// Mulheres da vila: aparência (fig), trabalho, dor e história.
// Cada história é um pequeno grafo de cenas: { t: texto, e: expressão, o: [{ t: resposta da Maria, v: próxima cena }] }.
// Expressões: neutra | sorriso | preocupada | triste. Uma cena com `produto` mostra o produto e fecha a história.

export const MARIA = {
  id: "maria", nome: "Maria", idade: 34, trabalho: "Mentora",
  fig: {
    pele: "#c98d63", cabelo: "#2a1a12", estilo: "longo", olhos: "#4a2a1a", batom: "#b9707a",
    altura: 161, corpo: 0.92, idade: 34,
    top: { tipo: "camisola", cor: "#f1e6d2" }, mangas: "longas",
    baixo: { tipo: "calca", cor: "#4a73a8", ganga: true },
    sapatos: { cor: "#6b4430", salto: true }, item: "clutch", itemCor: "#8a5430",
  },
};

// Prólogo: a história da Maria, em casa.
export const PROLOGO = [
  { quem: "narrador", t: "Lisboa, 23h40. Na casa da Maria, só o ecrã do computador está aceso." },
  { quem: "maria", e: "triste", t: "Mais um projeto de freelance entregue. O Gui já está a dormir... e outra vez não o vi chegar da escola." },
  { quem: "maria", e: "triste", t: "Onze anos. Às vezes sinto que o vejo crescer em fotografias." },
  { quem: "narrador", t: "No telemóvel, uma notícia: nos Estados Unidos, milhares de mulheres criam negócios online sem mostrar a cara. Chamam-lhe Faceless." },
  { quem: "maria", e: "neutra", t: "Sem mostrar a cara... com o meu tempo, ao meu ritmo, perto do Gui." },
  { quem: "maria", e: "sorriso", t: "E se eu trouxesse isto para Portugal? Para mim... e para tantas mulheres como eu." },
];

export const MULHERES = [
  {
    id: "mariana", nome: "Mariana", idade: 29, trabalho: "Bancária", local: "banco",
    resumo: "Recém-casada, sem filhos. Quer escolher quando, sem fazer contas ao fim do mês.",
    fig: {
      pele: "#f3d0b0", cabelo: "#d9ad62", estilo: "ondas", olhos: "#4f7fa8", batom: "#c76c72",
      altura: 172, corpo: 0.9, idade: 29,
      top: { tipo: "blusa", cor: "#ffffff" }, baixo: { tipo: "saia", cor: "#2d3c5e" },
      sapatos: { cor: "#d9a88a", salto: true }, item: "pasta", itemCor: "#8a5430",
    },
    produto: "curso",
    inicio: "a",
    cenas: {
      a: { e: "preocupada", t: "Casei há três meses. Toda a gente pergunta: «E os filhos, para quando?» Eu quero, mas o ordenado do banco e a prestação da casa não me deixam sonhar sossegada.",
        o: [{ t: "Isso pesa muito, não pesa?", v: "b" }, { t: "E tu, o que queres mesmo?", v: "c" }] },
      b: { e: "triste", t: "Pesa. Sinto que, ou sou boa profissional, ou serei boa mãe, e nenhuma das duas está a correr como imaginei.",
        o: [{ t: "E se tivesses um rendimento só teu?", v: "d" }] },
      c: { e: "neutra", t: "Ter escolha. Decidir quando, sem estar de calculadora na mão a ver se chega.",
        o: [{ t: "A escolha começa por um rendimento extra.", v: "d" }] },
      d: { e: "preocupada", t: "Rendimento extra? Mas eu não tenho jeito para aparecer. Não quero a minha cara nas redes e o banco nem ia gostar.",
        o: [{ t: "Não precisas. Existe o modelo Faceless: criar sem mostrar a cara.", v: "p" }] },
      p: { e: "sorriso", t: "Sem mostrar a cara... isso eu consigo. Não há milagres, mas dá para começar com 20 minutos por dia.", produto: true },
    },
    licao: "Escolher quando ser mãe passa por ter um rendimento que seja teu.",
  },
  {
    id: "fatima", nome: "Fátima", idade: 52, trabalho: "Operária têxtil", local: "fabrica",
    resumo: "Trinta anos de fábrica e medo de ficar sem turnos. Acha que é tarde para aprender.",
    fig: {
      pele: "#e8bd9a", cabelo: "#bdb6ad", estilo: "curto", olhos: "#5b3a22", batom: "#b5646b",
      altura: 158, corpo: 1.3, idade: 52, brincos: false,
      top: { tipo: "tshirt", cor: "#8fb09a" }, mangas: "curtas",
      baixo: { tipo: "calca", cor: "#4d4a52" }, sapatos: { cor: "#3a3a3a", salto: false },
      avental: { tipo: "comprido", cor: "#e6dcc6" },
    },
    produto: "studio",
    inicio: "a",
    cenas: {
      a: { e: "preocupada", t: "Trinta anos nesta fábrica. Agora cortaram turnos e cada semana é uma incerteza. Aos 52 anos, quem me dá emprego?",
        o: [{ t: "Trinta anos de trabalho valem muito.", v: "b" }, { t: "E se criasses algo além da fábrica?", v: "c" }] },
      b: { e: "triste", t: "Valem, mas o mundo mudou. Os meus filhos falam de redes, de computadores, e eu fico calada à mesa.",
        o: [{ t: "Ninguém nasce a saber. Começa-se por uma coisa pequena.", v: "d" }] },
      c: { e: "preocupada", t: "Eu? Não percebo nada de computadores. Isso é para os novos.",
        o: [{ t: "Há ferramentas feitas para quem nunca fez design.", v: "d" }] },
      d: { e: "neutra", t: "Se fosse simples, de escolher um modelo e mudar o texto... isso talvez eu soubesse fazer.",
        o: [{ t: "É exatamente isso. Escolhes, mudas e publicas.", v: "p" }] },
      p: { e: "sorriso", t: "Então talvez ainda vá a tempo de aprender alguma coisa nova. Eu gosto de coisas bem feitas.", produto: true },
    },
    licao: "Nunca é tarde: o primeiro passo só precisa de ser simples.",
  },
  {
    id: "rita", nome: "Rita", idade: 38, trabalho: "Carteira", local: "correios",
    resumo: "Acorda às 5h, volta às 18h. Vê as filhas crescer em fotografias.",
    fig: {
      pele: "#f1cdb0", cabelo: "#b5532d", estilo: "rabo", olhos: "#4a6a3a", batom: "#c06a6a",
      altura: 166, corpo: 1.0, idade: 38,
      top: { tipo: "tshirt", cor: "#e3b543" }, mangas: "curtas",
      baixo: { tipo: "calca", cor: "#3a5578", ganga: true }, sapatos: { cor: "#2a2a2a", salto: false },
      item: "cartas", itemCor: "#c8312f",
    },
    produto: "comunidade",
    inicio: "a",
    cenas: {
      a: { e: "triste", t: "Acordo às cinco, chego às seis da tarde. As minhas filhas já jantaram, já tomaram banho... Vejo-as crescer em fotografias.",
        o: [{ t: "Eu também já vivi isso. Sei bem como é.", v: "b" }] },
      b: { e: "neutra", t: "A sério? Tu? Pareces sempre tão segura...",
        o: [{ t: "Era freelancer e quase não via o Gui crescer. Foi o que me fez mudar.", v: "c" }] },
      c: { e: "preocupada", t: "E mudaste sozinha? Eu nem sei por onde começar. Sinto que sou a única a sentir isto.",
        o: [{ t: "Não és. Nunca fiz isto sozinha, e tu também não precisas.", v: "p" }] },
      p: { e: "sorriso", t: "Só de saber que há mais mulheres como eu já me sinto menos sozinha.", produto: true },
    },
    licao: "A culpa de mãe pesa menos quando se partilha com quem vive o mesmo.",
  },
  {
    id: "sonia", nome: "Sónia", idade: 44, trabalho: "Professora", local: "escola",
    resumo: "Cansada, com salário parado. Todo o seu saber fica fechado numa sala de aula.",
    fig: {
      pele: "#dcaa84", cabelo: "#5a3a2a", estilo: "curto", olhos: "#3a2a1a", batom: "#a85a62",
      altura: 176, corpo: 1.05, idade: 44, oculos: true,
      top: { tipo: "camisola", cor: "#c47a8a" }, baixo: { tipo: "calca", cor: "#3d3d46" },
      sapatos: { cor: "#4a3a2a", salto: false }, item: "livros", itemCor: "#b5533c",
    },
    produto: "mentoria",
    inicio: "a",
    cenas: {
      a: { e: "preocupada", t: "Vinte anos a ensinar, e o salário quase não mexe. Chego a casa exausta e ainda tenho testes para corrigir.",
        o: [{ t: "O que mais te custa?", v: "b" }] },
      b: { e: "triste", t: "Sinto que tudo o que sei está fechado numa sala com trinta alunos. Lá fora, há tanta gente que precisava de aprender isto.",
        o: [{ t: "E se levasses o que sabes para mais pessoas?", v: "c" }] },
      c: { e: "preocupada", t: "Mas como? Não sou influencer, não sei de vendas e nem tenho tempo.",
        o: [{ t: "Não precisas de ser influencer. Precisas de método e de alguém ao teu lado.", v: "p" }] },
      p: { e: "sorriso", t: "Alguém que me ajude a organizar o que já sei... isso fazia diferença.", produto: true },
    },
    licao: "O que já sabes pode ajudar mais pessoas do que cabem numa sala.",
  },
  {
    id: "ines", nome: "Inês", idade: 23, trabalho: "Empregada de café", local: "cafe",
    resumo: "Contratos curtos, vive com os pais e sonha com independência.",
    fig: {
      pele: "#d29d74", cabelo: "#3a2418", estilo: "carrapito", olhos: "#4a2a1a", batom: "#d06a7a",
      altura: 156, corpo: 0.86, idade: 23,
      top: { tipo: "tshirt", cor: "#f2a7b8" }, mangas: "curtas",
      baixo: { tipo: "saia", cor: "#3b3030" }, sapatos: { cor: "#f2efe8", salto: false },
      avental: { tipo: "cintura", cor: "#8a5a3a" }, item: "bloco", itemCor: "#d9879b",
    },
    produto: "afiliadas",
    inicio: "a",
    cenas: {
      a: { e: "triste", t: "Mais um contrato de três meses. Moro com os meus pais e sinto que a minha vida está sempre em pausa.",
        o: [{ t: "O que querias mudar primeiro?", v: "b" }] },
      b: { e: "preocupada", t: "Ter o meu dinheiro, a minha casa. Mas sem experiência e sem capital, ninguém me dá crédito, nem confiança.",
        o: [{ t: "Há quem comece sem dinheiro: recomendando o que acredita.", v: "c" }] },
      c: { e: "neutra", t: "Recomendar? Tipo ser afiliada? Eu vivo no telemóvel o dia todo, mas ninguém me paga por isso.",
        o: [{ t: "Pode passar a pagar. Com calma e com método.", v: "p" }] },
      p: { e: "sorriso", t: "Se eu puder começar do zero e aprender pelo caminho, estou dentro.", produto: true },
    },
    licao: "Começar do zero é possível quando se recomenda aquilo em que se acredita.",
  },
];
