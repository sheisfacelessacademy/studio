/* Teste de fumo: abre a app num browser real e percorre o essencial.
 * Correr: npm i -D playwright && node tests/smoke.mjs */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  const f = path.join(root, q.url === "/" ? "index.html" : q.url.split("?")[0]);
  if (!f.startsWith(root) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
}).listen(0);
const url = `http://localhost:${srv.address().port}/`;

let fails = 0;
const ok = (c, m) => { console.log((c ? "ok   " : "FAIL ") + m); if (!c) fails++; };
const b = await chromium.launch(), ctx = await b.newContext({ acceptDownloads: true }), p = await ctx.newPage(), errs = [];
p.on("pageerror", (e) => errs.push(e.message));
const boot = async () => { await p.goto(url); await p.waitForFunction(() => window.__studio); await p.waitForTimeout(500); };

await boot();
ok(await p.evaluate(() => window.__studio.PACKS.length) >= 8, "há pelo menos 8 coleções");
// templates: abrir um sem mexer substitui o design atual (não cria projetos a mais)
await p.evaluate(() => window.__studio.applyPack(window.__studio.PACKS[1])); await p.waitForTimeout(700);
ok((await p.evaluate(() => window.__studio.store.listProjects())).length === 1, "template intacto é substituído, não duplicado");
// editar e confirmar que fica guardado depois de recarregar
const box = await p.locator("#board").boundingBox();
await p.mouse.click(box.x + box.width * .5, box.y + box.height * .3);
await p.locator("#inspector textarea").fill("Texto de teste");
await p.waitForTimeout(900);
await boot();
ok(await p.evaluate(() => window.__studio.doc.pages[0].layers.some((l) => l.text === "Texto de teste")), "edição sobrevive ao recarregar");
// novo template depois de editar cria um segundo projeto e mantém o primeiro
await p.evaluate(() => window.__studio.applyPack(window.__studio.PACKS[0])); await p.waitForTimeout(900);
ok((await p.evaluate(() => window.__studio.store.listProjects())).length === 2, "projeto editado fica guardado ao abrir outro template");
// lista de projetos, duplicar, apagar
await p.click('[data-tab="proj"]'); await p.waitForTimeout(300);
ok((await p.locator(".proj").count()) === 2, "lista mostra 2 projetos");
await p.locator("[data-d]").first().click(); await p.waitForTimeout(300);
ok((await p.locator(".proj").count()) === 3, "duplicar cria cópia");
const x = p.locator("[data-x]").first(); await x.click(); await x.click(); await p.waitForTimeout(300);
ok((await p.locator(".proj").count()) === 2, "apagar pede confirmação e remove");
// marca
await p.click('[data-tab="brand"]');
await p.selectOption("#kitHead", "Instrument Serif"); await p.click("#kitApply");
ok(await p.evaluate(() => window.__studio.doc.pages[0].layers.some((l) => l.t === "text" && l.size >= 90 && l.font === "Instrument Serif")), "marca aplica a letra dos títulos");
// exportação
const dl = async (sel) => { const [d] = await Promise.all([p.waitForEvent("download"), (async () => { await p.click("#exp"); await p.click(sel); })()]); return fs.readFileSync(await d.path()); };
const pdf = await dl("[data-exp=pdf]");
ok(pdf.subarray(0, 5).toString() === "%PDF-" && (pdf.toString("latin1").match(/\/Type \/Page /g) || []).length >= 3, "PDF válido com várias páginas");
ok((await dl("[data-exp=jpg]")).subarray(0, 2).toString("hex") === "ffd8", "JPG válido");
ok((await dl("[data-exp=all]")).subarray(0, 2).toString() === "PK", "ZIP válido");
ok(errs.length === 0, "sem erros de JavaScript" + (errs.length ? ": " + errs.join("; ") : ""));
await b.close(); srv.close();
process.exit(fails ? 1 : 0);
