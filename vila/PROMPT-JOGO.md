# Prompt-mestre: jogo "Vila She Is"

Jogo de histórias com estilo de boneca fashion fotorrealista, que vende os produtos e serviços da She Is Faceless Academy através de storytelling.

> **Como usar:** copia a Parte 1 inteira para a ferramenta que vai construir o jogo. As Partes 2 e 3 são os prompts de imagem: usa-os num gerador de imagens, sempre com a mesma imagem de referência por personagem para a cara não mudar.
>
> **Nota legal:** "Barbie" é marca registada da Mattel. O jogo, os textos e as imagens nunca usam esse nome nem o logótipo. O estilo descreve-se como "fashion doll" / "boneca fashion".

---

## PARTE 1 — Prompt do jogo (copiar inteiro)

```
Cria um jogo web mobile-first chamado "Vila She Is": um jogo de histórias interativas (estilo Episode/Chapters) misturado com simulação de vida leve (estilo The Sims), em português de Portugal, para mulheres portuguesas entre os 25 e os 55 anos. O objetivo do jogo é entreter, criar ligação emocional e, de forma natural, apresentar e vender os produtos e serviços da marca She Is Faceless Academy (@sheisfacelessacademy, sheis.pt).

== 1. CONCEITO ==
A jogadora é a Maria, 34 anos, mãe do Gui (11 anos), que trabalhava como freelancer até de madrugada e quase não via o filho crescer. Uma noite descobre que nos Estados Unidos milhares de mulheres criam negócios online sem mostrar a cara ("Faceless"). Decide aprender, aplicar e trazer o método para Portugal. No jogo, a Maria constrói a sua nova vida e ajuda outras mulheres da vila, cada uma com uma dor real, a encontrar o seu caminho.
Mensagem central: "Podes construir uma vida com mais tempo, liberdade e rendimento, sem mostrar a cara e ao teu ritmo."

== 2. ESTÉTICA (obrigatória em todos os ecrãs) ==
- Personagens: bonecas fashion fotorrealistas, como fotografias de bonecas de coleção em tamanho real. Pele lisa com brilho suave de plástico satinado, olhos grandes e amendoados com pestanas longas e eyeliner, sobrancelhas definidas, lábios com gloss nude-rosado, blush pêssego, cabelo sintético comprido, liso ou ondulado, com brilho e fios visíveis. Articulações discretas de boneca nos pulsos e nos cotovelos. Proporções esguias e elegantes.
- Fotografia: luz golden hour quente, profundidade de campo curta (fundo desfocado com bokeh de luzes), lente de retrato 85 mm, tons creme, bege, caramelo, castanho chocolate, rosa-velho, ganga e dourado.
- Mundo: a vila é uma maquete em miniatura com efeito tilt-shift (vista de cima, centro nítido e bordas desfocadas). Prédios portugueses de telhado vermelho, calçada portuguesa, elétrico amarelo, árvores de flor rosa e lilás, carros clássicos coloridos e pessoas em miniatura. Ao fundo, colinas e o rio.
- Casas e interiores: maquetes arquitetónicas premium (betão claro, madeira de carvalho, vidro, luz LED quente, oliveiras em miniatura) e interiores cozy (secretária de madeira, candeeiro, livros pastel, plantas, estante, quadro "tudo vai correr bem").
- UI: minimalista e "aesthetic". Fundo creme #F7F1E8, texto castanho #4A2F25, rosa-velho #D9879B, dourado #E0B25A. Títulos em serif elegante (Instrument Serif ou Playfair Display), texto em sans-serif limpa (Inter). Cantos muito arredondados, sombras suaves, cartões translúcidos com desfoque.
- Movimento: as imagens das personagens têm micro-animações (respirar, piscar, cabelo a mexer, efeito parallax ligeiro no fundo), transições suaves entre cenas e partículas de brilho dourado nas conquistas.

== 3. PERSONAGENS ==
Maria (protagonista, a jogadora): 34 anos, 1,61 m, magra, morena com pele bronzeada, cabelo castanho-escuro muito comprido e liso com risca ao meio, olhos castanhos. Estilo fashion casual: calças de ganga largas, top castanho cai-cai, malha creme, clutch de pele castanha, pulseiras e argolas douradas. Mentora, calma, confiante, empática. Nunca "professora": vive a vida e as outras aprendem com ela.
Gui: 11 anos, filho da Maria, boneco no mesmo estilo, cabelo castanho, sweatshirt e ténis. Coração emocional da história.
Mariana: 29 anos, bancária, recém-casada, sem filhos. Loira ondulada, alta, olhos azuis, blusa de seda branca, saia lápis azul-marinho. Dor: pressão para ter filhos, mas o ordenado e a prestação da casa não deixam. Quer escolher quando.
Fátima: 52 anos, operária numa fábrica têxtil, grisalha de cabelo curto, mais cheia, avental de trabalho. Dor: cortaram turnos, medo do desemprego, acha que é tarde para aprender tecnologia.
Rita: 38 anos, carteira nos Correios, ruiva com rabo de cavalo, sardas. Dor: sai às 5h e chega às 18h, vê as filhas crescer em fotografias, culpa de mãe.
Sónia: 44 anos, professora, alta, cabelo castanho curto, óculos, malha rosa-velho. Dor: burnout, salário parado, sente que o saber dela está fechado numa sala.
Inês: 23 anos, empregada de café, baixinha, cabelo em carrapito, avental. Dor: contratos de 3 meses, vive com os pais, quer independência mas não tem dinheiro para começar.
(Deve ser fácil acrescentar novas mulheres: idade, aspeto, trabalho, dor, história e produto associado.)

== 4. ESTRUTURA DO JOGO ==
Prólogo (5 minutos): casa da Maria às 23h40. Ela entrega mais um trabalho de freelance, espreita o quarto do Gui a dormir, vê a notícia do Faceless no telemóvel e decide mudar. Termina com a escolha "Começar a nova vida".
Mapa da vila (ecrã principal): maquete tilt-shift em que se toca nos sítios para entrar: Casa da Maria, Banco, Fábrica Têxtil, Correios, Escola, Café da Vila, Estúdio da Maria (desbloqueia mais tarde), Praia/Resort (recompensa final).
Capítulos: cada mulher tem um capítulo de 3 a 6 cenas, com diálogos ilustrados (personagem grande no ecrã, fundo fotográfico desfocado, caixa de texto), 2 a 3 escolhas por cena, expressões que mudam (preocupada, triste, esperançosa, feliz) e um final em que a Maria lhe mostra o caminho certo para ela.
Arco da Maria em paralelo: cada capítulo concluído faz a vida da Maria evoluir. Secretária nova, mais tempo com o Gui (cenas curtas mãe-filho), primeira venda, viagem, até ao final "A Mentora", em que a Maria ensina outras mulheres.

== 5. MECÂNICAS ==
- Escolhas com consequência: as respostas da Maria mudam a confiança de cada mulher (barra de coração) e desbloqueiam finais diferentes.
- Pontos Faceless ✨: ganham-se ao completar cenas, mini-desafios e missões diárias. Servem para desbloquear roupas, decoração e conteúdos bónus.
- Guarda-roupa: vestir a Maria com looks (ganga larga, malha creme, vestido de crochet branco, roupão de spa, riscas rosa e castanho, óculos de sol). Cada look aparece nas cenas seguintes.
- Decorar a casa e o estúdio: a secretária da Maria evolui de pequena e escura para cozy e luminosa.
- Missões diárias de 2 minutos ligadas à vida real, por exemplo: "Escreve 3 ideias de conteúdo para um perfil faceless", "Escolhe um nicho", "Faz um carrossel no She Is Studio". Ao completar, a jogadora ganha pontos e aprende algo útil de verdade.
- Diário da Maria: guarda cada história concluída, a dor da mulher e a lição aprendida.
- Partilha: no fim de cada capítulo, cartão vertical 9:16 para Stories e TikTok ("Eu ajudei a Rita a deixar de ver as filhas crescer em fotografias ✨ #VilaSheIs") com link para o jogo.

== 6. VENDA DOS PRODUTOS (integrada na história, nunca agressiva) ==
Cada história termina com a Maria a mostrar à mulher o recurso certo para a dor dela. O produto aparece como parte da narrativa, com um cartão elegante ("O que a Maria lhe mostrou") e um botão para saber mais:
- Mariana (quer rendimento sem expor a cara) → Curso Faceless.
- Fátima (acha que não sabe tecnologia) → She Is Studio (templates prontos para criar posts sem saber design).
- Rita (sente-se sozinha) → Comunidade She Is.
- Sónia (quer transformar o que sabe em produto) → Mentoria.
- Inês (começa sem dinheiro) → Círculo de Embaixadoras (programa de afiliadas).
- Donas de negócio (capítulo bónus) → Plano 30 posts por mês (serviço feito para elas).
Funil:
1. Jogar o prólogo e o 1.º capítulo sem registo.
2. Para continuar, pedir nome e email (com consentimento RGPD claro e opção de recusar), oferecendo um presente: mini-aula grátis "O teu primeiro perfil faceless em 7 dias".
3. Ao fim de cada capítulo, cartão do produto e código de desconto exclusivo do jogo (ex.: VILA10), com validade.
4. No final do jogo, convite para uma aula ao vivo ou sessão de diagnóstico com a Maria.
5. Emails automáticos que continuam a história ("A Rita mandou-te uma mensagem...") e levam aos produtos.
Regras de honestidade: nunca prometer ganhos, valores ou resultados garantidos. Falar de método, tempo, consistência e comunidade. Testemunhos só se forem reais e autorizados.

== 7. TOM E ESCRITA ==
Português de Portugal (nunca do Brasil): "tu", "ecrã", "telemóvel", "rapariga". Frases curtas, emocionais e verdadeiras, com o dia a dia português (bica, pastel de nata, prestação da casa, horário da escola, transportes). Empático, sem vitimizar. Cada cena tem no máximo 3 a 4 linhas de texto.

== 8. SOM ==
Música lo-fi acústica e calma, sons ambiente por cenário (máquina de café, rua, sala de aula, teclado à noite) e um pequeno "brilho" sonoro nas conquistas. Botão para desligar o som, que começa desligado.

== 9. REQUISITOS TÉCNICOS ==
- Web app (PWA) que funciona no telemóvel, no tablet e no computador, e se instala no ecrã inicial. Carregamento rápido: imagens WebP otimizadas e carregamento progressivo.
- Conteúdo (personagens, cenas, textos, produtos, links e códigos) num ficheiro editável (JSON ou CMS), para eu poder acrescentar mulheres e capítulos sem programar.
- Progresso guardado (conta simples ou email com link mágico).
- Integração de email (por exemplo, Brevo ou MailerLite) e links de checkout dos produtos.
- Analytics: início do jogo, conclusão de cada capítulo, cliques em cada produto, registos e partilhas.
- Acessibilidade: texto legível, contraste suficiente, botões grandes e opção de texto maior.
- Publicação no Netlify com domínio próprio (ex.: jogo.sheis.pt).

== 10. ENTREGÁVEIS ==
1. Jogo funcional com prólogo, mapa e 5 capítulos completos.
2. Ficheiro de conteúdo editável.
3. Lista de imagens necessárias, com nome de ficheiro, e prompts de geração para cada uma.
4. Guia curto para acrescentar novas personagens e capítulos.
```

---

## PARTE 2 — Bíblia visual e prompts das personagens

**Regra de consistência:** gera primeiro a ficha de cada personagem (frente, perfil e corpo inteiro). Depois usa essa imagem como referência em todas as outras cenas da mesma personagem. Mantém sempre o mesmo bloco de estilo no fim do prompt.

**Bloco de estilo (juntar sempre no fim):**
```
photorealistic fashion doll photographed like a real person, collectible doll aesthetic, smooth satin skin with subtle glossy sheen, large almond-shaped eyes with long lashes and winged eyeliner, defined brows, glossy nude-pink lips, peach blush, silky synthetic hair with visible strands and shine, subtle doll joints at wrists, warm golden-hour light, 85mm portrait lens, shallow depth of field, creamy bokeh background, warm palette of cream, caramel, chocolate brown, dusty pink, denim and gold, ultra detailed, 9:16 vertical
```

**Maria (ficha):**
```
Character sheet of Maria, 34-year-old Portuguese woman, petite and slim (161 cm), tanned olive skin, very long straight dark brown hair with a center part, warm brown eyes, soft confident smile. Outfit: wide-leg mid-blue jeans, chocolate brown strapless ruched top, gold layered necklaces, gold hoop earrings, stacked gold bangles, brown woven leather clutch, brown strappy heels. Front view, side view and full body, neutral cream studio background. + [bloco de estilo]
```

**Maria (variações para cenas):**
- Manhã: `Maria in a fluffy white terry bathrobe sipping a green matcha smoothie through a black straw, pearl earrings, calm morning light, grey-beige wall.`
- Selfie: `Maria taking a mirror selfie with a black phone in a warm oak-wood luxury bathroom, white crochet long-sleeve mini dress with gold ring detail, brown leather clutch, chunky gold bangle.`
- Noite na cidade: `Maria at night on a Lisbon crosswalk, oversized pink and chocolate brown striped knit polo sweater, light-wash baggy jeans, black cat-eye sunglasses, brown suede bag, street lights bokeh.`
- Resort: `Maria walking along a candle-lit resort pool at dusk, palm trees, ocean, rattan lanterns.`
- Retrato: `Close-up portrait of Maria, black ribbed tank top, glossy dark hair over one shoulder, small silver hoop, soft smile, white apartment interior.`

**Gui:**
```
Gui, 11-year-old Portuguese boy as a fashion doll, short tousled brown hair, brown eyes, freckles, grey hoodie, jeans, white sneakers, playful smile, holding a football. + [bloco de estilo]
```

**Mariana:**
```
Mariana, 29-year-old Portuguese bank employee, tall and slim, long wavy honey-blonde hair, blue eyes, light skin, white silk blouse, navy pencil skirt, nude heels, thin gold necklace and engagement ring, holding a leather folder, slightly worried expression. + [bloco de estilo]
```

**Fátima:**
```
Fátima, 52-year-old Portuguese textile factory worker, curvy body, short silver-grey bob, warm brown eyes, gentle smile lines, sage green t-shirt, beige work apron, dark trousers, measuring tape around the neck, tired but kind expression. + [bloco de estilo]
```

**Rita:**
```
Rita, 38-year-old Portuguese postwoman, medium build, copper-red hair in a high ponytail, freckles, green eyes, mustard yellow uniform polo, dark jeans, black sneakers, red mail bag with letters, tired but hopeful expression. + [bloco de estilo]
```

**Sónia:**
```
Sónia, 44-year-old Portuguese school teacher, tall, short chestnut brown hair, tortoiseshell glasses, dusty rose knit sweater, grey trousers, holding a stack of colorful books, thoughtful expression. + [bloco de estilo]
```

**Inês:**
```
Inês, 23-year-old Portuguese café waitress, petite and slim, dark brown hair in a messy high bun, warm tan skin, pink t-shirt, brown waist apron, black skirt, white sneakers, holding a small notepad, dreamy expression. + [bloco de estilo]
```

**Expressões (para cada personagem, mantendo a referência):** `same character, same outfit, worried expression` / `sad expression, eyes slightly down` / `hopeful soft smile` / `big happy smile`.

---

## PARTE 3 — Prompts dos cenários

**Mapa da vila:**
```
Tilt-shift miniature model of a charming Portuguese town seen from above, red terracotta roofs, pastel and tiled facades with azulejos, Portuguese cobblestone calçada, a yellow tram, rows of green trees and pink and purple blossoming trees, colorful vintage cars, tiny people, a whitewashed church with bell tower in the center, river and green hills in the background, sunny warm light, vivid colors, shallow depth of field, vertical 9:16.
```

**Casa da Maria (maquete):**
```
Architectural scale model of a modern two-storey house, light concrete, oak wood panels, black-framed glass, warm LED interior lighting, glass balcony with potted plants, small olive trees and lit garden path, cream base, soft grey background, elegant serif caption "Casa da Maria · Maqueta conceptual".
```

**Interiores (fundo para os diálogos, sem pessoas):**
- Secretária da Maria (antes): `small dark cluttered desk at night, laptop glow, cold coffee mug, messy papers, window with Lisbon night lights, lonely mood, miniature diorama, warm lamp.`
- Secretária da Maria (depois): `cozy pastel home office diorama, light wood desk, white monitor showing "olá", pink tablet, ceramic mug, small cactus in a pig pot, pegboard with stationery, shelf with pastel books and a frame "tudo vai correr bem", digital clock, warm golden-hour sunlight, plants.`
- Banco: `elegant Portuguese bank branch interior, teal and cream, wooden counter, round wall clock, "Crédito Habitação" poster, plants, warm light, shallow depth of field, no people.`
- Fábrica têxtil: `Portuguese textile factory interior, exposed brick, tall windows with sunbeams, sewing machines, colorful fabric rolls, warm dust light, no people.`
- Correios: `cozy Portuguese post office interior, cream and red, wooden counter, parcel shelves, red mailbox, morning light, no people.`
- Escola: `warm classroom, green chalkboard reading "Hoje: frações", wooden desks, world map, window with a tree, afternoon light, no people.`
- Café: `Portuguese café interior, blue and white azulejo tiles, marble counter, espresso machine, pastéis de nata in a glass display, chalkboard menu "Bica 0,80€", pendant lamps, warm light, no people.`
- Resort (recompensa): `luxury resort walkway at dusk, candle lanterns, infinity pool, palm trees, ocean, warm glow, no people.`

---

## PARTE 4 — Exemplo de cena escrita (modelo para as restantes)

**Capítulo 1: Mariana, no Banco**
1. *Mariana (preocupada):* "Casei há três meses. Toda a gente pergunta: «E os filhos, para quando?» Eu quero, mas o ordenado e a prestação da casa não me deixam sonhar sossegada."
   - Maria: "Isso pesa muito, não pesa?" → cena 2
   - Maria: "E tu, o que queres mesmo?" → cena 3
2. *Mariana (triste):* "Sinto que, ou sou boa profissional, ou serei boa mãe."
   - Maria: "E se tivesses um rendimento só teu?" → cena 4
3. *Mariana (neutra):* "Ter escolha. Decidir quando, sem fazer contas."
   - Maria: "A escolha começa por um rendimento extra." → cena 4
4. *Mariana (preocupada):* "Mas eu não quero a minha cara nas redes."
   - Maria: "Não precisas. Existe o modelo Faceless." → final
5. *Final (Mariana, a sorrir):* "Sem mostrar a cara... isso eu consigo."
   - Cartão: **Curso Faceless**, com botão "Quero conhecer", código VILA10, +50 ✨ e história guardada no diário.

---

## O que confirmar antes de enviar

- [ ] Nomes finais, preços e links de cada produto e serviço.
- [ ] Código de desconto e validade.
- [ ] Ferramenta de email que usas.
- [ ] Domínio onde o jogo vai ficar.
- [ ] Se o Gui e a Maria aparecem com o teu nome real ou como personagens.
