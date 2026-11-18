// Cenários ilustrados (SVG 1600 x 1000) e fachadas para o mapa da vila.

const chao = (c1, c2, tipo = "madeira") => tipo === "madeira"
  ? `<rect y="760" width="1600" height="240" fill="${c1}"/>
     ${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${770 + i * 28} L1600 ${770 + i * 28}" stroke="${c2}" stroke-width="2" opacity=".5"/>`).join("")}
     ${Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 137) % 1600} ${770 + (i % 8) * 28} l0 28" stroke="${c2}" stroke-width="2" opacity=".5"/>`).join("")}`
  : `<rect y="760" width="1600" height="240" fill="${c1}"/>
     ${Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 760 L${i * 100 - 200 + i * 25} 1000" stroke="${c2}" stroke-width="2" opacity=".55"/>`).join("")}
     ${[800, 850, 915, 990].map((y) => `<path d="M0 ${y} L1600 ${y}" stroke="${c2}" stroke-width="2" opacity=".55"/>`).join("")}`;

const rodape = (c) => `<rect y="740" width="1600" height="22" fill="${c}"/>`;
const letreiro = (x, y, w, txt, fundo, cor = "#fff") => `
  <g><rect x="${x}" y="${y}" width="${w}" height="${w * 0.2}" rx="10" fill="${fundo}"/>
  <rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${w * 0.2 - 16}" rx="6" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + w * 0.13}" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-weight="700" font-size="${w * 0.1}" fill="${cor}" letter-spacing="2">${txt}</text></g>`;
const planta = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-34 0 L34 0 L26 70 L-26 70 Z" fill="#c9845a"/><rect x="-38" y="-8" width="76" height="12" rx="4" fill="#b8744c"/>
  ${[[-50, -110, -20], [40, -130, 25], [-10, -160, 0], [-60, -60, -40], [55, -70, 40], [10, -100, 10]].map(([dx, dy, r]) =>
    `<ellipse cx="${dx * 0.6}" cy="${dy * 0.6}" rx="18" ry="46" transform="rotate(${r} ${dx * 0.6} ${dy * 0.6})" fill="${r % 20 ? "#5f8f52" : "#6fa35e"}"/>`).join("")}
  <path d="M0 0 C-4 -40 -8 -70 -10 -90 M0 0 C10 -40 20 -60 30 -70" stroke="#4a7340" stroke-width="3" fill="none"/></g>`;
const janela = (x, y, w, h, ceu = ["#ffe7c4", "#f7c99a"], id = "j") => `
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ceu[0]}"/><stop offset="1" stop-color="${ceu[1]}"/></linearGradient></defs>
  <rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="6" fill="#fdf7ec"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>
  <path d="M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}" stroke="#fdf7ec" stroke-width="10"/>`;
const luzQuente = (x, y, r = 500, op = 0.35) => `<defs><radialGradient id="lq${x}${y}"><stop offset="0" stop-color="#ffd9a0" stop-opacity="${op}"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#lq${x}${y})"/>`;
const parede = (c1, c2, id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1600" height="760" fill="url(#${id})"/>`;
const svg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">${s}</svg>`;

const CENAS = {
  casa: () => svg(`
    ${parede("#3d3247", "#5b4656", "pc")}
    ${janela(140, 150, 300, 380, ["#1d2340", "#3b3f66"], "jc")}
    <circle cx="370" cy="220" r="26" fill="#fff4d6"/><circle cx="382" cy="212" r="22" fill="#262b4c"/>
    ${[[180, 470], [220, 455], [260, 480], [310, 462], [350, 476], [400, 458]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="70" fill="#2a2e4f"/><rect x="${x + 4}" y="${y + 10}" width="4" height="5" fill="#ffd27a"/>`).join("")}
    ${luzQuente(1080, 430, 620, 0.55)}
    <rect x="760" y="250" width="640" height="16" rx="4" fill="#caa47c"/>
    ${[["#e8a3a8", 790, 70], ["#a7b9d8", 822, 86], ["#f2d38a", 854, 64], ["#b7d1b0", 884, 78], ["#d9b6e3", 916, 70]].map(([c, x, hh]) => `<rect x="${x}" y="${250 - hh}" width="28" height="${hh}" rx="3" fill="${c}"/>`).join("")}
    <rect x="1180" y="150" width="140" height="100" rx="4" fill="#fdf7ec"/><text x="1250" y="192" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#d9879b">tudo vai</text><text x="1250" y="222" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#7aa2c9">correr bem</text>
    ${rodape("#4a3a45")}${chao("#7a5a4a", "#5e4438")}
    <rect x="720" y="560" width="720" height="26" rx="6" fill="#d4ae86"/><rect x="740" y="586" width="22" height="200" fill="#b8936c"/><rect x="1398" y="586" width="22" height="200" fill="#b8936c"/>
    <rect x="930" y="370" width="300" height="190" rx="12" fill="#e8e2da"/><rect x="944" y="384" width="272" height="150" rx="6" fill="#fff8ee"/>
    <text x="1080" y="472" text-anchor="middle" font-family="Brush Script MT, cursive" font-size="58" fill="#d9879b">olá</text>
    <rect x="1060" y="560" width="40" height="0" fill="#ccc"/><path d="M1060 560 L1050 600 L1110 600 L1100 560 Z" fill="#cfc8bf" transform="translate(0 -40)"/>
    <rect x="980" y="568" width="200" height="12" rx="4" fill="#f4efe8"/>
    <path d="M820 560 L800 430 L760 420" stroke="#ead8c4" stroke-width="8" fill="none"/><path d="M730 400 C740 370 800 370 810 400 Z" fill="#f6e2c8"/>${luzQuente(770, 420, 160, 0.8)}
    ${planta(1500, 700, 1.3)}`),

  banco: () => svg(`
    ${parede("#efe2cc", "#e3d0b4", "pb")}
    ${letreiro(560, 90, 480, "BANCO", "#2f5d62")}
    ${janela(110, 200, 260, 330, undefined, "jb")}
    <circle cx="1320" cy="230" r="58" fill="#fdf7ec" stroke="#2f5d62" stroke-width="8"/><path d="M1320 230 L1320 196 M1320 230 L1346 240" stroke="#2f5d62" stroke-width="6" stroke-linecap="round"/>
    <rect x="1180" y="330" width="220" height="280" rx="6" fill="#fdf7ec"/><text x="1290" y="400" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="30" fill="#2f5d62">CRÉDITO</text><text x="1290" y="440" text-anchor="middle" font-family="Helvetica Neue, Arial" font-size="26" fill="#2f5d62">HABITAÇÃO</text><rect x="1220" y="480" width="140" height="90" rx="4" fill="#c8dcd8"/><path d="M1240 560 L1290 500 L1340 560 Z" fill="#2f5d62"/>
    ${rodape("#cdb79a")}${chao("#d9cbb6", "#bfae96", "pedra")}
    <rect x="420" y="560" width="760" height="200" rx="8" fill="#2f5d62"/><rect x="420" y="540" width="760" height="28" rx="6" fill="#d8c6a8"/>
    <rect x="460" y="380" width="680" height="160" fill="#cfe3e2" opacity=".45"/><path d="M793 380 L793 540" stroke="#e8f2f1" stroke-width="6"/>
    ${planta(260, 700, 1.2)}${planta(1480, 700, 1)}${luzQuente(800, 300, 700, 0.25)}`),

  fabrica: () => svg(`
    <defs><pattern id="tij" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#c6826a"/><path d="M0 0 L80 0 M0 20 L80 20 M40 0 L40 20 M0 20 L0 40 M80 20 L80 40" stroke="#b16f58" stroke-width="3"/></pattern></defs>
    <rect width="1600" height="760" fill="url(#tij)"/><rect width="1600" height="760" fill="#5a3a2a" opacity=".12"/>
    ${[160, 560, 960, 1360].map((x, i) => janela(x, 90, 200, 220, undefined, "jf" + i)).join("")}
    ${letreiro(600, 360, 400, "FÁBRICA TÊXTIL", "#6b4a3a")}
    ${rodape("#6e4a3a")}${chao("#9a8f86", "#827870", "pedra")}
    ${[150, 1150].map((x) => `<rect x="${x}" y="560" width="320" height="22" rx="4" fill="#d9c7ae"/><rect x="${x + 20}" y="582" width="16" height="180" fill="#8a7a6a"/><rect x="${x + 284}" y="582" width="16" height="180" fill="#8a7a6a"/>
      <path d="M${x + 90} 560 L${x + 90} 490 L${x + 210} 490 L${x + 230} 510 L${x + 230} 530 L${x + 200} 530 L${x + 200} 560" fill="#ece6dc" stroke="#7a6a5a" stroke-width="3"/><rect x="${x + 200}" y="530" width="6" height="30" fill="#7a6a5a"/>`).join("")}
    ${[["#d9879b", 560], ["#7aa2c9", 640], ["#e8c36a", 720], ["#9bb8a0", 800], ["#c47a8a", 880]].map(([c, x]) => `<rect x="${x}" y="640" width="70" height="120" rx="35" fill="${c}"/><ellipse cx="${x + 35}" cy="645" rx="35" ry="10" fill="#fff" opacity=".3"/>`).join("")}
    ${luzQuente(800, 200, 800, 0.3)}`),

  correios: () => svg(`
    ${parede("#f4e6cf", "#ead6b8", "pr")}
    <rect y="430" width="1600" height="30" fill="#c8312f"/>
    ${letreiro(580, 90, 440, "CORREIOS", "#c8312f")}
    <rect x="80" y="180" width="380" height="240" rx="6" fill="#d8bf98"/>${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${96 + c * 90}" y="${196 + r * 74}" width="78" height="62" rx="4" fill="${["#c99b6a", "#e3c08e", "#b98a5a"][(r + c) % 3]}"/><path d="M${96 + c * 90} ${210 + r * 74} L${174 + c * 90} ${210 + r * 74}" stroke="#8a6a44" stroke-width="2"/>`).join("")).join("")}
    ${janela(1160, 170, 300, 240, undefined, "jr")}
    ${rodape("#c8312f")}${chao("#d6c4a8", "#bba98e", "pedra")}
    <rect x="460" y="560" width="680" height="200" rx="8" fill="#e8d4b4"/><rect x="460" y="540" width="680" height="28" rx="6" fill="#c8312f"/>
    <rect x="1260" y="560" width="110" height="200" rx="50" fill="#c8312f"/><rect x="1280" y="610" width="70" height="10" rx="5" fill="#7a1a18"/><text x="1315" y="700" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="20" fill="#fff">CORREIO</text>
    ${planta(220, 700, 1)}${luzQuente(800, 260, 700, 0.25)}`),

  escola: () => svg(`
    ${parede("#f2e4c4", "#e6d2a8", "pe")}
    <rect x="420" y="150" width="760" height="380" rx="10" fill="#8a6a4a"/><rect x="440" y="170" width="720" height="340" rx="6" fill="#2f5446"/>
    <text x="800" y="260" text-anchor="middle" font-family="Chalkboard SE, Comic Sans MS, cursive" font-size="54" fill="#f3f1e6">Hoje: frações</text>
    <text x="640" y="370" font-family="Chalkboard SE, Comic Sans MS, cursive" font-size="64" fill="#f3f1e6">½ + ¼ = ¾</text>
    <rect x="460" y="500" width="120" height="14" rx="4" fill="#f3f1e6" opacity=".7"/>
    ${janela(80, 170, 240, 300, ["#cfe6f2", "#f7e2b8"], "je")}
    <circle cx="160" cy="370" r="70" fill="#7fae63"/><rect x="152" y="420" width="16" height="60" fill="#7a5a3a"/>
    <rect x="1250" y="180" width="260" height="170" rx="6" fill="#fdf7ec"/><path d="M1270 260 C1300 220 1340 230 1360 250 C1390 280 1420 230 1450 250 C1470 265 1480 290 1490 300" stroke="#7aa2c9" stroke-width="18" fill="none" opacity=".7"/><text x="1380" y="330" text-anchor="middle" font-family="Helvetica Neue, Arial" font-size="20" fill="#5a4a3a">MUNDO</text>
    ${rodape("#b89a6a")}${chao("#c9a477", "#a98760")}
    ${[300, 1100].map((x) => `<rect x="${x}" y="620" width="240" height="18" rx="4" fill="#d4ae7c"/><rect x="${x + 14}" y="638" width="12" height="122" fill="#7a6a5a"/><rect x="${x + 214}" y="638" width="12" height="122" fill="#7a6a5a"/>
      <rect x="${x + 40}" y="600" width="60" height="20" rx="2" fill="#e8a3a8"/><rect x="${x + 110}" y="606" width="80" height="14" rx="2" fill="#f2d38a"/>`).join("")}
    ${luzQuente(800, 300, 700, 0.25)}`),

  cafe: () => svg(`
    <defs><pattern id="azul" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#f7f4ee"/><circle cx="40" cy="40" r="22" fill="none" stroke="#3a6aa8" stroke-width="5"/><path d="M40 6 L40 74 M6 40 L74 40" stroke="#3a6aa8" stroke-width="3"/><circle cx="40" cy="40" r="7" fill="#3a6aa8"/><path d="M0 0 L10 0 L0 10 Z M80 0 L70 0 L80 10 Z M0 80 L10 80 L0 70 Z M80 80 L70 80 L80 70 Z" fill="#3a6aa8"/></pattern></defs>
    ${parede("#f3dcc4", "#ead0b2", "pf")}
    <rect y="460" width="1600" height="300" fill="url(#azul)"/>
    ${letreiro(560, 70, 480, "CAFÉ DA VILA", "#a0522d")}
    <rect x="1170" y="170" width="300" height="230" rx="8" fill="#2f2a26"/><text x="1320" y="220" text-anchor="middle" font-family="Chalkboard SE, Comic Sans MS, cursive" font-size="30" fill="#f3f1e6">Menu</text>
    ${[["Bica", "0,80€"], ["Galão", "1,40€"], ["Pastel de nata", "1,20€"], ["Torrada", "1,80€"]].map(([a, b], i) => `<text x="1196" y="${265 + i * 36}" font-family="Chalkboard SE, Comic Sans MS, cursive" font-size="22" fill="#f3f1e6">${a}</text><text x="1446" y="${265 + i * 36}" text-anchor="end" font-family="Chalkboard SE, Comic Sans MS, cursive" font-size="22" fill="#f2d38a">${b}</text>`).join("")}
    ${[260, 1110].map((x) => `<path d="M${x} 0 L${x} 120" stroke="#3a3a3a" stroke-width="3"/><path d="M${x - 50} 160 C${x - 50} 110 ${x + 50} 110 ${x + 50} 160 Z" fill="#c98a4a"/>${luzQuente(x, 170, 160, 0.7)}`).join("")}
    ${rodape("#8a5a3a")}${chao("#a87a52", "#8a6040")}
    <rect x="80" y="560" width="760" height="200" rx="8" fill="#8a5a3a"/><rect x="80" y="540" width="760" height="28" rx="6" fill="#e8d4b4"/>
    <rect x="140" y="420" width="200" height="120" rx="10" fill="#c9ccd0"/><rect x="160" y="440" width="160" height="40" rx="6" fill="#9aa0a6"/><rect x="190" y="500" width="30" height="30" fill="#5a5a5a"/><rect x="260" y="500" width="30" height="30" fill="#5a5a5a"/>
    <rect x="460" y="440" width="320" height="100" rx="10" fill="#e6f0f2" opacity=".75"/>
    ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${500 + i * 60}" cy="${510}" rx="24" ry="13" fill="#e9b04a"/><ellipse cx="${500 + i * 60}" cy="${506}" rx="16" ry="7" fill="#f6d27a"/><circle cx="${496 + i * 60}" cy="${504}" r="3" fill="#8a4a1a"/>`).join("")}
    ${planta(1500, 700, 1)}`),
};

export const cenario = (id) => (CENAS[id] || CENAS.casa)();

export function fachada({ cor, telhado = "#b5533c", texto, fundo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260">
    <path d="M10 100 L150 20 L290 100 Z" fill="${telhado}"/><path d="M10 100 L150 20 L290 100" stroke="${telhado}" stroke-width="14" stroke-linejoin="round" fill="none"/>
    <rect x="34" y="96" width="232" height="160" fill="${cor}"/>
    <rect x="70" y="112" width="160" height="34" rx="5" fill="${fundo}"/><text x="150" y="136" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="${texto.length > 10 ? 14 : 18}" fill="#fff" letter-spacing="1">${texto}</text>
    <rect x="56" y="160" width="46" height="46" rx="3" fill="#ffe3a3" stroke="#fdf7ec" stroke-width="5"/><rect x="198" y="160" width="46" height="46" rx="3" fill="#ffe3a3" stroke="#fdf7ec" stroke-width="5"/>
    <path d="M128 256 L128 186 C128 170 172 170 172 186 L172 256 Z" fill="#7a4a32"/><circle cx="162" cy="222" r="3" fill="#e1b25d"/>
  </svg>`;
}
