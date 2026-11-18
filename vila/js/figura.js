// Gerador de personagens em ilustração vetorial (SVG), 100% código.
// figura(P, { expr, fechados }) devolve o SVG de uma mulher, a partir dos parâmetros P.

let contador = 0;
const hx = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const cl = (c, t) => mix(c, "#ffffff", t);
const es = (c, t) => mix(c, "#000000", t);

export const PADRAO = {
  pele: "#e9bf9c", cabelo: "#2a1a12", estilo: "longo", olhos: "#4a2a1a", batom: "#c27078",
  altura: 165, corpo: 1, idade: 30,
  top: { tipo: "blusa", cor: "#ffffff", riscas: null }, mangas: "longas",
  baixo: { tipo: "saia", cor: "#2d3c5e", ganga: false },
  sapatos: { cor: "#d9a88a", salto: true },
  item: null, itemCor: "#7a4a2b", avental: null, oculos: false, brincos: true, colar: true,
};

export function figura(opcoes, { expr = "neutra", fechados = false } = {}) {
  const P = { ...PADRAO, ...opcoes };
  const id = "f" + (++contador) + "_";
  const u = (k) => `url(#${id}${k})`;
  const w = P.corpo;
  const h = P.altura / 165;
  const pele = P.pele, cab = P.cabelo;
  const topCor = P.top.cor, baixoCor = P.baixo.cor;

  const defs = `
  <defs>
    <linearGradient id="${id}pele" x1="0" x2="1"><stop offset="0" stop-color="${es(pele, 0.07)}"/><stop offset=".45" stop-color="${cl(pele, 0.14)}"/><stop offset="1" stop-color="${es(pele, 0.1)}"/></linearGradient>
    <linearGradient id="${id}peleV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cl(pele, 0.08)}"/><stop offset="1" stop-color="${es(pele, 0.08)}"/></linearGradient>
    <linearGradient id="${id}cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cl(cab, 0.22)}"/><stop offset=".5" stop-color="${cab}"/><stop offset="1" stop-color="${es(cab, 0.2)}"/></linearGradient>
    <linearGradient id="${id}cabE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${es(cab, 0.1)}"/><stop offset="1" stop-color="${es(cab, 0.32)}"/></linearGradient>
    <linearGradient id="${id}top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cl(topCor, 0.18)}"/><stop offset=".6" stop-color="${topCor}"/><stop offset="1" stop-color="${es(topCor, 0.12)}"/></linearGradient>
    <linearGradient id="${id}baixo" x1="0" x2="1"><stop offset="0" stop-color="${es(baixoCor, 0.22)}"/><stop offset=".45" stop-color="${cl(baixoCor, 0.06)}"/><stop offset="1" stop-color="${es(baixoCor, 0.3)}"/></linearGradient>
    <radialGradient id="${id}blush"><stop offset="0" stop-color="#ef8f8f" stop-opacity=".5"/><stop offset="1" stop-color="#ef8f8f" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}iris" cx="50%" cy="62%" r="55%"><stop offset="0" stop-color="${cl(P.olhos, 0.5)}"/><stop offset=".6" stop-color="${P.olhos}"/><stop offset="1" stop-color="${es(P.olhos, 0.55)}"/></radialGradient>
    <linearGradient id="${id}lab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${es(P.batom, 0.08)}"/><stop offset="1" stop-color="${cl(P.batom, 0.18)}"/></linearGradient>
    <clipPath id="${id}oE"><path d="M265 189 C271 180.5 287 180 294 187.5 C287 194 272 195.5 265 189 Z"/></clipPath>
    <clipPath id="${id}oD"><path d="M335 189 C329 180.5 313 180 306 187.5 C313 194 328 195.5 335 189 Z"/></clipPath>
    <clipPath id="${id}topo"><path d="${caminhoTop()}"/></clipPath>
  </defs>`;

  // ---------- cabelo ----------
  const longo = P.estilo === "longo" || P.estilo === "ondas";
  const cabTras = {
    longo: `<path d="M234 150 C222 92 378 92 366 150 C380 240 392 360 396 516 Q300 548 204 516 C208 360 220 240 234 150 Z" fill="${u("cabE")}"/>`,
    ondas: `<path d="M232 150 C220 90 380 90 368 150 C390 220 386 280 400 340 C414 400 392 440 404 490 C410 522 380 540 356 530 L244 530 C220 540 190 522 196 490 C208 440 186 400 200 340 C214 280 210 220 232 150 Z" fill="${u("cabE")}"/>`,
    rabo: `<path d="M340 122 C380 120 398 160 396 210 C394 260 404 300 392 340 C384 360 370 350 372 330 C376 290 370 250 366 210 C362 170 352 150 334 140 Z" fill="${u("cab")}"/>`,
  }[P.estilo] || "";
  const madeixa = {
    longo: "M252 148 C238 200 236 260 232 330 C230 400 232 450 230 500 C240 506 252 502 256 494 C258 430 258 360 262 300 C264 240 264 190 266 176 C264 162 258 152 252 148 Z",
    ondas: "M252 148 C232 190 236 230 228 270 C220 310 240 340 228 380 C216 420 238 450 226 492 C222 508 236 516 248 504 C262 476 252 444 262 410 C272 372 256 340 264 300 C270 260 262 210 266 180 C266 166 260 154 252 148 Z",
  }[P.estilo];
  const brilho = cl(cab, 0.45), sombraCab = es(cab, 0.25);
  let cabFrente = "";
  if (longo) {
    cabFrente = `
    <path d="M244 214 C230 150 255 106 300 106 C345 106 370 150 356 214 C352 176 336 140 300 126 C264 140 248 176 244 214 Z" fill="${u("cab")}"/>
    <path id="${id}m" d="${madeixa}" fill="${u("cab")}"/>
    <use href="#${id}m" transform="translate(600 0) scale(-1 1)"/>
    <g stroke="${brilho}" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round">
      <path d="M296 112 C274 118 258 140 252 170"/><path d="M304 112 C326 118 342 140 348 170"/>
      <path d="M248 200 C242 240 244 270 236 310 C232 350 240 380 236 420"/><path d="M352 200 C358 240 356 270 364 310 C368 350 360 380 364 420"/>
    </g>
    <g stroke="${sombraCab}" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round">
      <path d="M258 222 C256 262 250 300 252 330 C254 360 246 390 248 430"/><path d="M342 222 C344 262 350 300 348 330 C346 360 354 390 352 430"/>
    </g>`;
  } else if (P.estilo === "curto") {
    cabFrente = `
    <path d="M236 160 C226 96 374 96 364 160 C372 200 378 236 372 262 C352 270 334 262 326 250 C344 214 340 160 300 128 C260 160 256 214 274 250 C266 262 248 270 228 262 C222 236 228 200 236 160 Z" fill="${u("cab")}"/>
    <g stroke="${brilho}" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round">
      <path d="M296 112 C268 120 250 150 244 200"/><path d="M304 112 C332 120 350 150 356 200"/>
    </g>
    <g stroke="${sombraCab}" stroke-width="1.3" fill="none" opacity=".5"><path d="M250 180 C244 210 244 240 252 262"/><path d="M350 180 C356 210 356 240 348 262"/></g>`;
  } else {
    // carrapito ou rabo: cabelo apanhado
    const carrapito = P.estilo === "carrapito"
      ? `<circle cx="300" cy="98" r="30" fill="${u("cab")}"/><path d="M280 92 C290 78 312 80 318 96 M284 106 C296 114 312 110 318 102" stroke="${sombraCab}" stroke-width="1.6" fill="none" opacity=".6"/>`
      : `<ellipse cx="336" cy="128" rx="9" ry="7" fill="#2b2b2b"/>`;
    cabFrente = `${carrapito}
    <path d="M246 196 C236 140 260 108 300 108 C340 108 364 140 354 196 C348 162 330 138 300 128 C270 138 252 162 246 196 Z" fill="${u("cab")}"/>
    <g stroke="${brilho}" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"><path d="M296 114 C272 120 258 140 252 168"/><path d="M304 114 C328 120 342 140 348 168"/></g>`;
  }

  // ---------- pernas, sapatos e parte de baixo ----------
  const pernas = `
    <path d="M258 768 C258 820 262 862 270 902 C274 932 277 962 281 1000 L292 1000 C292 960 294 920 296 880 C298 840 298 800 299 768 Z" fill="${u("pele")}"/>
    <path d="M342 768 C342 820 338 862 330 902 C326 932 323 962 319 1000 L308 1000 C308 960 306 920 304 880 C302 840 302 800 301 768 Z" fill="${u("pele")}"/>`;
  const sc = P.sapatos.cor;
  const sapatos = P.sapatos.salto
    ? `<path d="M280 992 C272 1004 264 1016 266 1025 L292 1023 L294 998 Z" fill="${sc}"/><path d="M291 1004 L294 1034" stroke="${es(sc, 0.18)}" stroke-width="3.5" stroke-linecap="round"/>
       <path d="M320 992 C328 1004 336 1016 334 1025 L308 1023 L306 998 Z" fill="${sc}"/><path d="M309 1004 L306 1034" stroke="${es(sc, 0.18)}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<path d="M278 996 C268 1004 260 1020 264 1030 L296 1030 L296 998 Z" fill="${sc}"/><path d="M322 996 C332 1004 340 1020 336 1030 L304 1030 L304 998 Z" fill="${sc}"/>`;
  let baixo;
  if (P.baixo.tipo === "calca") {
    const costura = P.baixo.ganga ? cl(baixoCor, 0.45) : es(baixoCor, 0.25);
    baixo = `
    <path d="M256 484 L344 484 C356 520 364 560 362 600 L350 1000 L306 1000 L302 646 L298 646 L294 1000 L250 1000 L238 600 C236 560 244 520 256 484 Z" fill="${u("baixo")}"/>
    <g stroke="${costura}" stroke-width="1.6" fill="none" opacity=".75" ${P.baixo.ganga ? 'stroke-dasharray="4 3"' : ""}>
      <path d="M300 486 L300 646"/><path d="M262 500 C272 520 284 524 292 522"/><path d="M338 500 C328 520 316 524 308 522"/>
      <path d="M270 650 L276 1000"/><path d="M330 650 L324 1000"/>
    </g>`;
  } else {
    baixo = `
    <path d="M256 484 L344 484 C358 520 368 560 366 600 C364 660 356 720 350 772 L250 772 C244 720 236 660 234 600 C232 560 242 520 256 484 Z" fill="${u("baixo")}"/>
    <path d="M300 700 L300 772" stroke="${es(baixoCor, 0.45)}" stroke-width="2" opacity=".6"/>
    <path d="M262 520 C270 600 268 690 262 770" stroke="${cl(baixoCor, 0.2)}" stroke-width="2" fill="none" opacity=".45"/>`;
  }

  // ---------- braços ----------
  const curtas = P.mangas === "curtas";
  const bracoPele = `<path d="M226 300 C208 306 202 330 200 360 C198 400 194 440 192 480 C191 500 192 510 193 518 L213 518 C213 500 215 470 217 440 C221 400 228 360 234 330 Z" fill="${u("pele")}"/>`;
  const manga = curtas
    ? `<path d="M226 300 C208 306 202 330 200 360 L198 392 L223 394 C225 370 229 346 234 330 Z" fill="${u("top")}"/>`
    : `<path d="M226 300 C208 306 202 330 200 360 C198 400 194 440 192 480 C191 500 192 510 193 518 L213 518 C213 500 215 470 217 440 C221 400 228 360 234 330 Z" fill="${u("top")}"/>
       <path d="M191 508 L214 508 L213 522 L192 522 Z" fill="${es(topCor, 0.08)}"/>`;
  const mao = `<path d="M194 521 C189 536 190 552 196 562 C200 569 208 567 209 558 C210 548 211 534 212 521 Z" fill="${u("peleV")}"/>
    <path d="M211 530 C216 536 216 544 212 548" stroke="${es(pele, 0.15)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const bracoEsq = `<g>${bracoPele}${manga}${mao}</g>`;

  let bracoDir, item = "";
  if (P.item) {
    const mangaDir = curtas
      ? `<path d="M374 300 C392 306 400 330 402 360 L402 392 L378 394 C380 372 380 360 378 350 Z" fill="${u("top")}"/>`
      : `<path d="M374 300 C392 306 400 330 402 360 C404 395 402 430 392 455 L368 476 L358 462 L378 442 C384 420 384 385 378 350 Z" fill="${u("top")}"/>`;
    bracoDir = `<path d="M374 300 C392 306 400 330 402 360 C404 395 402 430 392 455 L368 476 L358 462 L378 442 C384 420 384 385 378 350 Z" fill="${u("pele")}"/>${mangaDir}`;
    item = objeto(P.item, P.itemCor) + `
      <path d="M362 458 C352 456 344 462 346 471 C348 480 358 482 366 478 C373 474 373 463 366 459 Z" fill="${u("peleV")}"/>
      <path d="M347 466 C343 470 344 476 349 478" stroke="${es(pele, 0.15)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  } else {
    bracoDir = `<g transform="translate(600 0) scale(-1 1)">${bracoPele}${manga}${mao}</g>`;
  }

  // ---------- parte de cima ----------
  const tc = P.top.tipo;
  let decote, detalhes = "";
  if (tc === "blusa") {
    decote = `<path d="M286 280 L300 336 L314 280 Z" fill="${u("peleV")}"/>
      <path d="M286 280 L300 336 L272 300 Z M314 280 L300 336 L328 300 Z" fill="${cl(topCor, 0.25)}" stroke="${es(topCor, 0.12)}" stroke-width="1.5"/>`;
    detalhes = `<path d="M300 336 L300 482" stroke="${es(topCor, 0.12)}" stroke-width="1.5"/>
      ${[360, 400, 440].map((y) => `<circle cx="300" cy="${y}" r="2.6" fill="${es(topCor, 0.1)}"/>`).join("")}`;
  } else {
    decote = `<path d="M284 282 C290 300 310 300 316 282 Z" fill="${u("peleV")}"/>
      <path d="M282 282 C288 304 312 304 318 282" stroke="${es(topCor, 0.18)}" stroke-width="4" fill="none"/>`;
    if (tc === "camisola") detalhes = `<g stroke="${es(topCor, 0.12)}" stroke-width="1.5" opacity=".7">${[468, 474, 480].map((y) => `<path d="M254 ${y} L346 ${y}"/>`).join("")}</g>`;
  }
  const riscas = P.top.riscas
    ? `<g clip-path="url(#${id}topo)">${[316, 360, 404, 448].map((y) => `<rect x="190" y="${y}" width="220" height="22" fill="${P.top.riscas}"/>`).join("")}</g>` : "";
  const topo = `
    <path d="${caminhoTop()}" fill="${u("top")}"/>${riscas}
    <path d="M256 360 C266 372 282 376 296 372 M344 360 C334 372 318 376 304 372" stroke="${es(topCor, 0.1)}" stroke-width="2" fill="none" opacity=".8"/>
    ${decote}${detalhes}
    ${P.baixo.tipo === "saia" || !P.avental ? `<path d="M255 478 L345 478 L344 490 L256 490 Z" fill="${P.baixo.tipo === "calca" ? es(baixoCor, 0.35) : "#7a4a2b"}"/>
    <rect x="293" y="476" width="14" height="16" rx="2" fill="none" stroke="#e1b25d" stroke-width="2.5"/>` : ""}`;

  let avental = "";
  if (P.avental) {
    const a = P.avental;
    avental = P.avental.tipo === "cintura"
      ? `<path d="M258 486 L342 486 L350 640 C320 650 280 650 250 640 Z" fill="${a.cor}"/><path d="M256 486 L344 486" stroke="${es(a.cor, 0.25)}" stroke-width="5"/>
         <rect x="282" y="560" width="36" height="28" rx="3" fill="none" stroke="${es(a.cor, 0.25)}" stroke-width="2"/>`
      : `<path d="M268 318 L332 318 L340 486 L356 720 C320 732 280 732 244 720 L260 486 Z" fill="${a.cor}"/>
         <path d="M270 318 L286 286 M330 318 L314 286" stroke="${es(a.cor, 0.2)}" stroke-width="4"/>
         <path d="M262 486 L338 486" stroke="${es(a.cor, 0.2)}" stroke-width="3"/>
         <rect x="276" y="560" width="48" height="40" rx="4" fill="none" stroke="${es(a.cor, 0.2)}" stroke-width="2"/>`;
  }

  // ---------- rosto e expressões ----------
  const corSob = hx(cab).reduce((a, b) => a + b, 0) / 3 > 140 ? es(cab, 0.4) : es(cab, 0.05);
  const sobrancelhas = {
    neutra: ["M265 172 C272 165 284 163 294 168 C285 166 274 168 266 174 Z"],
    sorriso: ["M265 170 C272 162 284 160 294 166 C285 164 274 166 266 172 Z"],
    preocupada: ["M265 174 C272 169 284 164 294 162 C285 166 274 170 266 176 Z"],
    triste: ["M265 176 C272 172 284 166 294 160 C285 165 274 172 266 178 Z"],
  }[expr] || ["M265 172 C272 165 284 163 294 168 C285 166 274 168 266 174 Z"];
  const sob = `<path d="${sobrancelhas[0]}" fill="${corSob}"/><path d="${sobrancelhas[0]}" fill="${corSob}" transform="translate(600 0) scale(-1 1)"/>`;

  const olhoAberto = (lado) => {
    const cx = lado < 0 ? 280.5 : 319.5;
    const clip = lado < 0 ? "oE" : "oD";
    const forma = lado < 0 ? "M265 189 C271 180.5 287 180 294 187.5 C287 194 272 195.5 265 189 Z" : "M335 189 C329 180.5 313 180 306 187.5 C313 194 328 195.5 335 189 Z";
    const linha = lado < 0 ? "M294 187.5 C287 180 271 180.5 265 189 L259 184" : "M306 187.5 C313 180 329 180.5 335 189 L341 184";
    const pest = lado < 0 ? "M268 185 l-4 -4 M272 182.5 l-3 -5 M276.5 181.2 l-2 -5 M281 181 l-1 -5" : "M332 185 l4 -4 M328 182.5 l3 -5 M323.5 181.2 l2 -5 M319 181 l1 -5";
    const baixoL = lado < 0 ? "M268 192 C275 195 286 195 292 190" : "M332 192 C325 195 314 195 308 190";
    const palpebra = expr === "triste" ? `<rect x="${cx - 16}" y="176" width="32" height="8" fill="${pele}"/>` : "";
    return `<path d="${forma}" fill="#fbf7f2"/>
      <g clip-path="url(#${id}${clip})">
        <circle cx="${cx}" cy="187.5" r="6.6" fill="${u("iris")}"/><circle cx="${cx}" cy="187.5" r="2.8" fill="#10161d"/>
        <rect x="${cx - 18}" y="178" width="36" height="5" fill="#6b4434" opacity=".35"/>${palpebra}
      </g>
      <circle cx="${cx + 2.1}" cy="185.2" r="1.7" fill="#fff"/>
      <path d="${linha}" stroke="#24150f" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${pest}" stroke="#24150f" stroke-width="1.1" stroke-linecap="round"/>
      <path d="${baixoL}" stroke="#8a5a44" stroke-width=".8" fill="none" opacity=".6"/>`;
  };
  const olhoFechado = (lado) => lado < 0
    ? `<path d="M265 188 C271 193 287 194 294 188 L259 184" stroke="#24150f" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M270 192 l-2 4 M276 193.5 l-1 4.5 M282 193.5 l0 4.5" stroke="#24150f" stroke-width="1" stroke-linecap="round"/>`
    : `<path d="M335 188 C329 193 313 194 306 188 L341 184" stroke="#24150f" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M330 192 l2 4 M324 193.5 l1 4.5 M318 193.5 l0 4.5" stroke="#24150f" stroke-width="1" stroke-linecap="round"/>`;
  const olhos = fechados ? olhoFechado(-1) + olhoFechado(1) : olhoAberto(-1) + olhoAberto(1);
  const oculos = P.oculos
    ? `<g fill="none" stroke="#2a1d17" stroke-width="2.4"><rect x="262" y="176" width="35" height="24" rx="9"/><rect x="303" y="176" width="35" height="24" rx="9"/><path d="M297 186 L303 186 M262 184 L250 180 M338 184 L350 180"/></g>
       <rect x="264" y="178" width="31" height="8" rx="4" fill="#fff" opacity=".18"/><rect x="305" y="178" width="31" height="8" rx="4" fill="#fff" opacity=".18"/>` : "";

  const boca = {
    neutra: `<path d="M286 228 C290 223 295.5 221.5 300 224.5 C304.5 221.5 310 223 314 228 C306 230.5 294 230.5 286 228 Z" fill="${es(P.batom, 0.12)}"/>
      <path d="M286 228 C292 238 308 238 314 228 C306 231 294 231 286 228 Z" fill="${u("lab")}"/>
      <path d="M285 226 C293 231 307 231 315 226" stroke="${es(P.batom, 0.4)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <ellipse cx="303" cy="233" rx="4.5" ry="1.6" fill="#fff" opacity=".5"/>`,
    sorriso: `<path d="M283 224 C290 220 296 220 300 222 C304 220 310 220 317 224 C310 240 290 240 283 224 Z" fill="${u("lab")}"/>
      <path d="M287 226 C294 229 306 229 313 226 C307 232 293 232 287 226 Z" fill="#fffaf5"/>
      <path d="M283 224 C290 226 310 226 317 224" stroke="${es(P.batom, 0.4)}" stroke-width="1" fill="none"/>
      <path d="M280 222 C281 225 282 226 284 226 M320 222 C319 225 318 226 316 226" stroke="${es(pele, 0.25)}" stroke-width="1.2" fill="none"/>`,
    preocupada: `<path d="M288 229 C292 225 296 224 300 226 C304 224 308 225 312 229 C306 230.5 294 230.5 288 229 Z" fill="${es(P.batom, 0.12)}"/>
      <path d="M288 229 C293 235 307 235 312 229 C306 231 294 231 288 229 Z" fill="${u("lab")}"/>
      <path d="M288 230 C294 228.5 306 228.5 312 230" stroke="${es(P.batom, 0.4)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
    triste: `<path d="M288 230 C292 226 296 225 300 227 C304 225 308 226 312 230 C306 231 294 231 288 230 Z" fill="${es(P.batom, 0.12)}"/>
      <path d="M288 230 C293 236 307 236 312 230 C306 232 294 232 288 230 Z" fill="${u("lab")}"/>
      <path d="M287 233 C293 228.5 307 228.5 313 233" stroke="${es(P.batom, 0.4)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
  }[expr] || "";
  const rugas = P.idade >= 44
    ? `<g stroke="${es(pele, 0.22)}" stroke-width="1.1" fill="none" opacity=".45" stroke-linecap="round">
         <path d="M284 212 C279 219 280 227 283 233"/><path d="M316 212 C321 219 320 227 317 233"/>
         <path d="M270 199 C275 201 281 201 286 199"/><path d="M330 199 C325 201 319 201 314 199"/></g>` : "";

  const rosto = `
    <path d="M285 236 L285 288 C292 296 308 296 315 288 L315 236 Z" fill="${u("peleV")}"/>
    <path d="M285 246 C292 262 308 262 315 246 L315 236 L285 236 Z" fill="${es(pele, 0.12)}" opacity=".55"/>
    ${P.colar ? `<path d="M287 290 C292 312 308 312 313 290" stroke="#e1b25d" stroke-width="1.6" fill="none"/><circle cx="300" cy="309" r="3" fill="#f0c873"/>` : ""}
    <path d="M248 172 C248 122 352 122 352 172 C352 214 331 246 300 252 C269 246 248 214 248 172 Z" fill="${u("pele")}"/>
    <ellipse cx="268" cy="210" rx="17" ry="11" fill="${u("blush")}"/><ellipse cx="332" cy="210" rx="17" ry="11" fill="${u("blush")}"/>
    <g transform="translate(300 184) scale(1.16) translate(-300 -184)">
      <ellipse cx="278" cy="181" rx="17" ry="8" fill="${es(pele, 0.2)}" opacity=".35"/>
      <ellipse cx="322" cy="181" rx="17" ry="8" fill="${es(pele, 0.2)}" opacity=".35"/>
      ${olhos}${sob}
    </g>
    ${oculos}
    <path d="M297 196 C295 205 294 210 296 213 C298 215 302 215 305 213" stroke="${es(pele, 0.22)}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="301" cy="205" rx="2" ry="6" fill="#fff" opacity=".22"/>
    ${rugas}${boca}
    ${P.brincos ? `<circle cx="248" cy="200" r="3.2" fill="none" stroke="#e1b25d" stroke-width="1.8"/><circle cx="352" cy="200" r="3.2" fill="none" stroke="#e1b25d" stroke-width="1.8"/>` : ""}`;

  const corpo = (s) => `<g transform="translate(300 0) scale(${w} 1) translate(-300 0)">${s}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1100" class="figura">${defs}
  <g transform="translate(300 1030) scale(${h}) translate(-300 -1030)">
    <ellipse cx="300" cy="1030" rx="${95 * w}" ry="13" fill="#000" opacity=".12"/>
    ${longo ? corpo(cabTras) : cabTras}
    ${corpo(pernas + sapatos + baixo + bracoEsq + topo + avental + bracoDir + item)}
    <g class="cabeca">${rosto}${cabFrente}</g>
  </g>
</svg>`;
}

function caminhoTop() {
  return "M287 282 C266 288 238 290 224 302 C213 314 215 340 221 366 C229 400 245 436 252 466 L256 486 L344 486 L348 466 C355 436 371 400 379 366 C385 340 387 314 376 302 C362 290 334 288 313 282 Z";
}

function objeto(tipo, cor) {
  if (tipo === "pasta" || tipo === "clutch") {
    const [wd, ht] = tipo === "pasta" ? [82, 104] : [92, 56];
    return `<g transform="rotate(-12 350 470) translate(-6 ${tipo === "pasta" ? 6 : 34}) scale(.92)">
      <rect x="318" y="420" width="${wd}" height="${ht}" rx="6" fill="${cor}"/>
      <rect x="318" y="420" width="${wd}" height="${ht}" rx="6" fill="none" stroke="${es(cor, 0.3)}" stroke-width="2"/>
      ${tipo === "clutch" ? `<path d="M318 432 L${318 + wd} 432" stroke="${es(cor, 0.25)}" stroke-width="2"/><rect x="${318 + wd / 2 - 6}" y="428" width="12" height="8" rx="2" fill="#e1b25d"/>` : `<path d="M326 430 L392 430" stroke="${cl(cor, 0.3)}" stroke-width="1.5"/>`}
    </g>`;
  }
  if (tipo === "cartas") {
    return `<g transform="rotate(-10 350 470)">
      ${[0, 1, 2].map((i) => `<rect x="${316 + i * 3}" y="${430 - i * 8}" width="86" height="54" rx="3" fill="#fbf8f2" stroke="#d8cfc2" stroke-width="1.5"/>
      <path d="M${316 + i * 3} ${430 - i * 8} L${359 + i * 3} ${458 - i * 8} L${402 + i * 3} ${430 - i * 8}" stroke="#d8cfc2" stroke-width="1.5" fill="none"/>`).join("")}
      <rect x="322" y="414" width="80" height="6" fill="${cor}"/>
    </g>`;
  }
  if (tipo === "livros") {
    return `<g transform="rotate(-8 350 470)">
      <rect x="318" y="438" width="88" height="22" rx="3" fill="${cor}"/><rect x="322" y="416" width="82" height="22" rx="3" fill="#7d9a8a"/>
      <rect x="316" y="394" width="86" height="22" rx="3" fill="#e2c37a"/>
      <path d="M326 405 L392 405 M332 427 L396 427 M328 449 L398 449" stroke="#fff" stroke-width="2" opacity=".6"/>
    </g>`;
  }
  if (tipo === "bloco") {
    return `<g transform="rotate(-14 350 470)">
      <rect x="326" y="418" width="58" height="76" rx="4" fill="#fffdf6" stroke="#d8cfc2" stroke-width="1.5"/>
      <rect x="326" y="418" width="58" height="10" rx="3" fill="${cor}"/>
      <path d="M334 444 L376 444 M334 456 L370 456 M334 468 L374 468" stroke="#c9bdb0" stroke-width="1.5"/>
    </g>`;
  }
  return "";
}
