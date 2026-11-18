import { figura } from "./figura.js";
import { cenario, fachada } from "./cenarios.js";
import { MARIA, PROLOGO, MULHERES } from "./personagens.js";
import { PRODUTOS, NEGOCIO } from "./produtos.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- progresso guardado no browser ----------
const CHAVE = "vila2d.v1";
const feitas = new Set();
let viuPrologo = false;
try {
  const g = JSON.parse(localStorage.getItem(CHAVE) || "{}");
  (g.feitas || []).forEach((id) => feitas.add(id));
  viuPrologo = !!g.prologo;
} catch (e) { /* sem storage */ }
const guardar = () => { try { localStorage.setItem(CHAVE, JSON.stringify({ feitas: [...feitas], prologo: viuPrologo })); } catch (e) { /* ignora */ } };

const LOCAIS = {
  casa: { nome: "Casa da Maria", cor: "#f6e7c6", texto: "CASA DA MARIA", fundo: "#d9879b" },
  banco: { nome: "Banco", cor: "#efe2c9", texto: "BANCO", fundo: "#2f5d62" },
  fabrica: { nome: "Fábrica", cor: "#e2c49c", telhado: "#9a7a62", texto: "FÁBRICA", fundo: "#6b4a3a" },
  correios: { nome: "Correios", cor: "#f2dfc2", texto: "CORREIOS", fundo: "#c8312f" },
  escola: { nome: "Escola", cor: "#e6c9a1", texto: "ESCOLA", fundo: "#355a8a" },
  cafe: { nome: "Café", cor: "#f0d3c4", texto: "CAFÉ DA VILA", fundo: "#a0522d" },
};

// ---------- ecrãs ----------
function mostrar(id) {
  for (const e of ["#intro", "#mapa", "#palco"]) $(e).hidden = e !== id;
}

// ---------- personagens no palco (com piscar de olhos) ----------
function ator(el, fig, expr = "neutra") {
  let atual = expr, t1, t2, vivo = true;
  const desenhar = (fechados) => { el.innerHTML = figura(fig, { expr: atual, fechados }); };
  desenhar(false);
  const ciclo = () => {
    t1 = setTimeout(() => {
      if (!vivo) return;
      desenhar(true);
      t2 = setTimeout(() => { if (vivo) { desenhar(false); ciclo(); } }, 140);
    }, 2200 + Math.random() * 3200);
  };
  ciclo();
  el.classList.remove("entra"); void el.offsetWidth; el.classList.add("entra");
  return {
    expr(e) { if (e && e !== atual) { atual = e; desenhar(false); } },
    parar() { vivo = false; clearTimeout(t1); clearTimeout(t2); el.innerHTML = ""; },
  };
}
let npc = null, maria = null;
function limparPalco() { npc?.parar(); maria?.parar(); npc = maria = null; }

// ---------- caixa de diálogo com efeito de escrita ----------
const caixa = $("#caixa");
let escrever = null;
function falar({ nome, sub, texto, narrador = false, opcoes = [], extra = null }) {
  caixa.className = narrador ? "narrador" : "";
  caixa.innerHTML = `
    ${nome ? `<div class="nome"><b>${esc(nome)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</div>` : ""}
    <p class="texto"></p><div class="extra"></div><div class="ops"></div>`;
  const p = caixa.querySelector(".texto");
  const ops = caixa.querySelector(".ops");
  let i = 0;
  clearInterval(escrever);
  const acabar = () => {
    clearInterval(escrever); escrever = null;
    p.textContent = texto;
    if (extra) caixa.querySelector(".extra").append(extra);
    for (const o of opcoes) {
      const b = document.createElement("button");
      b.className = o.principal ? "op principal" : "op";
      b.innerHTML = o.html || esc(o.t);
      b.onclick = (ev) => { ev.stopPropagation(); o.fn(); };
      ops.append(b);
    }
  };
  escrever = setInterval(() => { i += 2; p.textContent = texto.slice(0, i); if (i >= texto.length) acabar(); }, 18);
  caixa.onclick = () => { if (escrever) acabar(); };
}

// ---------- prólogo ----------
function prologo() {
  limparPalco();
  mostrar("#palco");
  $("#fundo").innerHTML = cenario("casa");
  $("#palco").classList.add("so");
  maria = ator($("#ator-npc"), MARIA.fig, "triste");
  let i = 0;
  const passo = () => {
    const l = PROLOGO[i];
    if (l.e) maria.expr(l.e);
    const ultimo = i === PROLOGO.length - 1;
    falar({
      nome: l.quem === "maria" ? "Maria" : "", sub: l.quem === "maria" ? "34 anos · freelancer" : "",
      narrador: l.quem === "narrador", texto: l.t,
      opcoes: [ultimo
        ? { t: "Sair para a vila ▸", principal: true, fn: () => { viuPrologo = true; guardar(); abrirMapa(); } }
        : { t: "Continuar ▸", fn: () => { i++; passo(); } }],
    });
  };
  passo();
}

// ---------- mapa da vila ----------
function abrirMapa() {
  limparPalco();
  mostrar("#mapa");
  $("#contador").textContent = `📖 Diário ${feitas.size}/${MULHERES.length}`;
  const g = $("#predios");
  g.innerHTML = "";
  for (const [id, L] of Object.entries(LOCAIS)) {
    const m = MULHERES.find((x) => x.local === id);
    const b = document.createElement("button");
    b.className = "predio" + (m && feitas.has(m.id) ? " feita" : "");
    b.innerHTML = `${fachada(L)}<b>${esc(L.nome)}</b><span>${m ? (feitas.has(m.id) ? `✓ História da ${esc(m.nome)} guardada` : `Conhece a ${esc(m.nome)}, ${esc(m.trabalho.toLowerCase())}`) : "Rever o início da história"}</span>`;
    b.onclick = () => (m ? cena(m) : prologo());
    g.append(b);
  }
}

// ---------- cena com uma mulher ----------
function cena(m) {
  limparPalco();
  mostrar("#palco");
  $("#palco").classList.remove("so");
  $("#fundo").innerHTML = cenario(m.local);
  maria = ator($("#ator-maria"), MARIA.fig, "neutra");
  npc = ator($("#ator-npc"), m.fig, "neutra");
  const sub = `${m.idade} anos · ${m.trabalho}`;
  const no = (id) => {
    const c = m.cenas[id];
    npc.expr(c.e);
    if (c.produto) {
      maria.expr("sorriso");
      const p = PRODUTOS[m.produto];
      const card = document.createElement("div");
      card.className = "produto";
      card.innerHTML = `<small>O que a Maria lhe mostrou</small><h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.cta)}</a>`;
      falar({
        nome: m.nome, sub, texto: c.t, extra: card,
        opcoes: [{ t: "Guardar no diário e voltar à vila", principal: true, fn: () => {
          feitas.add(m.id); guardar();
          abrirMapa();
          if (feitas.size === MULHERES.length) setTimeout(fim, 300);
        } }],
      });
      return;
    }
    falar({
      nome: m.nome, sub, texto: c.t,
      opcoes: [
        ...c.o.map((o) => ({ html: `<em>Maria:</em> ${esc(o.t)}`, fn: () => { maria.expr("neutra"); no(o.v); } })),
        { t: "Voltar à vila", fn: abrirMapa, sair: true },
      ].map((o) => (o.sair ? { ...o, html: `<span class="sair">Voltar à vila</span>` } : o)),
    });
  };
  no(m.inicio);
}

// ---------- diário e final ----------
function modal(html) {
  const m = $("#modal");
  m.innerHTML = `<div class="cartao">${html}<button class="fechar">Fechar</button></div>`;
  m.hidden = false;
  m.querySelector(".fechar").onclick = () => { m.hidden = true; };
}
$("#contador").onclick = () => {
  const li = MULHERES.map((m) => feitas.has(m.id)
    ? `<li><b>${esc(m.nome)}</b>, ${m.idade} · ${esc(m.trabalho)}<br><span>${esc(m.resumo)}</span><em>${esc(m.licao)}</em></li>`
    : `<li class="trancada"><b>???</b><br><span>Ainda não conheceste esta história.</span></li>`).join("");
  modal(`<h2>O diário da Maria</h2><ul class="diario">${li}</ul>`);
};
function fim() {
  modal(`<h2>Conheceste a vila toda 💛</h2>
    <p>Cada mulher tem a sua dor, e todas encontraram um caminho que cabe na sua vida.</p>
    <p>E tu, queres começar o teu?</p>
    <a class="cta" href="${esc(NEGOCIO.site)}" target="_blank" rel="noopener">Conhecer a ${esc(NEGOCIO.marca)}</a>
    <p class="peq">${esc(NEGOCIO.handle)}</p>`);
}

// ---------- início ----------
$("#intro-figura").innerHTML = figura(MARIA.fig, { expr: "sorriso" });
$("#entrar").onclick = () => (viuPrologo ? abrirMapa() : prologo());
mostrar("#intro");

window.__vila = { prologo, abrirMapa, cena: (id) => cena(MULHERES.find((m) => m.id === id)), feitas };
