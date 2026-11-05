/* =========================================================================
   CirurgiaAfiliada — camada MVP sobre o Copiloto (mesma base, mesmo bridge).
   Nada aqui substitui o conteúdo do Copiloto: é um segundo eixo de navegação.
   Campo "st" = status verificado em 05/11/2026:
      "ok"    → confirmado na fonte (GitHub API / npm registry)
      "ajuste"→ existe, mas o identificador/rota da spec estava diferente
      "nok"   → não encontrado
      "n/d"   → não foi possível verificar (DNS resolve, sem resposta no sandbox)
   ========================================================================= */
window.BM_CIRURGIA = {

  verificado: "05/11/2026",

  posicionamento: {
    nome: "CirurgiaAfiliada",
    alternativas: ["Affiliate Surgeon", "BOFU Lab"],
    promessa: "O blueprint operacional que transforma tráfego pago em comissão cirúrgica — sem aparecer, sem criar conteúdo, sem achismo.",
    publico: "Afiliado iniciante/intermediário brasileiro que quer validar ofertas rápido com Google Ads BOFU + Reddit como validador.",
    problemas: [
      "Falta de método claro para escolher ofertas lucrativas",
      "Medo de compliance/FTC e ban de contas",
      "Desorganização entre redes, MCPs e ferramentas"
    ],
    kpis: [
      ["Foco", "BOFU (intenção de compra)", "não topo de funil"],
      ["Budget cirúrgico", "R$ 30–40/dia", "por oferta testada"],
      ["CPC teto", "R$ 5–6", "acima disso, não escala"],
      ["CTR mínimo", "> 5%", "após 50 impressões"],
      ["Produtos simultâneos", "25–35", "carteira, não aposta única"],
      ["Reddit karma", "500–1.000", "para postar sem remoção"]
    ],
    provaSocial: {
      texto: "Benchmark realista de mercado: r/juststart reporta US$ 500–4.000/mês aos 6 meses para quem executa o método com consistência — não é promessa, é faixa observada em relatos públicos.",
      honestidade: "Não existe garantia de resultado. A faixa acima é de relatos da comunidade, sujeita a viés de sobrevivência."
    }
  },

  /* ------------------------------------------------------------------ */
  diagnostico: {
    perguntas: [
      { id: "ads", label: "Você já tem conta Google Ads ativa?", opts: [["sim", "Sim, já anuncio"], ["nao", "Não, seria a primeira"], ["bloqueada", "Já tive e foi bloqueada"]] },
      { id: "tipo", label: "O que prefere promover?", opts: [["info", "Infoproduto"], ["fisico", "Produto físico"], ["saas", "SaaS / recorrência"]] },
      { id: "budget", label: "Orçamento diário disponível", opts: [["b30", "R$ 30/dia"], ["b50", "R$ 50/dia"], ["b100", "R$ 100+/dia"]] },
      { id: "trafego", label: "Aceita só tráfego pago ou quer orgânico também?", opts: [["pago", "Só pago (zero conteúdo)"], ["misto", "Pago + orgânico"], ["org", "Só orgânico por enquanto"]] },
      { id: "dominio", label: "Você tem domínio próprio + hospedagem?", opts: [["sim", "Sim"], ["nao", "Não"], ["naosei", "Tenho domínio, não sei usar"]] }
    ]
  },

  /* ------------------------------------------------------------------ */
  redes: [
    { nome: "Hotmart", tipo: "Infoproduto BR", comissao: "50–80%", payout: "Variável (30 dias)", ideal: "Iniciante BR", st: "ok", nota: "Maior marketplace BR; aprovação rápida e suporte em português." },
    { nome: "Kiwify", tipo: "Infoproduto BR", comissao: "40–80%", payout: "Variável", ideal: "Iniciante BR", st: "ok", nota: "Checkout forte, aprovação quase imediata; ofertas de lançamento." },
    { nome: "Eduzz", tipo: "Infoproduto BR", comissao: "40–80%", payout: "Variável", ideal: "Iniciante BR", st: "ok", nota: "Boa para nichos de saúde/espiritualidade BR." },
    { nome: "Braip", tipo: "Físico encapsulado", comissao: "40–70%", payout: "Variável", ideal: "Suplementos / saúde feminina", st: "ok", nota: "Frete nativo, logística própria — vence em produto físico." },
    { nome: "ClickBank", tipo: "Infoproduto intl", comissao: "75%+", payout: "Semanal (US$ 10 mín.)", ideal: "Gravity > 50 e EPC > US$ 0,75", st: "ok", nota: "Payout semanal é o melhor em caixa. Filtro de oferta já está no Radar do Copiloto." },
    { nome: "BuyGoods", tipo: "Nutra intl", comissao: "65–90%", payout: "Semanal", ideal: "Nutra com EPC alto", st: "ok", nota: "Bônus da base: várias ofertas top do Radar estão aqui (ProstaVive, PawBiotix)." },
    { nome: "Awin (ex-ShareASale)", tipo: "30k anunciantes", comissao: "5–30%", payout: "Mensal", ideal: "Marcas grandes", st: "ok", nota: "Rede consolidada; exige aprovação por anunciante." },
    { nome: "Impact.com", tipo: "SaaS / marca", comissao: "20–40% recorrente", payout: "Mensal", ideal: "Recorrência", st: "ok", nota: "Melhor para comissão recorrente e partnerships." },
    { nome: "CJ Affiliate", tipo: "Big brands", comissao: "5–20%", payout: "Mensal", ideal: "Autoridade / SEO", st: "ok", nota: "Difícil aprovar sem site com conteúdo — não é canal de iniciante." },
    { nome: "PartnerStack", tipo: "B2B SaaS", comissao: "20–40%", payout: "Mensal", ideal: "B2B", st: "ok", nota: "Spec citava 'AppDirect abr/26'; não consegui confirmar essa aquisição — trate como não verificado." }
  ],

  /* ------------------------------------------------------------------ */
  stack: {
    skills: [
      { nome: "Affitor/affiliate-skills", o_que: "50 skills de agente em 8 estágios (Research → Content → SEO → Offers → Distribution → Analytics → Automation → Meta).", url: "https://github.com/Affitor/affiliate-skills", st: "ok", detalhe: "767 estrelas, atualizado 19/10/2026" },
      { nome: "Affitor/open-affiliate", o_que: "CLI para buscar e gerenciar programas de afiliado. Publicado no npm como 'openaffiliate' v0.0.2.", url: "https://github.com/Affitor/open-affiliate", st: "ajuste", detalhe: "A spec citava a API REST 'openaffiliate.dev/api/programs' sem chave. O que existe e é verificável é o pacote CLI. O endpoint ficou n/d neste sandbox." }
    ],
    mcps: [
      { nome: "affiliate-networks-mcp", o_que: "Traz dados das suas redes de afiliado para Claude/Codex via MCP local (stdio).", url: "https://www.npmjs.com/package/affiliate-networks-mcp", st: "ajuste", detalhe: "Pacote existe (v0.20.0), mas o repositório é bobberrisford/affiliatemcp — o caminho 'affiliate-networks-mcp' da spec dá 404 no GitHub. Adaptadores ainda marcados como experimentais pelo autor." },
      { nome: "mcp-redtrack", o_que: "MCP do RedTrack: campanhas, cliques, conversões, ofertas, redes.", url: "https://www.npmjs.com/package/mcp-redtrack", st: "ajuste", detalhe: "A spec dizia 'RedTrack MCP' genericamente. O pacote real é 'mcp-redtrack' v0.3.1 (repo pijusz/mcp-redtrack) e usa REDTRACK_API_KEY." },
      { nome: "feedico-mcp", o_que: "Cupons, ofertas e produtos com links de afiliado rastreados.", url: "https://www.npmjs.com/package/feedico-mcp", st: "ok", detalhe: "Publicado (v2.1.2)." },
      { nome: "affilync-mcp", o_que: "MCP de afiliados (stdio + HTTP OAuth em mcp.affilync.com).", url: "", st: "nok", detalhe: "Nenhum pacote 'affilync-mcp' no npm (404) e não achei repositório. Não use até confirmar a fonte." },
      { nome: "AffiliateOS (api.affiliateos.dev/mcp)", o_que: "Awin/Impact/CJ/Amazon em um único endpoint MCP.", url: "https://api.affiliateos.dev/mcp", st: "n/d", detalhe: "O host resolve no DNS, mas não respondeu daqui. Teste do seu ambiente antes de depender." }
    ],
    validacao: [
      { nome: "harness/harness-schema", o_que: "Schema público v0 para validar pipelines (YAML, schema, RBAC, OPA, expression).", url: "https://github.com/harness/harness-schema", st: "ok", detalhe: "Repo existe (atualizado hoje). O dry-run real roda no Harness CI — aqui eu implemento um validador local do YAML de campanha (ver Dashboard), que é honesto sobre o que valida." }
    ]
  },

  /* ------------------------------------------------------------------ */
  metodo: {
    autor: "Thiago Boeiras (@thiagoboeiras)",
    nome: "BOFU cirúrgico",
    passos: [
      { n: 1, t: "Intenção > Atenção", d: "Só keywords transacionais: \"buy\", \"official website\", \"where to buy\", nome exato do produto, \"[produto] reviews\". Nada de topo de funil.", tags: ["buy", "official website", "where to buy", "nome exato"] },
      { n: 2, t: "Budget cirúrgico", d: "R$ 30–40/dia por oferta. CPC máximo R$ 5–6. Corte o criativo se o CTR não passar de 5% após 50 impressões.", tags: ["R$ 30-40/dia", "CPC ≤ R$ 5-6", "CTR > 5% em 50 impr."] },
      { n: 3, t: "Validação de produto", d: "Google Keyword Planner para demanda + ClickBank gravity > 50 + EPC > US$ 0,75. Três filtros, todos obrigatórios.", tags: ["Keyword Planner", "gravity > 50", "EPC > US$ 0,75"] },
      { n: 4, t: "Funil de carteira", d: "25–35 produtos simultâneos. Contingência grátis: múltiplas contas Google Ads apenas com contas Google distintas — sem multilogin, sem cloaking (isso é circumventing systems).", tags: ["25-35 ofertas", "contingência sem multilogin"] },
      { n: 5, t: "Zero conteúdo, zero aparecer", d: "Tráfego pago puro. Sua página é presell/advertorial; você não é creator, é comprador de intenção.", tags: ["tráfego pago puro", "presell própria"] }
    ],
    avisoCompliance: "A parte 4 é onde a maioria se queima: múltiplas contas para contornar bloqueio é violação de 'circumventing systems' no Google e dá suspensão sem aviso. Contingência legítima = contas separadas por empresas distintas, com dados de pagamento e domínios distintos — e nunca para burlar uma punição."
  },

  /* ------------------------------------------------------------------ */
  reddit: {
    bridge: "Reddit → seu review/comparativo → link de afiliado. Link direto no post = ban.",
    timeline: [
      ["Semanas 1–4", "Contribuir sem nenhuma promoção. Responder dúvidas reais no seu nicho."],
      ["Semanas 4–8", "Recomendar produtos sem link (só o nome). Construir reputação e karma."],
      ["Semana 8+", "Postar links divulgados (disclosure explícito no post + na página de destino)."]
    ],
    karma: "500–1.000 de karma prático antes de postar link — abaixo disso a moderação remove.",
    subreddits: [
      ["r/BuyItForLife", "produto físico durável", "alta"],
      ["r/HomeImprovement", "casa / DIY", "alta"],
      ["r/Supplements", "≈850k membros · nutra", "muito alta"],
      ["r/SkincareAddiction", "beleza / skincare", "alta"],
      ["r/SmallBusiness", "B2B / SaaS", "média"]
    ],
    ofertasQuentes: [
      ["Liv Pure", "ClickBank · gravity 312", "nutra"],
      ["Java Burn", "ClickBank · gravity 278 · 75%", "nutra"],
      ["AI SaaS", "20–40% recorrente", "software"],
      ["Finance offers", "US$ 50–200 por lead", "financas"]
    ]
  },

  /* ------------------------------------------------------------------ */
  clonagem: {
    ferramentas: ["Atomicat AI Cloner", "LanderLab", "Clicopy", "Funnelish Pro"],
    regraOuro: "Recriar ESTRUTURA, nunca copiar headline, script, visual, depoimento ou logo. Copiar qualquer um desses é violação de direito autoral além de política de anúncio.",
    framework: [
      ["AIDA", "Atenção → Interesse → Desejo → Ação no corpo da presell"],
      ["3+ CTAs", "um acima da dobra, dois no meio/fim"],
      ["FTC disclosure", "acima da dobra, linguagem clara, antes de qualquer link"],
      ["Hormozi Grand Slam", "Valor = Sonho × Probabilidade ÷ Tempo ÷ Esforço"],
      ["Bonus stack", "bônus exclusivos seus (não os do produtor) para diferenciar a oferta"]
    ],
    compliance: [
      "FTC: exige evidência (bank statements) quando você afirma resultado; a análise é por 'Net Impression' — vale o que o conjunto comunica, não só a letra miúda.",
      "Disclosure precisa ser material e próximo do link — não pode estar só no rodapé.",
      "Amazon Associates: proíbe 'dupe', 'fake', 'faux' e qualquer sugestão de produto alternativo/similar.",
      "Domínio próprio é obrigatório: sem ele não há disclosure consistente nem remarketing."
    ]
  },

  /* ------------------------------------------------------------------ */
  dashboard: {
    pipeline: [
      ["Research", "oferta validada no Radar (EPC, gravity, risco)"],
      ["Oferta", "rede confirmada + link com sub-id"],
      ["Landing", "presell própria com FTC disclosure acima da dobra"],
      ["Campanha", "BOFU no ar, orçamento cirúrgico, campanha nasce pausada"],
      ["Análise", "copiloto com 300 cliques → escalar/ajustar/cortar"]
    ],
    checklistDiario: [
      "1 oferta validada (gravity > 50, EPC > US$ 0,75)",
      "1 landing revisada (FTC acima da dobra, link testado)",
      "1 campanha BOFU ativa com orçamento cirúrgico",
      "Corte de 10 negativas do relatório de termos",
      "1 entrada no Caderno com hipótese + número"
    ],
    ftcRegras: [
      ["Disclosure de afiliado", /(affiliate|afiliad|comiss[aã]o|commission|sponsored|patrocinad|#ad\b|#publi)/i, "Aviso de que você recebe comissão"],
      ["Termos legais", /(privacy|privacidade|terms|termos)/i, "Links de privacidade/termos"],
      ["Contato", /(contact|contato|fale conosco)/i, "Forma de contato real"],
      ["Sem claim de cura", /(cure|cura\b|guaranteed|garantido|100% ?(result|resultado)|milagr)/i, "Claim absoluto proibido (negativo: deve estar ausente)"]
    ],
    utmCampos: [
      ["utm_source", "google"], ["utm_medium", "cpc"], ["utm_campaign", "bofu-oferta"],
      ["utm_content", "angulo"], ["utm_term", "{keyword}"], ["subid", "campanha_angulo"]
    ]
  },

  roadmap: [
    ["Semana 1", "Home + Diagnóstico + Redes 2026", "feito neste módulo"],
    ["Semana 2", "Stack MCP + Método BOFU", "feito neste módulo"],
    ["Semana 3", "Reddit Playbook + Clonagem + FTC checker + validação de campanha", "feito neste módulo"],
    ["Semana 4", "Dashboard + onboarding 3 passos + testes end-to-end", "feito neste módulo (estado local; login real exige backend)"]
  ],

  onboarding3: [
    ["1", "Diagnóstico", "5 perguntas → rede + nicho + ofertas recomendadas"],
    ["2", "Oferta validada", "confirme EPC/gravity na rede e gere o link com sub-id"],
    ["3", "Landing + validação", "presell própria com disclosure, validador de campanha e campanha pausada"]
  ],

  /* Spec original vs. realidade — mesma disciplina do módulo de integrações */
  specCheck: [
    ["Affitor/affiliate-skills (50 skills)", "ok", "Repo real, 767★, 8 estágios conforme descrito."],
    ["API openaffiliate.dev/api/programs sem chave", "n/d", "Host resolve, mas não respondeu. O verificável é o npm 'openaffiliate' (CLI v0.0.2). Mantido como rota opcional no bridge."],
    ["affiliate-networks-mcp (bobberrisford)", "ajuste", "Pacote real v0.20.0; repositório é /affiliatemcp, não /affiliate-networks-mcp."],
    ["affilync-mcp", "nok", "Não existe no npm (404). Removido da lista de recomendados; ficou só como alerta."],
    ["AffiliateOS api.affiliateos.dev/mcp", "n/d", "DNS ok, sem resposta no sandbox. Não dependa sem testar."],
    ["RedTrack MCP", "ajuste", "Nome real: mcp-redtrack v0.3.1, env REDTRACK_API_KEY."],
    ["feedico-mcp", "ok", "v2.1.2 publicado."],
    ["Harness schema v0", "ok", "Repo harness/harness-schema existe. Dry-run real roda no CI deles; aqui há validador local do YAML."],
    ["Números do método (R$30-40, CPC R$5-6, CTR>5%, gravity>50, EPC>$0.75)", "ok", "Mantidos 100%, agora com o alerta de compliance na contingência de contas."],
    ["Reddit: timeline 3 fases + karma 500-1.000", "ok", "Mantido 100%, agora com tela operacional."],
    ["Clonagem: Atomicat/LanderLab/Clicopy/Funnelish", "ok", "Mantido 100% + regra de ouro e framework AIDA/Hormozi."],
    ["FTC / Amazon dupe-fake-faux", "ok", "Mantido e transformado em verificador de copy."],
    ["Ofertas quentes 2026 (Liv Pure 312, Java Burn 278)", "ok", "Batem com os números do Radar do Copiloto."],
    ["PartnerStack 'AppDirect abr/26'", "n/d", "Não confirmei a aquisição; marcado como não verificado na tabela de redes."]
  ]
};
