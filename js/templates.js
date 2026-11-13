/* She Is Studio 2 · templates
 * Cada coleção ("pack") é um conjunto de páginas já desenhadas, em 1080 × 1350.
 * Inspirados nos estilos de feed (texto grande e apertado, autocolantes, UI de câmara,
 * balões de mensagens), mas com layout, cores e textos próprios. */

const SANS = "Plus Jakarta Sans", SERIF = "Playfair Display", ISERIF = "Instrument Serif";
const YEL = "#F8F5B6", INK = "#161210", PINK = "#F4B6D2", CREAM = "#F4EEE3";

const txt = (o) => ({ t: "text", font: SANS, weight: 800, size: 60, color: "#fff", align: "center", lh: 1.05, track: 0, ...o });
const sticker = (kind, x, y, w, fill, o = {}) => ({ t: "sticker", kind, x, y, w, fill, ...o });
const emoji = (e, x, y, w, rot = 0) => ({ t: "sticker", kind: "emoji", emoji: e, x, y, w, rot });
const shape = (kind, x, y, w, h, fill, o = {}) => ({ t: "shape", kind, x, y, w, h, fill, ...o });
const chip = (text, cx, y, o = {}) => txt({ text, auto: true, cx: true, x: cx, y, size: 32, weight: 600, color: "#fff", lh: 1, pill: { bg: "rgba(255,255,255,.26)", px: 34, py: 20 }, ...o });
const mesh = (c1, c2, c3, seed, stripes = false) => ({ type: "mesh", c1, c2, c3, seed, stripes, tint: "#000", tintA: 0 });
const solid = (c1) => ({ type: "color", c1 });

/** Cabeçalho de 3 colunas em maiúsculas pequenas e espaçadas. */
const head = (a, b, c, color = "rgba(255,255,255,.8)", y = 84) => {
  const base = { size: 15, weight: 600, track: .34, upper: true, color, y, lh: 1.2 };
  return [
    txt({ ...base, text: a, auto: true, x: 64, align: "left" }),
    txt({ ...base, text: b, auto: true, cx: true, x: 540 }),
    txt({ ...base, text: c, w: 420, x: 596, align: "right" }),
  ];
};

/** Linha de comandos da câmara (obturador + 2 botões). */
const camBar = (y = 1180) => [
  shape("circle", 112, y + 18, 80, 80, "rgba(0,0,0,.38)"),
  txt({ text: "📷", auto: true, cx: true, x: 152, y: y + 40, size: 34, weight: 400, lh: 1 }),
  shape("circle", 484, y - 4, 112, 112, "#fff"),
  shape("circle", 888, y + 18, 80, 80, "rgba(0,0,0,.38)"),
  txt({ text: "↻", auto: true, cx: true, x: 928, y: y + 36, size: 44, weight: 600, lh: 1 }),
];

const bubble = (text, o) => txt({
  text, size: 42, weight: 500, align: "left", lh: 1.18, color: "#fff", track: -.005,
  pill: { bg: "#2F7CF6", px: 40, py: 28, r: 54, tail: "r" }, ...o,
});

export const CATEGORIES = ["Todos", "Feed viral", "Elementos", "Câmara", "Mensagens", "Notas", "Editorial", "Stories", "Pinterest"];

export const PACKS = [
  /* ───────── 1. Feed viral: texto amarelo grande sobre foto ───────── */
  {
    id: "amarelinho", n: "Amarelinho", c: "Feed viral", fmt: "post",
    pages: [
      { bg: mesh("#8a8a86", "#2b2b2b", "#5d5d5a", 5), layers: [
        ...head("template grátis", "o teu @", "posts virais"),
        sticker("star", 188, 320, 112, YEL, { rot: -8 }),
        sticker("star", 880, 372, 66, YEL, { rot: 6 }),
        txt({ text: "O amarelinho\nque eu uso é o\n#f8f5b6", x: 40, y: 470, w: 1000, size: 126, lh: .93, track: -.05, color: YEL }),
        sticker("star", 722, 1000, 118, YEL, { rot: 10 }),
        sticker("star", 148, 1000, 200, YEL, { rot: -14 }),
      ] },
      { bg: solid("#171513"), layers: [
        ...head("template grátis", "o teu @", "posts virais"),
        txt({ text: "A minha paleta", x: 60, y: 250, w: 960, size: 110, lh: .95, track: -.05, color: YEL }),
        ...[["#F8F5B6", "F8F5B6"], ["#F4B6D2", "F4B6D2"], ["#C94F6D", "C94F6D"], ["#EFE7DD", "EFE7DD"]].flatMap(([c, h], i) => {
          const x = 70 + (i % 2) * 480, y = 520 + Math.floor(i / 2) * 330;
          return [shape("circle", x, y, 230, 230, c), txt({ text: "#" + h.toLowerCase(), auto: true, x: x + 262, y: y + 94, size: 38, weight: 800, track: -.02, align: "left", lh: 1, color: "#fff" })];
        }),
        txt({ text: "guarda para consultares depois ✦", auto: true, cx: true, x: 540, y: 1230, size: 28, weight: 600, color: "rgba(255,255,255,.6)", lh: 1 }),
      ] },
      { bg: mesh("#c9a8a0", "#3a2a2a", "#e6c9c0", 12), layers: [
        ...head("template grátis", "o teu @", "posts virais"),
        txt({ text: "3 formas de\nusar a cor", x: 40, y: 250, w: 1000, size: 118, lh: .93, track: -.05, color: YEL }),
        chip("01  títulos grandes e apertados", 540, 640, { size: 36, pill: { bg: "rgba(0,0,0,.34)", px: 40, py: 26 } }),
        chip("02  só uma cor de destaque", 540, 790, { size: 36, pill: { bg: "rgba(0,0,0,.34)", px: 40, py: 26 } }),
        chip("03  autocolantes para dar vida", 540, 940, { size: 36, pill: { bg: "rgba(0,0,0,.34)", px: 40, py: 26 } }),
        sticker("spark", 810, 1090, 130, YEL), sticker("spark", 190, 1130, 70, YEL),
      ] },
      { bg: solid(YEL), layers: [
        ...head("template grátis", "o teu @", "posts virais", "rgba(22,18,16,.6)"),
        sticker("star", 120, 250, 150, INK, { rot: -12 }), sticker("star", 800, 910, 120, INK, { rot: 10 }),
        txt({ text: "Comenta\n“VIRAL”", x: 40, y: 420, w: 1000, size: 168, lh: .9, track: -.05, color: INK }),
        txt({ text: "e eu envio-te os templates no DM", x: 90, y: 860, w: 900, size: 40, weight: 600, color: INK, track: -.01 }),
        txt({ text: "guarda este post", auto: true, cx: true, x: 540, y: 1090, size: 32, weight: 800, color: YEL, lh: 1, pill: { bg: INK, px: 48, py: 26 } }),
      ] },
    ],
  },

  /* ───────── 2. Elementos: "Pesquise por:" ───────── */
  {
    id: "pesquise", n: "Pesquise por:", c: "Elementos", fmt: "post",
    pages: [
      { bg: mesh("#6b4a2b", "#1f2026", "#a07848", 21), layers: [
        ...head("template grátis", "", "feed irresistível"),
        txt({ text: "Pesquise por:", auto: true, cx: true, x: 540, y: 400, size: 92, lh: 1, track: -.05, color: "#F3EBC8" }),
        chip("sparkle star", 258, 540), chip("glitter star", 540, 540), chip("star icon", 812, 540),
        sticker("star", 230, 830, 170, "#F0A6C6", { glitter: true, rot: -6 }),
        sticker("star", 450, 780, 240, "#E8337F", { glitter: true, rot: 4 }),
        sticker("star", 790, 770, 130, YEL),
        sticker("star", 640, 930, 230, "#D8D8D8", { outline: true, sw: 12, rot: -3 }),
        ...[[290, 1000, 70], [400, 960, 60], [330, 1090, 76], [460, 1110, 74], [200, 1090, 66], [560, 1050, 40]].map(([x, y, w], i) => sticker("star", x, y, w, "#EDEDED", { rot: i * 14 })),
      ] },
      { bg: mesh("#d9cfc2", "#5d554b", "#ffffff", 8), layers: [
        ...head("template grátis", "", "feed irresistível"),
        txt({ text: "Pesquise por:", auto: true, cx: true, x: 540, y: 400, size: 92, lh: 1, track: -.05, color: "#fffbe0", shadow: true }),
        chip("folder graphic", 258, 540), chip("flat folder", 540, 540), chip("Documents", 812, 540),
        shape("folder", 250, 700, 250, 200, "#F7C6DC"),
        shape("folder", 570, 760, 160, 125, "#D9BE97"),
        shape("folder", 690, 670, 270, 210, "#E5399F"),
        shape("folder", 310, 930, 230, 175, "#73BFF2"),
        shape("folder", 640, 960, 230, 160, "#E9B2BE"),
      ] },
      { bg: mesh("#4a2736", "#160f14", "#a8506f", 33), layers: [
        ...head("template grátis", "", "feed irresistível"),
        txt({ text: "Pesquise por:", auto: true, cx: true, x: 540, y: 400, size: 92, lh: 1, track: -.05, color: YEL }),
        chip("heart sticker", 258, 540), chip("pink flower", 540, 540), chip("sparkle", 812, 540),
        sticker("heart", 200, 720, 230, "#F06FA6", { glitter: true, rot: -8 }),
        sticker("heart", 480, 800, 150, "#FFD1E3", { rot: 8 }),
        sticker("flower", 720, 700, 220, "#F8A9CB"),
        sticker("flower", 330, 1010, 140, "#FFF1A8"),
        sticker("spark", 610, 980, 190, YEL),
        sticker("spark", 850, 1010, 90, "#fff"),
      ] },
    ],
  },

  /* ───────── 3. Câmara: o "tchan" no teu carrossel ───────── */
  {
    id: "tchan", n: "Tchan na câmara", c: "Câmara", fmt: "post",
    pages: [
      { bg: mesh("#5a3d26", "#1a110b", "#a4814f", 41, true), layers: [
        ...head("template grátis", "o teu @", "feed irresistível"),
        txt({ text: "Elementos que\nvão dar um", x: 30, y: 180, w: 1020, size: 112, lh: .92, track: -.05, color: YEL }),
        emoji("🌸", 40, 180, 110, -12), emoji("🌸", 890, 240, 100, 14),
        shape("viewfinder", 470, 600, 300, 300, "rgba(255,255,255,.9)", { sw: 4 }),
        emoji("✨", 800, 560, 90), emoji("💖", 810, 720, 72, 8),
        txt({ text: "“Tchan”", auto: true, cx: true, x: 690, y: 800, size: 210, weight: 500, italic: true, font: SERIF, color: "#fff", lh: 1, track: -.03, rot: -3 }),
        emoji("🌟", 880, 1000, 92),
        bubble("no seu carrossel", { auto: true, x: 470, y: 1090, size: 44 }),
        ...camBar(1190),
      ] },
      { bg: mesh("#5a3d26", "#1a110b", "#a4814f", 42, true), layers: [
        ...head("template grátis", "o teu @", "feed irresistível"),
        txt({ text: "3 toques que\nmudam o post", x: 30, y: 200, w: 1020, size: 112, lh: .92, track: -.05, color: YEL }),
        bubble("1. uma cor de destaque", { auto: true, x: 80, y: 620 }),
        bubble("2. um autocolante a brilhar", { auto: true, x: 80, y: 790 }),
        bubble("3. uma frase em itálico", { auto: true, x: 80, y: 960 }),
        emoji("✨", 905, 330, 90), emoji("🌸", 70, 1160, 100, -10), emoji("💖", 900, 1150, 80),
      ] },
      { bg: mesh("#5a3d26", "#1a110b", "#a4814f", 43, true), layers: [
        ...head("template grátis", "o teu @", "feed irresistível"),
        txt({ text: "antes", auto: true, cx: true, x: 300, y: 215, size: 44, weight: 800, color: YEL, lh: 1, track: -.02 }),
        txt({ text: "depois", auto: true, cx: true, x: 780, y: 215, size: 44, weight: 800, color: YEL, lh: 1, track: -.02 }),
        { t: "image", x: 70, y: 290, w: 460, h: 700, r: 44, ph: "#6d5338" },
        { t: "image", x: 550, y: 290, w: 460, h: 700, r: 44, ph: "#8a6c4a" },
        txt({ text: "o “tchan” que faltava", auto: true, cx: true, x: 540, y: 1080, size: 78, weight: 500, italic: true, font: SERIF, color: "#fff", lh: 1 }),
        emoji("🌟", 880, 960, 100), emoji("✨", 70, 940, 80),
      ] },
      { bg: mesh("#5a3d26", "#1a110b", "#a4814f", 44, true), layers: [
        ...head("template grátis", "o teu @", "feed irresistível"),
        txt({ text: "Guarda para\nusares depois", x: 30, y: 330, w: 1020, size: 116, lh: .92, track: -.05, color: YEL }),
        txt({ text: "e comenta “TCHAN” para receberes o pack", x: 100, y: 760, w: 880, size: 42, weight: 600, color: "#fff" }),
        shape("viewfinder", 130, 960, 820, 150, "rgba(255,255,255,.85)", { sw: 4 }),
        ...camBar(1190),
      ] },
    ],
  },

  /* ───────── 4. Mensagens (iMessage) ───────── */
  {
    id: "mensagens", n: "Conversa", c: "Mensagens", fmt: "post",
    pages: [
      { bg: solid("#FFFFFF"), layers: [
        shape("circle", 480, 90, 120, 120, "#D8D8DC"),
        txt({ text: "S", auto: true, cx: true, x: 540, y: 125, size: 56, weight: 600, color: "#fff", lh: 1 }),
        txt({ text: "She Is", auto: true, cx: true, x: 540, y: 228, size: 28, weight: 600, color: "#3a3a3c", lh: 1 }),
        txt({ text: "tenho uma ideia de post mas não sei por onde começar 🥲", x: 80, y: 340, w: 640, size: 40, weight: 500, color: "#000", align: "left", lh: 1.2, pill: { bg: "#E9E9EB", px: 40, py: 28, r: 54, tail: "l" } }),
        txt({ text: "qual é o tema?", x: 650, y: 590, w: 350, size: 40, weight: 500, align: "left", lh: 1.2, pill: { bg: "#2F7CF6", px: 40, py: 28, r: 54, tail: "r" } }),
        txt({ text: "como organizar o meu feed sem gastar horas", x: 80, y: 760, w: 640, size: 40, weight: 500, color: "#000", align: "left", lh: 1.2, pill: { bg: "#E9E9EB", px: 40, py: 28, r: 54, tail: "l" } }),
        txt({ text: "escolhe um template, troca o texto e publica 🫶", x: 300, y: 1000, w: 700, size: 40, weight: 500, align: "left", lh: 1.2, pill: { bg: "#2F7CF6", px: 40, py: 28, r: 54, tail: "r" } }),
        txt({ text: "Entregue", auto: true, x: 910, y: 1210, size: 22, weight: 600, color: "#8E8E93", lh: 1 }),
      ] },
      { bg: solid("#FFFFFF"), layers: [
        shape("circle", 480, 90, 120, 120, "#D8D8DC"),
        txt({ text: "S", auto: true, cx: true, x: 540, y: 125, size: 56, weight: 600, color: "#fff", lh: 1 }),
        txt({ text: "She Is", auto: true, cx: true, x: 540, y: 228, size: 28, weight: 600, color: "#3a3a3c", lh: 1 }),
        txt({ text: "e se eu não tiver fotos boas?", x: 80, y: 340, w: 640, size: 40, weight: 500, color: "#000", align: "left", lh: 1.2, pill: { bg: "#E9E9EB", px: 40, py: 28, r: 54, tail: "l" } }),
        txt({ text: "não faz mal! usa um fundo de cor ou o desfocado ✨", x: 300, y: 540, w: 700, size: 40, weight: 500, align: "left", lh: 1.2, pill: { bg: "#2F7CF6", px: 40, py: 28, r: 54, tail: "r" } }),
        txt({ text: "e depois?", x: 80, y: 790, w: 270, size: 40, weight: 500, color: "#000", align: "left", lh: 1.2, pill: { bg: "#E9E9EB", px: 40, py: 28, r: 54, tail: "l" } }),
        txt({ text: "exportas em PNG e está pronto", x: 360, y: 940, w: 640, size: 40, weight: 500, align: "left", lh: 1.2, pill: { bg: "#2F7CF6", px: 40, py: 28, r: 54, tail: "r" } }),
        txt({ text: "guarda este post para mais tarde", auto: true, cx: true, x: 540, y: 1180, size: 30, weight: 800, color: "#fff", lh: 1, pill: { bg: INK, px: 44, py: 24 } }),
      ] },
      { bg: mesh("#f5b9d1", "#c2658f", "#fff1f6", 17), layers: [
        txt({ text: "escreve\nà tua amiga", x: 40, y: 250, w: 1000, size: 140, lh: .9, track: -.05, color: "#fff", shadow: true }),
        txt({ text: "“isto foi feito num\nminuto”", x: 140, y: 720, w: 800, size: 62, weight: 500, italic: true, font: SERIF, color: INK, lh: 1.1, pill: { bg: "rgba(255,255,255,.88)", px: 56, py: 44, r: 70, tail: "r" } }),
        sticker("spark", 800, 200, 120, "#fff"), sticker("heart", 120, 1040, 140, "#fff", { rot: -10 }),
      ] },
    ],
  },

  /* ───────── 5. Notas ───────── */
  {
    id: "notas", n: "Notas do telemóvel", c: "Notas", fmt: "post",
    pages: [
      { bg: solid("#FBF8EF"), layers: [
        txt({ text: "‹ Notas", auto: true, x: 70, y: 90, size: 40, weight: 600, color: "#D9A300", lh: 1, align: "left" }),
        txt({ text: "O que postar\nesta semana", x: 70, y: 220, w: 940, size: 108, lh: .98, track: -.04, color: INK, align: "left" }),
        txt({ text: "13 de novembro  ·  só para ti", auto: true, x: 72, y: 480, size: 28, weight: 600, color: "#9a948a", lh: 1, align: "left" }),
        ...["segunda · carrossel “3 erros”", "quarta · reel dos bastidores", "sexta · story com pergunta", "domingo · post de gratidão"].flatMap((t, i) => [
          shape("circle", 72, 600 + i * 150, 54, 54, "", { stroke: "#D9A300", sw: 5 }),
          txt({ text: t, auto: true, x: 160, y: 612 + i * 150, size: 42, weight: 600, color: INK, lh: 1, align: "left" }),
        ]),
        shape("line", 72, 560, 936, 0, "#E4DDCF", { sw: 3 }),
      ] },
      { bg: solid("#FBF8EF"), layers: [
        txt({ text: "‹ Notas", auto: true, x: 70, y: 90, size: 40, weight: 600, color: "#D9A300", lh: 1, align: "left" }),
        txt({ text: "Checklist antes de publicar", x: 70, y: 220, w: 940, size: 96, lh: .98, track: -.04, color: INK, align: "left" }),
        ...["gancho nos primeiros 3 segundos", "texto legível no telemóvel", "uma só ideia por slide", "chamada para ação no fim"].flatMap((t, i) => [
          shape("circle", 72, 580 + i * 150, 54, 54, "#D9A300"),
          txt({ text: "✓", auto: true, cx: true, x: 99, y: 592 + i * 150, size: 34, weight: 800, color: "#fff", lh: 1 }),
          txt({ text: t, auto: true, x: 160, y: 592 + i * 150, size: 42, weight: 600, color: INK, lh: 1, align: "left" }),
        ]),
      ] },
      { bg: solid("#FBF8EF"), layers: [
        txt({ text: "dica de ouro", auto: true, x: 72, y: 150, size: 30, weight: 800, track: .28, upper: true, color: "#D9A300", lh: 1, align: "left" }),
        txt({ text: "Menos texto.\nMais respiração.", x: 70, y: 260, w: 940, size: 132, lh: .96, track: -.045, color: INK, align: "left" }),
        txt({ text: "Se tens de ler duas vezes, o slide tem demasiado texto.", x: 72, y: 800, w: 820, size: 46, weight: 500, color: "#4a443b", lh: 1.25, align: "left" }),
        sticker("spark", 800, 960, 150, "#D9A300"),
      ] },
    ],
  },

  /* ───────── 6. Editorial ───────── */
  {
    id: "editorial", n: "Editorial creme", c: "Editorial", fmt: "post",
    pages: [
      { bg: solid(CREAM), layers: [
        ...head("edição nº 01", "she is studio", "novembro", "rgba(22,18,16,.55)"),
        { t: "image", x: 290, y: 190, w: 500, h: 700, shape: "arch", ph: "#E0D3C2" },
        txt({ text: "o teu feed,", auto: true, cx: true, x: 540, y: 930, size: 128, weight: 400, italic: true, font: ISERIF, color: INK, lh: 1, track: -.02 }),
        txt({ text: "com intenção", auto: true, cx: true, x: 540, y: 1060, size: 128, weight: 400, font: ISERIF, color: INK, lh: 1, track: -.02 }),
        txt({ text: "desliza →", auto: true, cx: true, x: 540, y: 1240, size: 24, weight: 600, track: .3, upper: true, color: "rgba(22,18,16,.6)", lh: 1 }),
      ] },
      { bg: solid("#E9DBCB"), layers: [
        ...head("edição nº 01", "she is studio", "novembro", "rgba(22,18,16,.55)"),
        txt({ text: "“", auto: true, cx: true, x: 540, y: 250, size: 300, weight: 400, font: ISERIF, color: "#B9456F", lh: 1 }),
        txt({ text: "Não precisas de\nmais ideias.\nPrecisas de um\nsistema.", x: 90, y: 480, w: 900, size: 110, weight: 400, italic: true, font: ISERIF, color: INK, lh: 1.02, track: -.02 }),
        shape("line", 440, 1120, 200, 0, INK, { sw: 3 }),
        txt({ text: "@o.teu.perfil", auto: true, cx: true, x: 540, y: 1170, size: 26, weight: 600, track: .24, upper: true, color: INK, lh: 1 }),
      ] },
      { bg: solid(CREAM), layers: [
        ...head("edição nº 01", "she is studio", "novembro", "rgba(22,18,16,.55)"),
        txt({ text: "três hábitos", auto: true, cx: true, x: 540, y: 220, size: 120, weight: 400, italic: true, font: ISERIF, color: INK, lh: 1 }),
        ...[["01", "planear o mês num dia"], ["02", "criar em lote"], ["03", "rever o que resultou"]].flatMap(([n, t], i) => [
          shape("line", 90, 480 + i * 220, 900, 0, "rgba(22,18,16,.25)", { sw: 2 }),
          txt({ text: n, auto: true, x: 90, y: 520 + i * 220, size: 40, weight: 600, font: ISERIF, italic: true, color: "#B9456F", lh: 1, align: "left" }),
          txt({ text: t, auto: true, x: 210, y: 510 + i * 220, size: 54, weight: 600, color: INK, lh: 1.1, align: "left", track: -.02 }),
        ]),
      ] },
    ],
  },

  /* ───────── 7. Stories (1080 × 1920) ───────── */
  {
    id: "story-perguntas", n: "Story: perguntas", c: "Stories", fmt: "story",
    pages: [
      { bg: mesh("#f5b9d1", "#b9456f", "#fff1f6", 61), layers: [
        txt({ text: "pergunta\ndo dia", x: 40, y: 330, w: 1000, size: 190, lh: .9, track: -.05, color: "#fff", shadow: true }),
        shape("rect", 110, 900, 860, 250, "#ffffff", { r: 70 }),
        txt({ text: "Qual é o teu maior desafio a criar conteúdo?", x: 170, y: 960, w: 740, size: 54, weight: 800, color: INK, lh: 1.12, track: -.02, align: "left" }),
        txt({ text: "responde aqui ↓", auto: true, cx: true, x: 540, y: 1240, size: 34, weight: 600, color: "#fff", lh: 1, pill: { bg: "rgba(0,0,0,.28)", px: 40, py: 22 } }),
        sticker("spark", 840, 240, 140, "#fff"), sticker("heart", 90, 1560, 150, "#fff", { rot: -10 }),
      ] },
      { bg: solid(INK), layers: [
        txt({ text: "vais\npublicar\nhoje?", x: 40, y: 360, w: 1000, size: 210, lh: .88, track: -.05, color: YEL }),
        shape("rect", 110, 1100, 410, 170, YEL, { r: 85 }), txt({ text: "SIM", auto: true, cx: true, x: 315, y: 1155, size: 58, weight: 800, color: INK, lh: 1, track: .06 }),
        shape("rect", 560, 1100, 410, 170, "", { r: 85, stroke: YEL, sw: 6 }), txt({ text: "AINDA NÃO", auto: true, cx: true, x: 765, y: 1155, size: 58, weight: 800, color: YEL, lh: 1, track: .06 }),
        sticker("star", 800, 220, 150, YEL, { rot: 12 }),
      ] },
      { bg: solid(YEL), layers: [
        txt({ text: "template\ngrátis", x: 40, y: 520, w: 1000, size: 200, lh: .88, track: -.05, color: INK }),
        txt({ text: "link na bio", auto: true, cx: true, x: 540, y: 1180, size: 46, weight: 800, color: YEL, lh: 1, pill: { bg: INK, px: 60, py: 34 } }),
        txt({ text: "↑", auto: true, cx: true, x: 540, y: 1330, size: 120, weight: 600, color: INK, lh: 1 }),
        sticker("spark", 130, 300, 150, INK), sticker("spark", 820, 1500, 110, INK),
      ] },
    ],
  },

  /* ───────── 8. Pinterest (1080 × 1620) ───────── */
  {
    id: "pin-editorial", n: "Pin editorial", c: "Pinterest", fmt: "pin",
    pages: [
      { bg: solid(CREAM), layers: [
        txt({ text: "ideias para o teu feed", auto: true, cx: true, x: 540, y: 110, size: 26, weight: 600, track: .3, upper: true, color: "rgba(22,18,16,.6)", lh: 1 }),
        { t: "image", x: 160, y: 190, w: 760, h: 840, shape: "arch", ph: "#E0D3C2" },
        txt({ text: "10 ideias de posts", auto: true, cx: true, x: 540, y: 1090, size: 130, weight: 400, italic: true, font: ISERIF, color: INK, lh: 1, track: -.02 }),
        txt({ text: "que ninguém está a fazer", auto: true, cx: true, x: 540, y: 1230, size: 70, weight: 400, font: ISERIF, color: INK, lh: 1 }),
        txt({ text: "guarda este pin", auto: true, cx: true, x: 540, y: 1430, size: 28, weight: 800, color: CREAM, lh: 1, pill: { bg: INK, px: 44, py: 26 } }),
      ] },
      { bg: mesh("#4a2736", "#160f14", "#a8506f", 71), layers: [
        txt({ text: "Pesquise por:", auto: true, cx: true, x: 540, y: 250, size: 110, lh: 1, track: -.05, color: YEL }),
        chip("aesthetic feed", 540, 420), chip("pink flower", 540, 540), chip("sparkle star", 540, 660),
        sticker("heart", 260, 840, 330, "#F06FA6", { glitter: true, rot: -8 }),
        sticker("star", 640, 900, 280, "#F8F5B6", { rot: 8 }),
        sticker("spark", 420, 1200, 220, "#fff"), sticker("flower", 740, 1260, 190, "#F8A9CB"),
      ] },
    ],
  },
];
