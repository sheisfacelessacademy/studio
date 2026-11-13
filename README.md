# She Is Studio 2

Editor de posts, carrosséis e stories com templates prontos. Site estático, sem build e sem dependências: abre-se `index.html` num servidor (`python3 -m http.server`) ou publica-se a pasta tal como está (Netlify, Vercel, GitHub Pages…).

## Estrutura

| Ficheiro | O que faz |
|---|---|
| `js/render.js` | Motor de desenho em canvas (texto, formas, autocolantes, fundos, fotos). Usado no ecrã, nas miniaturas e na exportação. |
| `js/templates.js` | As coleções ("packs") de templates. Cada uma é JSON legível. |
| `js/app.js` | Interface: seleção, arrastar, redimensionar, rodar, inspetor, fundos, páginas, anular/refazer, exportar. |
| `js/zip.js` | Gera o ZIP das páginas. |
| `fonts/`, `css/fonts.css` | Fontes locais (OFL), sem pedidos a Google Fonts. |

## Como criar um template novo

Em `js/templates.js`, acrescenta um objeto a `PACKS` com páginas de 1080 × 1350. Os auxiliares `txt`, `chip`, `sticker`, `shape`, `emoji`, `head`, `camBar` e `bubble` já existem.

```js
{ id: "meu", n: "O meu template", c: "Feed viral", fmt: "post", pages: [
  { bg: mesh("#8a8a86", "#2b2b2b", "#5d5d5a", 5),
    layers: [ txt({ text: "Olá", x: 40, y: 500, w: 1000, size: 140, track: -.05, color: "#F8F5B6" }) ] },
] }
```

Para trocar o fundo por uma foto, usa o separador **Fundo → Carregar foto**.

## Limitações conhecidas

- Os projetos ficam guardados no browser (`localStorage`). Não há contas nem sincronização.
- Não há pagamentos, IA de texto nem kit de marca (existem no Studio atual em sheis.pt/studio).
- Os templates de foto usam fundos gerados; as fotos reais são as que a utilizadora carrega.
