# She Is Studio 2

Editor de posts, carrosséis e stories com templates prontos. Site estático, sem build e sem dependências: abre-se `index.html` num servidor (`python3 -m http.server`) ou publica-se a pasta tal como está (Netlify, Vercel, GitHub Pages…).

## Estrutura

| Ficheiro | O que faz |
|---|---|
| `js/render.js` | Motor de desenho em canvas (texto, formas, autocolantes, fundos, fotos). Usado no ecrã, nas miniaturas e na exportação. |
| `js/templates.js` | As coleções ("packs") de templates. Cada uma é JSON legível. |
| `js/app.js` | Interface: seleção, arrastar, redimensionar, rodar, inspetor, fundos, páginas, anular/refazer, exportar. |
| `js/store.js` | Projetos guardados em IndexedDB (aguenta fotos grandes e muitos projetos). |
| `js/zip.js`, `js/pdf.js` | Geram o ZIP de PNG e o PDF das páginas, sem bibliotecas. |
| `tests/smoke.mjs` | Teste num browser real: guardar, reabrir, duplicar, apagar, marca e exportação. `npm i && npm test`. |
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

## Área interna

- **Projetos:** cada design é guardado automaticamente (nome, miniatura, páginas). Podes abrir, duplicar, renomear e apagar. Abrir um template num design já editado cria um projeto novo em vez de apagar o trabalho.
- **Marca:** @, 5 cores, letra de títulos e de texto, logótipo. As cores aparecem como atalhos nos fundos e ao editar; "Aplicar" muda letras e @ do design inteiro.
- **Exportar:** PNG, JPG, ZIP de PNG e PDF com todas as páginas.

## Limitações conhecidas

- Os projetos e a marca ficam no browser (sem contas nem sincronização entre dispositivos). Ligar a contas é o próximo passo, e o formato do projeto (`{ fmt, pages }`) já está pronto para isso.
- Não há pagamentos nem IA de texto (existem no Studio atual em sheis.pt/studio).
- Os templates de foto usam fundos gerados; as fotos reais são as que a utilizadora carrega.
