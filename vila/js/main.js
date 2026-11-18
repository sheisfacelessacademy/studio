import * as THREE from "../vendor/three.module.js";
import { criarBoneca } from "./boneca.js";
import { construirCidade } from "./cidade.js";
import { MARIA, MULHERES } from "./personagens.js";
import { PRODUTOS, NEGOCIO } from "./produtos.js";

const $ = (s) => document.querySelector(s);
const LIMITE = 30;
const RAIO = 0.45;

// ---------- estado guardado ----------
const CHAVE = "vila.v1";
const feitas = new Set();
try { for (const id of JSON.parse(localStorage.getItem(CHAVE) || "[]")) feitas.add(id); } catch (e) { /* sem storage */ }
const guardar = () => { try { localStorage.setItem(CHAVE, JSON.stringify([...feitas])); } catch (e) { /* ignora */ } };

// ---------- cena ----------
const canvas = $("#cena");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const cena = new THREE.Scene();
const CEU = new THREE.Color("#f6d2a8");
cena.background = CEU;
cena.fog = new THREE.Fog(CEU, 45, 105);

const camara = new THREE.PerspectiveCamera(38, 1, 0.5, 200);
let zoom = 1;

cena.add(new THREE.HemisphereLight("#fff0da", "#a58f6c", 1.05));
const sol = new THREE.DirectionalLight("#ffd29a", 2.6);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
Object.assign(sol.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 });
sol.shadow.bias = -0.0006;
sol.shadow.normalBias = 0.04;
cena.add(sol, sol.target);

const { colisoes, predios } = construirCidade(cena);

// ---------- movimento com colisões ----------
function empurrar(pos) {
  pos.x = Math.max(-LIMITE, Math.min(LIMITE, pos.x));
  pos.z = Math.max(-LIMITE, Math.min(LIMITE, pos.z));
  for (const c of colisoes) {
    const x0 = c.x0 - RAIO, x1 = c.x1 + RAIO, z0 = c.z0 - RAIO, z1 = c.z1 + RAIO;
    if (pos.x > x0 && pos.x < x1 && pos.z > z0 && pos.z < z1) {
      const dl = pos.x - x0, dr = x1 - pos.x, dt = pos.z - z0, db = z1 - pos.z;
      const m = Math.min(dl, dr, dt, db);
      if (m === dl) pos.x = x0; else if (m === dr) pos.x = x1;
      else if (m === dt) pos.z = z0; else pos.z = z1;
    }
  }
}
const livre = (x, z) => !colisoes.some((c) => x > c.x0 - RAIO - 0.3 && x < c.x1 + RAIO + 0.3 && z > c.z0 - RAIO - 0.3 && z < c.z1 + RAIO + 0.3);

// ---------- personagens ----------
function etiqueta(texto, sub) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const x = c.getContext("2d");
  x.fillStyle = "rgba(255,248,238,.94)";
  const r = 44;
  x.beginPath();
  x.roundRect(6, 14, 500, 100, r);
  x.fill();
  x.fillStyle = "#4a2f25";
  x.textAlign = "center";
  x.font = "700 44px 'Helvetica Neue', Arial, sans-serif";
  x.fillText(texto, 256, 62);
  x.fillStyle = "#b5677a";
  x.font = "500 28px 'Helvetica Neue', Arial, sans-serif";
  x.fillText(sub, 256, 98);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(2.8, 0.7, 1);
  s.renderOrder = 10;
  return s;
}

function criar(def, pos) {
  const api = criarBoneca(def.boneca);
  api.grupo.position.copy(pos);
  cena.add(api.grupo);
  const lab = etiqueta(def.nome, def.trabalho);
  lab.position.set(0, api.altura + 0.55, 0);
  lab.userData.dentro = true;
  cena.add(lab);
  return { def, api, pos: api.grupo.position, lab, vel: 0, dir: 0 };
}

const jogador = criar(MARIA, new THREE.Vector3(-2, 0, 5.5));
jogador.lab.visible = true;
const npcs = MULHERES.map((m, i) => {
  const e = predios[m.local].userData.entrada.clone();
  e.x += (i % 2 ? 1 : -1) * 1.5;
  const n = criar(m, e);
  n.casa = e.clone();
  n.alvo = null;
  n.espera = 1 + Math.random() * 2;
  n.api.grupo.userData.npc = n;
  n.api.grupo.traverse((o) => { o.userData.npc = n; });
  return n;
});

function escolherAlvo(n) {
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2, r = 1.5 + Math.random() * 3.5;
    const x = n.casa.x + Math.cos(a) * r, z = n.casa.z + Math.sin(a) * r;
    if (livre(x, z)) return new THREE.Vector3(x, 0, z);
  }
  return n.casa.clone();
}

// ---------- entrada ----------
const teclas = new Set();
let destino = null;         // { pos, npc }
let falando = null;         // npc em diálogo
let ligado = false;

addEventListener("keydown", (e) => {
  if (!ligado) return;
  const k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  if ((k === "e" || k === "enter" || k === " ") && !falando) { const p = proxima(); if (p) abrir(p); return; }
  if (k === "escape" && falando) { fechar(); return; }
  teclas.add(k);
  destino = null;
});
addEventListener("keyup", (e) => teclas.delete(e.key.toLowerCase()));
addEventListener("blur", () => teclas.clear());
canvas.addEventListener("wheel", (e) => { zoom = Math.max(0.65, Math.min(1.5, zoom + Math.sign(e.deltaY) * 0.08)); e.preventDefault(); }, { passive: false });

const ray = new THREE.Raycaster();
const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
canvas.addEventListener("pointerdown", (e) => {
  if (!ligado || falando) return;
  const r = canvas.getBoundingClientRect();
  const nd = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(nd, camara);
  const hit = ray.intersectObjects(npcs.map((n) => n.api.grupo), true)[0];
  if (hit) {
    const n = hit.object.userData.npc;
    if (n) { destino = { pos: n.pos, npc: n }; return; }
  }
  const p = new THREE.Vector3();
  if (ray.ray.intersectPlane(plano, p)) { p.x = Math.max(-LIMITE, Math.min(LIMITE, p.x)); p.z = Math.max(-LIMITE, Math.min(LIMITE, p.z)); destino = { pos: p, npc: null }; }
});

function proxima() {
  let melhor = null, dm = 2.7;
  for (const n of npcs) {
    const d = Math.hypot(n.pos.x - jogador.pos.x, n.pos.z - jogador.pos.z);
    if (d < dm) { dm = d; melhor = n; }
  }
  return melhor;
}

// ---------- diálogo ----------
const caixa = $("#dialogo");
function abrir(n) {
  falando = n;
  destino = null;
  n.api.acenar(true);
  jogador.api.acenar(false);
  const a = Math.atan2(jogador.pos.x - n.pos.x, jogador.pos.z - n.pos.z);
  n.api.grupo.rotation.y = a;
  jogador.api.grupo.rotation.y = a + Math.PI;
  cenaDialogo(n.def.inicio);
}

function cenaDialogo(id) {
  const m = falando.def;
  const c = m.cenas[id];
  caixa.hidden = false;
  caixa.innerHTML = "";
  const topo = document.createElement("div");
  topo.className = "d-topo";
  topo.innerHTML = `<b></b><span></span>`;
  topo.firstChild.textContent = m.nome;
  topo.lastChild.textContent = `${m.idade} anos · ${m.trabalho}`;
  caixa.append(topo);
  const t = document.createElement("p");
  t.className = "d-texto";
  t.textContent = c.t;
  caixa.append(t);

  if (c.produto) {
    const p = PRODUTOS[m.produto];
    const card = document.createElement("div");
    card.className = "produto";
    card.innerHTML = `<small>O que a Maria lhe mostrou</small><h3></h3><p></p>`;
    card.querySelector("h3").textContent = p.nome;
    card.querySelector("p").textContent = p.desc;
    const a = document.createElement("a");
    a.href = p.url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = p.cta;
    card.append(a);
    caixa.append(card);
    const b = botao("Guardar no diário e continuar", () => {
      feitas.add(m.id); guardar(); atualizarHud(); fechar();
      if (feitas.size === MULHERES.length) setTimeout(fim, 400);
    });
    b.classList.add("fim");
    caixa.append(b);
    return;
  }
  const ops = document.createElement("div");
  ops.className = "d-ops";
  for (const o of c.o) ops.append(botao(o.t, () => cenaDialogo(o.v)));
  caixa.append(ops);
  const sair = document.createElement("button");
  sair.className = "sair";
  sair.textContent = "Sair";
  sair.onclick = fechar;
  caixa.append(sair);
}

function botao(txt, fn) {
  const b = document.createElement("button");
  b.textContent = txt;
  b.onclick = fn;
  return b;
}

function fechar() {
  if (falando) falando.api.acenar(false);
  falando = null;
  caixa.hidden = true;
}

// ---------- interface ----------
const dica = $("#falar");
dica.onclick = () => { const p = proxima(); if (p && !falando) abrir(p); };

function atualizarHud() {
  $("#contador").textContent = `📖 Diário ${feitas.size}/${MULHERES.length}`;
}
atualizarHud();

function modal(html) {
  const m = $("#modal");
  m.innerHTML = `<div class="cartao">${html}<button class="fechar">Fechar</button></div>`;
  m.hidden = false;
  m.querySelector(".fechar").onclick = () => { m.hidden = true; };
}
$("#contador").onclick = () => {
  const li = MULHERES.map((m) => feitas.has(m.id)
    ? `<li><b>${m.nome}</b>, ${m.idade} · ${m.trabalho}<br><span>${m.resumo}</span><em>${m.licao}</em></li>`
    : `<li class="trancada"><b>???</b><br><span>Ainda não conheceste esta história.</span></li>`).join("");
  modal(`<h2>O diário da Maria</h2><ul class="diario">${li}</ul>`);
};

function fim() {
  modal(`<h2>Conheceste a vila toda 💛</h2>
    <p>Cada mulher tem a sua dor, e todas encontraram um caminho que cabe na sua vida.</p>
    <p>Queres começar o teu?</p>
    <a class="cta" href="${NEGOCIO.site}" target="_blank" rel="noopener">Conhecer ${NEGOCIO.marca}</a>
    <p class="peq">${NEGOCIO.handle}</p>`);
}

$("#entrar").onclick = () => { $("#intro").hidden = true; ligado = true; };

// ---------- ciclo ----------
const relogio = new THREE.Clock();
const dirTecla = new THREE.Vector3();
let tempo = 0;

function mover(e, dx, dz, dt, vmax) {
  const d = Math.hypot(dx, dz);
  if (d < 1e-4) { e.vel = 0; return; }
  const v = Math.min(vmax, d / Math.max(dt, 1e-3));
  e.pos.x += (dx / d) * v * dt;
  e.pos.z += (dz / d) * v * dt;
  empurrar(e.pos);
  e.vel = v;
  const alvo = Math.atan2(dx, dz);
  let da = alvo - e.dir;
  da = Math.atan2(Math.sin(da), Math.cos(da));
  e.dir += da * Math.min(1, dt * 12);
  e.api.grupo.rotation.y = e.dir;
}

function atualizar(dt) {
  tempo += dt;
  // jogador
  if (ligado && !falando) {
    dirTecla.set(0, 0, 0);
    if (teclas.has("w") || teclas.has("arrowup")) dirTecla.z -= 1;
    if (teclas.has("s") || teclas.has("arrowdown")) dirTecla.z += 1;
    if (teclas.has("a") || teclas.has("arrowleft")) dirTecla.x -= 1;
    if (teclas.has("d") || teclas.has("arrowright")) dirTecla.x += 1;
    if (dirTecla.lengthSq() > 0) {
      dirTecla.normalize();
      mover(jogador, dirTecla.x, dirTecla.z, dt, 4.2);
    } else if (destino) {
      const dx = destino.pos.x - jogador.pos.x, dz = destino.pos.z - jogador.pos.z;
      const d = Math.hypot(dx, dz);
      const parar = destino.npc ? 1.9 : 0.15;
      if (d <= parar) {
        const n = destino.npc;
        destino = null; jogador.vel = 0;
        if (n) abrir(n);
      } else {
        mover(jogador, dx, dz, dt, 4.2);
      }
    } else {
      jogador.vel = 0;
    }
  } else {
    jogador.vel = 0;
  }
  jogador.api.atualizar(dt, jogador.vel, tempo);

  // mulheres da vila
  for (const n of npcs) {
    if (n === falando) { n.vel = 0; n.api.atualizar(dt, 0, tempo); continue; }
    if (n.espera > 0) { n.espera -= dt; n.vel = 0; }
    else {
      if (!n.alvo) n.alvo = escolherAlvo(n);
      const dx = n.alvo.x - n.pos.x, dz = n.alvo.z - n.pos.z;
      if (Math.hypot(dx, dz) < 0.2) { n.alvo = null; n.espera = 2 + Math.random() * 4; n.vel = 0; }
      else mover(n, dx, dz, dt, 1.3);
    }
    n.api.atualizar(dt, n.vel, tempo);
  }
  for (const p of [jogador, ...npcs]) p.lab.position.set(p.pos.x, p.api.altura + 0.55, p.pos.z);

  // pergunta "falar"
  const p = ligado && !falando ? proxima() : null;
  dica.hidden = !p;
  if (p) dica.textContent = `Falar com ${p.def.nome}  (E)`;

  // câmara e sol seguem a Maria
  const alvo = new THREE.Vector3(jogador.pos.x, 1.2, jogador.pos.z);
  const off = new THREE.Vector3(0, 13, 15).multiplyScalar(zoom);
  camara.position.lerp(alvo.clone().add(off), Math.min(1, dt * 4));
  camara.lookAt(alvo);
  sol.position.set(jogador.pos.x - 22, 30, jogador.pos.z + 16);
  sol.target.position.set(jogador.pos.x, 0, jogador.pos.z);
}

function ajustar() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camara.aspect = w / h;
  camara.fov = w / h < 0.8 ? 52 : 38;
  camara.updateProjectionMatrix();
}
addEventListener("resize", ajustar);
ajustar();
camara.position.set(jogador.pos.x, 14, jogador.pos.z + 16);

renderer.setAnimationLoop(() => {
  const dt = Math.min(relogio.getDelta(), 0.05);
  atualizar(dt);
  renderer.render(cena, camara);
});

window.__vila = { jogador, npcs, abrir, destino: (x, z) => { destino = { pos: new THREE.Vector3(x, 0, z), npc: null }; }, feitas };
