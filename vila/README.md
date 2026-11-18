# Vila She Is (protótipo)

Jogo de histórias ilustradas: a Maria passeia pela vila e conhece cinco mulheres portuguesas, cada uma com a sua dor, e no fim de cada conversa mostra um produto do negócio.

Tudo é desenhado em código (SVG), sem imagens externas. Site estático: abre `vila/index.html` num servidor ou publica a pasta no Netlify.

| Ficheiro | O que faz |
|---|---|
| `js/figura.js` | Gerador de personagens: pele, cabelo e penteado, corpo, altura, idade, roupa, objeto, expressão e piscar de olhos. |
| `js/personagens.js` | A Maria, o prólogo e as cinco mulheres com as suas histórias (textos e expressões). |
| `js/cenarios.js` | Cenários (casa, banco, fábrica, correios, escola, café) e fachadas do mapa. |
| `js/produtos.js` | Produtos e links mostrados no fim de cada história. **Textos e links provisórios.** |
| `js/jogo.js` | Ecrãs, diálogos, mapa, diário e progresso guardado no browser. |

Para criar uma mulher nova, acrescenta um objeto a `MULHERES` em `personagens.js` com `fig` (aparência), `local`, `produto` e `cenas`.
