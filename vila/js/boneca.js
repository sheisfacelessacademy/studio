// Construtor de bonecas 3D por código (sem modelos externos).
// O rosto é pintado numa textura, como nas bonecas verdadeiras; cabelo e roupa têm textura própria.
import * as THREE from "../vendor/three.module.js";

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
function pintarRosto(P) {
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

// ---------- materiais ----------
const plastico = (cor, o = {}) => new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.3, envMapIntensity: 0.6, ...o });
const pano = (map, o = {}) => new THREE.MeshStandardMaterial({ map, roughness: 0.9, envMapIntensity: 0.3, ...o });
const ouro = () => new THREE.MeshStandardMaterial({ color: "#e6b85e", roughness: 0.2, metalness: 1, envMapIntensity: 1.4 });

export function criarBoneca(opcoes = {}) {
  const P = { ...PADRAO, ...opcoes };
  const w = P.corpo;
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  const pele = plastico(P.pele, { roughness: 0.3 });
  const cabelo = new THREE.MeshPhysicalMaterial({
    map: texCabelo(P.cabelo), roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.25,
    sheen: 1, sheenColor: C(clarear(P.cabelo, 0.5)), sheenRoughness: 0.35, envMapIntensity: 0.7,
  });
  const matTop = pano(texMalha(P.top));
  const matBaixo = pano(P.ganga ? texGanga(P.baixo) : texTecido(P.baixo));
  const matSapato = plastico(P.sapato, { roughness: 0.3, clearcoat: 0.8 });
  const sombra = (m) => { m.castShadow = true; return m; };

  // ----- pernas -----
  const ANCA = 0.82;
  const pernas = [];
  for (const lado of [-1, 1]) {
    const piv = new THREE.Group();
    piv.position.set(lado * 0.075 * w, ANCA, 0);
    const calca = P.tipoBaixo === "calca";
    const perna = sombra(new THREE.Mesh(new THREE.CapsuleGeometry((calca ? 0.074 : 0.056) * w, 0.62, 8, 18), calca ? matBaixo : pele));
    perna.position.y = -0.41;
    if (calca) perna.scale.x = 1.08;
    piv.add(perna);
    const sapato = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), matSapato));
    sapato.scale.set(1.05, 0.62, 2.0);
    sapato.position.set(0, -0.79, 0.04);
    piv.add(sapato);
    corpo.add(piv);
    pernas.push(piv);
  }

  // ----- tronco com cintura -----
  const perfil = [
    [0.001, 0], [0.15 * w, 0], [0.175 * w, 0.08], [0.125 * w, 0.26],
    [0.152 * w, 0.4], [0.145 * w, 0.5], [0.12 * w, 0.56], [0.06, 0.6], [0.001, 0.61],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const tronco = sombra(new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(perfil).getPoints(28), 32), matTop));
  tronco.scale.z = 0.72;
  tronco.position.y = ANCA;
  corpo.add(tronco);

  if (P.tipoBaixo === "saia") {
    const saia = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.165 * w, 0.27 * w, 0.42, 32, 1, true), matBaixo.clone()));
    saia.material.side = THREE.DoubleSide;
    saia.scale.z = 0.85;
    saia.position.y = ANCA - 0.15;
    corpo.add(saia);
  } else {
    const cinto = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.158 * w, 0.168 * w, 0.1, 28), matBaixo));
    cinto.scale.z = 0.74;
    cinto.position.y = ANCA + 0.03;
    corpo.add(cinto);
  }
  if (P.avental) {
    const av = sombra(new THREE.Mesh(new THREE.BoxGeometry(0.26 * w, 0.42, 0.02), pano(texTecido(P.avental))));
    av.position.set(0, ANCA + 0.22, 0.125 * w);
    corpo.add(av);
  }

  // ----- pescoço e cabeça -----
  const pescoco = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.08, 4, 14), pele));
  pescoco.position.y = 1.44;
  corpo.add(pescoco);

  const cabeca = new THREE.Group();
  cabeca.position.y = 1.62;
  corpo.add(cabeca);
  const rosto = plastico("#ffffff", { map: pintarRosto(P), roughness: 0.32, clearcoat: 0.45 });
  const cranio = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.17, 48, 32), rosto));
  cranio.scale.set(0.9, 1.04, 0.94);
  cabeca.add(cranio);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 10), pele);
  nariz.scale.set(0.9, 1.1, 1.0);
  nariz.position.set(0, -0.022, 0.153);
  cabeca.add(nariz);

  for (const lado of [-1, 1]) {
    if (P.brincos) {
      const b = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 8, 16), ouro());
      b.position.set(lado * 0.155, -0.07, 0.0);
      b.rotation.y = Math.PI / 2;
      cabeca.add(b);
    }
  }
  if (P.oculos) {
    const aro = plastico("#1b1512", { roughness: 0.25 });
    for (const lado of [-1, 1]) {
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.006, 8, 28), aro);
      l.scale.y = 0.8;
      l.position.set(lado * 0.064, 0.0, 0.168);
      cabeca.add(l);
    }
    const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.006), aro);
    ponte.position.set(0, 0.008, 0.17);
    cabeca.add(ponte);
  }

  // ----- cabelo -----
  const topoCabelo = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.186, 40, 24, 0, Math.PI * 2, 0, 1.82), cabelo));
  topoCabelo.scale.set(0.94, 1.02, 0.98);
  topoCabelo.rotation.x = -0.82;
  topoCabelo.position.set(0, 0.006, -0.004);
  cabeca.add(topoCabelo);

  let rabo = null;
  const estilo = P.estilo;
  if (estilo === "longo" || estilo === "ondas") {
    const larg = estilo === "ondas" ? 1.22 : 1.05;
    const costas = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.6, 10, 24), cabelo));
    costas.scale.set(larg, 1, 0.62);
    costas.position.set(0, -0.32, -0.09);
    cabeca.add(costas);
    // madeixas a emoldurar o rosto, a partir da risca ao meio
    for (const lado of [-1, 1]) {
      const m = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.46, 8, 14), cabelo));
      m.scale.set(0.7, 1, 1.25);
      m.position.set(lado * 0.148, -0.22, 0.0);
      m.rotation.z = lado * 0.08;
      cabeca.add(m);
    }
  } else if (estilo === "curto") {
    const costas = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.188, 32, 20, Math.PI, Math.PI, 0.45, 1.85), cabelo));
    costas.position.set(0, -0.05, -0.012);
    cabeca.add(costas);
    for (const lado of [-1, 1]) {
      const m = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.12, 6, 12), cabelo));
      m.scale.z = 0.8;
      m.position.set(lado * 0.152, -0.08, 0.02);
      cabeca.add(m);
    }
  } else if (estilo === "carrapito") {
    const bola = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), cabelo));
    bola.position.set(0, 0.2, -0.08);
    cabeca.add(bola);
  } else if (estilo === "rabo") {
    rabo = new THREE.Group();
    rabo.position.set(0, 0.1, -0.16);
    const r = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.32, 6, 14), cabelo));
    r.position.set(0, -0.18, -0.02);
    rabo.add(r);
    rabo.rotation.x = 0.25;
    cabeca.add(rabo);
  }

  // ----- braços -----
  const bracos = [];
  for (const lado of [-1, 1]) {
    const ombro = new THREE.Group();
    ombro.position.set(lado * (0.17 * w + 0.045), 1.35, 0);
    ombro.rotation.z = lado * 0.07;
    const sup = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.22, 8, 14), P.mangas === "nenhuma" ? pele : matTop));
    sup.position.y = -0.15;
    ombro.add(sup);
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.29;
    const inf = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.2, 8, 14), P.mangas === "longas" ? matTop : pele));
    inf.position.y = -0.14;
    cotovelo.add(inf);
    const mao = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), pele));
    mao.scale.set(0.85, 1.2, 0.7);
    mao.position.y = -0.31;
    cotovelo.add(mao);
    cotovelo.rotation.x = -0.18;
    ombro.add(cotovelo);
    corpo.add(ombro);
    bracos.push({ ombro, cotovelo, mao });
  }
  if (P.mala) {
    const mala = sombra(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.06), plastico(P.mala, { roughness: 0.45, clearcoat: 0.3 })));
    mala.position.set(0, -0.09, 0.02);
    mala.rotation.z = 0.15;
    bracos[0].mao.add(mala);
  }
  if (P.colar) {
    const colar = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.0035, 6, 32), ouro());
    colar.rotation.x = Math.PI / 2.4;
    colar.position.set(0, 1.37, 0.035);
    corpo.add(colar);
    const pend = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), ouro());
    pend.position.set(0, 1.315, 0.095);
    corpo.add(pend);
  }

  const esc = P.altura / 161;
  raiz.scale.setScalar(esc);

  // ----- animação -----
  let fase = Math.random() * 6;
  let amp = 0;
  let acenar = 0;
  return {
    grupo: raiz,
    params: P,
    altura: 1.86 * esc,
    cabeca: 1.62 * esc,
    acenar(on) { acenar = on ? 1 : 0; },
    atualizar(dt, velocidade = 0, tempo = 0) {
      const alvo = Math.min(1, velocidade / 3.2);
      amp += (alvo - amp) * Math.min(1, dt * 10);
      fase += dt * (4 + velocidade * 2.6);
      const s = Math.sin(fase) * 0.75 * amp;
      pernas[0].rotation.x = s;
      pernas[1].rotation.x = -s;
      bracos[0].ombro.rotation.x = -s * 0.8;
      bracos[1].ombro.rotation.x = s * 0.8;
      corpo.position.y = Math.abs(Math.cos(fase)) * 0.025 * amp;
      corpo.rotation.y = Math.sin(fase) * 0.08 * amp;
      cabeca.rotation.y = Math.sin(tempo * 0.7 + P.altura) * 0.12 * (1 - amp);
      cabeca.rotation.z = Math.sin(tempo * 0.5 + P.altura) * 0.04 * (1 - amp);
      if (rabo) rabo.rotation.x = 0.25 + Math.sin(fase) * 0.18 * amp;
      if (acenar) {
        bracos[1].ombro.rotation.z = 2.5 + Math.sin(tempo * 9) * 0.22;
        bracos[1].ombro.rotation.x = 0;
      } else {
        bracos[1].ombro.rotation.z += (0.07 - bracos[1].ombro.rotation.z) * Math.min(1, dt * 8);
      }
    },
  };
}
