/* She Is Studio 2 · motor de desenho
 * Um design é JSON puro: { fmt, pages:[{ bg, layers:[…] }] }.
 * Tudo é desenhado num <canvas> 2D, em unidades de 1080 px de largura,
 * por isso o ecrã, a miniatura e a exportação usam exatamente o mesmo código. */

export const FORMATS = {
  post:   { w: 1080, h: 1350, n: "Post 4:5" },
  story:  { w: 1080, h: 1920, n: "Story / Reel 9:16" },
  square: { w: 1080, h: 1080, n: "Quadrado 1:1" },
};

export const FONTS = ["Plus Jakarta Sans", "Instrument Serif", "Playfair Display", "Inter", "Caveat"];

/* ---------- imagens ---------- */
const imgs = new Map();
let onLoad = null;
export const onImageLoad = (f) => { onLoad = f; };
export function getImg(src) {
  if (!src) return null;
  let e = imgs.get(src);
  if (!e) {
    e = { img: new Image(), ok: false };
    e.img.onload = () => { e.ok = true; onLoad && onLoad(); };
    e.img.src = src;
    imgs.set(src, e);
  }
  return e.ok ? e.img : null;
}
export function preloadDoc(doc) {
  const srcs = new Set();
  doc.pages.forEach((p) => {
    if (p.bg.src) srcs.add(p.bg.src);
    p.layers.forEach((l) => l.src && srcs.add(l.src));
  });
  return Promise.all([...srcs].map((s) => new Promise((res) => {
    const e = imgs.get(s);
    if (e && e.ok) return res();
    const i = new Image();
    i.onload = () => { imgs.set(s, { img: i, ok: true }); res(); };
    i.onerror = res;
    i.src = s;
  })));
}

/* ---------- texto ---------- */
const mc = document.createElement("canvas").getContext("2d");
const HAS_LS = "letterSpacing" in mc;

function setFont(c, l) {
  c.font = `${l.italic ? "italic " : ""}${l.weight || 400} ${l.size}px "${l.font}", system-ui, sans-serif`;
  if (HAS_LS) c.letterSpacing = (l.track || 0) * l.size + "px";
}
function strW(c, l, s) {
  const ls = (l.track || 0) * l.size;
  if (HAS_LS || !ls) return c.measureText(s).width - (HAS_LS && ls ? ls : 0);
  let w = 0;
  for (const ch of s) w += c.measureText(ch).width + ls;
  return w - ls;
}
function drawStr(c, l, s, x, y) {
  const ls = (l.track || 0) * l.size;
  if (HAS_LS || !ls) return c.fillText(s, x, y);
  for (const ch of s) { c.fillText(ch, x, y); x += c.measureText(ch).width + ls; }
}
function wrap(c, l, text, maxW) {
  const out = [];
  text.split("\n").forEach((para) => {
    if (!para) return out.push("");
    let line = "";
    para.split(" ").forEach((w) => {
      const t = line ? line + " " + w : w;
      if (line && strW(c, l, t) > maxW) { out.push(line); line = w; } else line = t;
    });
    out.push(line);
  });
  return out;
}

/** Calcula as linhas e a caixa de um texto. */
export function layoutText(l, c = mc) {
  c.save();
  setFont(c, l);
  const text = l.upper ? String(l.text || "").toUpperCase() : String(l.text || "");
  const p = l.pill || null, px = p ? p.px ?? 28 : 0, py = p ? p.py ?? 14 : 0;
  const lh = l.size * (l.lh || 1.1);
  let lines, bw;
  if (l.auto) {
    lines = text.split("\n");
    bw = Math.max(...lines.map((s) => strW(c, l, s))) + px * 2;
  } else {
    bw = l.w;
    lines = wrap(c, l, text, bw - px * 2);
  }
  const bh = lines.length * lh + py * 2;
  const bx = l.auto && l.cx ? l.x - bw / 2 : l.x;
  const widths = lines.map((s) => strW(c, l, s));
  c.restore();
  return { lines, widths, lh, px, py, box: { x: bx, y: l.y, w: bw, h: bh } };
}

export function getBox(l) {
  if (l.t === "text") return layoutText(l).box;
  return { x: l.x, y: l.y, w: l.w, h: l.h ?? l.w };
}

/* ---------- caminhos dos autocolantes (0..1) ---------- */
function pathOf(kind) {
  const p = new Path2D();
  if (kind === "spark") {
    p.moveTo(.5, 0); p.bezierCurveTo(.5, .32, .68, .5, 1, .5);
    p.bezierCurveTo(.68, .5, .5, .68, .5, 1); p.bezierCurveTo(.5, .68, .32, .5, 0, .5);
    p.bezierCurveTo(.32, .5, .5, .32, .5, 0);
  } else if (kind === "star") {
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? .22 : .5, a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = .5 + r * Math.cos(a) * 1, y = .53 + r * Math.sin(a);
      i ? p.lineTo(x, y) : p.moveTo(x, y);
    }
  } else if (kind === "heart") {
    p.moveTo(.5, .92); p.bezierCurveTo(-.15, .5, .12, .02, .5, .3);
    p.bezierCurveTo(.88, .02, 1.15, .5, .5, .92);
  } else if (kind === "flower") {
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      p.moveTo(.5 + Math.cos(a) * .27 + .245, .5 + Math.sin(a) * .27);
      p.arc(.5 + Math.cos(a) * .27, .5 + Math.sin(a) * .27, .245, 0, Math.PI * 2);
    }
  }
  return p;
}
const PATHS = {};
const rand = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function drawSticker(c, l) {
  const s = l.w;
  if (l.kind === "emoji") {
    c.font = `${s * .82}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(l.emoji || "✨", l.x + s / 2, l.y + s / 2 + s * .04);
    c.textAlign = "left";
    return;
  }
  const path = PATHS[l.kind] || (PATHS[l.kind] = pathOf(l.kind));
  c.save();
  c.translate(l.x, l.y); c.scale(s, s);
  c.fillStyle = l.fill || "#fff";
  c.strokeStyle = l.fill || "#fff";
  c.lineJoin = "round";
  if (l.outline) {
    c.lineWidth = (l.sw || 6) / s; c.strokeStyle = l.fill; c.stroke(path);
  } else {
    if (l.kind === "star" || l.kind === "spark") { c.lineWidth = .05; c.stroke(path); }
    c.fill(path);
  }
  if (l.glitter) {
    c.clip(path);
    const r = rand(7 + Math.round(l.x + l.y));
    for (let i = 0; i < 110; i++) {
      c.globalAlpha = .25 + r() * .5;
      c.fillStyle = r() > .5 ? "#fff" : "rgba(120,20,70,.9)";
      const d = .004 + r() * .012;
      c.fillRect(r(), r(), d, d);
    }
  }
  c.restore();
}

/* ---------- formas ---------- */
function rr(c, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

/** Cauda dos balões estilo iMessage. */
function tail(c, x, y, w, h, r, right) {
  c.beginPath();
  if (right) {
    c.moveTo(x + w - r * .9, y + h - 2);
    c.bezierCurveTo(x + w - 6, y + h + 2, x + w + 8, y + h + 2, x + w + 16, y + h + 14);
    c.bezierCurveTo(x + w + 2, y + h + 14, x + w - 22, y + h + 8, x + w - r * 1.6, y + h - 14);
  } else {
    c.moveTo(x + r * .9, y + h - 2);
    c.bezierCurveTo(x + 6, y + h + 2, x - 8, y + h + 2, x - 16, y + h + 14);
    c.bezierCurveTo(x - 2, y + h + 14, x + 22, y + h + 8, x + r * 1.6, y + h - 14);
  }
  c.fill();
}

function drawShape(c, l) {
  const { x, y, w } = l, h = l.h ?? l.w;
  c.fillStyle = l.fill || "#fff";
  c.strokeStyle = l.stroke || "#000";
  c.lineWidth = l.sw || 0;
  if (l.kind === "rect") {
    rr(c, x, y, w, h, l.r || 0); l.fill && c.fill(); l.sw && c.stroke();
  } else if (l.kind === "circle") {
    c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    l.fill && c.fill(); l.sw && c.stroke();
  } else if (l.kind === "bubble") {
    const r = Math.min(h / 2, l.r ?? 46);
    rr(c, x, y, w, h, r); c.fill();
    tail(c, x, y, w, h, r, l.tail !== "l");
  } else if (l.kind === "viewfinder") {
    const k = Math.min(w, h) * .2;
    c.strokeStyle = l.fill || "#fff"; c.lineWidth = l.sw || 4; c.lineCap = "round";
    c.beginPath();
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, sx, sy]) => {
      c.moveTo(px + k * sx, py); c.lineTo(px, py); c.lineTo(px, py + k * sy);
    });
    c.stroke();
    c.beginPath(); c.moveTo(x + w / 2 - 22, y + h / 2); c.lineTo(x + w / 2 + 22, y + h / 2);
    c.moveTo(x + w / 2, y + h / 2 - 22); c.lineTo(x + w / 2, y + h / 2 + 22); c.stroke();
  } else if (l.kind === "folder") {
    const tabW = w * .42, tabH = h * .16;
    c.beginPath(); rr(c, x, y, tabW, tabH * 2, tabH * .5); c.fill();
    rr(c, x, y + tabH, w, h - tabH, Math.min(w, h) * .09); c.fill();
    c.fillStyle = "rgba(255,255,255,.55)";
    rr(c, x, y + tabH, w, h * .08, h * .04); c.fill();
  } else if (l.kind === "line") {
    c.strokeStyle = l.fill || "#000"; c.lineWidth = l.sw || 3;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.stroke();
  }
}

/* ---------- fundo ---------- */
let grain = null;
function getGrain() {
  if (grain) return grain;
  grain = document.createElement("canvas"); grain.width = grain.height = 220;
  const g = grain.getContext("2d"), id = g.createImageData(220, 220), r = rand(99);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 26;
  }
  g.putImageData(id, 0, 0);
  return grain;
}

function cover(c, img, W, H, blur) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
  if (blur > 0) {
    // desfocado sem ctx.filter (o Safari não tem): reduz e volta a ampliar
    const f = 1 / (1 + blur * 3), t = document.createElement("canvas");
    t.width = Math.max(8, Math.round(W * f)); t.height = Math.max(8, Math.round(H * f));
    t.getContext("2d").drawImage(img, (t.width - dw * f) / 2, (t.height - dh * f) / 2, dw * f, dh * f);
    c.imageSmoothingQuality = "high";
    c.drawImage(t, 0, 0, W, H);
  } else c.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

function drawBg(c, bg, W, H) {
  if (bg.type === "color") { c.fillStyle = bg.c1; c.fillRect(0, 0, W, H); }
  else if (bg.type === "grad") {
    const g = c.createLinearGradient(0, 0, W * .35, H); g.addColorStop(0, bg.c1); g.addColorStop(1, bg.c2 || bg.c1);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  } else if (bg.type === "mesh") {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, bg.c1); g.addColorStop(1, bg.c2);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const r = rand(bg.seed || 3);
    for (let i = 0; i < 4; i++) {
      const x = r() * W, y = r() * H, rad = (.35 + r() * .4) * Math.max(W, H);
      const rg = c.createRadialGradient(x, y, 0, x, y, rad);
      rg.addColorStop(0, (i % 2 ? bg.c3 : bg.c1) + "aa"); rg.addColorStop(1, "#00000000");
      c.fillStyle = rg; c.fillRect(0, 0, W, H);
    }
    if (bg.stripes) {
      c.fillStyle = "rgba(0,0,0,.17)";
      for (let x = 0; x < W; x += 86) c.fillRect(x, 0, 46, H);
    }
  } else if (bg.type === "photo") {
    c.fillStyle = bg.c1 || "#222"; c.fillRect(0, 0, W, H);
    const im = getImg(bg.src); im && cover(c, im, W, H, bg.blur || 0);
  }
  if (bg.tintA) { c.fillStyle = bg.tint || "#000"; c.globalAlpha = bg.tintA; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
  if (bg.type === "mesh" || bg.type === "photo") {
    const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .8);
    v.addColorStop(0, "#00000000"); v.addColorStop(1, "#00000055");
    c.fillStyle = v; c.fillRect(0, 0, W, H);
    c.fillStyle = c.createPattern(getGrain(), "repeat"); c.fillRect(0, 0, W, H);
  }
}

/* ---------- camada ---------- */
function drawLayer(c, l, exporting) {
  const b = getBox(l);
  c.save();
  c.translate(b.x + b.w / 2, b.y + b.h / 2);
  if (l.rot) c.rotate((l.rot * Math.PI) / 180);
  c.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
  c.globalAlpha = l.op ?? 1;
  if (l.t === "text") {
    const L = layoutText(l, c);
    setFont(c, l);
    c.textBaseline = "middle"; c.textAlign = "left";
    if (l.pill) {
      c.fillStyle = l.pill.bg; const pr = l.pill.r ?? b.h / 2;
      rr(c, b.x, b.y, b.w, b.h, pr); c.fill();
      if (l.pill.tail) tail(c, b.x, b.y, b.w, b.h, Math.min(pr, 46), l.pill.tail === "r");
    }
    c.fillStyle = l.color;
    if (l.shadow) { c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 18; c.shadowOffsetY = 4; }
    L.lines.forEach((s, i) => {
      const lw = L.widths[i];
      const x = l.align === "left" ? b.x + L.px : l.align === "right" ? b.x + b.w - L.px - lw : b.x + b.w / 2 - lw / 2;
      const y = b.y + L.py + (i + .5) * L.lh;
      drawStr(c, l, s, x, y);
      if (l.underline) { c.fillRect(x, y + l.size * .42, lw, Math.max(2, l.size * .05)); }
    });
  } else if (l.t === "shape") drawShape(c, l);
  else if (l.t === "sticker") drawSticker(c, l);
  else if (l.t === "image") {
    const { x, y, w } = l, h = l.h ?? l.w, im = getImg(l.src);
    c.save();
    if (l.shape === "circle") { c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); }
    else if (l.shape === "arch") {
      c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + w / 2); c.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w, y + h); c.closePath();
    } else rr(c, x, y, w, h, l.r || 0);
    c.clip();
    if (im) {
      const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
      c.drawImage(im, x + (w - im.naturalWidth * s) / 2, y + (h - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s);
    } else {
      c.fillStyle = l.ph || "#E3DCD0"; c.fillRect(x, y, w, h);
      if (!exporting) {
        c.fillStyle = "rgba(0,0,0,.35)"; c.font = `600 ${Math.min(w, h) * .09}px "Plus Jakarta Sans",sans-serif`;
        c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("+ a tua foto", x + w / 2, y + h / 2);
      }
    }
    c.restore();
  }
  c.restore();
}

export function renderPage(c, page, W, H, exporting) {
  c.clearRect(0, 0, W, H);
  drawBg(c, page.bg, W, H);
  page.layers.forEach((l) => drawLayer(c, l, exporting));
}

/** Devolve o id da camada mais acima no ponto (x, y). */
export function hitTest(page, x, y) {
  for (let i = page.layers.length - 1; i >= 0; i--) {
    const l = page.layers[i], b = getBox(l);
    let px = x, py = y;
    if (l.rot) {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, a = (-l.rot * Math.PI) / 180;
      const dx = x - cx, dy = y - cy;
      px = cx + dx * Math.cos(a) - dy * Math.sin(a); py = cy + dx * Math.sin(a) + dy * Math.cos(a);
    }
    const m = 8;
    if (px >= b.x - m && px <= b.x + b.w + m && py >= b.y - m && py <= b.y + b.h + m) return l.id;
  }
  return null;
}
