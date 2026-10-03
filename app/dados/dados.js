/* =========================================================================
   BLOGMASTER — PINMIND
   Base de conhecimento do app: nichos, ofertas, benchmarks e estilos visuais.
   Todos os números vêm de benchmarks públicos 2025-2026 citados na BÍBLIA/11.
   ========================================================================= */

const BM = {
  // Benchmarks de design (GenSumo Research 2026, 148k pins analisados)
  design: {
    proporcao:   '2:3 vertical — 1000 x 1500 px',
    video:       '9:16 — 1080 x 1920 px',
    impressoes:  '+45% impressões vs quadrado · +22% cliques',
    texto:       '5 a 8 palavras, fonte sans-serif bold, alto contraste → +110% cliques',
    titulo:      '40 a 60 caracteres com keyword → +67% impressões',
    fundo:       'tons quentes/claros → +38% saves vs fundo escuro',
    Bordas:      'evite bordas grossas (-9% impressões)',
    sujeito:     'pessoa em contexto lifestyle → +14% impressões, +18% saves',
    frequencia:  '3 a 5 pins/dia por 90 dias → +22% impressões por pin',
    hashtags:    'hashtags caíram para ~1% do peso de ranking; priorize keyword longa',
    sazonal:     'publique sazonal 30 a 60 dias antes do pico',
    videostats:  'vídeo = +185% impressões, mas estático = 3x mais cliques de saída',
    carrossel:   'carrossel: +112 impressões, +7,1 saves/1k, +4,1 cliques/1k',
    freshPin:    'pin novo (imagem inédita) é o maior alavancador de alcance em 2026',
    prazos:      'pin forte segue surfando por 3 a 6 meses (alguns por anos)'
  },
  funil: { // taxas de referência para planejamento (conservador)
    impressaoParaClique: 0.004,   // 0,4% CTR médio (0,34%-0,62% em anúncios)
    cliqueParaConversao: 0.01,    // 1% (depende da oferta)
    saveParaClique: 0.15
  }
};

/* ---------------------------------------------------------------------------
   NICHOS — demanda, ticket médio, tipo de oferta e amarração com IA
   score = demanda(0-10) + monetização(0-10) + facilidade de fazer com IA(0-10)
   ------------------------------------------------------------------------- */
const NICHOS = [
  { id:'decor', pt:'Decoração & Organização de Casa', en:'Home Decor & Organization',
    sub:['cantinho de leitura','quarto pequeno','cozinha organizada','banheiro spa','home office',
         'decoração de aluguel','organização de despensa','quarto de bebê','sala minimalista'],
    demanda:10, monet:9, ia:9, ticketMedio:'R$ 60 a R$ 400',
    ofertas:['infoproduto decor','físico Amazon/ML (organizadores, luminárias, quadros)','printables (planners de casa)','SaaS de design'],
    obs:'Maior longevidade do Pinterest: pin de decoração entrega tráfego 2-3 anos depois. Ideal para físico + printables.' },

  { id:'receitas', pt:'Receitas & Comida', en:'Recipes & Food',
    sub:['jantar rápido 15 min','low carb','marmita fit','doces sem forno','airfryer','café da manhã proteico','receitas veganas','pão caseiro'],
    demanda:10, monet:7, ia:7, ticketMedio:'R$ 30 a R$ 200',
    ofertas:['e-book de receitas próprio','infoproduto nutrição','físico (utensílios, airfryer)','AdSense/tráfego'],
    obs:'Maior categoria por saves. Foto top-down do prato pronto com quantidade no overlay. Video pin de receita estoura fácil.' },

  { id:'fitness', pt:'Fitness & Emagrecimento', en:'Fitness & Weight Loss',
    sub:['treino em casa sem equipamento','pilates para iniciantes','abdômen lower','alongamento para quem trabalha sentado','treino 10 min','pós-parto'],
    demanda:9, monet:10, ia:8, ticketMedio:'R$ 97 a R$ 600',
    ofertas:['infoproduto fitness (Hotmart/Kiwify)','assinatura de treinos','suplementos (físico)','SaaS de dieta'],
    obs:'Picos em janeiro e maio. Formato campeão: grade numerada de exercícios, não vídeo único. Alto ticket de infoproduto.' },

  { id:'financas', pt:'Finanças & Renda Extra', en:'Personal Finance & Side Hustles',
    sub:['sair das dívidas','planilha de orçamento','renda extra em casa','como investir 100 reais','MEI para iniciantes','controle de gastos do casal'],
    demanda:9, monet:10, ia:10, ticketMedio:'R$ 47 a R$ 1.200',
    ofertas:['infoproduto finanças','planilhas próprias','SaaS/ferramenta (afiliado recorrente)','serviços'],
    obs:'Melhor nicho para produto digital próprio + afiliado SaaS recorrente. Infográfico e checklist dominam os saves.' },

  { id:'produtividade', pt:'Produtividade & Estudos', en:'Productivity & Studying',
    sub:['método pomodoro','notion para estudantes','como estudar para concurso','rotina matinal de 30 min','foco com TDAH','mapas mentais'],
    demanda:8, monet:8, ia:10, ticketMedio:'R$ 27 a R$ 400',
    ofertas:['templates Notion/planilhas','infoproduto estudo','SaaS de produtividade (recorrente)','printables'],
    obs:'Pico em janeiro e setembro. Público compra sistema, não motivação. Ótimo para digital próprio de margem 100%.' },

  { id:'beleza', pt:'Beleza & Autocuidado', en:'Beauty & Self-Care',
    sub:['skincare para pele oleosa','cronograma capilar','maquiagem natural','unhas em casa','rotina de skincare noturna','perfume barato que parece caro'],
    demanda:9, monet:9, ia:8, ticketMedio:'R$ 50 a R$ 300',
    ofertas:['físico (Amazon/Shopee/ML)','infoproduto beleza','marca própria','SaaS de beleza'],
    obs:'Visual clean, tons claros, produto em contexto. Funciona excepcionalmente bem para pin de "lista" e "antes/depois".' },

  { id:'moda', pt:'Moda & Looks', en:'Fashion & Outfits',
    sub:['look trabalho feminino','moda verão barata','capsule wardrobe','look casual chic','moda plus size','look festa'],
    demanda:9, monet:8, ia:7, ticketMedio:'R$ 80 a R$ 500',
    ofertas:['físico (Shopee/ML/Magalu)','infoproduto de moda','marca própria/print-on-demand','SaaS'],
    obs:'Lookbook de 4-6 looks no mesmo pin salva muito. Carrossel com 5-7 slides do mesmo look base performando em 2026.' },

  { id:'diydiy', pt:'DIY & Artesanato', en:'DIY & Crafts',
    sub:['artesanato com material barato','upcycling','presente feito à mão','crochê iniciante','velas caseiras','decoração com sucata'],
    demanda:9, monet:6, ia:8, ticketMedio:'R$ 20 a R$ 200',
    ofertas:['moldes e printables próprios','infoproduto artesanato','físico (materiais, kits)','Etsy/Gumroad'],
    obs:'Formato vencedor: grade numerada mostrando cada etapa. Close do resultado final (não o plano geral).' },

  { id:'bebe', pt:'Maternidade & Bebê', en:'Parenting & Baby',
    sub:['enxoval econômico','cardápio de introdução alimentar','rotina de sono do bebê','atividades para criança de 3 anos','maternidade real'],
    demanda:8, monet:8, ia:8, ticketMedio:'R$ 60 a R$ 400',
    ofertas:['infoproduto maternidade','printables (rotina, cardápios)','físico (bebê)','assinaturas'],
    obs:'Público altamente comprador e emocional. Cuidado com compliance em saúde infantil (nada de promessa médica).' },

  { id:'pets', pt:'Pets', en:'Pets',
    sub:['adestramento básico','gato em apartamento','brinquedo caseiro para cachorro','viagem com pet','ração econômica'],
    demanda:8, monet:7, ia:8, ticketMedio:'R$ 40 a R$ 300',
    ofertas:['físico (Petlove/Amazon)','infoproduto adestramento','assinatura de petiscos','serviços locais'],
    obs:'Nicho afetivo, converte muito em físico. Visual: pet em contexto real, fundo claro.' },

  { id:'ia', pt:'IA & Ferramentas', en:'AI & Tools',
    sub:['prompts de chatgpt para trabalho','ferramentas de ia grátis','automação com notion','ganhar dinheiro com ia','ia para estudar'],
    demanda:10, monet:9, ia:10, ticketMedio:'R$ 27 a R$ 997',
    ofertas:['SaaS de IA (recorrente alto)','infoproduto de IA','templates de prompts','serviços'],
    obs:'O nicho mais quente de 2025-2026. Comissões de SaaS recorrentes pagam todo mês pelo mesmo cliente.' },

  { id:'viagem', pt:'Viagem', en:'Travel',
    sub:['viagem barata','roteiro de 3 dias','mochilão','viagem com criança','destinos pouco conhecidos no Brasil'],
    demanda:8, monet:7, ia:8, ticketMedio:'R$ 100 a R$ 2.000',
    ofertas:['infoproduto de roteiro','SaaS de hospedagem/seguro (recorrente)','físico (mala, acessórios)','serviços'],
    obs:'Comissões altas em seguro-viagem e hospedagem. Roteiro próprio em PDF vende bem a R$ 27-47.' },

  { id:'negocios', pt:'Negócios & Marketing Digital', en:'Business & Digital Marketing',
    sub:['como abrir MEI','social media para iniciantes','canva para negócios','tráfego para pequenos negócios','vender no instagram'],
    demanda:9, monet:10, ia:9, ticketMedio:'R$ 97 a R$ 2.500',
    ofertas:['infoproduto (comissão até 80%)','SaaS (Hostinger, Canva, SEMrush, Elementor)','serviços próprios'],
    obs:'Mesmo público que compra ferramentas — perfeito para empilhar afiliado de SaaS recorrente + serviço próprio.' },

  { id:'jardim', pt:'Jardim & Plantas', en:'Garden & Plants',
    sub:['plantas que não morrem','horta em apartamento','suculentas','jardim vertical','plantas para sombra'],
    demanda:8, monet:6, ia:9, ticketMedio:'R$ 30 a R$ 250',
    ofertas:['físico (plantas, vasos, insumos)','infoproduto jardinagem','printables','SaaS'],
    obs:'Temática muito salva e com pouca concorrência em PT-BR. Pin claro, verde vivo, luz natural.' },

  { id:'relacionamento', pt:'Relacionamento & Família', en:'Relationship & Family',
    sub:['encontro barato em casa','conversas para casais','atividades em família','presentes para namorado','rotina de casal'],
    demanda:7, monet:6, ia:9, ticketMedio:'R$ 27 a R$ 200',
    ofertas:['printables (jogos, cartas)','infoproduto','físico (presentes)','serviços'],
    obs:'Printables de jogos e cartas vendem muito e custam zero para produzir com IA + Canva.' },

  { id:'artefitness', pt:'Fitness de Baixo Impacto & Bem-estar', en:'Low Impact Fitness & Wellness',
    sub:['yoga em casa','meditação para ansiedade','respiração para dormir','mobilidade para dor nas costas','sono reparador'],
    demanda:8, monet:8, ia:8, ticketMedio:'R$ 47 a R$ 500',
    ofertas:['infoproduto (yoga/meditação)','assinatura','físico (tapete, acessórios)','SaaS de meditação'],
    obs:'Pinterest elegeu otimização de sono como tendência forte em 2026. Visual calmo, luz baixa, overlay de ações.' }
];

/* ---------------------------------------------------------------------------
   TIPOS DE OFERTA — onde achar, quanto paga, quais regras
   cookie em dias; comissao em %; risco = chance de bloqueio/limitação
   ------------------------------------------------------------------------- */
const OFERTAS = [
  { id:'hotmart', tipo:'Infoproduto BR', onde:'hotmart.com', comissao:'10% a 80% (média 40-60%)',
    cookie:'60 a 180 dias', pagamento:'Semanal / Pix em ~2 dias', publico:'Brasil',
    linkDireto:true, risco:'baixo', obs:'Maior catálogo do Brasil. Permite link direto em pin. Escolha produtos com ≥100 vendas e nota alta.' },
  { id:'kiwify', tipo:'Infoproduto BR', onde:'kiwify.com.br', comissao:'até 70-85%',
    cookie:'configurável (até 180d)', pagamento:'a cada 15 dias / Pix em ~7d', publico:'Brasil',
    linkDireto:true, risco:'baixo', obs:'Ciclo de caixa mais rápido. Ótimo para reinvestir em volume.' },
  { id:'monetizze', tipo:'Infoproduto + físico BR', onde:'monetizze.com.br', comissao:'até 70-80%',
    cookie:'30 a 180 dias', pagamento:'Semanal / Pix ~2d', publico:'Brasil', linkDireto:true, risco:'baixo',
    obs:'Forte em saúde/beleza/físico. Boa para pin de produto físico com apelo emocional.' },
  { id:'eduzz', tipo:'Infoproduto BR', onde:'eduzz.com', comissao:'10% a 70%',
    cookie:'30 a 180 dias', pagamento:'Rápido', publico:'Brasil', linkDireto:true, risco:'baixo', obs:'Alternativa para diversificar catálogo.' },
  { id:'braip', tipo:'Físico + digital BR', onde:'braip.com', comissao:'até 99% em alguns produtos',
    cookie:'não divulgado', pagamento:'24h (Pix)', publico:'Brasil', linkDireto:true, risco:'médio',
    obs:'Pagamento rápido, mas tem mensalidade de inatividade — só vale com volume.' },
  { id:'amazon', tipo:'Físico global', onde:'associados.amazon.com.br', comissao:'1% a 15% (moda ~10%, livro 4,5%)',
    cookie:'24 horas', pagamento:'60 dias, mínimo R$ 30', publico:'Global', linkDireto:true, risco:'médio',
    obs:'Cookie curtinho → funciona melhor com produto de impulso e pin que leva direto para a página do item.' },
  { id:'mercadolivre', tipo:'Físico BR', onde:'mercadolivre.com.br/afiliados', comissao:'até ~16%',
    cookie:'30 dias', pagamento:'mensal', publico:'Brasil', linkDireto:true, risco:'baixo', obs:'Bom para eletrônicos e utilidades com preço competitivo.' },
  { id:'shopee', tipo:'Físico BR/Ásia', onde:'shopee.com.br/afiliados', comissao:'3% a 15%',
    cookie:'7 dias', pagamento:'mensal', publico:'Brasil', linkDireto:true, risco:'baixo', obs:'Tickets baixos + volume grande. Combina com nicho de utilidades e moda barata.' },
  { id:'magalu', tipo:'Físico BR', onde:'parceiromagalu.com.br', comissao:'1% a 12%',
    cookie:'30 dias', pagamento:'mensal', publico:'Brasil', linkDireto:true, risco:'baixo', obs:'Marca com alta confiança do consumidor brasileiro — bom para eletro e casa.' },
  { id:'saas', tipo:'Software / assinatura', onde:'programas próprios (Hostinger, Canva, SEMrush, Elementor, ConvertKit, Notion)',
    comissao:'30% a 60% por venda ou recorrente', cookie:'30 a 90 dias', pagamento:'mensal', publico:'Global',
    linkDireto:true, risco:'baixo', obs:'MELHOR de todos: comissão recorrente. Hostinger ~60%/venda; ConvertKit 30% por 24 meses; empresas grandes pagam em dólar.' },
  { id:'digitais', tipo:'Produto digital PRÓPRIO', onde:'Gumroad, Payhip, Etsy, Hotmart como produtor, Ko-fi',
    comissao:'80% a 95% para você', cookie:'n/a', pagamento:'na hora/quinzenal', publico:'Global',
    linkDireto:true, risco:'baixo', obs:'Margem quase total. Ideal: printables, planners, templates, ebooks, packs de prompts, packs de imagens.' },
  { id:'printondemand', tipo:'Print on demand', onde:'Printful/Printify + Shopify ou Etsy; Redbubble',
    comissao:'margem de 20% a 50%', cookie:'n/a', pagamento:'mensal', publico:'Global', linkDireto:true, risco:'baixo',
    obs:'Você cria o design com IA, a plataforma imprime e envia. Escala sem estoque.' },
  { id:'blogads', tipo:'Tráfego → anúncios', onde:'Google AdSense, Ezoic, Mediavine, Journey',
    comissao:'RPM variável (US$ 5 a US$ 40)', cookie:'n/a', pagamento:'mensal', publico:'Global', linkDireto:false, risco:'baixo',
    obs:'Pin → seu blog → anúncio. Não precisa de produto nenhum, mas exige volume de conteúdo.' },
  { id:'servicos', tipo:'Serviço próprio', onde:'Pinterest management, criação de pins, setup de loja',
    comissao:'R$ 500 a R$ 5.000/mês por cliente', cookie:'n/a', pagamento:'contrato', publico:'Brasil/Global',
    linkDireto:false, risco:'baixo', obs:'Usa os mesmos pins como portfólio. Receita previsível e imediata.' },
  { id:'leadgen', tipo:'Lead → venda consultiva', onde:'formulário/WhatsApp → seu produto ou do parceiro',
    comissao:'alto ticket', cookie:'n/a', pagamento:'negociado', publico:'Brasil', linkDireto:true, risco:'baixo',
    obs:'Pin chama para material gratuito → você captura e-mail/telefone → vende depois. Blinda contra bloqueio de link.' },
  { id:'plr', tipo:'PLR / conteúdo licenciado', onde:'PLR Databases, IDPLR, packs de prompts',
    comissao:'margem 100% após a compra', cookie:'n/a', pagamento:'n/a', publico:'Global', linkDireto:true, risco:'baixo',
    obs:'Compre uma vez, revenda infinitas. Sempre confira a licença (direito de revenda e uso comercial).' }
];

/* ---------------------------------------------------------------------------
   ESTILOS VISUAIS — "o visual que mais se vê" no Pinterest em 2025-2026
   Cada estilo traz fragmento de prompt em PT e EN + onde usar.
   ------------------------------------------------------------------------- */
const ESTILOS = [
  { id:'light', nome:'Light & Bright', en:'Light & Bright',
    forca:'alta', nichos:['decor','receitas','beleza','jardim','bebe','produtividade'],
    porque:'Fundo claro/quente rende +38% de saves que fundo escuro. É o visual mais visto no feed de casa, comida e bem-estar.',
    pt:'fundo branco ou bege claro, luz natural suave vindo da esquerda, sombras mínimas, paleta pastel com 1 cor de destaque, estética arejada e limpa, muito espaço negativo',
    en:'white or light beige background, soft natural light from the left, minimal shadows, pastel palette with one accent color, airy clean aesthetic, lots of negative space',
    evitar:'Evite saturação alta e sombras duras — parece panfleto.' },

  { id:'bold', nome:'Bold Tipográfico', en:'Bold Typographic',
    forca:'alta', nichos:['financas','ia','negocios','produtividade','fitness'],
    porque:'Texto grande em 5-8 palavras dá +110% de cliques vs pin sem texto. É o formato dominante em nichos de informação.',
    pt:'tipografia sans-serif extra-bold ocupando 40% do pin, alto contraste (texto quase preto sobre fundo off-white, ou branco sobre bloco colorido), hierarquia clara entre linha 1 e linha 2, alinhamento à esquerda',
    en:'extra-bold sans-serif typography filling 40% of the pin, high contrast (near-black text on off-white, or white on a colored block), clear hierarchy between line 1 and line 2, left aligned',
    evitar:'Não passe de 8 palavras e não use 3 fontes diferentes.' },

  { id:'topdown', nome:'Top-down Flat Lay', en:'Top-down Flat Lay',
    forca:'alta', nichos:['receitas','diydiy','beleza','jardim','produtividade'],
    porque:'Padrão visual nº 1 em comida e DIY. O prato/projeto visto de cima com ingredientes ao redor gera altíssimo save.',
    pt:'foto vista de cima (flat lay), superfície neutra de madeira clara ou mármore, prato/projeto centralizado, ingredientes ou peças dispostas ao redor em composição equilibrada, luz difusa sem reflexo',
    en:'top-down flat lay photograph, neutral light wood or marble surface, dish/project centered, ingredients or pieces arranged around it in a balanced composition, diffused light with no glare',
    evitar:'Não encha demais as bordas — o pin vira ilegível no thumbnail.' },

  { id:'lifestyle', nome:'Lifestyle com Pessoa', en:'Lifestyle with Person',
    forca:'alta', nichos:['fitness','moda','bebe','pets','viagem','beleza'],
    porque:'Pessoa em contexto lifestyle rende +14% impressões e +18% saves. Gera identificação imediata e "quero essa vida".',
    pt:'pessoa real em contexto cotidiano (não modelo de estúdio), ângulo levemente lateral, luz natural de janela, ambiente doméstico ou urbano reconhecível, cores quentes, momento espontâneo e não posado',
    en:'real person in an everyday context (not a studio model), slightly side angle, natural window light, recognizable home or urban setting, warm colors, candid unposed moment',
    evitar:'Cuidado com rosto gerado por IA "plástico" — Pinterest sinaliza e o público rejeita.' },

  { id:'checklist', nome:'Checklist / Infográfico', en:'Checklist / Infographic',
    forca:'alta', nichos:['financas','produtividade','negocios','ia','fitness','bebe'],
    porque:'Conteúdo de referência (lista, checklist, passo a passo) é o que mais é salvo. O usuário salva para usar depois.',
    pt:'layout de infográfico vertical, 5 a 7 itens numerados com ícones simples de linha, blocos de cor suave separando cada item, tipografia legível em tela de celular, título no topo com 4 palavras',
    en:'vertical infographic layout, 5 to 7 numbered items with simple line icons, soft color blocks separating each item, typography legible on mobile, 4-word title at the top',
    evitar:'Não use mais de 7 itens nem texto pequeno — ninguém lê.' },

  { id:'grid', nome:'Grade Numerada / Passo a Passo', en:'Numbered Grid / Step by Step',
    forca:'media', nichos:['diydiy','receitas','fitness','jardim'],
    porque:'Padrão vencedor em DIY e treino: mostra o processo. Combina o resultado final no topo com as etapas embaixo.',
    pt:'grade de 2x2 ou 3x2 mostrando etapas, numerais grandes em círculo no canto de cada quadro, resultado final no quadro maior do topo, moldura fina branca entre os quadros',
    en:'2x2 or 3x2 grid showing steps, large numerals in a circle at each frame corner, final result in the larger top frame, thin white frame between frames',
    evitar:'Não use grade 3x3 em pin 2:3 — cada quadro fica pequeno demais.' },

  { id:'darkacademia', nome:'Dark Academia / Moody', en:'Dark Academia / Moody',
    forca:'media', nichos:['produtividade','moda','viagem','negocios'],
    porque:'Ainda é um dos feeds de maior distribuição por estética em 2026, com destaque para aubergine e dark academia 2.0.',
    pt:'fotografia em luz baixa e quente, sombras ricas, detalhes dourados, color grade levemente fílmico, textura de madeira escura e couro, atmosfera de biblioteca antiga',
    en:'warm low-light photography, rich shadows, gold accents, slightly filmic color grade, dark wood and leather textures, old library atmosphere',
    evitar:'Fundo escuro perde save médio — use só quando a estética for o diferencial.' },

  { id:'cottage', nome:'Cottage-Glam', en:'Cottage-Glam',
    forca:'media', nichos:['decor','receitas','jardim','relacionamento','beleza'],
    porque:'Tendência declarada de 2026: mistura de rústico com um elemento glamouroso. O reconhecimento visual do Pinterest categoriza sozinho.',
    pt:'cenário rústico acolhedor com um único elemento glamouroso (cristal, metal dourado, cetim), filtro quente, flores do campo, louça de cerâmica artesanal, luz de fim de tarde',
    en:'cozy rustic setting with one glamorous element (crystal, gold metal, satin), warm filter, wildflowers, artisanal ceramic dishes, late afternoon light',
    evitar:'Só um elemento glamouroso — dois viram kitsch.' },

  { id:'curated', nome:'Cluttercore Curado (Maximalismo)', en:'Curated Cluttercore (Maximalism)',
    forca:'media', nichos:['decor','moda','relacionamento'],
    porque:'2026 premia o excesso INTENCIONAL: cada objeto parece escolhido. Alto save em decoração e moda eclética.',
    pt:'ambiente maximalista porém intencional, objetos colecionáveis visíveis mas organizados por cor, estampas misturadas com uma paleta unificadora, textura de tecido e cerâmica, luz quente',
    en:'maximalist yet intentional interior, collectible objects visible but organized by color, mixed patterns unified by one palette, fabric and ceramic textures, warm light',
    evitar:'Desordem aleatória é o oposto: o pin precisa parecer curado.' },

  { id:'minimal', nome:'Minimalista Premium', en:'Minimal Premium',
    forca:'media', nichos:['negocios','financas','ia','produtividade','viagem'],
    porque:'Passa autoridade e marca. Ideal para vender software, curso caro e serviço — o pin parece "de empresa grande".',
    pt:'composição minimalista com muito espaço em branco, um único objeto ou mockup de tela, tipografia fina e elegante em preto, sombra suave longa, fundo off-white ou cinza claro',
    en:'minimal composition with lots of white space, a single object or screen mockup, thin elegant black typography, soft long shadow, off-white or light grey background',
    evitar:'Minimalismo sem hierarquia morre no feed — o título precisa ser grande.' },

  { id:'antesdepois', nome:'Antes / Depois', en:'Before / After',
    forca:'alta', nichos:['decor','fitness','beleza','diydiy','jardim'],
    porque:'Contraste visual resolve em 1 segundo. É o gancho mais forte para cliques em transformação.',
    pt:'divisão vertical exata ao meio, lado esquerdo "antes" e direito "depois" com o mesmo enquadramento e a mesma luz, linha divisória fina, rótulos discretos nos cantos, cores consistentes entre os dois lados',
    en:'exact vertical split down the middle, "before" on the left and "after" on the right with the same framing and lighting, thin divider line, subtle corner labels, consistent color between both sides',
    evitar:'Nunca prometa resultado de saúde irreal — é infração e destrói a conta.' },

  { id:'beforeafter_pinterest', nome:'Print/Planner Mockup', en:'Print / Planner Mockup',
    forca:'media', nichos:['produtividade','financas','relacionamento','bebe'],
    porque:'A melhor forma de vender produto digital próprio: mostrar o arquivo como objeto físico na mão.',
    pt:'mockup de folha impressa sobre mesa clara ou segurada na mão, iPad/mesa digitalizadora com o template aberto, caneta e xícara ao lado, sombra realista, sensação de produto tangível',
    en:'mockup of the printed sheet on a light desk or held in hand, tablet with the template open, pen and coffee cup beside it, realistic shadow, tangible product feel',
    evitar:'Print no mockup precisa ficar legível — é a promessa visual do produto.' }
];

/* ---------------------------------------------------------------------------
   CHECKLISTS DE VALIDAÇÃO — usadas pelo motor de score do app
   peso: 3 = elimina (bloqueio), 2 = muito importante, 1 = desejável
   ------------------------------------------------------------------------- */
const CHECKS = {
  produto: [
    { id:'p1', peso:3, pt:'O produto resolve uma dor concreta e específica?', en:'Does it solve a concrete, specific pain?', dica:'"Organizar despensa pequena" > "ter uma vida melhor".' },
    { id:'p2', peso:3, pt:'Existe oferta afiliada aprovada e disponível hoje?', en:'Is there an approved affiliate offer available today?', dica:'Sem link aprovado, não existe projeto.' },
    { id:'p3', peso:3, pt:'O link direto é permitido pelo programa no Pinterest?', en:'Does the program allow direct linking on Pinterest?', dica:'Etsy, por exemplo, exige intermediação por blog.' },
    { id:'p4', peso:2, pt:'Comissão × preço gera pelo menos R$ 25 por venda?', en:'Does commission × price yield at least US$5 per sale?', dica:'Abaixo disso o volume necessário é brutal.' },
    { id:'p5', peso:2, pt:'O produto é legitimamente útil (você recomendaria para um amigo)?', en:'Is the product genuinely useful (would you recommend it to a friend)?', dica:'Queima de reputação mata contas no médio prazo.' },
    { id:'p6', peso:2, pt:'Existe busca no Pinterest para o tema (guided search retorna sugestões)?', en:'Is there Pinterest search demand for it?', dica:'Teste: digite o termo e veja se aparecem sugestões coloridas.' },
    { id:'p7', peso:2, pt:'O produto tem provas sociais (avaliações, vendas, reputação)?', en:'Does the product have social proof?', dica:'Evite oferta sem nenhum histórico — taxa de reembolso sobe.' },
    { id:'p8', peso:2, pt:'O produto é visual (dá uma imagem/demonstração óbvia)?', en:'Is the product visual (obvious image/demo)?', dica:'Pinterest é buscador visual. Produto invisível não performa.' },
    { id:'p9', peso:1, pt:'O ticket permite tráfego frio sem funil complexo?', en:'Does the price work with cold traffic?', dica:'R$ 27-197 é a faixa de impulse buy.' },
    { id:'p10', peso:1, pt:'Você consegue produzir 15-25 pins sobre este produto?', en:'Can you produce 15-25 pins around this product?', dica:'Se só dá 3 pins, o nicho é raso.' },
    { id:'p11', peso:1, pt:'A sazonalidade está a favor (ou o tema é evergreen)?', en:'Is seasonality in your favor (or evergreen)?', dica:'Publique sazonal 30-60 dias antes.' },
    { id:'p12', peso:1, pt:'Existe produto digital próprio complementar (upsell)?', en:'Is there a complementary own digital product?', dica:'Printables/templates aumentam o lucro por clique.' }
  ],
  visual: [
    { id:'v1', peso:3, pt:'Proporção 2:3 (1000×1500 px) em estático / 9:16 em vídeo?', en:'2:3 ratio (1000×1500) or 9:16 for video?', dica:'Quadrado perde 30-45% de distribuição.' },
    { id:'v2', peso:3, pt:'Título legível com 5 a 8 palavras em fonte bold?', en:'Title readable with 5-8 words in bold font?', dica:'+110% de cliques vs pin sem texto.' },
    { id:'v3', peso:2, pt:'Alto contraste real (testei no celular a 30% de brilho)?', en:'Real high contrast (tested on phone at 30% brightness)?', dica:'Teste do brilho baixo é obrigatório.' },
    { id:'v4', peso:2, pt:'Fundo claro ou tom quente (salvo se a estética exigir escuro)?', en:'Light or warm background (unless the aesthetic demands dark)?', dica:'+38% saves em fundo claro.' },
    { id:'v5', peso:2, pt:'Um único foco visual, sem poluição?', en:'Single visual focus, no clutter?', dica:'Lido em 0,3 segundo no thumbnail.' },
    { id:'v6', peso:2, pt:'Sem borda grossa e sem marca d´água de outra plataforma?', en:'No thick border and no other platform watermark?', dica:'Borda: -9% impressões. Marca d´água: penalização.' },
    { id:'v7', peso:2, pt:'Nada de "cara de IA" óbvia (mãos, dentes, texto torto)?', en:'No obvious AI look (hands, teeth, warped text)?', dica:'Pinners estão desligando conteúdo GenAI genérico.' },
    { id:'v8', peso:1, pt:'Texto dentro da área segura (não corta no feed)?', en:'Text inside safe area (not cropped in feed)?', dica:'Deixe 8-10% de margem.' },
    { id:'v9', peso:1, pt:'Paleta coerente com a marca/conta?', en:'Palette coherent with your brand/account?', dica:'Reconhecimento no feed aumenta o save.' },
    { id:'v10', peso:1, pt:'Nome do arquivo contém a keyword (não "imagem1.png")?', en:'Filename contains the keyword?', dica:'Pinterest lê o nome do arquivo.' }
  ],
  seo: [
    { id:'s1', peso:3, pt:'Existe uma keyword principal long-tail definida?', en:'Is there one long-tail primary keyword?', dica:'"organização de cozinha pequena" e não "casa".' },
    { id:'s2', peso:3, pt:'Título com 40 a 60 caracteres contendo a keyword?', en:'Title with 40-60 chars containing the keyword?', dica:'+67% impressões.' },
    { id:'s3', peso:2, pt:'Descrição natural de 2 a 4 linhas com a keyword e sinônimos?', en:'Natural 2-4 line description with keyword and synonyms?', dica:'Escreva para humano, não para robô.' },
    { id:'s4', peso:2, pt:'Alt text descritivo preenchido?', en:'Descriptive alt text filled?', dica:'Acessibilidade + ranking.' },
    { id:'s5', peso:2, pt:'Board de destino tem título e descrição com keyword?', en:'Destination board title/description has the keyword?', dica:'Pinterest indexa boards.' },
    { id:'s6', peso:2, pt:'Destino é relevante e casa com a promessa do pin?', en:'Destination matches the pin promise?', dica:'Quebra de promessa = queda de ranking.' },
    { id:'s7', peso:1, pt:'3 a 5 hashtags relevantes (não 30)?', en:'3-5 relevant hashtags (not 30)?', dica:'Hashtag hoje pesa ~1%. Keyword pesa muito mais.' },
    { id:'s8', peso:1, pt:'Keyword também no nome do arquivo e no texto do overlay?', en:'Keyword also in filename and overlay text?', dica:'Sinal multiplicado.' },
    { id:'s9', peso:1, pt:'Pin é "fresh" (imagem inédita) para o mesmo link?', en:'Pin is fresh (new image) for the same link?', dica:'Maior alavancador de alcance em 2026.' },
    { id:'s10', peso:1, pt:'Pelo menos 72h entre pins do mesmo link?', en:'At least 72h between pins for the same link?', dica:'Evita o filtro de spam.' }
  ],
  compliance: [
    { id:'c1', peso:3, pt:'A descrição deixa claro que é conteúdo com link de afiliado?', en:'Description discloses affiliate link?', dica:'"Contém link de afiliado" / "#ad #affiliate".' },
    { id:'c2', peso:3, pt:'A página de destino também tem o aviso de afiliado antes do primeiro link?', en:'Landing page also discloses before the first link?', dica:'Exigência de transparência (Pinterest + CDC/FTC).' },
    { id:'c3', peso:3, pt:'Nenhum link encurtado (bit.ly, tinyurl) sendo usado?', en:'No shortened links (bit.ly, tinyurl)?', dica:'Pinterest bloqueia encurtador — sinal de spam.' },
    { id:'c4', peso:2, pt:'Nenhuma promessa de resultado irreal (saúde, dinheiro, prazo)?', en:'No unrealistic result claims?', dica:'Infração e risco jurídico.' },
    { id:'c5', peso:2, pt:'O produto não é de categoria proibida (arma, tabaco, adulto, aposta)?', en:'Not a prohibited category?', dica:'Veta a conta inteira.' },
    { id:'c6', peso:2, pt:'Você tem direito de uso comercial das imagens geradas por IA?', en:'Do you have commercial rights to the AI images?', dica:'Verifique a licença da ferramenta grátis.' },
    { id:'c7', peso:2, pt:'Não estou usando foto de marca/pessoa sem autorização?', en:'No unauthorized brand/person photo?', dica:'Risco de DMCA e derrubada de perfil.' },
    { id:'c8', peso:1, pt:'Não estou copiando pin de concorrente 1:1?', en:'Not copying a competitor pin 1:1?', dica:'Use referência, não cópia.' },
    { id:'c9', peso:1, pt:'Conta é business, com perfil e site consistentes?', en:'Business account, consistent profile and site?', dica:'Confiança do algoritmo e acesso a analytics.' },
    { id:'c10', peso:1, pt:'Volume diário abaixo do limite de segurança (≤150 links/dia, ideal 3-5 pins)?', en:'Daily volume under safe limits?', dica:'Excesso de links afiliados é padrão de spam.' }
  ]
};

/* ---------------------------------------------------------------------------
   ROTINA — 30 dias, 3 blocos, tarefa por dia
   ------------------------------------------------------------------------- */
const ROTINA_30 = [
  { d:1,  fase:'Fundação', tarefa:'Criar/converter conta para Business e reivindicar (claim) seu site ou perfil' },
  { d:2,  fase:'Fundação', tarefa:'Escrever bio com keyword + link; criar 5 boards temáticos com título/descrição otimizados' },
  { d:3,  fase:'Pesquisa', tarefa:'Rodar o Prompt 1 (Máquina de Nichos) e escolher 3 nichos candidatos' },
  { d:4,  fase:'Pesquisa', tarefa:'Validar demanda dos 3 nichos no Pinterest Trends e na busca guiada' },
  { d:5,  fase:'Pesquisa', tarefa:'Levantar 5-10 ofertas (afiliado ou produto próprio) para o nicho vencedor' },
  { d:6,  fase:'Validação', tarefa:'Rodar a Validação de Produto (12 critérios) e escolher 1 oferta principal + 2 secundárias' },
  { d:7,  fase:'Validação', tarefa:'Cadastrar-se no programa de afiliado e gerar o link rastreável' },
  { d:8,  fase:'Ângulos', tarefa:'Rodar o Prompt 2: 1 keyword → 10 ângulos de pin' },
  { d:9,  fase:'Ângulos', tarefa:'Rodar o Prompt 3 para os 10 ângulos e montar a planilha de temas' },
  { d:10, fase:'Visual', tarefa:'Rodar o Prompt 4 (Visual) para os 5 melhores ângulos; escolher 2 estilos fixos de conta' },
  { d:11, fase:'Produção', tarefa:'Gerar as 10 primeiras imagens de pin (grátis) e selecionar 5' },
  { d:12, fase:'Produção', tarefa:'Montar 5 pins no Canva com overlay (5-8 palavras) e exportar em 1000×1500' },
  { d:13, fase:'Publicação', tarefa:'Publicar 5 pins em 5 boards diferentes; anotar horário' },
  { d:14, fase:'Produção', tarefa:'Rodar o Prompt 5 (página de destino) e criar a página/artigo com o aviso de afiliado' },
  { d:15, fase:'Publicação', tarefa:'Publicar 5 pins novos apontando para a página; conferir todos os links (zero erro 404)' },
  { d:16, fase:'Métricas', tarefa:'Primeira leitura: impressões, saves e cliques. Identificar o pin com melhor CTR de saída' },
  { d:17, fase:'Produção', tarefa:'Criar 4 variações do pin vencedor (outro estilo, outro título, outro fundo)' },
  { d:18, fase:'Produção', tarefa:'Rodar o Prompt 6 (roteiro de vídeo 15s) e gravar/gerar 1 video pin' },
  { d:19, fase:'Publicação', tarefa:'Publicar 5 pins + 1 video pin; fixar o melhor pin no topo do board principal' },
  { d:20, fase:'Escala', tarefa:'Rodar o Prompt 7 (carrossel) e montar 3 carrosséis de 5 slides' },
  { d:21, fase:'Métricas', tarefa:'Diagnóstico de funil: onde está o vazamento (impressão→clique ou clique→conversão)?' },
  { d:22, fase:'Produção', tarefa:'Criar o produto digital próprio complementar (printable/template) usando o Prompt 8' },
  { d:23, fase:'Publicação', tarefa:'Publicar 5 pins apontando para o produto próprio (margem 100%)' },
  { d:24, fase:'Métricas', tarefa:'Auditar os 10 melhores pins: o que eles têm em comum (estilo, cor, verbo, formato)?' },
  { d:25, fase:'Escala', tarefa:'Lote do dia: gerar 20 imagens + 20 títulos usando a mesma ficha de oferta' },
  { d:26, fase:'Escala', tarefa:'Agendar a semana (nativo do Pinterest, Metricool grátis ou Buffer grátis)' },
  { d:27, fase:'Compliance', tarefa:'Revisar todos os avisos de afiliado, links e categorias proibidas (checklist de risco)' },
  { d:28, fase:'Otimização', tarefa:'Reescrever título e descrição dos 5 pins com pior desempenho (não apague, reescreva)' },
  { d:29, fase:'Otimização', tarefa:'Duplicar a página de destino para o segundo melhor ângulo e testar novo CTA' },
  { d:30, fase:'Decisão', tarefa:'Fechar o relatório do mês: pins publicados, cliques, vendas, comissão. Decidir: escalar, pivotar de ângulo ou trocar de oferta' }
];

/* ---------------------------------------------------------------------------
   MÉTRICAS — o que medir e o que significa cada resultado
   ------------------------------------------------------------------------- */
const METRICAS_GUIA = [
  { kpi:'Impressões', meta:'crescendo semana contra semana', leitura:'Se estagnou: publique mais pins frescos (não repin).' },
  { kpi:'CTR de saída (cliques/impressões)', meta:'0,3% a 1%+', leitura:'Baixo = problema de promessa/visual. Alto = pin bom, problema é a oferta.' },
  { kpi:'Saves / 1k impressões', meta:'5+ (estático)', leitura:'Alto save e pouco clique = conteúdo ótimo, mas CTA fraco.' },
  { kpi:'Cliques de saída', meta:'crescendo em 30 dias', leitura:'Se sobe e não vende: revise a página de destino e a oferta.' },
  { kpi:'Conversão (vendas/cliques)', meta:'≥0,5% a 2%', leitura:'Abaixo: destino desalinhado, preço errado ou público errado.' },
  { kpi:'Receita por 1.000 impressões (RPM)', meta:'comparar entre pins', leitura:'É o número que decide o que escalar — ignore likes.' },
  { kpi:'Vida útil do pin', meta:'3 a 6 meses', leitura:'Pins com clique no mês 3 valem mais que virais de 2 dias.' },
  { kpi:'Taxa de pins "mortos"', meta:'aceitar ~70-80%', leitura:'O top 1% dos pins gera >50% dos resultados. Volume é a estratégia.' }
];

if (typeof window !== 'undefined') {
  window.PM_DADOS = { BM, NICHOS, OFERTAS, ESTILOS, CHECKS, ROTINA_30, METRICAS_GUIA };
}
