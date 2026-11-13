/* She Is Studio 2 · interface do editor */
import { FORMATS, FONTS, renderPage, hitTest, getBox, preloadDoc, onImageLoad } from "./render.js";
import { PACKS, CATEGORIES } from "./templates.js";
import { zip } from "./zip.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => "l" + Math.random().toString(36).slice(2, 8);
const clone = (o) => JSON.parse(JSON.stringify(o));
const mobile = () => matchMedia("(max-width:899px)").matches;

/* ---------- estado ---------- */
let doc = { fmt: "post", pages: [] };
let cur = 0, selId = null, scale = 1;
let HIST = [], REDO = [], last = "";
const KEY = "sheis-studio2";

const cv = $("#cv"), ctx = cv.getContext("2d"), board = $("#board"), ov = $("#ov"), stage = $("#stage");
const W = () => FORMATS[doc.fmt].w, H = () => FORMATS[doc.fmt].h;
const page = () => doc.pages[cur];
const sel = () => page().layers.find((l) => l.id === selId);

function withIds(p) { const q = clone(p); q.layers.forEach((l) => (l.id = uid())); return q; }

/* ---------- histórico e gravação ---------- */
function snap(force) {
  const j = JSON.stringify({ doc, cur });
  if (j === last && !force) return;
  if (last) { HIST.push(last); if (HIST.length > 80) HIST.shift(); }
  REDO = []; last = j; histUi(); save();
}
function restore(j) {
  const s = JSON.parse(j); doc = s.doc; cur = Math.min(s.cur, doc.pages.length - 1); selId = null; last = j;
  all(); histUi(); save();
}
const undo = () => { if (HIST.length) { REDO.push(last); restore(HIST.pop()); } };
const redo = () => { if (REDO.length) { HIST.push(last); restore(REDO.pop()); } };
function histUi() { $("#undo").disabled = !HIST.length; $("#redo").disabled = !REDO.length; }
let saveT, warned = false;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ doc, cur })); }
    catch (e) { if (!warned) { warned = true; toast("Não consegui guardar neste dispositivo (fotos grandes). Descarrega o teu trabalho."); } }
  }, 400);
}

/* ---------- desenho ---------- */
function fit() {
  const aw = stage.clientWidth - 24, ah = stage.clientHeight - $("#pages").offsetHeight - 24;
  scale = Math.max(.05, Math.min(aw / W(), ah / H()));
  board.style.width = W() * scale + "px"; board.style.height = H() * scale + "px";
  if (cv.width !== W() || cv.height !== H()) { cv.width = W(); cv.height = H(); }
  draw();
}
function draw() {
  renderPage(ctx, page(), W(), H(), false);
  overlay();
  thumbsSoon();
}
function all() { pagesUi(); fit(); inspector(); syncBg(); }

/* ---------- seleção, arrastar, redimensionar, rodar ---------- */
function overlay() {
  const l = selId && sel();
  if (!l) { ov.innerHTML = ""; return; }
  let el = ov.firstElementChild;
  if (!el || el.dataset.id !== l.id) {
    ov.innerHTML = "";
    el = document.createElement("div"); el.className = "sel"; el.dataset.id = l.id;
    el.innerHTML = '<span class="stem"></span><span class="hd rot"></span><span class="hd br"></span>';
    ov.appendChild(el);
    bindHandle($(".hd.br", el), "resize"); bindHandle($(".hd.rot", el), "rotate");
  }
  const b = getBox(l);
  Object.assign(el.style, {
    left: b.x * scale + "px", top: b.y * scale + "px", width: b.w * scale + "px", height: b.h * scale + "px",
    transform: `rotate(${l.rot || 0}deg)`,
  });
}
const pt = (e) => { const r = board.getBoundingClientRect(); return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale]; };

let drag = null;
board.addEventListener("pointerdown", (e) => {
  if (e.target.classList.contains("hd")) return;
  const [x, y] = pt(e), id = hitTest(page(), x, y);
  select(id);
  if (id) {
    const l = sel(); drag = { kind: "move", x, y, ox: l.x, oy: l.y };
    board.setPointerCapture(e.pointerId);
  }
});
function bindHandle(h, kind) {
  h.addEventListener("pointerdown", (e) => {
    e.stopPropagation(); const l = sel(), b = getBox(l), [x, y] = pt(e);
    drag = { kind, x, y, b, size: l.size, w: l.w, h: l.h, pill: l.pill && { ...l.pill } };
    h.setPointerCapture(e.pointerId);
  });
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", end); h.addEventListener("pointercancel", end);
}
board.addEventListener("pointermove", move); board.addEventListener("pointerup", end); board.addEventListener("pointercancel", end);
function move(e) {
  if (!drag) return;
  const l = sel(); if (!l) return;
  const [x, y] = pt(e);
  if (drag.kind === "move") {
    l.x = Math.round(drag.ox + x - drag.x); l.y = Math.round(drag.oy + y - drag.y);
    const b = getBox(l), cxm = b.x + b.w / 2 - W() / 2;
    if (!l.rot && Math.abs(cxm) < 10) l.x -= Math.round(cxm);   // íman ao centro
  } else if (drag.kind === "resize") {
    const f = Math.max(.1, (drag.b.w + (x - drag.x)) / drag.b.w);
    if (l.t === "text") {
      l.size = Math.max(10, Math.round(drag.size * f));
      if (!l.auto) l.w = Math.round(drag.w * f);
      if (l.pill) l.pill = { ...drag.pill, px: drag.pill.px * f, py: drag.pill.py * f };
    } else { l.w = Math.max(20, Math.round(drag.b.w * f)); if (l.h != null) l.h = Math.max(20, Math.round(drag.b.h * f)); }
  } else if (drag.kind === "rotate") {
    const b = drag.b, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    let a = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
    if (a > 180) a -= 360;
    l.rot = Math.abs(a) < 4 ? 0 : e.shiftKey ? Math.round(a / 15) * 15 : Math.round(a);
  }
  draw();
}
function end() { if (!drag) return; drag = null; inspectorValues(); snap(); }

function select(id) {
  if (id === selId) return;
  selId = id; draw(); inspector();
  if (mobile()) setTab(id ? "edit" : $(".rail .on")?.dataset.tab === "edit" ? "tpl" : $(".rail .on").dataset.tab);
}
board.addEventListener("dblclick", (e) => {
  const [x, y] = pt(e), id = hitTest(page(), x, y), l = id && page().layers.find((q) => q.id === id);
  if (l && l.t === "text") { select(id); if (mobile()) setTab("edit"); setTimeout(() => $("#inspector textarea")?.focus(), 30); }
});

/* ---------- inspetor ---------- */
const toHex = (v) => {
  if (/^#[0-9a-f]{6}$/i.test(v || "")) return v;
  const m = /rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(v || "");
  return m ? "#" + [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, "0")).join("") : "#ffffff";
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const range = (k, label, min, max, step, v) => `<label class="fld"><span>${label}</span><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${v ?? 0}"></label>`;
const color = (k, label, v) => `<label class="fld"><span>${label}</span><input type="color" data-k="${k}" value="${toHex(v)}"></label>`;
const check = (k, label, v) => `<label class="fld"><span>${label}</span><input type="checkbox" data-k="${k}" ${v ? "checked" : ""}></label>`;
const num = (k, label, v) => `<label class="fld"><span>${label}</span><input type="number" data-k="${k}" value="${Math.round(v ?? 0)}"></label>`;

function inspector() {
  const el = $("#inspector"), l = selId && sel();
  if (!l) {
    el.innerHTML = '<h2>Editar</h2><p class="hint">Toca num texto ou elemento do design para o editar.<br><br>Arrasta para mover, usa o círculo no canto para mudar o tamanho e o de cima para rodar. Duplo clique num texto para escrever.</p>';
    return;
  }
  let h = `<h2>${{ text: "Texto", shape: "Forma", sticker: "Autocolante", image: "Foto" }[l.t]}</h2>`;
  if (l.t === "text") {
    h += `<textarea class="tx" data-k="text">${esc(l.text)}</textarea>
    <label class="fld"><span>Letra</span><select data-k="font">${FONTS.map((f) => `<option ${f === l.font ? "selected" : ""}>${f}</option>`).join("")}</select></label>
    <label class="fld"><span>Peso</span><select data-k="weight">${[[400, "Normal"], [600, "Seminegrito"], [800, "Negrito"]].map(([v, n]) => `<option value="${v}" ${(+l.weight >= 700 ? 800 : +l.weight >= 550 ? 600 : 400) === v ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    ${range("size", "Tamanho", 14, 360, 1, l.size)}
    ${range("track", "Espaçamento", -0.1, 0.6, 0.005, l.track)}
    ${range("lh", "Entrelinha", 0.7, 2, 0.01, l.lh)}
    <div class="fld"><span>Alinhar</span><div class="seg" data-seg="align">${["left", "center", "right"].map((a, i) => `<button class="${l.align === a ? "on" : ""}" data-v="${a}">${["Esq.", "Centro", "Dir."][i]}</button>`).join("")}</div></div>
    ${color("color", "Cor", l.color)}
    ${check("italic", "Itálico", l.italic)}${check("upper", "MAIÚSCULAS", l.upper)}${check("shadow", "Sombra", l.shadow)}
    ${check("$pill", "Fundo em etiqueta", !!l.pill)}${l.pill ? color("$pillbg", "Cor da etiqueta", l.pill.bg) : ""}
    ${check("auto", "Largura automática", l.auto)}${l.auto ? "" : num("w", "Largura", l.w)}`;
  } else if (l.t === "shape") {
    h += `${color("fill", "Cor", l.fill)}${num("w", "Largura", l.w)}${l.kind === "line" ? "" : num("h", "Altura", l.h)}`;
    if (l.kind === "rect" || l.kind === "bubble") h += range("r", "Cantos", 0, 200, 1, l.r ?? 46);
    if (l.kind === "rect" || l.kind === "circle") h += range("sw", "Contorno", 0, 30, 1, l.sw || 0) + color("stroke", "Cor do contorno", l.stroke);
    if (l.kind === "bubble") h += `<div class="fld"><span>Cauda</span><div class="seg" data-seg="tail">${[["l", "Esq."], ["r", "Dir."]].map(([v, n]) => `<button class="${(l.tail || "r") === v ? "on" : ""}" data-v="${v}">${n}</button>`).join("")}</div></div>`;
  } else if (l.t === "sticker") {
    h += l.kind === "emoji" ? `<label class="fld"><span>Emoji</span><input type="text" data-k="emoji" value="${esc(l.emoji)}" style="width:80px;font-size:22px;border:1px solid var(--line);border-radius:10px;padding:4px 8px"></label>` : color("fill", "Cor", l.fill);
    h += num("w", "Tamanho", l.w);
    if (l.kind !== "emoji" && l.kind !== "flower") h += check("glitter", "Brilho (glitter)", l.glitter);
  } else if (l.t === "image") {
    h += `<div class="acts" style="margin-top:0"><button data-act="pick">${l.src ? "Trocar foto" : "+ Escolher foto"}</button>${l.src ? '<button data-act="rmimg">Remover</button>' : ""}</div>
    <div class="fld"><span>Forma</span><div class="seg" data-seg="shape">${[["rect", "Retângulo"], ["circle", "Círculo"], ["arch", "Arco"]].map(([v, n]) => `<button class="${(l.shape || "rect") === v ? "on" : ""}" data-v="${v}">${n}</button>`).join("")}</div></div>
    ${num("w", "Largura", l.w)}${num("h", "Altura", l.h)}${range("r", "Cantos", 0, 200, 1, l.r || 0)}`;
  }
  h += `${range("rot", "Rodar", -180, 180, 1, l.rot || 0)}${range("op", "Opacidade", 0.05, 1, 0.01, l.op ?? 1)}
  <div class="acts"><button data-act="front">Trazer p/ frente</button><button data-act="back">Enviar p/ trás</button><button data-act="dup">Duplicar</button><button data-act="del" class="del">Apagar</button></div>`;
  el.innerHTML = h;
}
function inspectorValues() {
  const l = selId && sel(); if (!l) return;
  $$("#inspector [data-k]").forEach((i) => {
    const k = i.dataset.k; if (k[0] === "$" || document.activeElement === i) return;
    if (l[k] != null && i.type !== "checkbox") i.value = i.type === "color" ? toHex(l[k]) : l[k];
  });
}
const NUMERIC = new Set(["size", "track", "lh", "w", "h", "r", "sw", "rot", "op", "weight"]);
$("#inspector").addEventListener("input", (e) => {
  const i = e.target, k = i.dataset.k, l = sel(); if (!k || !l) return;
  const v = i.type === "checkbox" ? i.checked : NUMERIC.has(k) ? +i.value : i.value;
  if (k === "$pill") {
    l.pill = v ? { bg: "rgba(255,255,255,.26)", px: 34, py: 20 } : null; draw(); inspector(); return snap();
  }
  if (k === "$pillbg") l.pill.bg = v;
  else if (k === "auto") { l.auto = v; l.cx = false; if (!v) l.w = l.w || getBox(l).w; draw(); inspector(); return snap(); }
  else l[k] = v;
  draw();
});
$("#inspector").addEventListener("change", () => snap());
$("#inspector").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const l = sel(), L = page().layers;
  if (b.dataset.v != null) { l[b.parentElement.dataset.seg] = b.dataset.v; draw(); inspector(); return snap(); }
  const a = b.dataset.act, i = L.indexOf(l);
  if (a === "front") { L.push(L.splice(i, 1)[0]); }
  else if (a === "back") { L.unshift(L.splice(i, 1)[0]); }
  else if (a === "dup") { const c = { ...clone(l), id: uid(), x: l.x + 30, y: l.y + 30 }; L.push(c); selId = c.id; }
  else if (a === "del") { L.splice(i, 1); selId = null; }
  else if (a === "pick") return pickImage((src) => { l.src = src; draw(); inspector(); snap(); });
  else if (a === "rmimg") { l.src = ""; }
  draw(); inspector(); snap();
});

/* ---------- adicionar elementos ---------- */
function inkNow() {
  const bg = page().bg;
  if (bg.type === "photo") return "#ffffff";
  const h = toHex(bg.c1), n = parseInt(h.slice(1), 16);
  return ((n >> 16) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) / 255 > .55 ? "#161210" : "#ffffff";
}
function add(l) {
  l.id = uid(); page().layers.push(l); selId = l.id; draw(); inspector(); snap();
  if (mobile()) setTab("edit");
}
const T = (o) => ({ t: "text", font: "Plus Jakarta Sans", weight: 800, size: 60, color: inkNow(), align: "center", lh: 1.1, track: 0, ...o });
const ADD = {
  title: () => add(T({ text: "O teu título", x: 90, y: H() * .38, w: 900, size: 120, lh: .95, track: -.045 })),
  body: () => add(T({ text: "Escreve aqui o teu texto.", x: 140, y: H() * .5, w: 800, size: 46, weight: 600 })),
  pill: () => add(T({ text: "etiqueta", auto: true, cx: true, x: W() / 2, y: H() * .3, size: 32, weight: 600, lh: 1, pill: { bg: "rgba(255,255,255,.26)", px: 34, py: 20 } })),
  quote: () => add(T({ text: "“Uma frase que fica.”", x: 100, y: H() * .4, w: 880, size: 96, weight: 500, italic: true, font: "Playfair Display", lh: 1.05, track: -.02 })),
  photo: () => add({ t: "image", x: 190, y: H() * .25, w: 700, h: 700, r: 36, ph: "#E3DCD0" }),
  arch: () => add({ t: "image", x: 290, y: H() * .2, w: 500, h: 700, shape: "arch", ph: "#E3DCD0" }),
  circle: () => add({ t: "image", x: 290, y: H() * .25, w: 500, h: 500, shape: "circle", ph: "#E3DCD0" }),
};
$("[data-panel=el]").addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) ADD[b.dataset.add](); });

const SHAPES = [
  ["Retângulo", { t: "shape", kind: "rect", x: 200, y: 400, w: 680, h: 360, fill: "#F4B6D2", r: 40 }],
  ["Círculo", { t: "shape", kind: "circle", x: 340, y: 400, w: 400, h: 400, fill: "#F4B6D2" }],
  ["Balão", { t: "shape", kind: "bubble", x: 260, y: 500, w: 560, h: 150, fill: "#2F7CF6", tail: "r" }],
  ["Visor", { t: "shape", kind: "viewfinder", x: 300, y: 400, w: 480, h: 480, fill: "#ffffff", sw: 4 }],
  ["Pasta", { t: "shape", kind: "folder", x: 330, y: 450, w: 420, h: 330, fill: "#F7C6DC" }],
  ["Linha", { t: "shape", kind: "line", x: 240, y: 600, w: 600, h: 0, fill: "#161210", sw: 4 }],
];
const STICKERS = [
  ["spark", "#F8F5B6", {}], ["star", "#F8F5B6", {}], ["star", "#E8337F", { glitter: true }], ["star", "#9a9a9a", { outline: true, sw: 12 }],
  ["heart", "#F06FA6", {}], ["heart", "#F06FA6", { glitter: true }], ["flower", "#F8A9CB", {}],
];
function tile(layer, onClick) {
  const b = document.createElement("button"); b.className = "tile";
  const c = document.createElement("canvas"); c.width = c.height = 120; b.appendChild(c);
  const L = { id: "p", ...layer, x: 14, y: 14, w: 92, h: layer.h != null ? Math.min(layer.h, 92) * (92 / layer.w) : undefined };
  if (L.t === "shape" && L.h == null) L.h = 92;
  if (L.kind === "line") { L.x = 10; L.y = 60; L.w = 100; }
  if (layer.t === "shape" && layer.h != null && layer.kind !== "line") L.h = layer.h / layer.w * 92;
  if (L.kind === "viewfinder" || L.kind === "folder") L.fill = layer.kind === "viewfinder" ? "#161210" : layer.fill;
  renderPage(c.getContext("2d"), { bg: { type: "color", c1: "#F6F1E7" }, layers: [L] }, 120, 120, true);
  b.onclick = () => onClick(); return b;
}
SHAPES.forEach(([n, l]) => { const t = tile(l, () => add(clone(l))); t.title = n; $("#shapes").appendChild(t); });
STICKERS.forEach(([kind, fill, o]) => {
  const l = { t: "sticker", kind, w: 260, x: 410, y: 500, fill, ...o };
  $("#stickers").appendChild(tile({ ...l, fill: fill === "#F8F5B6" ? "#E7C547" : fill }, () => add(clone({ ...l, fill: fill === "#F8F5B6" ? "#F4B6D2" : fill }))));
});
"✨ 🌸 💖 🌟 🎀 💫 🤍 ☕ 📌 ✔️ 🔥 💡 📈 💸 🫶 👉 🌿 🌙 ☀️ 🦋 💌 📷 ⭐ 🧿".split(" ").forEach((e) => {
  const b = document.createElement("button"); b.textContent = e;
  b.onclick = () => add({ t: "sticker", kind: "emoji", emoji: e, x: 440, y: 520, w: 200 }); $("#emojis").appendChild(b);
});

/* ---------- fundo ---------- */
const SW = ["#F4EEE3", "#FFFFFF", "#161210", "#F4B6D2", "#F8F5B6", "#C94F6D", "#E4E9DA", "#CFE3F7", "#5A3D26", "#D9CCF0"];
const MOODS = [
  ["#8a8a86", "#2b2b2b", "#5d5d5a", false], ["#6b4a2b", "#1f2026", "#a07848", false], ["#5a3d26", "#1a110b", "#a4814f", true],
  ["#4a2736", "#160f14", "#a8506f", false], ["#d9cfc2", "#5d554b", "#ffffff", false], ["#f5b9d1", "#c2658f", "#fff1f6", false],
  ["#2d3a2f", "#0f1511", "#7c9a72", false], ["#27324d", "#0d1020", "#6f86c9", false],
];
SW.forEach((c) => { const b = document.createElement("button"); b.className = "sw"; b.style.background = c; b.onclick = () => { page().bg = { type: "color", c1: c }; draw(); syncBg(); snap(); }; $("#swatches").appendChild(b); });
MOODS.forEach(([c1, c2, c3, st], i) => { const b = document.createElement("button"); b.className = "mood"; b.style.background = `linear-gradient(180deg,${c1},${c2})`; b.onclick = () => { page().bg = { type: "mesh", c1, c2, c3, seed: 3 + i * 7, stripes: st, tint: "#000", tintA: 0 }; draw(); syncBg(); snap(); }; $("#moods").appendChild(b); });
$("#bgColor").addEventListener("input", (e) => { page().bg = { type: "color", c1: e.target.value }; draw(); });
$("#bgColor").addEventListener("change", () => snap());
$("#bgPhoto").onclick = () => pickImage((src) => { page().bg = { type: "photo", src, c1: "#222", blur: 0, tint: "#000", tintA: .15 }; draw(); syncBg(); snap(); });
$("#bgClear").onclick = () => { const b = page().bg; if (b.type === "photo") { page().bg = { type: "color", c1: "#F4EEE3" }; draw(); syncBg(); snap(); } };
$("#bgBlur").addEventListener("input", (e) => { const b = page().bg; if (b.type === "photo") { b.blur = +e.target.value; draw(); } });
$("#bgTint").addEventListener("input", (e) => { page().bg.tintA = +e.target.value; draw(); });
["#bgBlur", "#bgTint"].forEach((s) => $(s).addEventListener("change", () => snap()));
function syncBg() { const b = page().bg; $("#bgBlur").value = b.blur || 0; $("#bgTint").value = b.tintA || 0; if (b.type === "color") $("#bgColor").value = toHex(b.c1); }

/* ---------- fotos ---------- */
const FILE = $("#file");
let onPick = null;
function pickImage(cb) { onPick = cb; FILE.value = ""; FILE.click(); }
FILE.addEventListener("change", () => {
  const f = FILE.files[0]; if (!f || !onPick) return;
  const cb = onPick, url = URL.createObjectURL(f), img = new Image();
  img.onload = () => {
    const m = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * m); c.height = Math.round(img.height * m);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    cb(c.toDataURL(f.type === "image/png" ? "image/png" : "image/jpeg", .86));
  };
  img.onerror = () => toast("Não consegui abrir essa imagem.");
  img.src = url;
});
onImageLoad(() => draw());

/* ---------- templates ---------- */
let cat = "Todos";
function thumb(p, w) {
  const c = document.createElement("canvas"); c.width = w; c.height = Math.round(w * 1.25);
  const g = c.getContext("2d"); g.scale(w / 1080, w / 1080);
  renderPage(g, withIds(p), 1080, 1350, true); return c;
}
function templates() {
  $("#cats").innerHTML = CATEGORIES.map((c) => `<button class="${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
  const g = $("#tplGrid"); g.innerHTML = "";
  PACKS.filter((p) => cat === "Todos" || p.c === cat).forEach((p) => {
    const b = document.createElement("button"); b.className = "card";
    b.appendChild(thumb(p.pages[0], 240));
    const d = document.createElement("div"); d.innerHTML = `${esc(p.n)}<small>${p.pages.length} páginas · ${esc(p.c)}</small>`; b.appendChild(d);
    b.onclick = () => applyPack(p); g.appendChild(b);
  });
}
$("#cats").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) { cat = b.dataset.c; templates(); } });
function applyPack(p) {
  doc = { fmt: p.fmt, pages: p.pages.map(withIds) }; cur = 0; selId = null;
  $("#fmt").value = doc.fmt; all(); snap(true); toast(`“${p.n}” aplicado · toca nos textos para os mudares`);
}

/* ---------- páginas ---------- */
let thT;
function thumbsSoon() { clearTimeout(thT); thT = setTimeout(pagesUi, 250); }
function pagesUi() {
  const el = $("#pages"); el.innerHTML = "";
  doc.pages.forEach((p, i) => {
    const b = document.createElement("button"); b.className = "pg" + (i === cur ? " on" : "");
    const c = document.createElement("canvas"); c.width = 92; c.height = Math.round(92 * H() / W());
    const g = c.getContext("2d"); g.scale(92 / W(), 92 / W()); renderPage(g, p, W(), H(), true);
    b.appendChild(c); b.insertAdjacentHTML("beforeend", `<b>${i + 1}</b>`);
    b.onclick = () => { cur = i; selId = null; all(); }; el.appendChild(b);
  });
  const add = document.createElement("button"); add.className = "pgadd"; add.textContent = "+"; add.title = "Nova página";
  add.onclick = () => { doc.pages.splice(cur + 1, 0, { bg: clone(page().bg), layers: [] }); cur++; selId = null; all(); snap(); };
  el.appendChild(add);
  const m = document.createElement("div"); m.className = "pgmenu";
  m.innerHTML = '<button data-p="dup">Duplicar</button>' + (doc.pages.length > 1 ? '<button data-p="del">Apagar</button>' : "");
  el.appendChild(m);
}
$("#pages").addEventListener("click", (e) => {
  const a = e.target.dataset.p; if (!a) return;
  if (a === "dup") { doc.pages.splice(cur + 1, 0, withIds(page())); cur++; }
  else if (a === "del" && doc.pages.length > 1) { doc.pages.splice(cur, 1); cur = Math.max(0, cur - 1); }
  selId = null; all(); snap();
});

/* ---------- formato ---------- */
$("#fmt").innerHTML = Object.entries(FORMATS).map(([k, f]) => `<option value="${k}">${f.n}</option>`).join("");
$("#fmt").addEventListener("change", (e) => {
  const old = H(); doc.fmt = e.target.value; const k = H() / old;
  doc.pages.forEach((p) => p.layers.forEach((l) => { l.y = Math.round(l.y * k); if (l.t !== "text" && l.t !== "sticker" && l.h != null) l.h = Math.round(l.h * k); }));
  all(); snap();
});

/* ---------- exportar ---------- */
const menuBtn = $("#exp"), pop = $("#expPop");
menuBtn.onclick = (e) => { e.stopPropagation(); pop.hidden = !pop.hidden; };
document.addEventListener("click", () => (pop.hidden = true));
async function pngOf(i) {
  await preloadDoc(doc); await document.fonts.ready;
  const c = document.createElement("canvas"); c.width = W(); c.height = H();
  renderPage(c.getContext("2d"), doc.pages[i], W(), H(), true);
  return new Promise((r) => c.toBlob(r, "image/png"));
}
function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
pop.addEventListener("click", async (e) => {
  const k = e.target.dataset.exp; if (!k) return;
  toast("A preparar…");
  try {
    if (k === "one" || doc.pages.length === 1) download(await pngOf(cur), `she-is-studio-${cur + 1}.png`);
    else {
      const files = [];
      for (let i = 0; i < doc.pages.length; i++) files.push({ name: `slide-${i + 1}.png`, data: new Uint8Array(await (await pngOf(i)).arrayBuffer()) });
      download(zip(files), "she-is-studio.zip");
    }
    toast("Pronto ✓");
  } catch (err) { toast("Não consegui exportar. Tenta outra vez."); console.error(err); }
});

/* ---------- separadores e atalhos ---------- */
function setTab(t) {
  if (t === "edit" && !mobile()) return;
  $$("#rail button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
  $$(".panel").forEach((p) => (p.hidden = p.dataset.panel !== t));
}
$("#rail").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setTab(b.dataset.tab); });
$("#undo").onclick = undo; $("#redo").onclick = redo;
document.addEventListener("keydown", (e) => {
  if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const m = e.metaKey || e.ctrlKey, l = selId && sel();
  if (m && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if (m && e.key.toLowerCase() === "d" && l) { e.preventDefault(); $('#inspector [data-act="dup"]').click(); }
  else if ((e.key === "Delete" || e.key === "Backspace") && l) { e.preventDefault(); $('#inspector [data-act="del"]').click(); }
  else if (l && e.key.startsWith("Arrow")) {
    e.preventDefault(); const d = e.shiftKey ? 20 : 2;
    if (e.key === "ArrowLeft") l.x -= d; if (e.key === "ArrowRight") l.x += d; if (e.key === "ArrowUp") l.y -= d; if (e.key === "ArrowDown") l.y += d;
    draw(); snap();
  } else if (e.key === "Escape") select(null);
});
let tT; function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tT); tT = setTimeout(() => el.classList.remove("on"), 2600); }
new ResizeObserver(() => doc.pages.length && fit()).observe(stage);

/* ---------- arranque ---------- */
async function boot() {
  const wanted = [["400", "Plus Jakarta Sans"], ["600", "Plus Jakarta Sans"], ["800", "Plus Jakarta Sans"], ["400", "Instrument Serif"], ["italic 400", "Instrument Serif"], ["500", "Playfair Display"], ["italic 500", "Playfair Display"], ["600", "Caveat"], ["400", "Inter"], ["600", "Inter"]];
  await Promise.all(wanted.map(([w, f]) => document.fonts.load(`${w} 40px "${f}"`).catch(() => {})));
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignora */ }
  if (saved && saved.doc && saved.doc.pages.length) { doc = saved.doc; cur = Math.min(saved.cur || 0, doc.pages.length - 1); }
  else doc = { fmt: PACKS[0].fmt, pages: PACKS[0].pages.map(withIds) };
  $("#fmt").value = doc.fmt;
  templates(); all(); snap(true);
  window.__studio = { get doc() { return doc; }, select, applyPack, PACKS, setPage: (i) => { cur = i; selId = null; all(); }, pngOf };
}
boot();
