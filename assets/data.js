/* =========================================================================
   BlogMaster — Copiloto de Afiliados (Gringa)
   Base de conhecimento estática. Tudo aqui é editável: ajuste os números
   conforme a realidade da sua conta / oferta.
   SNAPSHOT de referência: nov/2026. Métricas de oferta mudam toda semana.
   ========================================================================= */
window.BM_DATA = {

  meta: {
    versao: "1.0",
    snapshot: "2026-11-04",
    aviso: "Métricas de oferta (gravity, EPC, APV, CVR) são referência de mercado e mudam semanalmente. Sempre confirme no painel da rede antes de investir."
  },

  /* ------------------------------------------------------------------ */
  nichos: [
    { id: "nutra",     nome: "Nutra / Saúde",              riscoGoogle: "alto",   riscoMeta: "alto",   observacao: "Claims de saúde são o maior gatilho de reprovação. Exige presell educativa, sem promessa de cura, sem before/after." },
    { id: "financas",  nome: "Finanças / Renda",           riscoGoogle: "alto",   riscoMeta: "medio",  observacao: "Google exige transparência total de custos e evidência. Meta limita 'ganhos rápidos'. Prova social real é obrigatória." },
    { id: "espiritual",nome: "Espiritualidade / Manifestação", riscoGoogle: "alto", riscoMeta: "medio", observacao: "Funciona muito em native e YouTube. Em search/display o CTR é alto mas a qualidade do clique é baixa." },
    { id: "sobrevivencia", nome: "Sobrevivência / DIY",    riscoGoogle: "medio",  riscoMeta: "baixo",  observacao: "Público masculino 40+, excelente em native e YouTube. Ticket médio baixo, volume alto." },
    { id: "pets",      nome: "Pets",                       riscoGoogle: "baixo",  riscoMeta: "baixo",  observacao: "Nicho mais 'safe' do momento em política de anúncio. Presell com storytelling converte muito." },
    { id: "relacionamento", nome: "Relacionamento",        riscoGoogle: "medio",  riscoMeta: "alto",   observacao: "Meta trata como sensível (pessoal). Evite 'você é traído?'. Use ângulo educativo." },
    { id: "software",  nome: "Software / SaaS / IA",       riscoGoogle: "baixo",  riscoMeta: "baixo",  observacao: "Comissões recorrentes e aprovação fácil. Melhor nicho para quem quer previsibilidade." },
    { id: "ecom",      nome: "E-commerce / Gadgets",       riscoGoogle: "baixo",  riscoMeta: "medio",  observacao: "Ideal para Performance Max e catálogo. Exige feed limpo e preço consistente." },
    { id: "educacao",  nome: "Educação / Idiomas / Concursos", riscoGoogle: "baixo", riscoMeta: "baixo", observacao: "Público quente, boa margem, remarketing performa bem." }
  ],

  /* ------------------------------------------------------------------ */
  /* CATÁLOGO DE OFERTAS — mercado gringo (ClickBank / Digistore24 / BuyGoods)
     Campos:
     rede, nicho, geo, comissao (USD médio por venda), apv (average payout value),
     epc (earnings per click do hop), cvr (hop conversion rate %), gravity,
     aprovacao (precisa aprovação?), trafego (canais que historicamente performam),
     risco (0-10 de risco de compliance), presell (0-10 quão bem aceita presell),
     nota_fonte (de onde veio o número)                                       */
  produtos: [
    { nome: "The Brain Song", rede: "ClickBank", nicho: "espiritual", geo: "US/CA/UK/AU", comissao: 53, apv: 52.71, epc: 0.29, cvr: 0.56, gravity: 184, aprovacao: true, trafego: ["native", "youtube", "email"], risco: 7, presell: 8, fonte: "ClickBank Top Offers / cbhive (mai-2026)" },
    { nome: "The Genius Song", rede: "ClickBank", nicho: "espiritual", geo: "US/CA", comissao: 53, apv: 52.99, epc: 0.92, cvr: 1.72, gravity: 127, aprovacao: true, trafego: ["seo", "native", "email"], risco: 7, presell: 8, fonte: "ClickBank Top Offers (mai-2026) — EPC mais alto da lista" },
    { nome: "ProDentim", rede: "ClickBank", nicho: "nutra", geo: "US/CA/AU", comissao: 160, apv: 160.01, epc: 0.73, cvr: 0.55, gravity: 96, aprovacao: false, trafego: ["native", "meta", "email"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (jul-2026)" },
    { nome: "ProstaVive", rede: "BuyGoods", nicho: "nutra", geo: "US", comissao: 136, apv: 135.66, epc: 0.90, cvr: 0.88, gravity: 266, aprovacao: true, trafego: ["native", "email", "youtube"], risco: 8, presell: 7, fonte: "cbhive top gravity (2026)" },
    { nome: "Mitolyn", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 139, apv: 138.70, epc: 1.71, cvr: 1.78, gravity: 116, aprovacao: true, trafego: ["native", "meta"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (jul-2026)" },
    { nome: "Liv Pure", rede: "ClickBank", nicho: "nutra", geo: "US/CA", comissao: 175, apv: 174.81, epc: 0.80, cvr: 0.46, gravity: 150, aprovacao: false, trafego: ["native", "email", "yt"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (2026)" },
    { nome: "Java Burn", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 130, apv: 130.00, epc: 0.65, cvr: 0.50, gravity: 278, aprovacao: false, trafego: ["native", "email"], risco: 8, presell: 7, fonte: "Referência de mercado (gravity ~278)" },
    { nome: "Joint Genesis", rede: "ClickBank", nicho: "nutra", geo: "US/CA/UK", comissao: 133, apv: 133.47, epc: 3.50, cvr: 0.90, gravity: 114, aprovacao: false, trafego: ["native", "seo"], risco: 8, presell: 8, fonte: "Vendor declara EPC US$3-5 em funil otimizado" },
    { nome: "Quietum Plus", rede: "ClickBank", nicho: "nutra", geo: "US/CA", comissao: 118, apv: 118.21, epc: 0.70, cvr: 0.64, gravity: 107, aprovacao: false, trafego: ["native", "email"], risco: 8, presell: 7, fonte: "cbhive (2026)" },
    { nome: "PawBiotix", rede: "BuyGoods", nicho: "pets", geo: "US", comissao: 132, apv: 132.08, epc: 1.95, cvr: 1.68, gravity: 60, aprovacao: false, trafego: ["meta", "native", "email"], risco: 4, presell: 9, fonte: "BuyGoods top offers (2026)" },
    { nome: "All Day Slimming Tea", rede: "BuyGoods", nicho: "nutra", geo: "US", comissao: 149, apv: 148.70, epc: 1.03, cvr: 0.69, gravity: 70, aprovacao: false, trafego: ["meta", "native"], risco: 8, presell: 7, fonte: "BuyGoods top offers (2026)" },
    { nome: "YU Sleep", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 155, apv: 155.26, epc: 0.56, cvr: 0.37, gravity: 98, aprovacao: true, trafego: ["email", "native", "yt", "meta"], risco: 8, presell: 8, fonte: "ClickBank Top Offers (jul-2026)" },
    { nome: "FemiCore", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 145, apv: 145.00, epc: 0.85, cvr: 0.70, gravity: 90, aprovacao: true, trafego: ["native", "meta"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (jul-2026)" },
    { nome: "CitrusBurn", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 140, apv: 140.00, epc: 0.90, cvr: 0.75, gravity: 85, aprovacao: false, trafego: ["meta", "native"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (set-2026)" },
    { nome: "The Lost Generator", rede: "ClickBank", nicho: "sobrevivencia", geo: "US", comissao: 44, apv: 44.46, epc: 0.60, cvr: 1.55, gravity: 135, aprovacao: false, trafego: ["native", "youtube"], risco: 5, presell: 9, fonte: "ClickBank Top Offers (CVR 1.55%)" },
    { nome: "Energy Revolution System", rede: "ClickBank", nicho: "sobrevivencia", geo: "US", comissao: 49, apv: 49.36, epc: 0.55, cvr: 1.18, gravity: 146, aprovacao: false, trafego: ["native", "yt"], risco: 5, presell: 9, fonte: "ClickBank Top Offers (2026)" },
    { nome: "Primera", rede: "ClickBank", nicho: "educacao", geo: "US", comissao: 139, apv: 138.70, epc: 1.06, cvr: 0.87, gravity: 40, aprovacao: true, trafego: ["meta", "email"], risco: 6, presell: 6, fonte: "ClickBank Top Offers (2026)" },
    { nome: "NewEra Protect", rede: "ClickBank", nicho: "nutra", geo: "US", comissao: 157, apv: 156.92, epc: 0.95, cvr: 0.80, gravity: 39, aprovacao: true, trafego: ["native"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (até 90% comissão)" },
    { nome: "Audifort", rede: "ClickBank", nicho: "nutra", geo: "US/CA", comissao: 154, apv: 154.30, epc: 0.75, cvr: 0.60, gravity: 69, aprovacao: false, trafego: ["native", "seo"], risco: 8, presell: 7, fonte: "ClickBank Top Offers (65% revshare)" },
    { nome: "The Memory Wave", rede: "ClickBank", nicho: "espiritual", geo: "US", comissao: 54, apv: 54.23, epc: 0.58, cvr: 1.09, gravity: 77, aprovacao: true, trafego: ["seo", "native"], risco: 6, presell: 8, fonte: "ClickBank Top Offers (2026)" },
    { nome: "Moon Reading", rede: "ClickBank", nicho: "espiritual", geo: "US/UK", comissao: 40, apv: 40.00, epc: 0.45, cvr: 1.20, gravity: 55, aprovacao: false, trafego: ["meta", "email"], risco: 5, presell: 8, fonte: "ClickBank Top Offers (upsell no funil)" }
  ],

  /* ------------------------------------------------------------------ */
  /* BLUEPRINTS — arquétipos de campanha que a indústria já validou.
     Cada um: quando usar, estrutura, números de referência, passos, erros. */
  blueprints: [
    {
      id: "display-custom-intent",
      nome: "Display — Custom Intent (o 'display de afiliado' de verdade)",
      canal: "Google Display",
      dificuldade: "Médio",
      quando: "Você tem presell própria e quer tráfego frio com intenção de compra, não display cego por interesse.",
      ofertasIdeais: ["software", "pets", "educacao", "sobrevivencia"],
      budget: { teste: "US$ 20–30/dia por campanha", validacao: "US$ 50–80/dia", escala: "US$ 150+/dia" },
      kpis: [
        ["CPC aceitável", "US$ 0,10 – 0,45"],
        ["CTR display", "0,4% – 1,2%"],
        ["CVR presell → oferta", "15% – 35%"],
        ["RPC (receita por clique)", "> 1,3 × CPC"],
        ["Cliques para 1ª leitura", "150–300"]
      ],
      estrutura: [
        "1 campanha por oferta + geo (nunca misture ofertas na mesma campanha)",
        "1 grupo de anúncios por ANgULO (medo, prova, mecanismo único, comparação)",
        "Custom Segment com 15–30 termos de intenção (use a ferramenta de Keyword do app)",
        "Segmentação combinada: Custom Intent + Remarketing (OR), nunca 'in-market genérico' sozinho",
        "Camada de exclusões obrigatória: apps móveis, canais infantis, placements de baixa qualidade"
      ],
      passos: [
        "Compre domínio próprio + hospedagem (HostGator/Hostinger/Cloudflare Pages). Nunca use subdomínio de produtor.",
        "Suba a presell com Política de Privacidade, Termos, Contato e DISCLOSURE DE AFILIADO visível (exigência FTC).",
        "Instale GA4 + tag de conversão do Google Ads na presell (evento: clique no botão de saída e/ou scroll 75%).",
        "Monte o Custom Segment com termos que o comprador digita: '[produto] reviews', 'best X for Y', 'X side effects', 'X vs Z'.",
        "Crie a campanha Display com lances 'Conversões' (tCPA 0 na fase 1 — deixe o Google aprender 7 dias).",
        "Substitua a presell a cada 2 criativos reprovados; mantenha 1 página por ângulo.",
        "Semana 2: corte placements com >2.000 impressões e 0 clique; adicione os top 20 placements como 'targeting' na campanha de escala.",
        "Semana 3+: tCPA = CPA real × 1,3. Se o tCPA não entregar, volte para Maximizar cliques e mexa no criativo."
      ],
      erros: [
        "Apontar o anúncio direto para o link de afiliado (a URL muda no redirect → reprovação 'Destino não correspondeu' e risco de bloqueio).",
        "Usar 'in-market' genérico como única segmentação: CPC baixo, zero intenção.",
        "Deixar 'apps móveis' e 'tipos de dispositivos desconhecidos' ativos: é onde o dinheiro some.",
        "Mesma presell para todos os ângulos: mata o aprendizado da conta."
      ],
      gate: "Se após 300 cliques o RPC < 0,8 × CPC, mate o ângulo (não a oferta) e teste outro ângulo antes de trocar de produto."
    },
    {
      id: "display-remarketing",
      nome: "Display — Remarketing em 3 camadas (a campanha que salva o ROI)",
      canal: "Google Display",
      dificuldade: "Fácil",
      quando: "Sempre. É a única forma de recuperar quem visitou sem comprar — o produtor não faz isso por você.",
      ofertasIdeais: ["*"],
      budget: { teste: "US$ 10/dia", validacao: "US$ 20–40/dia", escala: "proporcional ao funil frio" },
      kpis: [["CPC", "US$ 0,05 – 0,20"], ["CVR", "2× a do tráfego frio"], ["Frequência", "3–7 por usuário/7 dias"], ["ROAS alvo", "1,5 – 3,0"]],
      estrutura: [
        "Camada 1 — 'Leu e saiu' (visitou presell, não clicou no botão, 7 dias)",
        "Camada 2 — 'Clicou e não comprou' (clicou no link de afiliado, 14 dias) — o público mais quente que existe",
        "Camada 3 — 'Semelhante aos compradores' (lista de compradores do produtor, se ele fornecer; senão Lookalike de camada 2)"
      ],
      passos: [
        "Crie 3 audiências no GA4/Ads por evento, com duração 7 / 14 / 30 dias.",
        "Crie a campanha 'RMK — [oferta]' com lance tCPA agressivo (CPA real × 1,1).",
        "Camada 2 recebe criativo de OBJEÇÃO ('ainda em dúvida? veja o que muda em 30 dias') e não de desconto (o preço é do produtor).",
        "Exclua compradores convertidos (lista de exclusão) para não queimar verba.",
        "Limite frequência com 'Frequência de impressão' ou orçamento compartilhado; fadiga em remarketing é rápida."
      ],
      erros: ["Deixar as 3 camadas no mesmo grupo (a camada 2 paga pelo erro da 1)", "Não excluir quem já comprou", "Falar de preço: você não controla o preço do produtor."],
      gate: "Remarketing com RPC > CPC em 7 dias = sinal verde para escalar o frio. Sem isso, escalar frio é queimar dinheiro."
    },
    {
      id: "search-marca",
      nome: "Search — Marca do produtor + 'review' (intenção máxima, CPC baixo)",
      canal: "Google Search",
      dificuldade: "Fácil",
      quando: "A oferta tem demanda de busca (nome do produto com volume) e você quer a conversão mais barata da conta.",
      ofertasIdeais: ["nutra", "espiritual", "sobrevivencia", "software"],
      budget: { teste: "US$ 10–15/dia", validacao: "US$ 30/dia", escala: "US$ 80+/dia" },
      kpis: [["CPC", "US$ 0,15 – 0,80"], ["CTR", "4% – 12%"], ["CVR presell → oferta", "25% – 45%"], ["CPC máx.", "RPC ÷ 3"]],
      estrutura: [
        "Grupo 1 — marca exata ('produto', 'produto oficial', 'produto site') → presell de review",
        "Grupo 2 — marca + intenção ('produto funciona?', 'produto reclame aqui / complaints', 'produto vs concorrente')",
        "Grupo 3 — problema ('como [resultado] sem [dor]') → presell educativa",
        "Negativas: 'grátis', 'pdf', 'torrent', 'download', 'gratis', 'scam', termos de emprego"
      ],
      passos: [
        "Verifique política: anunciar termo de marca de terceiros é permitido no Google em vários casos, mas o criativo não pode se passar pelo produtor.",
        "Nunca use o nome do produtor como nome de exibição nem no domínio da presell (risco de marca registrada).",
        "Use o modificador 'review', 'análise', 'funciona mesmo', 'antes de comprar' nas headlines.",
        "Página de destino: comparativo honesto com prós/contras — é o formato com melhor CVR nesse arquétipo.",
        "Se o produtor reclamar, você tem 48h para pausar; deixe isso claro no seu checklist de relacionamento com o vendor."
      ],
      erros: ["Prometer o que o produtor não entrega (a página do produtor muda sem aviso)", "Usar o nome da marca no domínio", "Deixar termos genéricos amplos ativos sem negativas."],
      gate: "Search marca com CVR > 25% e RPC > 2× CPC paga a operação. Use o lucro dele para financiar o display."
    },
    {
      id: "demandgen-youtube",
      nome: "Demand Gen / YouTube in-stream (vídeo próprio = escala)",
      canal: "Google Demand Gen (YouTube, Discover, Gmail)",
      dificuldade: "Alto",
      quando: "Você tem VSL/vídeo próprio de 30–90s e quer escala com CPM baixo para ofertas de ticket alto.",
      ofertasIdeais: ["nutra", "espiritual", "sobrevivencia", "financas"],
      budget: { teste: "US$ 30–50/dia", validacao: "US$ 100/dia", escala: "US$ 300+/dia" },
      kpis: [["CPV", "US$ 0,01 – 0,04"], ["CTR", "1% – 3%"], ["View rate (in-stream)", "20% – 40%"], ["CVR presell", "8% – 20%"]],
      estrutura: [
        "1 campanha Demand Gen por oferta, 3 grupos (público: custom segment / lookalike / remarketing)",
        "3–5 criativos de vídeo com HOOKS diferentes nos 3 primeiros segundos",
        "Vídeo 1: mecanismo único | Vídeo 2: história/antes-depois (sem promessa clínica) | Vídeo 3: comparação | Vídeo 4: prova social",
        "Sempre vídeo próprio na presell — não faça ponte para o VSL do produtor sem conteúdo seu."
      ],
      passos: [
        "Roteiro 60s: 0-3s hook visual + promessa específica; 3-15s problema; 15-40s mecanismo; 40-55s prova; 55-60s CTA para a presell.",
        "Gere variações de hook com IA, mas grave com o mesmo corpo: o hook é 80% do resultado.",
        "Suba 5 criativos, deixe rodar 72h, mate os que tiverem CTR < 0,8% com > 5.000 impressões.",
        "Use 'Maximizar conversões' sem tCPA na fase 1; tCPA só depois de 30 conversões.",
        "Coloque na presell um player de vídeo próprio (não o do produtor) — o remarketing de vídeo é ouro."
      ],
      erros: ["Roubar o VSL do produtor (violação de direito autoral + política de conteúdo duplicado)", "Hook genérico ('você sabia que...')", "Mixar ofertas na mesma campanha e culpar o canal."],
      gate: "Custo por clique na presell (CPC do vídeo) < 30% do RPC esperado. Senão, o problema é o hook, não a oferta."
    },
    {
      id: "native",
      nome: "Native Ads (Taboola / Outbrain / MGID) — o canal clássico de VSL",
      canal: "Native",
      dificuldade: "Médio",
      quando: "Ofertas de VSL longa, ticket alto, público 45+; é o habitat natural de nutra/espiritual/sobrevivência.",
      ofertasIdeais: ["nutra", "espiritual", "sobrevivencia"],
      budget: { teste: "US$ 50/dia (mínimo prático das redes)", validacao: "US$ 150/dia", escala: "US$ 500+/dia" },
      kpis: [["CPC", "US$ 0,08 – 0,35"], ["CTR", "0,5% – 1,5%"], ["CVR presell", "10% – 25%"], ["RPC alvo", "> 1,5 × CPC"]],
      estrutura: [
        "Campanha por geo + dispositivo (mobile e desktop performam MUITO diferente)",
        "5–10 criativos de imagem (thumbnail é 90% do CTR) por ângulo",
        "Presell no formato advertorial (parece artigo, é anúncio identificado) — o formato que mais converte em native",
        "White/blacklist de sites obrigatória na semana 2"
      ],
      passos: [
        "Regra de ouro: nunca use a página do produtor como destino; o native exige conteúdo editorial seu.",
        "Thumbnail: rosto humano curioso + objeto estranho; sem texto queimado exagerado (reprova em revisão).",
        "Headline native: curiosidade + especificidade ('Ele misturou 3 ingredientes e o resultado surpreendeu os médicos' → cuidado com claim médico).",
        "Rode 3 dias com lance CPC fixo, corte criativos com CTR < 0,4%.",
        "Semana 2: extraia os 20 melhores sites e crie campanha 'whitelist only' com lance maior.",
        "Peça ao vendor materiais de claim aprovados: usar claim não aprovado = perda de conta."
      ],
      erros: ["Escalar em native sem whitelist (o volume vem de sites ruins)", "Não separar mobile/desktop", "Usar presell sem disclosure de anúncio."],
      gate: "Se o custo por venda em native > 60% da comissão por 3 dias, ajuste a presell antes de aumentar orçamento."
    },
    {
      id: "meta-advantage",
      nome: "Meta Ads — Advantage+ com criativo UGC (volume e escala)",
      canal: "Meta (Facebook/Instagram)",
      dificuldade: "Médio",
      quando: "Oferta com prova visual/emocional e ângulo de história; volume grande de criativo é o motor.",
      ofertasIdeais: ["pets", "educacao", "software", "nutra"],
      budget: { teste: "US$ 30/dia (CBO)", validacao: "US$ 80/dia", escala: "US$ 250+/dia" },
      kpis: [["CPM", "US$ 8 – 25"], ["CTR (link)", "0,8% – 2,5%"], ["CPC", "US$ 0,30 – 1,20"], ["CVR presell", "10% – 30%"]],
      estrutura: [
        "1 campanha CBO, 1 conjunto amplo (público aberto), 4–8 criativos",
        "Evento de conversão: 'Lead' ou 'ViewContent' na presell + 'Purchase' se houver pixel do produtor",
        "Criativos: UGC 30s (pessoa falando), demonstração, print de comentários, antes/depois SÓ se a política permitir"
      ],
      passos: [
        "Instale pixel próprio na presell e envie evento com valor (value = comissão estimada) para o algoritmo otimizar receita.",
        "Escreva 5 hooks diferentes para o MESMO corpo de vídeo; teste hook antes de testar público.",
        "Deixe CBO rodar 3 dias sem editar (edição reinicia aprendizado).",
        "Regra de corte: gastou 1× a comissão sem venda → mata o criativo.",
        "Escale 20% a cada 2–3 dias, nunca 2× de uma vez.",
        "Use o Meta Ad Library para ver o que já roda há 30+ dias nos concorrentes: anúncio antigo = anúncio lucrativo."
      ],
      erros: ["Misturar públicos frios e remarketing no mesmo conjunto", "Reclamar de saúde/peso no criativo (reprovação)", "Trocar o criativo antes de 3 dias."],
      gate: "Com 3× a comissão gastos e CVR acima da média do nicho, escale. Abaixo disso, troque o hook."
    },
    {
      id: "bing-ads",
      nome: "Microsoft Ads (Bing) — a aprovação fácil e o CPC barato",
      canal: "Microsoft Advertising",
      dificuldade: "Fácil",
      quando: "Você quer validar a oferta com risco baixo de reprovação e público 45+ (que é o público de nutra/finance).",
      ofertasIdeais: ["nutra", "financas", "software", "educacao"],
      budget: { teste: "US$ 10–20/dia", validacao: "US$ 40/dia", escala: "US$ 100+/dia" },
      kpis: [["CPC", "30%–60% menor que Google"], ["CTR", "3% – 8%"], ["CVR", "parecida ou melhor que Google em 45+"]],
      estrutura: [
        "Importe a campanha do Google Ads (a Microsoft tem importador nativo — copia keywords, negativas e extensões)",
        "Ajuste lances: comece 20% abaixo do Google e suba conforme CVR",
        "Use 'públicos de remarketing' importados do UET"
      ],
      passos: [
        "Crie a conta com o mesmo domínio da presell e verifique o site (verificação obrigatória de anunciante).",
        "Importe do Google Ads e revise as negativas (a importação às vezes perde).",
        "Ative 'Campanhas de compras' só se houver feed.",
        "Bing tem menos volume: espere 5–7 dias por significância estatística."
      ],
      erros: ["Esperar volume de Google", "Não ativar a verificação de anunciante (conta fica limitada)"],
      gate: "Se Bing converter com RPC > CPC, use esses dados para justificar escala no Google."
    },
    {
      id: "email-seo",
      nome: "Email + SEO/parasita (o caixa sem tráfego pago)",
      canal: "Email / Orgânico",
      dificuldade: "Médio",
      quando: "Você quer construir ativo próprio e não depender 100% de mídia paga (o que protege contra bloqueio de conta).",
      ofertasIdeais: ["*"],
      budget: { teste: "US$ 0–50/mês (ferramenta)", validacao: "tempo", escala: "tempo" },
      kpis: [["Open rate", "35% – 55%"], ["CTR", "3% – 8%"], ["Conversão por 1.000 envios", "1–5 vendas em lista quente"]],
      estrutura: [
        "Isca digital na presell (checklist/PDF) → captura de e-mail → sequência de 5 e-mails",
        "E-mail 1: entrega da isca | 2: história/mecanismo | 3: prova | 4: objeções | 5: oferta + prazo",
        "Parasita SEO: reviews em Medium, Reddit, Quora, blogs convidados com link para a SUA presell"
      ],
      passos: [
        "Use Brevo/MailerLite (grátis até alguns milhares) e autentique domínio (SPF/DKIM).",
        "Nunca envie link de afiliado cru em e-mail: use sua presell (obrigatório nas principais redes e melhor para rastreio).",
        "Escreva 1 review longo por produto-alvo, com prós e contras reais, tabela comparativa e disclosure.",
        "Publique 2 reviews/semana em plataformas parasita e 1 no seu domínio.",
        "Remarketing de e-mail: reenvie para quem clicou e não comprou em 72h."
      ],
      erros: ["Comprar lista", "Link direto de afiliado no e-mail", "Review sem disclosure (FTC)"],
      gate: "1 review indexado com tráfego orgânico > 50 visitas/mês já paga a operação a longo prazo."
    }
  ],

  /* ------------------------------------------------------------------ */
  canais: [
    ["Display (GDN)", "frio com intenção", "baixo", "custom intent + presell", "Alto risco se link direto"],
    ["Search", "intenção máxima", "médio", "marca, review, problema", "Melhor CVR"],
    ["Performance Max", "escala via feed", "alto", "só com catálogo próprio", "Pouco controle para afiliado"],
    ["Demand Gen / YouTube", "descoberta", "médio", "vídeo próprio", "Escala com CPM baixo"],
    ["Native", "frio VSL", "médio", "advertorial", "Melhor habitat de nutra"],
    ["Meta Ads", "história/UGC", "médio", "Advantage+ CBO", "Volume de criativo"],
    ["TikTok Ads", "público 25-40", "baixo", "UGC nativo", "Ticket baixo converte mais"],
    ["Microsoft Ads", "45+", "baixo", "importar do Google", "Aprovação fácil"],
    ["Pinterest", "nicho feminino/DIY", "baixo", "pins para review", "CVR baixa, CPC baixo"],
    ["Reddit Ads", "nicho técnico/software", "baixo", "thread-style", "Comunidade hostil a anúncio"],
    ["E-mail", "lista própria", "alto (ativo)", "sequência 5 e-mails", "Ativo que ninguém tira de você"],
    ["SEO/parasita", "longo prazo", "alto (ativo)", "review + comparativo", "Composta"]
  ],

  /* ------------------------------------------------------------------ */
  arsenalGithub: [
    { repo: "amekala/ads-mcp", url: "https://github.com/amekala/ads-mcp", stars: "106", o_que: "MCP server com 100+ ferramentas para criar/analisar campanhas no Google, Meta, LinkedIn e TikTok Ads.", como: "Conecte ao Claude/Cursor/ChatGPT e peça auditoria e criação de campanhas por linguagem natural.", categoria: "Operação" },
    { repo: "irinabuht12-oss/google-ads-meta-ads-mcp", url: "https://github.com/irinabuht12-oss/google-ads-meta-ads-mcp", stars: "6.9k", o_que: "MCP hospedado com Google Ads + Meta Ads + GA4 + Search Console juntos.", como: "Bom ponto de partida se você não quer hospedar nada.", categoria: "Operação" },
    { repo: "googleads/google-ads-python", url: "https://github.com/googleads/google-ads-python", stars: "760", o_que: "Biblioteca oficial da Google Ads API em Python.", como: "Base para relatórios automáticos, regras de lance e alertas (o caminho 'profissional').", categoria: "Operação" },
    { repo: "Brainlabs-Digital/Google-Ads-Scripts", url: "https://github.com/Brainlabs-Digital/Google-Ads-Scripts", stars: "165", o_que: "Scripts prontos de agência (n-gram, exclusões, controle de orçamento).", como: "Cole direto no Google Ads > Scripts. Rode o n-gram semanalmente para achar negativas.", categoria: "Otimização" },
    { repo: "Czarto/Adwords-Scripts", url: "https://github.com/Czarto/Adwords-Scripts", stars: "56", o_que: "Scripts de lance e relatório clássicos.", como: "Use o de 'budget pacing' e o de 'search query report' para cortar desperdício.", categoria: "Otimização" },
    { repo: "ivangfalco/ads-skills", url: "https://github.com/ivangfalco/ads-skills", stars: "290", o_que: "40+ arquivos de estratégia e 39 scripts de API para LinkedIn, Meta e Google Ads como Skills de agente.", como: "Instale como skill no Claude Code e peça estruturas de campanha prontas.", categoria: "Copy/Estratégia" },
    { repo: "coreyhaines31/marketingskills", url: "https://github.com/coreyhaines31/marketingskills", stars: "58.4k", o_que: "Skills de marketing para agentes: CRO, copywriting, SEO e analytics.", como: "A base mais completa para transformar seu agente em sócio de marketing.", categoria: "Copy/Estratégia" },
    { repo: "coleschaffer/copywritingskills-rmbc", url: "https://github.com/coleschaffer/copywritingskills-rmbc", stars: "40", o_que: "Metodologia RMBC (Stefan Georgi) como skills de copywriting direto.", como: "Use para escrever a presell no formato que mais converte em VSL.", categoria: "Copy/Estratégia" },
    { repo: "robpalmer99/claude-code-copywriting-skills", url: "https://github.com/robpalmer99/claude-code-copywriting-skills", stars: "45", o_que: "5 skills de resposta direta (hooks, headlines, ofertas).", como: "Gera 50 variações de headline em segundos para testar hook.", categoria: "Copy/Estratégia" },
    { repo: "mikiarlo3/ai-copywriter", url: "https://github.com/mikiarlo3/ai-copywriter", stars: "1.2k", o_que: "Copywriter de IA com tom humano.", como: "Reescreve texto 'cara de IA' em texto de conversa.", categoria: "Copy/Estratégia" },
    { repo: "ominou5/funnel-architect-plugin", url: "https://github.com/ominou5/funnel-architect-plugin", stars: "93", o_que: "Plugin que transforma o agente em arquiteto de funil (páginas, upsell, copy).", como: "Use para desenhar a presell + obrigado + remarketing de uma vez.", categoria: "Presell" },
    { repo: "creatify-ai/video-ad-generator", url: "https://github.com/creatify-ai/video-ad-generator", stars: "70", o_que: "Skill que gera vídeo-ad a partir de uma URL de produto.", como: "Gera os 5 hooks de vídeo para Demand Gen/YouTube.", categoria: "Criativo" },
    { repo: "tenfoldmarc/meta-ads-generator-skill", url: "https://github.com/tenfoldmarc/meta-ads-generator-skill", stars: "29", o_que: "URL do produto → 4 criativos prontos para Meta.", como: "Acelera o teste de 4 ângulos por semana.", categoria: "Criativo" },
    { repo: "mrpaidsocial/Meta-Ads-Spy-Claude-Code-Airtable", url: "https://github.com/mrpaidsocial/Meta-Ads-Spy-Claude-Code-Airtable", stars: "60", o_que: "Puxa anúncios da Meta Ad Library para o Airtable.", como: "Monte um banco de anúncios concorrentes que rodam há 30+ dias (sinal de lucro).", categoria: "Pesquisa" },
    { repo: "springvoiceswell/semrush-ai-tool", url: "https://github.com/springvoiceswell/semrush-ai-tool", stars: "539", o_que: "MCP/CLI de keyword research e análise de domínio.", como: "Descubra os termos que os concorrentes compram no search.", categoria: "Pesquisa" },
    { repo: "chukhraiartur/seo-keyword-research-tool", url: "https://github.com/chukhraiartur/seo-keyword-research-tool", stars: "166", o_que: "Sugestões via Google Autocomplete, People Also Ask e buscas relacionadas (grátis).", como: "Alimenta o Custom Intent Segment com termos reais. Alternativa local ao script tools/keyword_harvest.py.", categoria: "Pesquisa" },
    { repo: "lbalceda/awesome-affiliates", url: "https://github.com/lbalceda/awesome-affiliates", stars: "126", o_que: "Lista curada de programas de afiliados.", como: "Fontes de oferta fora das redes tradicionais (SaaS com recorrência).", categoria: "Pesquisa" },
    { repo: "ninjasort/awesome-marketing", url: "https://github.com/ninjasort/awesome-marketing", stars: "237", o_que: "Lista curada de recursos de marketing digital.", como: "Mapa de ferramentas para não assinar nada no escuro.", categoria: "Pesquisa" },
    { repo: "valeriansaliou/raider", url: "https://github.com/valeriansaliou/raider", stars: "253", o_que: "Dashboard de afiliados (código de tracking + saldo).", como: "Se você virar produtor/afiliado com rede própria.", categoria: "Tracking" },
    { repo: "kumatrk/initialrelease", url: "https://github.com/kumatrk/initialrelease", stars: "52", o_que: "Tracker de afiliado self-hosted com sync de custo Meta/Google.", como: "Rastreio próprio quando você quiser saber seu lucro real por campanha.", categoria: "Tracking" },
    { repo: "izzipizzy/slimtds", url: "https://github.com/izzipizzy/slimtds", stars: "35", o_que: "Tracker/distribuidor de tráfego self-hosted com roteamento por geo/device.", como: "Só para operações avançadas — leia os limites de política do Google/Meta antes de usar cloaking.", categoria: "Tracking" },
    { repo: "Cybrarist/InstantLand", url: "https://github.com/Cybrarist/InstantLand", stars: "54", o_que: "Builder de landing page open source com A/B testing e formulários.", como: "Teste A/B de presell sem WordPress pesado.", categoria: "Presell" },
    { repo: "unfolding-io/StarFunnel", url: "https://github.com/unfolding-io/StarFunnel", stars: "174", o_que: "Landing page builder em Astro.", como: "Presell ultrarrápida (Core Web Vitals ajudam no Índice de Qualidade).", categoria: "Presell" },
    { repo: "azizaeffendi/conversion-rate-optimization-playbook", url: "https://github.com/azizaeffendi/conversion-rate-optimization-playbook", stars: "1", o_que: "100+ táticas de CRO, frameworks de A/B e gatilhos psicológicos.", como: "Checklist para melhorar a presell antes de aumentar orçamento.", categoria: "Presell" },
    { repo: "ncklrs/startup-os-skills", url: "https://github.com/ncklrs/startup-os-skills", stars: "53", o_que: "Coleção de skills de operação de negócio.", como: "Útil para a parte de oferta, pricing e growth.", categoria: "Copy/Estratégia" }
  ],

  /* ------------------------------------------------------------------ */
  arsenalHF: [
    { id: "nirajsaran/AdTextGeneration", url: "https://huggingface.co/nirajsaran/AdTextGeneration", o_que: "GPT-Neo 125M fine-tuned em copy de anúncio (Amazon).", como: "Gera variações rápidas de headline offline. Qualidade limitada — use como semente, refine com seu próprio prompt." },
    { id: "PeterBrendan/llama-2-7b-Ads", url: "https://huggingface.co/PeterBrendan/llama-2-7b-Ads", o_que: "Llama-2 7B fine-tuned em criativos de anúncio por tamanho de peça.", como: "Gera copy por formato (300x250, 728x90...). Pesado: precisa GPU ou endpoint pago." },
    { id: "meta-llama/Llama-3.1-8B-Instruct", url: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct", o_que: "Modelo generalista forte em instrução, ótimo custo-benefício.", como: "É o que você realmente vai usar para presell, e-mails e 50 headlines. Rode local com Ollama/LM Studio." },
    { id: "Qwen/Qwen2.5-7B-Instruct", url: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct", o_que: "Alternativa aberta ao Llama, muito boa em multilíngue (pt/en).", como: "Presell bilíngue e adaptação de copy US → BR." },
    { id: "sentence-transformers/all-MiniLM-L6-v2", url: "https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2", o_que: "Embeddings leves e rápidos.", como: "Agrupe 2.000 search terms em clusters de intenção para montar Custom Segments e grupos de anúncio." },
    { id: "facebook/bart-large-mnli", url: "https://huggingface.co/facebook/bart-large-mnli", o_que: "Classificação zero-shot por NLI.", como: "Classifique se a query é 'informacional', 'comparativa' ou 'transacional' — só anunciar nas duas últimas." },
    { id: "cross-encoder/ms-marco-MiniLM-L-6-v2", url: "https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2", o_que: "Re-ranking de relevância.", como: "Pontue se sua presell responde à query do anúncio (evita reprovação por 'destino não corresponde ao anúncio')." },
    { id: "openai/whisper-large-v3", url: "https://huggingface.co/openai/whisper-large-v3", o_que: "Transcrição de áudio.", como: "Transcreva VSLs do produtor/concorrentes para extrair claims, mecanismo e oferta e escrever sua presell." },
    { id: "black-forest-labs/FLUX.1-schnell", url: "https://huggingface.co/black-forest-labs/FLUX.1-schnell", o_que: "Geração de imagem rápida.", como: "Thumbnails para native e criativos de display. Nunca use imagem que simule resultado clínico/pessoa real." },
    { id: "busca: text-generation", url: "https://huggingface.co/models?pipeline_tag=text-generation&sort=trending", o_que: "Lista viva dos LLMs em alta.", como: "Filtre por 'GGUF' se quiser rodar local, ou por 'Inference Providers' para usar via API." },
    { id: "busca: text-classification", url: "https://huggingface.co/models?pipeline_tag=text-classification&sort=downloads", o_que: "Classificadores prontos (intenção, sentimento, spam).", como: "Separe leads ruins de leads com intenção real na sua lista." },
    { id: "busca: datasets advertising", url: "https://huggingface.co/datasets?search=advertising", o_que: "Datasets de anúncios/copy.", como: "Fine-tune um modelo no SEU histórico de anúncios vencedores — é o que realmente funciona." }
  ],

  /* ------------------------------------------------------------------ */
  checklistPresell: [
    "Domínio próprio (não subdomínio do produtor) com HTTPS",
    "Disclosure de afiliado visível acima da dobra ('Este site contém links de afiliado e podemos receber comissão')",
    "Política de Privacidade, Termos de Uso e página de Contato publicadas",
    "Mesma promessa do anúncio — sem troca de promessa entre anúncio e página",
    "Botão de saída aponta para o SEU link de afiliado, sem redirect intermediário estranho",
    "Sem promessa de cura, diagnóstico, resultado garantido ou 'ganhe X em Y dias'",
    "Sem usar logo/nome do produtor como se você fosse ele",
    "Copy com prós E contras (o que aumenta conversão e reduz risco de 'misrepresentation')",
    "Sem pop-up que bloqueia conteúdo e sem auto-redirect",
    "Carrega em < 2,5s no mobile (PageSpeed)",
    "Pixel/tag de conversão próprio instalado e testado",
    "Aviso de cookies (LGPD/GDPR) quando aplicável ao geo",
    "Nenhum texto de template sobrando ('lorem ipsum', '[seu nome]')",
    "Links testados em mobile e desktop (incluindo o link de afiliado)",
    "E-mail de contato respondendo (Google checa domínio)"
  ],

  checklistGoogle: [
    "Domínio verificado e anunciante verificado na conta",
    "Política de conteúdo de destino: página funcional, navegável, com conteúdo próprio",
    "Sem links quebrados no caminho do anúncio",
    "Sem redirecionamento automático para outro domínio (gatilho de reprovação)",
    "Sem 'excesso de anúncios' na página (mais anúncios que conteúdo = destino de baixa qualidade)",
    "Sem claims não comprováveis (saúde, financeiro, 'garantido')",
    "Se o nicho é restrito (saúde/finanças/cripto), revisar a política específica antes de subir",
    "Criativo correspondendo ao destino (mesma oferta, mesmo preço, mesmo produto)",
    "Exclusão de apps móveis e canais infantis nas campanhas de display",
    "Conta não usa múltiplas contas para contornar bloqueio (circumventing systems = suspensão sem aviso)",
    "Faturamento e dados da empresa corretos",
    "Revisão semanal de 'Política' no Google Ads (não deixar reprovação acumular)"
  ],

  checklistMeta: [
    "Domínio verificado no Business Manager",
    "Página com conteúdo real (não só um botão)",
    "Sem alegações de atributos pessoais ('você está acima do peso?')",
    "Sem before/after de corpo, sem zoom em parte do corpo",
    "Sem linguagem sensacionalista de saúde/finanças",
    "Evento de conversão próprio configurado (Lead/ViewContent/Purchase)",
    "Mínimo 4 criativos por conjunto para o aprendizado",
    "Pixel com deduplicação de eventos",
    "Sem 'você' + condição sensível na mesma frase",
    "Revisar a Biblioteca de Anúncios para não copiar criativo reprovado de concorrente"
  ],

  /* ------------------------------------------------------------------ */
  plano7dias: [
    { dia: 1, titulo: "Escolha do produto (Radar)", tarefas: [
      "Filtrar 3 ofertas do mesmo nicho com EPC ≥ 0,55 e gravity ≥ 60",
      "Confirmar na rede: comissão real, APV, aceita tráfego pago?, precisa aprovação?",
      "Pedir aprovação e materiais de claim ao vendor (não espere)",
      "Rodar o Score neste app para as 3 e escolher 1 (só 1)"
    ], entrega: "1 oferta + 1 nicho + 3 ângulos diferentes" },
    { dia: 2, titulo: "Estrutura e presell", tarefas: [
      "Comprar domínio + hospedagem (Cloudflare Pages/Hostinger)",
      "Publicar presell do Ângulo 1 com disclosure, privacidade, termos e contato",
      "Instalar GA4 + tag de conversão",
      "Testar o link de afiliado em desktop e mobile (cookie de rastreio ativo)"
    ], entrega: "Presell no ar, indexável, com conversão rastreando" },
    { dia: 3, titulo: "Pesquisa de intenção e criativos", tarefas: [
      "Rodar o Keyword Harvester e gerar 20–30 termos para Custom Segment",
      "Gerar 5 hooks e 10 headlines (use o gerador do app)",
      "Criar 3 imagens de display + 1 vídeo de 30–60s (se for Demand Gen)",
      "Montar as negativas iniciais"
    ], entrega: "Custom Segment + 5 criativos prontos" },
    { dia: 4, titulo: "Lançamento controlado", tarefas: [
      "Subir Display com orçamento de teste e 1 grupo por ângulo",
      "Subir Search de marca com orçamento menor",
      "Ativar remarketing (camadas 1 e 2) mesmo sem volume",
      "Confirmar que os anúncios foram APROVADOS antes de dormir"
    ], entrega: "2 campanhas no ar com verba de teste" },
    { dia: 5, titulo: "Leitura de dados", tarefas: [
      "Checar CPC, CTR, cliques na presell e CVR do botão",
      "Rodar o Copiloto com os números reais",
      "Matar criativo com gasto ≥ 1 comissão e zero venda",
      "Adicionar 10 negativas do relatório de termos/placements"
    ], entrega: "Relatório de 24–48h e decisão primária" },
    { dia: 6, titulo: "Iteração focada", tarefas: [
      "Testar UM elemento por vez (hook, headline ou thumbnail)",
      "Melhorar a presell se CVR de saída < 15%",
      "Trocar oferta só se RPC < 0,5× CPC com 300+ cliques",
      "Whitelist dos melhores placements/sites"
    ], entrega: "1 variação nova por ângulo" },
    { dia: 7, titulo: "Decisão de escala ou corte", tarefas: [
      "Rodar o Copiloto com 300+ cliques: escalar, ajustar ou cortar",
      "Se escalar: +20–30% de orçamento a cada 2–3 dias, nunca dobrar",
      "Se cortar: manter a oferta no radar (o problema pode ser o ângulo)",
      "Documentar aprendizados no Caderno do app"
    ], entrega: "Decisão documentada + próximo teste agendado" }
  ],

  /* ------------------------------------------------------------------ */
  hooksPorAngulo: {
    medo:       ["O erro silencioso que faz {beneficio} nunca acontecer", "Se você já tentou {solucao_comum}, leia isso antes de gastar de novo", "Por que {publico} não consegue {resultado} (e o que muda em 21 dias)"],
    prova:      ["{numero} pessoas já testaram {produto} — veja o que dizem", "Testei {produto} por {periodo}: o que funcionou e o que não", "{produto}: prós, contras e para quem NÃO serve"],
    mecanismo:  ["A causa real de {problema} não é {culpa_comum}", "O mecanismo por trás de {produto} explicado em 2 minutos", "Por que {produto} funciona diferente de {solucao_comum}"],
    comparacao: ["{produto} vs {concorrente}: qual faz sentido para você", "3 opções para {resultado} — e a mais barata não é a melhor", "Antes de comprar {produto}, compare estes 3 pontos"],
    curiosidade:["Ninguém fala sobre isso em {nicho}", "O detalhe que muda tudo em {produto}", "Descobri isso tarde — e custou caro"]
  },

  /* Templates de presell. Cada bloco é editável no gerador. */
  presellTemplates: {
    advertorial: {
      nome: "Advertorial (melhor para native e display)",
      blocos: [
        { id: "kicker", label: "Selo/Kicker", dica: "Identifique que é conteúdo patrocinado: 'CONTEÚDO PATROCINADO' ou 'ANÚNCIO'" },
        { id: "headline", label: "Manchete", dica: "Curiosidade específica + público. Sem promessa de resultado." },
        { id: "sub", label: "Submanchete", dica: "Quem escreve e por que essa pessoa é relevante." },
        { id: "historia", label: "História (3 parágrafos)", dica: "Dor concreta → tentativas frustradas → descoberta do mecanismo." },
        { id: "mecanismo", label: "Mecanismo único", dica: "Explique POR QUE funciona, não O QUE promete." },
        { id: "prova", label: "Prova social", dica: "Depoimentos reais ou dados públicos. Nunca invente resultado." },
        { id: "próscontras", label: "Prós e contras", dica: "Bloco que mais aumenta CVR e reduz risco de misrepresentation." },
        { id: "paraquem", label: "Para quem é / não é", dica: "Filtro honesto. Aumenta qualidade do clique." },
        { id: "cta", label: "CTA", dica: "Verbo + benefício + transparência ('Ver preço e disponibilidade no site oficial')." },
        { id: "disclosure", label: "Disclosure + rodapé", dica: "Obrigatório: link de afiliado, comissão, privacidade, contato, aviso de resultados." }
      ]
    },
    review: {
      nome: "Review / Comparativo (melhor para search)",
      blocos: [
        { id: "kicker", label: "Aviso de transparência", dica: "'Análise independente — contém links de afiliado'" },
        { id: "headline", label: "Título", dica: "'{Produto}: funciona? Análise honesta e alternativa'" },
        { id: "veredito", label: "Veredito em 3 linhas", dica: "Nota, para quem serve, para quem não serve." },
        { id: "metodologia", label: "Como avaliamos", dica: "Critérios claros constroem confiança e ajudam no Índice de Qualidade." },
        { id: "próscontras", label: "Prós e contras", dica: "Lista equilibrada." },
        { id: "comparativo", label: "Tabela comparativa", dica: "Produto vs 2 alternativas (podem ser concorrentes que você também afilia)." },
        { id: "preco", label: "Preço e garantia", dica: "Nunca prometa desconto que você não controla; diga 'verifique no site oficial'." },
        { id: "faq", label: "FAQ", dica: "Responda as 5 dúvidas reais (extraídas do 'People Also Ask')." },
        { id: "cta", label: "CTA", dica: "Botão para o site oficial + link secundário para a comparação." },
        { id: "disclosure", label: "Disclosure + rodapé", dica: "Obrigatório." }
      ]
    },
    quiz: {
      nome: "Quiz / Diagnóstico (melhor para Meta e e-mail)",
      blocos: [
        { id: "kicker", label: "Kicker", dica: "'Teste de 60 segundos'" },
        { id: "headline", label: "Título", dica: "'Qual {perfil} é o seu? descubra em 1 minuto'" },
        { id: "q1", label: "Pergunta 1", dica: "Pergunta fácil de responder (identificação)." },
        { id: "q2", label: "Pergunta 2", dica: "Pergunta de sintoma/dor." },
        { id: "q3", label: "Pergunta 3", dica: "Pergunta de tentativa anterior." },
        { id: "resultado", label: "Resultado", dica: "Classifique o perfil e recomende o mecanismo — a oferta entra como 'próximo passo'." },
        { id: "cta", label: "CTA", dica: "Botão único, sem menu, sem distração." },
        { id: "disclosure", label: "Disclosure + rodapé", dica: "Obrigatório." }
      ]
    },
    vsl: {
      nome: "Ponte para VSL (melhor para YouTube/Demand Gen)",
      blocos: [
        { id: "kicker", label: "Kicker", dica: "'Assista antes de comprar'" },
        { id: "headline", label: "Título", dica: "Prometa o que o vídeo entrega em 30 segundos." },
        { id: "video", label: "Player", dica: "Player próprio (YouTube não listado/Vimeo) com o SEU vídeo. Sem autoplay com som." },
        { id: "resumo", label: "Resumo em bullets", dica: "Para quem não assiste vídeo (mobile 3G)." },
        { id: "prova", label: "Prova", dica: "3 depoimentos curtos." },
        { id: "cta", label: "CTA", dica: "Aparece após 20–30s de vídeo assistido (evento de scroll)." },
        { id: "disclosure", label: "Disclosure + rodapé", dica: "Obrigatório." }
      ]
    }
  }
};

/* =========================================================================
   INTEGRAÇÕES — verificado em 05/11/2026 contra GitHub API + npm registry.
   Cada campo "verificado" indica a fonte real. Não invente endpoint.
   ========================================================================= */
window.BM_DATA.integracoes = {
  verificado: "05/11/2026",

  bridge: {
    nome: "Bridge local (recomendado)",
    padrao: "http://127.0.0.1:8791",
    cmd: "python3 tools/mcp_bridge.py --port 8791",
    porque: "Resolve CORS, mantém token fora da página e permite falar com o Rally MCP (que só existe via STDIO/JSON-RPC, não via navegador)."
  },

  ads: {
    nome: "Adspirer / Ads MCP",
    repo: "https://github.com/amekala/ads-mcp",
    mcpUrl: "https://mcp.adspirer.com/mcp",
    restBase: "https://api.adspirer.ai/api/v1/tools/{tool}/execute",
    docs: "https://api.adspirer.ai/docs",
    keys: "https://adspirer.ai/keys",
    connections: "https://adspirer.ai/connections",
    auth: "Bearer sk_live_…  (Personal Access Token)",
    verificado: "REST de 178 endpoints + MCP remoto com OAuth 2.1 PKCE — confirmado no README oficial do repo em 05/11/2026",
    atencao: [
      "Plano free = 15 chamadas/mês (Plus 150/US$49, Pro 600/US$99, Max 3.000/US$199). Para operação real, o free não cobre.",
      "Campanhas novas são SEMPRE criadas pausadas — nada gasta sem você ativar na plataforma.",
      "As contas de anúncio precisam estar conectadas em adspirer.ai/connections (OAuth no navegador).",
      "O app é estático: chamar api.adspirer.ai direto do navegador pode ser barrado por CORS. Por isso o bridge. O token nunca deve ir para um servidor de terceiros."
    ],
    toolsSugeridas: [
      ["create_campaign", "cria campanha pausada", "{\"platform\":\"google_ads\",\"name\":\"BM — {{oferta}} — display\",\"budget\":{\"amount\":20,\"currency\":\"USD\"},\"status\":\"PAUSED\"}"],
      ["fetch_metrics", "puxa métricas da conta", "{\"platform\":\"google_ads\",\"date_range\":{\"start\":\"2026-11-01\",\"end\":\"2026-11-05\"}}"],
      ["list_campaigns", "lista campanhas", "{\"platform\":\"google_ads\"}"]
    ]
  },

  rally: {
    nome: "Rally MCP (Mercado Livre + Shopee)",
    pkg: "@andrehocsis/rally-mcp-server",
    versao: "1.0.0",
    npm: "https://www.npmjs.com/package/@andrehocsis/rally-mcp-server",
    autor: "André Hocsis (Rally de Vendas)",
    verificado: "pacote existe e está publicado no npm; README confirma 6 ferramentas e as 3 variáveis de ambiente (05/11/2026)",
    env: [
      ["ML_AFFILIATE_ID", "seu matt_tool_id do Mercado Livre"],
      ["SHOPEE_APP_ID", "App ID da Shopee Affiliate Open Platform"],
      ["SHOPEE_SECRET", "Secret da Shopee Affiliate Open Platform"]
    ],
    tools: [
      ["search_products", "busca produtos com estimativa de comissão", "{\"marketplace\":\"mercadolibre\",\"query\":\"fone bluetooth\",\"limit\":20}"],
      ["trending_products", "produtos em alta por categoria", "{\"marketplace\":\"mercadolibre\",\"category\":\"MLB1051\",\"period\":\"7d\"}"],
      ["analyze_product", "score 0-100 do anúncio (título, fotos, descrição, preço)", "{\"marketplace\":\"mercadolibre\",\"product_id\":\"MLB12345\"}"],
      ["generate_affiliate_link", "link rastreado com parâmetros de campanha", "{\"marketplace\":\"mercadolibre\",\"product_url\":\"https://produto.ml.com.br/...\",\"campaign\":\"tiktok_nov\"}"],
      ["generate_copy", "copy por canal (tiktok, reels, whatsapp, telegram, blog)", "{\"product_id\":\"MLB12345\",\"channel\":\"tiktok\",\"language\":\"pt-BR\"}"],
      ["commission_calculator", "projeta ganho por venda", "{\"marketplace\":\"shopee\",\"price\":149.9,\"category\":\"eletronicos\"}"]
    ],
    atencao: [
      "É servidor MCP (STDIO/JSON-RPC). Navegador não fala MCP — precisa do bridge.",
      "Comissões de ML/Shopee mudam por categoria e por campanha: os percentuais do app são faixa típica EDITÁVEL, não cotação oficial.",
      "ML não tem API pública de afiliado; o pacote abstrai isso e pode parar de funcionar se o marketplace mudar. Teste antes de confiar."
    ],
    comissoesTipicas: [
      ["Mercado Livre — Eletrônicos", 4, 6],
      ["Mercado Livre — Casa/Decoração", 6, 10],
      ["Mercado Livre — Moda/Beleza", 8, 12],
      ["Mercado Livre — Esporte/Lazer", 6, 9],
      ["Shopee — Eletrônicos", 2, 5],
      ["Shopee — Moda/Beleza", 5, 10],
      ["Shopee — Casa/Utilidades", 4, 8],
      ["Shopee — Cupons/Ofertas", 1, 3]
    ]
  },

  sinais: {
    nome: "ProdIntel — sinais ao vivo (Reddit + Hacker News + Google Trends)",
    repo: "https://github.com/alicelabs-llc/Scraper",
    base: "https://prodintel-two.vercel.app",
    endpoints: [
      ["/api/signals", "GET", "Sinais globais já mesclados (Trends RSS + Reddit + HN). NÃO aceita query de produto — é o trending do momento.", "40 req/min por IP, cache de 15 min"],
      ["/api/reputation?domain=", "GET", "Source Safety Gate: reputação de domínio (allowlist, shortener, punycode, IP cru, typosquat, TLD abusado).", "público, sem chave"],
      ["/api/signals?probe=1", "GET", "checagem de disponibilidade do serviço", "-"]
    ],
    verificado: "li o código de api/signals.ts no repo: é GET sem parâmetro de busca, com rate limit de 40/min e cache CDN de 900s. O uso de 'query por produto' da spec original não existe (05/11/2026)",
    scoreProdIntel: "Deal Score = momentum de tendência 55% + margem 35% + link de fonte real 10% (documentado no README deles)",
    comoUsar: [
      "1. Puxe /api/signals para saber o que está em alta AGORA (temas, não produtos).",
      "2. Faça matching de tokens do nome da oferta + sinônimos do nicho contra os títulos retornados.",
      "3. Match encontrado = badge 'sinal vivo'. Sem match = 'sem menção' (não é sinal negativo, é ausência de dado).",
      "4. Passe o domínio da página do produtor em /api/reputation como gate de confiança antes de comprar tráfego."
    ]
  }
};
