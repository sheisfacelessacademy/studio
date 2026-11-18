// Construtor de bonecas 3D por código (sem modelos externos).
// O rosto é pintado numa textura, como nas bonecas verdadeiras; cabelo e roupa têm textura própria.
import * as THREE from "../vendor/three.module.js";
import { mergeGeometries } from "../vendor/addons/BufferGeometryUtils.js";

export const PADRAO = {
  pele: "#d9a074",
  cabelo: "#2a1a12",
  estilo: "longo",        // longo | curto | carrapito | rabo | ondas
  altura: 161,            // em cm (161 = Maria)
  corpo: 1,               // 0.85 magra ... 1.35 mais cheia
  top: "#f3ead8",
  baixo: "#4a78b0",
  tipoBaixo: "calca",     // calca | saia
  ganga: false,           // calças de ganga
  sapato: "#5a3a2a",
  mangas: "longas",       // longas | curtas | nenhuma
  olhos: "#4a2a1a",
  batom: "#c9707a",
  sombra: "#9a5f4a",      // sombra de olhos
  oculos: false,
  mala: null,
  colar: true,
  brincos: true,
  avental: null,
};

// ---------- cores ----------
const C = (h) => new THREE.Color(h);
const hex = (c) => "#" + c.getHexString();
const clarear = (h, t) => hex(C(h).lerp(C("#ffffff"), t));
const escurecer = (h, t) => hex(C(h).lerp(C("#000000"), t));
const rgba = (h, a) => { const c = C(h); return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`; };

function tex(canvas, rep = [1, 1]) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep[0], rep[1]);
  t.anisotropy = 8;
  return t;
}
const cache = new Map();
const guardado = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// ---------- rosto pintado ----------
// A textura cobre a esfera da cabeça: x = longitude (frente em 1/4 da largura), y = latitude.
function pintarRosto(P, fechado = false) {
  const W = 1024, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");
  x.fillStyle = P.pele;
  x.fillRect(0, 0, W, H);
  const cx = 256, ey = 256;

  // contorno suave (bochechas e têmporas)
  for (const s of [-1, 1]) {
    const g = x.createRadialGradient(cx + s * 150, 300, 10, cx + s * 150, 300, 90);
    g.addColorStop(0, rgba(escurecer(P.pele, 0.25), 0.25));
    g.addColorStop(1, rgba(P.pele, 0));
    x.fillStyle = g;
    x.fillRect(cx + s * 150 - 95, 200, 190, 200);
  }
  // blush
  for (const s of [-1, 1]) {
    const g = x.createRadialGradient(cx + s * 98, 304, 0, cx + s * 98, 304, 46);
    g.addColorStop(0, "rgba(236,112,118,.42)");
    g.addColorStop(1, "rgba(236,112,118,0)");
    x.fillStyle = g;
    x.fillRect(cx + s * 98 - 50, 254, 100, 100);
  }

  for (const s of [-1, 1]) {
    const ex = cx + s * 68;
    const dentro = ex - s * 34, fora = ex + s * 38;
    // sombra de olhos
    const gs = x.createRadialGradient(ex + s * 6, ey - 14, 4, ex + s * 6, ey - 14, 46);
    gs.addColorStop(0, rgba(P.sombra, 0.55));
    gs.addColorStop(1, rgba(P.sombra, 0));
    x.fillStyle = gs;
    x.beginPath(); x.ellipse(ex + s * 6, ey - 14, 50, 30, 0, 0, Math.PI * 2); x.fill();

    if (fechado) {
      x.strokeStyle = "#120a08";
      x.lineCap = "round";
      x.lineWidth = 5.5;
      x.beginPath();
      x.moveTo(dentro, ey + 2);
      x.bezierCurveTo(dentro + s * 16, ey + 11, fora - s * 16, ey + 10, fora, ey - 2);
      x.lineTo(fora + s * 12, ey - 8);
      x.stroke();
      x.lineWidth = 2.4;
      for (let i = 0; i < 8; i++) {
        const t = 0.2 + i * 0.1;
        const px = dentro + (fora - dentro) * t;
        const py = ey + 2 + Math.sin(t * Math.PI) * 8;
        x.beginPath(); x.moveTo(px, py); x.lineTo(px + s * 4, py + 7); x.stroke();
      }
    } else {
    const amendoa = () => {
      x.beginPath();
      x.moveTo(dentro, ey + 3);
      x.bezierCurveTo(dentro + s * 14, ey - 21, fora - s * 18, ey - 23, fora, ey - 6);
      x.bezierCurveTo(fora - s * 16, ey + 15, dentro + s * 16, ey + 17, dentro, ey + 3);
      x.closePath();
    };
    x.save();
    amendoa();
    x.fillStyle = "#fbf8f3";
    x.fill();
    x.clip();
    const ix = ex + s * 2, iy = ey - 2;
    const gi = x.createRadialGradient(ix, iy + 4, 2, ix, iy, 18);
    gi.addColorStop(0, clarear(P.olhos, 0.5));
    gi.addColorStop(0.65, P.olhos);
    gi.addColorStop(1, escurecer(P.olhos, 0.7));
    x.fillStyle = gi;
    x.beginPath(); x.arc(ix, iy, 18, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#0b0605";
    x.beginPath(); x.arc(ix, iy, 7.5, 0, Math.PI * 2); x.fill();
    const gl = x.createLinearGradient(0, ey - 24, 0, ey - 2);
    gl.addColorStop(0, "rgba(50,25,18,.55)");
    gl.addColorStop(1, "rgba(50,25,18,0)");
    x.fillStyle = gl;
    x.fillRect(ex - 50, ey - 26, 100, 24);
    x.restore();
    // brilhos
    x.fillStyle = "#ffffff";
    x.beginPath(); x.arc(ix + 6, iy - 7, 5, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(ix - 6, iy + 6, 2.2, 0, Math.PI * 2); x.fill();
    // eyeliner com asa
    x.strokeStyle = "#120a08";
    x.lineCap = "round";
    x.lineJoin = "round";
    x.lineWidth = 6.5;
    x.beginPath();
    x.moveTo(dentro, ey + 3);
    x.bezierCurveTo(dentro + s * 14, ey - 21, fora - s * 18, ey - 23, fora, ey - 6);
    x.lineTo(fora + s * 15, ey - 17);
    x.stroke();
    // pestanas
    x.lineWidth = 2.8;
    for (let i = 0; i < 10; i++) {
      const t = 0.18 + i * 0.09;
      const px = dentro + (fora - dentro) * t;
      const py = ey + 1 - Math.sin(t * Math.PI) * 17 - t * 5;
      const len = 8 + t * 10;
      x.beginPath();
      x.moveTo(px, py);
      x.quadraticCurveTo(px + s * len * 0.4, py - len * 0.8, px + s * len, py - len);
      x.stroke();
    }
    // linha inferior
    x.lineWidth = 1.8;
    x.strokeStyle = "rgba(40,20,15,.55)";
    x.beginPath();
    x.moveTo(dentro + s * 8, ey + 8);
    x.bezierCurveTo(dentro + s * 22, ey + 16, fora - s * 16, ey + 13, fora, ey - 4);
    x.stroke();
    }
    // sobrancelha (forma afinada)
    const corSob = C(P.cabelo).getHSL({}).l > 0.45 ? escurecer(P.cabelo, 0.45) : P.cabelo;
    x.fillStyle = corSob;
    const b0 = ex - s * 34, b1 = ex + s * 44, pico = ex + s * 16;
    x.beginPath();
    x.moveTo(b0, 214);
    x.quadraticCurveTo(pico, 186, b1, 206);
    x.quadraticCurveTo(pico, 194, b0, 225);
    x.closePath();
    x.fill();
  }

  // nariz
  x.fillStyle = rgba(escurecer(P.pele, 0.45), 0.35);
  for (const s of [-1, 1]) { x.beginPath(); x.ellipse(cx + s * 9, 302, 5, 3, s * 0.4, 0, Math.PI * 2); x.fill(); }
  const gn = x.createLinearGradient(cx - 14, 0, cx + 14, 0);
  gn.addColorStop(0, rgba(escurecer(P.pele, 0.3), 0.18));
  gn.addColorStop(0.5, rgba(clarear(P.pele, 0.4), 0.25));
  gn.addColorStop(1, rgba(escurecer(P.pele, 0.3), 0.18));
  x.fillStyle = gn;
  x.fillRect(cx - 14, 250, 28, 48);

  // lábios
  const ly = 340;
  const gl = x.createLinearGradient(0, ly - 14, 0, ly + 20);
  gl.addColorStop(0, escurecer(P.batom, 0.15));
  gl.addColorStop(0.5, P.batom);
  gl.addColorStop(1, clarear(P.batom, 0.15));
  x.fillStyle = gl;
  x.beginPath();
  x.moveTo(cx - 32, ly);
  x.bezierCurveTo(cx - 22, ly - 10, cx - 13, ly - 15, cx - 7, ly - 11);
  x.quadraticCurveTo(cx, ly - 8, cx + 7, ly - 11);
  x.bezierCurveTo(cx + 13, ly - 15, cx + 22, ly - 10, cx + 32, ly);
  x.bezierCurveTo(cx + 20, ly + 21, cx - 20, ly + 21, cx - 32, ly);
  x.closePath();
  x.fill();
  x.strokeStyle = rgba(escurecer(P.batom, 0.5), 0.7);
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(cx - 30, ly);
  x.quadraticCurveTo(cx, ly + 5, cx + 30, ly);
  x.stroke();
  x.fillStyle = "rgba(255,255,255,.55)";
  x.beginPath(); x.ellipse(cx + 5, ly + 9, 9, 3.5, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = "rgba(255,255,255,.35)";
  x.beginPath(); x.ellipse(cx - 12, ly - 6, 5, 2, -0.3, 0, Math.PI * 2); x.fill();

  return tex(c);
}

// ---------- texturas de cabelo e tecido ----------
function texCabelo(cor) {
  return guardado("cab" + cor, () => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 512;
    const x = c.getContext("2d");
    x.fillStyle = cor;
    x.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 520; i++) {
      const px = Math.random() * 256;
      const claro = Math.random() < 0.45;
      x.strokeStyle = claro ? rgba(clarear(cor, 0.25 + Math.random() * 0.25), 0.35) : rgba(escurecer(cor, 0.3 + Math.random() * 0.3), 0.4);
      x.lineWidth = 0.6 + Math.random() * 1.4;
      x.beginPath();
      x.moveTo(px, 0);
      const amp = 2 + Math.random() * 3;
      for (let y = 0; y <= 512; y += 32) x.lineTo(px + Math.sin(y / 60 + i) * amp, y);
      x.stroke();
    }
    return tex(c, [3, 1]);
  });
}

function texMalha(cor) {
  return guardado("malha" + cor, () => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    x.fillStyle = cor;
    x.fillRect(0, 0, 64, 64);
    x.lineWidth = 2;
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
      x.strokeStyle = rgba(escurecer(cor, 0.22), 0.55);
      x.beginPath();
      x.moveTo(i * 8 + 1, j * 8 + 1);
      x.lineTo(i * 8 + 4, j * 8 + 7);
      x.lineTo(i * 8 + 7, j * 8 + 1);
      x.stroke();
    }
    return tex(c, [10, 7]);
  });
}

function texGanga(cor) {
  return guardado("ganga" + cor, () => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d");
    x.fillStyle = cor;
    x.fillRect(0, 0, 128, 128);
    x.lineWidth = 1;
    for (let i = -128; i < 256; i += 3) {
      x.strokeStyle = rgba(i % 2 ? clarear(cor, 0.35) : escurecer(cor, 0.25), 0.35);
      x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 128, 128); x.stroke();
    }
    for (let k = 0; k < 500; k++) {
      x.fillStyle = rgba(clarear(cor, 0.5), Math.random() * 0.25);
      x.fillRect(Math.random() * 128, Math.random() * 128, 1.5, 1.5);
    }
    return tex(c, [3, 4]);
  });
}

function texTecido(cor) {
  return guardado("tec" + cor, () => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    x.fillStyle = cor;
    x.fillRect(0, 0, 64, 64);
    for (let k = 0; k < 300; k++) {
      x.fillStyle = rgba(Math.random() < 0.5 ? clarear(cor, 0.2) : escurecer(cor, 0.2), Math.random() * 0.3);
      x.fillRect(Math.random() * 64, Math.random() * 64, 1, 1);
    }
    return tex(c, [6, 6]);
  });
}

// ---------- cabelo em madeixas ----------
// Cada fio é um tubo fino que nasce no couro cabeludo e cai com o peso,
// contornando a cabeça, o pescoço e os ombros.
const RX = 0.103, RY = 0.127, RZ = 0.114;  // raios da cabeça (eixos locais)
const raioCabeca = (az) => 1 / Math.sqrt((Math.sin(az) / RX) ** 2 + (Math.cos(az) / RZ) ** 2);
function raioCorpo(y, az, w) {
  // y relativo ao centro da cabeça: pescoço até -0.17, ombros a partir de -0.2
  if (y > -0.12) return 0;
  const t = Math.min(1, Math.max(0, (-0.12 - y) / 0.09));
  const rx = 0.05 + t * (0.19 * w - 0.05), rz = 0.05 + t * (0.105 * w - 0.05);
  return 1 / Math.sqrt((Math.sin(az) / rx) ** 2 + (Math.cos(az) / rz) ** 2);
}

// Caminho de uma madeixa: nasce no couro cabeludo (ângulo th0) e cai até à altura `fim`.
function caminho(P, w, az, th0, fim, camada, fase, passos = 16) {
  const pts = [];
  const y0 = Math.cos(th0) * RY;
  let d = 0;
  for (let k = 0; k <= passos; k++) {
    const t = k / passos;
    const y = y0 + (fim - y0) * (t * t * 0.35 + t * 0.65);
    const rh = raioCabeca(az) * 1.04 + camada;
    let alvo = y > 0 ? rh * Math.sqrt(Math.max(0.05, 1 - (y / (RY * 1.04)) ** 2)) : rh;
    alvo = Math.max(alvo, raioCorpo(y, az, w) + camada + 0.006);
    d = k === 0 ? alvo : (alvo > d ? d + (alvo - d) * 0.6 : d + (alvo - d) * 0.25);
    let a = az, dd = d;
    if (P.estilo === "ondas" && y < -0.05) { a += Math.sin(y * 18 + fase) * 0.025; dd += Math.sin(y * 16 + fase) * 0.006; }
    pts.push(new THREE.Vector3(Math.sin(a) * dd, y, Math.cos(a) * dd));
  }
  return pts;
}

function fimFio(P, az, r) {
  const longo = P.estilo === "longo" || P.estilo === "ondas";
  return longo ? -0.6 - r * 0.08 + (Math.abs(az) < 1.6 ? 0.08 : 0) : -0.105 - r * 0.03;
}

// Massa de cabelo contínua (por baixo das madeixas), para não haver buracos.
function massaCabelo(P, w) {
  const longo = P.estilo === "longo" || P.estilo === "ondas";
  const frente = longo ? 1.0 : 0.9;
  const NA = 48, NT = 16;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= NA; i++) {
    const az = frente + (Math.PI * 2 - 2 * frente) * (i / NA);
    const pts = caminho(P, w, az, 0.25, fimFio(P, az > Math.PI ? az - Math.PI * 2 : az, 0.3), 0.0, 0, NT);
    for (let k = 0; k <= NT; k++) {
      pos.push(pts[k].x, pts[k].y, pts[k].z);
      uv.push(i / NA * 4, 1 - k / NT);
    }
  }
  for (let i = 0; i < NA; i++) for (let k = 0; k < NT; k++) {
    const a = i * (NT + 1) + k, b = (i + 1) * (NT + 1) + k;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function fios(P, w) {
  const longo = P.estilo === "longo" || P.estilo === "ondas";
  const n = longo ? 260 : 200;
  const base = C(P.cabelo);
  const geos = [];
  let semente = 7;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return semente / 2147483647; };
  for (let i = 0; i < n; i++) {
    let az = (rnd() * 2 - 1) * Math.PI;
    const frente = longo ? 0.95 : 0.85;
    if (Math.abs(az) < frente) az = Math.sign(az || 1) * (frente + rnd() * 0.25);
    const th0 = 0.2 + rnd() * (Math.abs(az) > 2.2 ? 1.2 : 0.75);
    const pts = caminho(P, w, az, th0, fimFio(P, az, rnd()), 0.004 + rnd() * 0.01, rnd() * 6.28);
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, longo ? 0.0058 : 0.0065, 4, false);
    const cor = base.clone().offsetHSL(0, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.14);
    const cores = new Float32Array(g.attributes.position.count * 3);
    for (let j = 0; j < cores.length; j += 3) { cores[j] = cor.r; cores[j + 1] = cor.g; cores[j + 2] = cor.b; }
    g.setAttribute("color", new THREE.BufferAttribute(cores, 3));
    geos.push(g);
  }
  return mergeGeometries(geos);
}

function fiosRabo(P) {
  const geos = [];
  const base = C(P.cabelo);
  for (let i = 0; i < 46; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 0.022;
    const ox = Math.cos(a) * r, oz = Math.sin(a) * r;
    const L = 0.26 + Math.random() * 0.08;
    const pts = [];
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      const abre = Math.sin(t * Math.PI) * 0.6 + 0.4;
      pts.push(new THREE.Vector3(ox * abre * 1.4, -t * L, -0.02 - t * 0.05 + oz * abre * 1.4));
    }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.009, 4, false);
    const cor = base.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.12);
    const cores = new Float32Array(g.attributes.position.count * 3);
    for (let j = 0; j < cores.length; j += 3) { cores[j] = cor.r; cores[j + 1] = cor.g; cores[j + 2] = cor.b; }
    g.setAttribute("color", new THREE.BufferAttribute(cores, 3));
    geos.push(g);
  }
  return mergeGeometries(geos);
}

// ---------- formas do corpo ----------
// Membro afunilado (torno), com origem no topo e a crescer para baixo.
function membro(perfil, segs = 18) {
  const pts = new THREE.SplineCurve(perfil.map(([r, y]) => new THREE.Vector2(r, -y))).getPoints(24);
  pts.reverse();
  return new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(Math.max(0.0005, p.x), p.y)), segs);
}

function cabecaEsculpida() {
  const g = new THREE.SphereGeometry(0.12, 56, 40);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const yn = v.y / 0.12;
    // maxilar e queixo mais estreitos
    const t = Math.min(1, Math.max(0, (-yn - 0.12) / 0.88));
    const estreita = 1 - 0.36 * t * t - 0.08 * t;
    v.x *= estreita;
    v.z *= 1 - 0.12 * t * t;
    // queixo ligeiramente para a frente
    if (v.z > 0) v.z += 0.01 * t * t * (v.z / 0.12);
    // maçãs do rosto
    const m = Math.exp(-(((yn + 0.18) / 0.18) ** 2)) * Math.max(0, v.z / 0.12);
    v.x *= 1 + 0.035 * m;
    // nuca mais cheia
    if (v.z < 0 && yn > -0.3) v.z *= 1.05;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function mao(pele, lado) {
  const g = new THREE.Group();
  const palma = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), pele);
  palma.scale.set(0.85, 1.25, 0.45);
  palma.position.y = -0.03;
  g.add(palma);
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.0058, 0.032 - Math.abs(i - 1.5) * 0.004, 4, 8), pele);
    f.position.set((i - 1.5) * 0.0115, -0.082 + Math.abs(i - 1.5) * 0.003, 0.002);
    f.rotation.x = 0.12;
    g.add(f);
  }
  const pol = new THREE.Mesh(new THREE.CapsuleGeometry(0.0065, 0.024, 4, 8), pele);
  pol.position.set(-lado * 0.022, -0.045, 0.01);
  pol.rotation.set(0.3, 0, lado * 0.6);
  g.add(pol);
  g.traverse((o) => { o.castShadow = true; });
  return g;
}

// ---------- materiais ----------
const plastico = (cor, o = {}) => new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.4, envMapIntensity: 0.5, ...o });
const pano = (map, o = {}) => new THREE.MeshStandardMaterial({ map, roughness: 0.9, envMapIntensity: 0.3, ...o });
const ouro = () => new THREE.MeshStandardMaterial({ color: "#e6b85e", roughness: 0.2, metalness: 1, envMapIntensity: 1.4 });

export function criarBoneca(opcoes = {}) {
  const P = { ...PADRAO, ...opcoes };
  const w = P.corpo;
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);
  const S = (m) => { m.castShadow = true; return m; };

  const pele = plastico(P.pele, { roughness: 0.42, clearcoat: 0.25, sheen: 0.4, sheenColor: C(clarear(P.pele, 0.5)) });
  const matCab = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3,
    sheen: 1, sheenColor: C(clarear(P.cabelo, 0.55)), sheenRoughness: 0.3, envMapIntensity: 0.6,
  });
  const matCapa = new THREE.MeshPhysicalMaterial({ map: texCabelo(P.cabelo), roughness: 0.5, clearcoat: 0.3, envMapIntensity: 0.5 });
  const matTop = pano(texMalha(P.top));
  const matBaixo = pano(P.ganga ? texGanga(P.baixo) : texTecido(P.baixo));
  const matSapato = plastico(P.sapato, { roughness: 0.3, clearcoat: 0.8 });
  const calca = P.tipoBaixo === "calca";

  // ----- pernas: coxa + canela, com joelho -----
  const ANCA = 0.86;
  const pernas = [];
  for (const lado of [-1, 1]) {
    const coxaPiv = new THREE.Group();
    coxaPiv.position.set(lado * 0.072 * w, ANCA, 0);
    const k = calca ? 1.12 : 1;
    const coxa = S(new THREE.Mesh(membro([[0.072 * w * k, 0], [0.075 * w * k, 0.06], [0.06 * w * k, 0.22], [0.045 * k, 0.37], [0.04 * k, 0.4]]), calca ? matBaixo : pele));
    coxaPiv.add(coxa);
    const joelho = new THREE.Group();
    joelho.position.y = -0.39;
    const canela = S(new THREE.Mesh(membro([[0.042 * k, 0], [0.045 * k, 0.1], [0.036 * k, 0.24], [0.026 * (calca ? 1.4 : 1), 0.36], [0.024 * (calca ? 1.4 : 1), 0.39]]), calca ? matBaixo : pele));
    joelho.add(canela);
    joelho.add(S(new THREE.Mesh(new THREE.SphereGeometry(0.043 * k, 14, 10), calca ? matBaixo : pele)));
    const pe = S(new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 12), matSapato));
    pe.scale.set(0.8, 0.55, 2.0);
    pe.position.set(0, -0.43, 0.045);
    joelho.add(pe);
    coxaPiv.add(joelho);
    corpo.add(coxaPiv);
    pernas.push({ coxaPiv, joelho });
  }

  // ----- tronco: ancas, cintura, peito e ombros -----
  const perfil = [
    [0.001, -0.02], [0.12 * w, -0.02], [0.152 * w, 0.06], [0.148 * w, 0.12], [0.112 * w, 0.21],
    [0.104 * w, 0.25], [0.118 * w, 0.33], [0.128 * w, 0.4], [0.122 * w, 0.46], [0.105, 0.51], [0.05, 0.545], [0.001, 0.55],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const gT = new THREE.LatheGeometry(new THREE.SplineCurve(perfil).getPoints(40), 40);
  {
    const p = gT.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const om = THREE.MathUtils.smoothstep(v.y, 0.38, 0.5);
      v.x *= 1 + 0.42 * om;              // ombros
      v.z *= 0.68 - 0.1 * om;            // profundidade
      const peito = Math.exp(-(((v.y - 0.36) / 0.06) ** 2)) * Math.max(0, v.z) * 0.55;
      v.z += peito;                      // busto
      const nadega = Math.exp(-(((v.y - 0.06) / 0.07) ** 2)) * Math.max(0, -v.z) * 0.25;
      v.z -= nadega;
      p.setXYZ(i, v.x, v.y, v.z);
    }
    gT.computeVertexNormals();
  }
  const tronco = S(new THREE.Mesh(gT, matTop));
  tronco.position.y = ANCA;
  corpo.add(tronco);

  if (!calca) {
    const saiaPerf = [[0.12 * w, 0.2], [0.155 * w, 0.06], [0.2 * w, -0.14], [0.235 * w, -0.3]].map(([r, y]) => new THREE.Vector2(r, y)).reverse();
    const saia = S(new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(saiaPerf).getPoints(16), 40), matBaixo.clone()));
    saia.material.side = THREE.DoubleSide;
    saia.scale.z = 0.8;
    saia.position.y = ANCA;
    corpo.add(saia);
  } else {
    const cinto = S(new THREE.Mesh(new THREE.CylinderGeometry(0.153 * w, 0.156 * w, 0.06, 32), matBaixo));
    cinto.scale.z = 0.69;
    cinto.position.y = ANCA + 0.05;
    corpo.add(cinto);
  }
  if (P.avental) {
    const av = S(new THREE.Mesh(new THREE.BoxGeometry(0.24 * w, 0.4, 0.012), pano(texTecido(P.avental))));
    av.position.set(0, ANCA + 0.08, 0.112 * w);
    corpo.add(av);
  }

  // ----- pescoço e cabeça -----
  const pescoco = S(new THREE.Mesh(membro([[0.04, 0], [0.038, 0.06], [0.045, 0.11], [0.06, 0.13]]), pele));
  pescoco.position.y = 1.49;
  corpo.add(pescoco);

  const cabeca = new THREE.Group();
  cabeca.position.y = 1.575;
  corpo.add(cabeca);
  const mapaAberto = pintarRosto(P);
  const mapaFechado = pintarRosto(P, true);
  const rosto = plastico("#ffffff", { map: mapaAberto, roughness: 0.42, clearcoat: 0.25 });
  const cranio = S(new THREE.Mesh(cabecaEsculpida(), rosto));
  cranio.scale.set(0.86, 1.06, 0.95);
  cabeca.add(cranio);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 12), pele);
  nariz.scale.set(0.62, 1.25, 0.8);
  nariz.position.set(0, -0.03, 0.106);
  nariz.rotation.x = -0.25;
  cabeca.add(nariz);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 10), pele);
    orelha.scale.set(0.35, 1.15, 0.8);
    orelha.position.set(lado * 0.1, -0.012, -0.005);
    cabeca.add(orelha);
    if (P.brincos) {
      const b = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0028, 8, 16), ouro());
      b.position.set(lado * 0.104, -0.045, 0.0);
      b.rotation.y = Math.PI / 2;
      cabeca.add(b);
    }
  }
  if (P.oculos) {
    const aro = plastico("#1b1512", { roughness: 0.25 });
    for (const lado of [-1, 1]) {
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.0045, 8, 28), aro);
      l.scale.y = 0.78;
      l.position.set(lado * 0.04, 0.0, 0.118);
      cabeca.add(l);
    }
    const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.005, 0.005), aro);
    ponte.position.set(0, 0.006, 0.12);
    cabeca.add(ponte);
  }

  // ----- cabelo -----
  const capa = S(new THREE.Mesh(new THREE.SphereGeometry(0.128, 48, 28, 0, Math.PI * 2, 0, 1.85), matCapa));
  capa.scale.set(0.87, 1.06, 0.97);
  capa.rotation.x = -0.86;
  capa.position.set(0, 0.004, -0.003);
  cabeca.add(capa);
  let rabo = null;
  if (P.estilo === "longo" || P.estilo === "ondas" || P.estilo === "curto") {
    const massa = S(new THREE.Mesh(massaCabelo(P, w), matCapa.clone()));
    massa.material.side = THREE.DoubleSide;
    cabeca.add(massa);
    cabeca.add(S(new THREE.Mesh(fios(P, w), matCab)));
  } else if (P.estilo === "carrapito") {
    const bola = S(new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), matCapa));
    bola.position.set(0, 0.12, -0.075);
    cabeca.add(bola);
  } else if (P.estilo === "rabo") {
    rabo = new THREE.Group();
    rabo.position.set(0, 0.07, -0.115);
    rabo.add(S(new THREE.Mesh(fiosRabo(P), matCab)));
    const atilho = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.006, 6, 12), plastico("#2b2b2b"));
    atilho.rotation.x = Math.PI / 2;
    rabo.add(atilho);
    rabo.rotation.x = 0.35;
    cabeca.add(rabo);
  }

  // ----- braços: ombro, cotovelo, pulso e mão com dedos -----
  const bracos = [];
  for (const lado of [-1, 1]) {
    const ombro = new THREE.Group();
    ombro.position.set(lado * 0.158 * w, 1.375, -0.005);
    ombro.rotation.z = lado * 0.1;
    const mSup = P.mangas === "nenhuma" ? pele : matTop;
    const sup = S(new THREE.Mesh(membro([[0.042 * w, 0], [0.043 * w, 0.04], [0.036 * w, 0.17], [0.03, 0.27], [0.029, 0.28]]), mSup));
    ombro.add(sup);
    const capOmbro = S(new THREE.Mesh(new THREE.SphereGeometry(0.044 * w, 16, 12), mSup));
    ombro.add(capOmbro);
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.27;
    const mInf = P.mangas === "longas" ? matTop : pele;
    const inf = S(new THREE.Mesh(membro([[0.03, 0], [0.032, 0.05], [0.026, 0.17], [0.02, 0.24], [0.019, 0.25]]), mInf));
    cotovelo.add(inf);
    cotovelo.add(S(new THREE.Mesh(new THREE.SphereGeometry(0.031, 12, 10), mInf)));
    const m = mao(pele, lado);
    m.position.y = -0.245;
    cotovelo.add(m);
    cotovelo.rotation.x = -0.22;
    ombro.add(cotovelo);
    corpo.add(ombro);
    bracos.push({ ombro, cotovelo, mao: m });
  }
  if (P.mala) {
    const mala = S(new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.12, 0.05), plastico(P.mala, { roughness: 0.45, clearcoat: 0.3 })));
    mala.position.set(0, -0.1, 0.03);
    mala.rotation.z = 0.12;
    bracos[0].mao.add(mala);
  }
  if (P.colar) {
    const colar = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.0028, 6, 40), ouro());
    colar.rotation.x = Math.PI / 2.3;
    colar.position.set(0, 1.43, 0.03);
    colar.scale.set(1, 0.85, 1);
    corpo.add(colar);
    const pend = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 10, 8), ouro());
    pend.position.set(0, 1.385, 0.08);
    corpo.add(pend);
  }

  const esc = P.altura / 161;
  raiz.scale.setScalar(esc);

  // ----- vida: andar, respirar, piscar, mudar o peso -----
  let fase = Math.random() * 6;
  let amp = 0;
  let acenar = 0;
  let piscar = 1 + Math.random() * 3;
  const sem = Math.random() * 10;
  return {
    grupo: raiz,
    params: P,
    altura: 1.72 * esc,
    cabeca: 1.575 * esc,
    acenar(on) { acenar = on ? 1 : 0; },
    atualizar(dt, velocidade = 0, tempo = 0) {
      const alvo = Math.min(1, velocidade / 3.2);
      amp += (alvo - amp) * Math.min(1, dt * 10);
      fase += dt * (3.5 + velocidade * 2.4);
      const s = Math.sin(fase);
      const parado = 1 - amp;
      // pernas com joelho a dobrar na fase de balanço
      pernas[0].coxaPiv.rotation.x = s * 0.6 * amp;
      pernas[1].coxaPiv.rotation.x = -s * 0.6 * amp;
      pernas[0].joelho.rotation.x = Math.max(0, -Math.cos(fase - 0.6)) * 0.9 * amp;
      pernas[1].joelho.rotation.x = Math.max(0, Math.cos(fase - 0.6)) * 0.9 * amp;
      // braços opostos às pernas, cotovelo solto
      bracos[0].ombro.rotation.x = -s * 0.5 * amp;
      bracos[1].ombro.rotation.x = s * 0.5 * amp;
      bracos[0].cotovelo.rotation.x = -0.22 - Math.max(0, s) * 0.35 * amp;
      bracos[1].cotovelo.rotation.x = -0.22 - Math.max(0, -s) * 0.35 * amp;
      // corpo: passo, respiração e peso numa perna quando parada
      const peso = Math.sin(tempo * 0.45 + sem) * parado;
      corpo.position.y = Math.abs(Math.cos(fase)) * 0.02 * amp;
      corpo.position.x = peso * 0.012;
      corpo.rotation.z = -peso * 0.02;
      corpo.rotation.y = s * 0.06 * amp;
      pernas[0].coxaPiv.rotation.z = Math.max(0, peso) * 0.04;
      pernas[1].coxaPiv.rotation.z = Math.min(0, peso) * 0.04;
      tronco.scale.set(1 + Math.sin(tempo * 1.7 + sem) * 0.006, 1, 1 + Math.sin(tempo * 1.7 + sem) * 0.012);
      cabeca.rotation.y = Math.sin(tempo * 0.6 + sem) * 0.15 * parado;
      cabeca.rotation.x = Math.sin(tempo * 0.4 + sem) * 0.04 * parado;
      cabeca.rotation.z = Math.sin(tempo * 0.5 + sem) * 0.035 * parado;
      if (rabo) rabo.rotation.x = 0.35 + s * 0.15 * amp + Math.sin(tempo * 1.3) * 0.02;
      // piscar os olhos
      piscar -= dt;
      if (piscar < 0) {
        rosto.map = mapaFechado;
        if (piscar < -0.12) { rosto.map = mapaAberto; piscar = 2 + Math.random() * 4; }
      }
      if (acenar) {
        bracos[1].ombro.rotation.z = 2.3 + Math.sin(tempo * 7) * 0.12;
        bracos[1].ombro.rotation.x = 0;
        bracos[1].cotovelo.rotation.x = 0;
        bracos[1].cotovelo.rotation.z = 0.5 + Math.sin(tempo * 7) * 0.3;
      } else {
        bracos[1].ombro.rotation.z += (0.1 - bracos[1].ombro.rotation.z) * Math.min(1, dt * 8);
        bracos[1].cotovelo.rotation.z *= 1 - Math.min(1, dt * 8);
      }
    },
  };
}
