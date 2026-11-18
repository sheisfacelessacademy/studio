// Construtor de bonecas 3D por código (sem modelos externos).
// Cada boneca é definida por parâmetros: pele, cabelo, penteado, altura, corpo, roupa...
import * as THREE from "../vendor/three.module.js";

const liso = (cor, o = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.6, metalness: 0, ...o });
const brilho = (cor, o = {}) => new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.35, ...o });
const ouro = () => new THREE.MeshStandardMaterial({ color: "#e0b25a", roughness: 0.25, metalness: 0.85 });

export const PADRAO = {
  pele: "#d9a074",
  cabelo: "#2a1a12",
  estilo: "longo",        // longo | curto | carrapito | rabo | ondas
  altura: 161,            // em cm (161 = Maria)
  corpo: 1,               // 0.85 magra ... 1.35 mais cheia
  top: "#f3ead8",
  baixo: "#4a78b0",
  tipoBaixo: "calca",     // calca | saia
  sapato: "#5a3a2a",
  mangas: "longas",       // longas | curtas | nenhuma
  olhos: "#4a2a1a",
  batom: "#c9707a",
  oculos: false,
  mala: null,             // cor da mala/carteira ou null
  colar: true,
  brincos: true,
  avental: null,          // cor de avental/colete (trabalho)
};

export function criarBoneca(opcoes = {}) {
  const P = { ...PADRAO, ...opcoes };
  const w = P.corpo;
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  const pele = brilho(P.pele, { roughness: 0.32 });
  const cabelo = brilho(P.cabelo, { roughness: 0.3, clearcoat: 0.7 });
  const matTop = liso(P.top, { roughness: 0.85 });
  const matBaixo = liso(P.baixo, { roughness: 0.8 });
  const matSapato = liso(P.sapato, { roughness: 0.45 });
  const sombra = (m) => { m.castShadow = true; return m; };

  // ----- pernas -----
  const ANCA = 0.82;
  const pernas = [];
  for (const lado of [-1, 1]) {
    const piv = new THREE.Group();
    piv.position.set(lado * 0.075 * w, ANCA, 0);
    const calca = P.tipoBaixo === "calca";
    const perna = sombra(new THREE.Mesh(
      new THREE.CapsuleGeometry((calca ? 0.072 : 0.058) * w, 0.62, 6, 16),
      calca ? matBaixo : pele));
    perna.position.y = -0.41;
    piv.add(perna);
    const sapato = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), matSapato));
    sapato.scale.set(1.05, 0.62, 2.0);
    sapato.position.set(0, -0.79, 0.04);
    piv.add(sapato);
    corpo.add(piv);
    pernas.push(piv);
  }

  // ----- tronco (torno com cintura) -----
  const perfil = [
    [0.001, 0], [0.15 * w, 0], [0.175 * w, 0.08], [0.125 * w, 0.26],
    [0.15 * w, 0.42], [0.14 * w, 0.52], [0.075, 0.58], [0.001, 0.6],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const tronco = sombra(new THREE.Mesh(new THREE.LatheGeometry(perfil, 24), matTop));
  tronco.scale.z = 0.72;
  tronco.position.y = ANCA;
  corpo.add(tronco);

  if (P.tipoBaixo === "saia") {
    const saia = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.17 * w, 0.27 * w, 0.4, 24, 1, true), matBaixo));
    saia.material.side = THREE.DoubleSide;
    saia.scale.z = 0.85;
    saia.position.y = ANCA - 0.14;
    corpo.add(saia);
  } else {
    const cinto = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.16 * w, 0.17 * w, 0.09, 20), matBaixo));
    cinto.scale.z = 0.74;
    cinto.position.y = ANCA + 0.03;
    corpo.add(cinto);
  }
  if (P.avental) {
    const av = sombra(new THREE.Mesh(new THREE.BoxGeometry(0.26 * w, 0.42, 0.02), liso(P.avental)));
    av.position.set(0, ANCA + 0.22, 0.125 * w);
    corpo.add(av);
  }

  // ----- pescoço e cabeça -----
  const pescoco = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.12, 12), pele));
  pescoco.position.y = 1.42;
  corpo.add(pescoco);

  const cabeca = new THREE.Group();
  cabeca.position.y = 1.62;
  corpo.add(cabeca);
  const cranio = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24), pele));
  cranio.scale.set(0.9, 1.02, 0.94);
  cabeca.add(cranio);

  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), pele);
  nariz.scale.set(1, 0.9, 1.1);
  nariz.position.set(0, -0.025, 0.16);
  cabeca.add(nariz);

  const olhos = [];
  for (const lado of [-1, 1]) {
    const o = new THREE.Group();
    o.position.set(lado * 0.064, 0.0, 0.142);
    const branco = new THREE.Mesh(new THREE.SphereGeometry(0.038, 18, 12), liso("#fbfaf7", { roughness: 0.2 }));
    branco.scale.set(1, 1.1, 0.35);
    o.add(branco);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.027, 18, 12), liso(P.olhos, { roughness: 0.15 }));
    iris.scale.set(1, 1, 0.3);
    iris.position.z = 0.009;
    o.add(iris);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), liso("#0b0605"));
    pupila.scale.z = 0.3;
    pupila.position.z = 0.016;
    o.add(pupila);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    luz.position.set(0.01, 0.011, 0.022);
    o.add(luz);
    const pestana = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.012), liso("#150d0b"));
    pestana.position.set(lado * 0.006, 0.036, 0.014);
    pestana.rotation.z = lado * -0.12;
    o.add(pestana);
    const sobrancelha = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.011, 0.009), liso(P.cabelo));
    sobrancelha.position.set(lado * 0.004, 0.07, 0.004);
    sobrancelha.rotation.z = lado * -0.16;
    o.add(sobrancelha);
    cabeca.add(o);
    olhos.push(o);
  }
  const labios = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), brilho(P.batom, { roughness: 0.2 }));
  labios.scale.set(1, 0.38, 0.45);
  labios.position.set(0, -0.085, 0.148);
  cabeca.add(labios);
  for (const lado of [-1, 1]) {
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.036, 18),
      new THREE.MeshBasicMaterial({ color: "#f08a8a", transparent: true, opacity: 0.32, depthWrite: false }));
    blush.position.set(lado * 0.098, -0.04, 0.122);
    blush.rotation.y = lado * 0.6;
    cabeca.add(blush);
    if (P.brincos) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), ouro());
      b.position.set(lado * 0.155, -0.06, 0.01);
      cabeca.add(b);
    }
  }
  if (P.oculos) {
    const aro = liso("#1b1512", { roughness: 0.4 });
    for (const lado of [-1, 1]) {
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.005, 8, 24), aro);
      l.position.set(lado * 0.064, 0.0, 0.168);
      cabeca.add(l);
    }
    const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.006), aro);
    ponte.position.set(0, 0.008, 0.168);
    cabeca.add(ponte);
  }

  // ----- cabelo -----
  const topoCabelo = new THREE.Mesh(
    new THREE.SphereGeometry(0.188, 32, 20, 0, Math.PI * 2, 0, 1.78), cabelo);
  topoCabelo.scale.set(0.93, 1.0, 0.97);
  topoCabelo.rotation.x = -0.62;
  topoCabelo.position.y = 0.003;
  topoCabelo.castShadow = true;
  cabeca.add(topoCabelo);

  let rabo = null;
  const estilo = P.estilo;
  if (estilo === "longo" || estilo === "ondas") {
    const larg = estilo === "ondas" ? 1.25 : 1.05;
    const costas = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.6, 8, 20), cabelo));
    costas.scale.set(larg, 1, 0.66);
    costas.position.set(0, -0.32, -0.085);
    cabeca.add(costas);
    for (const lado of [-1, 1]) {
      const m = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.42, 6, 12), cabelo));
      m.position.set(lado * 0.158, -0.2, 0.0);
      m.rotation.z = lado * -0.04;
      cabeca.add(m);
    }
  } else if (estilo === "curto") {
    // meia esfera só atrás e aos lados, para não tapar a cara
    const costas = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 16, Math.PI, Math.PI, 0.45, 1.9), cabelo));
    costas.scale.set(1.0, 1.0, 0.95);
    costas.position.set(0, -0.06, -0.01);
    cabeca.add(costas);
    for (const lado of [-1, 1]) {
      const m = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.1, 4, 10), cabelo));
      m.position.set(lado * 0.14, -0.08, 0.0);
      cabeca.add(m);
    }
  } else if (estilo === "carrapito") {
    const bola = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), cabelo));
    bola.position.set(0, 0.19, -0.08);
    cabeca.add(bola);
  } else if (estilo === "rabo") {
    rabo = new THREE.Group();
    rabo.position.set(0, 0.1, -0.16);
    const r = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.3, 4, 12), cabelo));
    r.position.set(0, -0.17, -0.02);
    rabo.add(r);
    rabo.rotation.x = 0.25;
    cabeca.add(rabo);
  }

  // ----- braços -----
  const bracos = [];
  const manga = P.mangas;
  for (const lado of [-1, 1]) {
    const ombro = new THREE.Group();
    ombro.position.set(lado * (0.17 * w + 0.045), 1.35, 0);
    ombro.rotation.z = lado * 0.07;
    const matSup = manga === "nenhuma" ? pele : matTop;
    const sup = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.22, 6, 12), matSup));
    sup.position.y = -0.15;
    ombro.add(sup);
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.29;
    const matInf = manga === "longas" ? matTop : pele;
    const inf = sombra(new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.2, 6, 12), matInf));
    inf.position.y = -0.14;
    cotovelo.add(inf);
    const mao = sombra(new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 12), pele));
    mao.scale.set(0.85, 1.2, 0.7);
    mao.position.y = -0.31;
    cotovelo.add(mao);
    cotovelo.rotation.x = -0.18;
    ombro.add(cotovelo);
    corpo.add(ombro);
    bracos.push({ ombro, cotovelo, mao });
  }
  if (P.mala) {
    const mala = sombra(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.06), liso(P.mala, { roughness: 0.5 })));
    mala.position.set(0, -0.09, 0.02);
    mala.rotation.z = 0.15;
    bracos[0].mao.add(mala);
  }
  if (P.colar) {
    const colar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.004, 6, 24), ouro());
    colar.rotation.x = Math.PI / 2.4;
    colar.position.set(0, 1.36, 0.035);
    colar.scale.set(1, 1, 1);
    corpo.add(colar);
  }

  // altura real: 172 unidades = 161 cm
  const esc = P.altura / 161;
  raiz.scale.setScalar(esc);

  // ----- animação -----
  let fase = Math.random() * 6;
  let amp = 0;
  let acenar = 0;
  const api = {
    grupo: raiz,
    params: P,
    altura: 1.86 * esc,
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
      corpo.position.y = Math.abs(Math.cos(fase)) * 0.025 * amp + Math.sin(tempo * 2 + fase * 0.0) * 0.004;
      corpo.rotation.y = Math.sin(fase) * 0.08 * amp;
      cabeca.rotation.y = Math.sin(tempo * 0.7 + P.altura) * 0.12 * (1 - amp);
      if (rabo) rabo.rotation.x = 0.25 + Math.sin(fase * 1.0) * 0.18 * amp;
      if (acenar) {
        bracos[1].ombro.rotation.z = 2.5 + Math.sin(tempo * 9) * 0.22;
        bracos[1].ombro.rotation.x = 0;
      } else {
        bracos[1].ombro.rotation.z += (0.07 - bracos[1].ombro.rotation.z) * Math.min(1, dt * 8);
      }
    },
  };
  raiz.traverse((o) => { if (o.isMesh && o.castShadow === undefined) o.castShadow = true; });
  return api;
}
