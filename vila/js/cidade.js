// A vila: ruas de calçada, prédios de telhado vermelho, árvores, candeeiros e carros.
import * as THREE from "../vendor/three.module.js";

const liso = (cor, o = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.85, metalness: 0, ...o });

function texturaCalcada() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  x.fillStyle = "#cfc4b3";
  x.fillRect(0, 0, 256, 256);
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const o = (j % 2) * 16;
      x.fillStyle = (i + j) % 3 === 0 ? "#d9d0c0" : (i * j) % 5 === 0 ? "#bfb4a2" : "#cbc0ae";
      x.fillRect(i * 32 + o + 1.5, j * 32 + 1.5, 29, 29);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaLetreiro(texto, fundo, cor = "#fff") {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const x = c.getContext("2d");
  x.fillStyle = fundo;
  x.fillRect(0, 0, 512, 128);
  x.strokeStyle = "rgba(255,255,255,.55)";
  x.lineWidth = 6;
  x.strokeRect(8, 8, 496, 112);
  x.fillStyle = cor;
  x.font = "700 62px 'Helvetica Neue', Arial, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(texto, 256, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function telhado(w, d, h, cor) {
  // prisma triangular (duas águas) com beiral
  const f = new THREE.Shape();
  f.moveTo(-w / 2 - 0.3, 0);
  f.lineTo(w / 2 + 0.3, 0);
  f.lineTo(0, h);
  f.closePath();
  const g = new THREE.ExtrudeGeometry(f, { depth: d + 0.6, bevelEnabled: false });
  g.translate(0, 0, -(d + 0.6) / 2);
  const m = new THREE.Mesh(g, liso(cor, { roughness: 0.7 }));
  m.castShadow = true;
  return m;
}

export function predio({ x, z, w, d, h, cor, cobertura = "#b5533c", nome, letreiro, rodar = false, fabrica = false, janelas = true }) {
  const g = new THREE.Group();
  const paredes = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), liso(cor));
  paredes.position.y = h / 2;
  paredes.castShadow = paredes.receiveShadow = true;
  g.add(paredes);

  if (fabrica) {
    // telhados em dente de serra
    const n = Math.max(2, Math.round(w / 3.6));
    const tw = w / n;
    for (let i = 0; i < n; i++) {
      const t = telhado(tw, d, 1.5, cobertura);
      t.position.set(-w / 2 + tw * (i + 0.5), h, 0);
      g.add(t);
    }
    const chamine = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 7, 16), liso("#a8553f"));
    chamine.position.set(w / 2 - 1.2, h + 2.5, -d / 4);
    chamine.castShadow = true;
    g.add(chamine);
  } else {
    const t = telhado(w, d, Math.min(3, w * 0.32), cobertura);
    t.position.y = h;
    g.add(t);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.6), liso("#9c5a45"));
    ch.position.set(w * 0.28, h + 2, -d * 0.2);
    ch.castShadow = true;
    g.add(ch);
  }

  const janelaMat = new THREE.MeshStandardMaterial({ color: "#ffe3a3", emissive: "#ffb85c", emissiveIntensity: 0.55, roughness: 0.3 });
  const moldura = liso("#fdf6e7");
  const colunas = Math.max(2, Math.floor((w - 1.5) / 2.2));
  const pisos = Math.max(1, Math.round(h / 3.2));
  if (janelas) {
    for (let p = 0; p < pisos; p++) {
      for (let c = 0; c < colunas; c++) {
        const jx = -w / 2 + (w / (colunas + 1)) * (c + 1);
        const jy = 1.9 + p * 3;
        if (p === 0 && Math.abs(jx) < 1.4) continue; // espaço da porta
        const mold = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.55, 0.12), moldura);
        mold.position.set(jx, jy, d / 2 + 0.02);
        g.add(mold);
        const vid = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.3, 0.14), janelaMat);
        vid.position.set(jx, jy, d / 2 + 0.04);
        g.add(vid);
      }
    }
  }
  const porta = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.2), liso("#6b3f2e"));
  porta.position.set(0, 1.25, d / 2 + 0.05);
  g.add(porta);
  const degrau = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.9), liso("#d6cbb9"));
  degrau.position.set(0, 0.09, d / 2 + 0.45);
  degrau.receiveShadow = true;
  g.add(degrau);

  if (letreiro) {
    const lw = Math.min(5.2, w - 0.8);
    const l = new THREE.Mesh(
      new THREE.PlaneGeometry(lw, lw / 4),
      new THREE.MeshBasicMaterial({ map: texturaLetreiro(letreiro.texto, letreiro.fundo, letreiro.cor), toneMapped: false }));
    l.position.set(0, 3.45, d / 2 + 0.12);
    g.add(l);
  }

  g.position.set(x, 0, z);
  if (rodar) g.rotation.y = Math.PI;
  g.userData.nome = nome;
  // porta de entrada no mundo (para posicionar personagens)
  const frente = rodar ? -1 : 1;
  g.userData.entrada = new THREE.Vector3(x, 0, z + frente * (d / 2 + 1.8));
  g.userData.caixa = { x0: x - w / 2 - 0.2, x1: x + w / 2 + 0.2, z0: z - d / 2 - 0.2, z1: z + d / 2 + 0.2 };
  return g;
}

function arvore(x, z, cor, escala = 1) {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * escala, 0.2 * escala, 1.4 * escala, 8), liso("#6e4a32"));
  tronco.position.y = 0.7 * escala;
  tronco.castShadow = true;
  g.add(tronco);
  const copa = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05 * escala, 2), liso(cor, { roughness: 0.9 }));
  copa.position.y = 2.1 * escala;
  copa.scale.y = 1.08;
  copa.castShadow = true;
  g.add(copa);
  g.position.set(x, 0, z);
  g.userData.caixa = { x0: x - 0.35, x1: x + 0.35, z0: z - 0.35, z1: z + 0.35 };
  return g;
}

function candeeiro(x, z) {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 8), liso("#3b3a3a"));
  poste.position.y = 1.7;
  poste.castShadow = true;
  g.add(poste);
  const luz = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10),
    new THREE.MeshStandardMaterial({ color: "#fff1c8", emissive: "#ffc66b", emissiveIntensity: 1.2 }));
  luz.position.y = 3.5;
  g.add(luz);
  g.position.set(x, 0, z);
  return g;
}

function carro(x, z, cor, rot = 0) {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 3.1), liso(cor, { roughness: 0.4 }));
  corpo.position.y = 0.55;
  corpo.castShadow = true;
  g.add(corpo);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.6), liso(cor, { roughness: 0.4 }));
  cab.position.set(0, 1.1, -0.1);
  cab.castShadow = true;
  g.add(cab);
  const vid = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.38, 1.35), liso("#9fc3d6", { roughness: 0.2 }));
  vid.position.set(0, 1.12, -0.1);
  g.add(vid);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12), liso("#222"));
    r.rotation.z = Math.PI / 2;
    r.position.set(sx * 0.85, 0.3, sz * 1.0);
    g.add(r);
  }
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  const a = rot ? 1.6 : 0.95, b = rot ? 0.95 : 1.6;
  g.userData.caixa = { x0: x - a, x1: x + a, z0: z - b, z1: z + b };
  return g;
}

export function construirCidade(cena) {
  const colisoes = [];
  const registar = (obj) => { if (obj.userData.caixa) colisoes.push(obj.userData.caixa); cena.add(obj); return obj; };

  // chão (relva) e ruas
  const relva = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), liso("#a9c98a", { roughness: 1 }));
  relva.rotation.x = -Math.PI / 2;
  relva.receiveShadow = true;
  cena.add(relva);

  const calc = texturaCalcada();
  const rua = (w, d, x, z) => {
    const t = calc.clone();
    t.needsUpdate = true;
    t.repeat.set(w / 4, d / 4);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.02, z);
    m.receiveShadow = true;
    cena.add(m);
  };
  rua(64, 7, 0, 0);
  rua(7, 64, 0, 0);

  // prédios (fila norte virada a sul; fila sul virada a norte)
  const lista = {};
  const defs = [
    { id: "fabrica", x: -17, z: -10.5, w: 12, d: 9, h: 5.2, cor: "#d9b58a", cobertura: "#9a7a62", fabrica: true, nome: "Fábrica", letreiro: { texto: "FÁBRICA TÊXTIL", fundo: "#6b4a3a" } },
    { id: "banco", x: -7.4, z: -10, w: 6.4, d: 8, h: 6.4, cor: "#efe2c9", nome: "Banco", letreiro: { texto: "BANCO", fundo: "#2f5d62" } },
    { id: "correios", x: 8, z: -10, w: 7, d: 8, h: 5.4, cor: "#f2dfc2", nome: "Correios", letreiro: { texto: "CORREIOS", fundo: "#c8312f" } },
    { id: "escola", x: 19, z: -10.5, w: 11, d: 9, h: 6.2, cor: "#e6c9a1", nome: "Escola", letreiro: { texto: "ESCOLA", fundo: "#355a8a" } },
    { id: "cafe", x: -14, z: 10, w: 7, d: 7.5, h: 5.2, cor: "#f0d3c4", nome: "Café", letreiro: { texto: "CAFÉ DA VILA", fundo: "#a0522d" }, rodar: true },
    { id: "casa", x: -6.7, z: 10, w: 6, d: 7.5, h: 6.2, cor: "#f6e7c6", nome: "Casa da Maria", letreiro: { texto: "CASA DA MARIA", fundo: "#d9879b" }, rodar: true },
    { id: "loja", x: 7.5, z: 10, w: 6, d: 7.5, h: 5.4, cor: "#e8cfae", nome: "Loja", letreiro: { texto: "ATELIER", fundo: "#7a5c8a" }, rodar: true },
  ];
  for (const def of defs) lista[def.id] = registar(predio(def));

  // árvores ao longo das ruas (algumas floridas, como nas referências)
  const verdes = ["#5f9a4a", "#6fa94f", "#4f8a43"];
  const rosa = "#d6479a";
  const livre = (x, z) => !colisoes.some((c) => x > c.x0 - 1.2 && x < c.x1 + 1.2 && z > c.z0 - 1.2 && z < c.z1 + 1.2);
  const plantar = (x, z, cor, e = 1) => { if (livre(x, z)) registar(arvore(x, z, cor, e)); };
  let k = 0;
  for (let x = -26; x <= 26; x += 6) {
    if (Math.abs(x) < 4.5) continue;
    plantar(x, -4.6, k % 5 === 2 ? rosa : verdes[k % 3], 0.95);
    plantar(x + 3, 4.6, k % 4 === 1 ? rosa : verdes[(k + 1) % 3], 1);
    k++;
  }
  for (let z = -26; z <= 28; z += 6) {
    if (Math.abs(z) < 5) continue;
    plantar(-4.7, z, Math.abs(z) % 4 === 2 ? rosa : verdes[Math.abs(z) % 3], 1);
    plantar(4.7, z + 3, Math.abs(z) % 4 === 0 ? rosa : verdes[1], 1);
  }
  // parque pequeno com canteiro
  const canteiro = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.3, 24), liso("#d97b3a"));
  canteiro.position.set(14, 0.15, 12);
  canteiro.receiveShadow = true;
  canteiro.userData.caixa = { x0: 11.8, x1: 16.2, z0: 9.8, z1: 14.2 };
  registar(canteiro);
  const fonte = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.2, 14), liso("#e7dfd0"));
  fonte.position.set(14, 0.75, 12);
  fonte.castShadow = true;
  cena.add(fonte);

  // candeeiros
  for (const x of [-20, -12, 12, 20]) { cena.add(candeeiro(x, -3.7)); cena.add(candeeiro(x + 4, 3.7)); }

  // carros estacionados
  registar(carro(-21, 2.2, "#ffd23f", Math.PI / 2));
  registar(carro(-15.5, -2.3, "#d9382f", Math.PI / 2));
  registar(carro(15, 2.2, "#3a5ca8", Math.PI / 2));
  registar(carro(22, -2.3, "#f4f1ea", Math.PI / 2));

  return { colisoes, predios: lista };
}
