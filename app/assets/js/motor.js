/* =========================================================================
   BLOGMASTER — PINMIND · MOTOR
   Estado do projeto, validação por score, geração de packs, exportação
   e integrações OPCIONAIS (OpenAI-compatível + Pinterest API v5).
   ========================================================================= */

const PM_MOTOR = (() => {
  const KEY = 'pinmind.projetos.v1';
  const KEYATIVO = 'pinmind.ativo.v1';

  /* ---------------- armazenamento ---------------- */
  function carregarTodos() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function salvarTodos(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }
  function salvar(p) {
    const todos = carregarTodos();
    p.atualizadoEm = new Date().toISOString();
    todos[p.id] = p;
    salvarTodos(todos);
    localStorage.setItem(KEYATIVO, p.id);
    return p;
  }
  function abrir(id) { return carregarTodos()[id] || null; }
  function ativo() { const id = localStorage.getItem(KEYATIVO); return id ? abrir(id) : null; }
  function excluir(id) { const t = carregarTodos(); delete t[id]; salvarTodos(t); }

  function novoProjeto(nome, lang) {
    const id = 'p' + Date.now().toString(36);
    return {
      id, nome: nome || 'Meu projeto Pinterest',
      criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString(),
      lang: lang || 'both',
      passo: 0,
      nicho: { id:'', nome:'', sub:'', demanda:0, monet:0, ia:0 },
      keyword: '', publico: '', marca: '',
      oferta: { nome:'', tipo:'', plataforma:'', comissaoPct:'', preco:'', cookie:'', linkDireto:true, categoria:'', obs:'', linkAfiliado:'', destino:'' },
      estilo: { id:'', nome:'' },
      angulos: [], pins: [], paginas: [],
      metricas: { impressoes:'', saves:'', cliques:'', sessoes:'', vendas:'', receita:'' },
      checks: { produto:{}, visual:{}, seo:{}, compliance:{} },
      log: [{ em:new Date().toISOString(), txt:'Projeto criado.' }]
    };
  }

  function registrar(p, txt) {
    p.log = p.log || [];
    p.log.unshift({ em: new Date().toISOString(), txt });
    if (p.log.length > 200) p.log.length = 200;
  }

  /* ---------------- validação por score ---------------- */
  // respostas: { idCheck: true|false|undefined }
  function calcularScore(listaChecks, respostas) {
    let pesoTotal = 0, pesoOk = 0;
    const falhas = [], bloqueios = [], pendentes = [];
    listaChecks.forEach(c => {
      const r = respostas[c.id];
      pesoTotal += c.peso;
      if (r === true) pesoOk += c.peso;
      else if (r === false) {
        falhas.push(c);
        if (c.peso === 3) bloqueios.push(c);
      } else pendentes.push(c);
    });
    const score = Math.round((pesoOk / pesoTotal) * 100);
    let veredito, cor;
    if (bloqueios.length) { veredito = 'BLOQUEADO — resolva os itens de peso 3 antes de seguir'; cor = 'vermelho'; }
    else if (pendentes.length > listaChecks.length * 0.4) { veredito = 'INCOMPLETO — responda ao restante do checklist'; cor = 'cinza'; }
    else if (score >= 85) { veredito = 'APROVADO — pode escalar'; cor = 'verde'; }
    else if (score >= 65) { veredito = 'VIÁVEL COM AJUSTES — corrija os pontos vermelhos'; cor = 'amarelo'; }
    else { veredito = 'FRACO — troque de produto, oferta ou ângulo'; cor = 'vermelho'; }
    return { score, veredito, cor, falhas, bloqueios, pendentes, pesoOk, pesoTotal };
  }

  function calcularScoreProjeto(p, qual) {
    const map = { produto:'produto', visual:'visual', seo:'seo', compliance:'compliance' };
    const lista = window.PM_DADOS.CHECKS[map[qual]];
    return calcularScore(lista, p.checks[qual] || {});
  }

  /* ---------------- estimativas financeiras ---------------- */
  function estimativa(p) {
    const f = window.PM_DADOS.BM.funil;
    const com = parseFloat(String(p.oferta.comissaoPct || '0').replace(',', '.')) || 0;
    const preco = parseFloat(String(p.oferta.preco || '0').replace(',', '.')) || 0;
    const porVenda = preco * (com / 100);
    const linhas = [1000, 10000, 50000, 200000].map(imp => {
      const cliques = Math.round(imp * f.impressaoParaClique);
      const vendas = cliques * f.cliqueParaConversao;
      return { imp, cliques, vendas: +vendas.toFixed(1), receita: +(vendas * porVenda).toFixed(2) };
    });
    return { porVenda, linhas, precisa: { cliquesPorVenda: porVenda > 0 ? Math.round(100 / f.cliqueParaConversao) : 0 } };
  }

  /* ---------------- geração de pins sem IA (templates) ---------------- */
  const MOLDES_TITULO = {
    pt: [
      '{kw} — o guia que resolve em 1 tarde',
      '{n} ideias de {kw} que funcionam de verdade',
      '{kw} sem gastar quase nada: passo a passo',
      'O erro nº 1 em {kw} (e como corrigir hoje)',
      '{kw}: o que eu faria se começasse do zero',
      '{n} formas de {kw} que ninguém te conta',
      '{kw} para iniciantes: do zero ao resultado',
      'Antes de tentar {kw}, leia isto',
      'Checklist de {kw} para salvar e usar hoje',
      '{kw}: o antes e depois que ninguém mostra',
      '{n} minutos por dia para dominar {kw}',
      '{kw} do jeito simples: guia para começar'
    ],
    en: [
      '{kw} — the guide that solves it in one afternoon',
      '{n} {kw} ideas that actually work',
      '{kw} without spending much: step by step',
      'The #1 mistake in {kw} (and how to fix it today)',
      '{kw}: what I would do starting from zero',
      '{n} {kw} tricks nobody tells you',
      '{kw} for beginners: zero to result',
      'Read this before trying {kw}',
      '{kw} checklist to save and use today',
      '{kw}: the before and after nobody shows',
      '{n} minutes a day to master {kw}',
      '{kw} the simple way: a beginner guide'
    ]
  };
  const MOLDES_DESC = {
    pt: [
      'Tudo sobre {kw} em um só lugar: o passo a passo completo, os erros mais comuns e o que priorizar primeiro. Salve para consultar depois e clique para ver o guia completo.',
      'Reunimos o essencial de {kw} para você resolver sem perder tempo nem dinheiro. Contém link de afiliado. Veja o passo a passo completo no link.',
      'Se você quer {kw} sem complicação, comece por aqui. O guia cobre o básico, o avançado e o que dá errado no caminho. Salve este pin para hoje mesmo.',
      'O caminho mais curto para {kw}: checklist, comparativo e o que escolher em cada etapa. Contém link de afiliado.'
    ],
    en: [
      'Everything about {kw} in one place: the full step by step, the most common mistakes and what to prioritize first. Save it for later and click for the complete guide.',
      'We gathered the essentials of {kw} so you can get it done without wasting time or money. Contains affiliate link. See the full step by step at the link.',
      'If you want {kw} without the headache, start here. The guide covers the basics, the advanced part and what usually goes wrong. Save this pin for today.',
      'The shortest path to {kw}: checklist, comparison and what to choose at each stage. Contains affiliate link.'
    ]
  };
  const MOLDES_ANGULO = {
    pt: ['Lista','Erro','Transformação','Cola/Atalho','Mito','Orçamento','Rotina','Comparativo','Caminho do iniciante','Antes/Depois'],
    en: ['List','Mistake','Transformation','Cheat sheet','Myth','Budget','Routine','Comparison','Beginner path','Before/After']
  };
  const GATILHOS = {
    pt: ['curiosidade','alívio','aspiração','medo de perder dinheiro','status','urgência','prova social','simplicidade'],
    en: ['curiosity','relief','aspiration','fear of wasting money','status','urgency','social proof','simplicity']
  };

  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
  function escolher(arr, semente, i) { return arr[(hash(semente) + i * 7) % arr.length]; }

  // Molde com rotação de passo primo: garante variedade sem repetir cedo.
  function moldar(moldes, kw, i, desloc) {
    const m = moldes[(desloc + i * 7) % moldes.length];
    return m.replace(/\{kw\}/g, kw).replace(/\{n\}/g, String(5 + (hash(kw + i) % 9)));
  }

  function gerarAngulos(p, lang) {
    const kw = p.keyword || (lang === 'en' ? 'your keyword' : 'sua palavra-chave');
    const fmt = MOLDES_ANGULO[lang];
    const gat = GATILHOS[lang];
    const destinos = lang === 'en'
      ? ['Offer page (affiliate link)', 'Article with disclosure', 'Own product page', 'Free download (lead magnet)']
      : ['Página da oferta (link de afiliado)', 'Artigo com aviso de afiliado', 'Página do produto próprio', 'Download grátis (isca de e-mail)'];
    const estilos = window.PM_DADOS.ESTILOS.filter(e => !p.nicho.id || e.nichos.includes(p.nicho.id));
    const base = estilos.length ? estilos : window.PM_DADOS.ESTILOS;
    const desloc = hash(kw + lang) % MOLDES_TITULO[lang].length;

    return fmt.map((formato, i) => {
      const marca = { pt: 'para quem quer resultado rápido', en: 'for people who want fast results' };
      return {
        id: 'a' + i,
        formato,
        gatilho: gat[i % gat.length],
        titulo: moldar(MOLDES_TITULO[lang], kw, i, desloc),
        promessa: (lang === 'en' ? 'Deliver a concrete result about ' : 'Entregar um resultado concreto sobre ') + kw + ' ' + marca[lang],
        estiloId: base[i % base.length].id,
        estiloNome: base[i % base.length].nome,
        destino: destinos[i % destinos.length],
        escolhido: i < 3
      };
    });
  }

  function gerarPackPins(p, lang, quantidade) {
    const estilos = window.PM_DADOS.ESTILOS;
    const escolhidos = p.angulos.filter(a => a.escolhido);
    const lista = escolhidos.length ? escolhidos : p.angulos;
    const pins = [];
    const qtd = quantidade || 10;
    const deslocT = hash((p.keyword || '') + lang + 'P') % MOLDES_TITULO[lang].length;
    for (let i = 0; i < qtd; i++) {
      const ang = lista[i % lista.length];
      const est = estilos.find(e => e.id === ang.estiloId) || estilos[0];
      const kw = p.keyword || 'keyword';
      const titulo = moldar(MOLDES_TITULO[lang], kw, i, deslocT);
      const desc = escolher(MOLDES_DESC[lang], kw + i + 'd', i).replace(/\{kw\}/g, kw);
      const overlay = (lang === 'en' ? ang.formato + ': ' + kw : ang.formato + ': ' + kw).split(' ').slice(0, 8).join(' ');
      const promptImagem = (lang === 'en' ? est.en : est.pt) + ', subject: ' + kw + ', clean top third for text overlay, vertical 2:3 composition, 1000x1500, no text, no watermark, no logos, no distorted hands, high resolution';
      pins.push({
        id: 'pin' + Date.now().toString(36) + i,
        lang,
        titulo: titulo.slice(0, 60),
        descricao: desc,
        alt: (lang === 'en' ? 'Image about ' : 'Imagem sobre ') + kw + ' — ' + ang.formato,
        overlay,
        promptImagem,
        arquivo: kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (i + 1) + '.png',
        board: (lang === 'en' ? 'Board ' : 'Board ') + ((i % 5) + 1),
        hashtags: (lang === 'en' ? ['#' + kw.replace(/\s+/g, ''), '#tips', '#ideas', '#diy', '#howto'] : ['#' + kw.replace(/\s+/g, ''), '#dicas', '#ideias', '#facavocemesmo', '#comofazer']).slice(0, 5).join(' '),
        estiloId: est.id, estiloNome: est.nome,
        formato: i % 5 === 4 ? (lang === 'en' ? 'video' : 'vídeo') : 'estático',
        status: 'a produzir'
      });
    }
    return pins;
  }

  /* ---------------- exportação ---------------- */
  function download(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
  }

  function exportarJSON(p) { download(p.nome.replace(/\s+/g, '-').toLowerCase() + '.json', JSON.stringify(p, null, 2), 'application/json'); }

  function exportarMarkdown(p) {
    const L = [];
    L.push('# Pack de Produção Pinterest — ' + p.nome);
    L.push('_Gerado em ' + new Date().toLocaleString('pt-BR') + '_');
    L.push('');
    L.push('## Resumo');
    L.push('- **Nicho:** ' + (p.nicho.nome || '—') + (p.nicho.sub ? ' / ' + p.nicho.sub : ''));
    L.push('- **Palavra-chave principal:** ' + (p.keyword || '—'));
    L.push('- **Oferta:** ' + (p.oferta.nome || '—') + ' (' + (p.oferta.plataforma || '—') + ')');
    L.push('- **Comissão:** ' + (p.oferta.comissaoPct || '—') + '% de ' + (p.oferta.preco || '—'));
    L.push('- **Estilo visual:** ' + (p.estilo.nome || '—'));
    L.push('- **Link de destino (colar manualmente):** ' + (p.oferta.linkAfiliado || '[COLAR LINK AQUI]'));
    L.push('');
    L.push('## Ângulos aprovados');
    p.angulos.filter(a => a.escolhido).forEach((a, i) => L.push((i + 1) + '. **' + a.formato + '** — ' + a.titulo + ' _(gatilho: ' + a.gatilho + ' · estilo: ' + a.estiloNome + ')_'));
    L.push('');
    L.push('## Pins prontos (' + p.pins.length + ')');
    p.pins.forEach((pin, i) => {
      L.push('### Pin ' + (i + 1) + ' — ' + pin.formato);
      L.push('- **Título:** ' + pin.titulo);
      L.push('- **Descrição:** ' + pin.descricao);
      L.push('- **Alt text:** ' + pin.alt);
      L.push('- **Overlay:** ' + pin.overlay);
      L.push('- **Prompt da imagem:** `' + pin.promptImagem + '`');
      L.push('- **Arquivo:** ' + pin.arquivo);
      L.push('- **Board:** ' + pin.board);
      L.push('- **Hashtags:** ' + pin.hashtags);
      L.push('- **Destino:** ' + (p.oferta.destino || p.oferta.linkAfiliado || '[COLAR LINK AQUI]'));
      L.push('');
    });
    L.push('## Checklist de publicação');
    L.push('- [ ] Imagem gerada em 1000×1500 px');
    L.push('- [ ] Overlay aplicado no Canva (5-8 palavras)');
    L.push('- [ ] Arquivo renomeado com a keyword');
    L.push('- [ ] Título 40-60 caracteres com a keyword');
    L.push('- [ ] Aviso de afiliado na descrição');
    L.push('- [ ] Link completo (sem encurtador) colado manualmente');
    L.push('- [ ] Board correto e relevante');
    L.push('');
    L.push('## Aviso');
    L.push('Contém link de afiliado. Se você comprar por ele, posso receber comissão sem custo extra para você. Este material não promete resultado financeiro.');
    return L.join('\n');
  }

  function exportarCSV(p) {
    const cab = ['#', 'titulo', 'descricao', 'overlay', 'arquivo', 'board', 'hashtags', 'estilo', 'formato', 'prompt_imagem', 'destino', 'status'];
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const linhas = p.pins.map((pin, i) => [
      i + 1, pin.titulo, pin.descricao, pin.overlay, pin.arquivo, pin.board, pin.hashtags,
      pin.estiloNome, pin.formato, pin.promptImagem, (p.oferta.linkAfiliado || '[COLAR LINK AQUI]'), pin.status
    ].map(esc).join(','));
    return [cab.map(esc).join(','), ...linhas].join('\n');
  }

  /* ---------------- integrações OPCIONAIS ---------------- */
  const CONFIGKEY = 'pinmind.config.v1';
  function config() { try { return JSON.parse(localStorage.getItem(CONFIGKEY) || '{}'); } catch (e) { return {}; } }
  function salvarConfig(c) { localStorage.setItem(CONFIGKEY, JSON.stringify(c)); }

  // Geração real de texto via endpoint compatível com OpenAI (opcional).
  async function chamarIA(prompt, cfg) {
    cfg = cfg || config();
    if (!cfg.chaveIA) throw new Error('Nenhuma chave de IA configurada. Use o modo offline (copiar e colar no ChatGPT).');
    const base = (cfg.baseIA || 'https://api.openai.com/v1').replace(/\/$/, '');
    const resp = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.chaveIA },
      body: JSON.stringify({
        model: cfg.modeloIA || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });
    if (!resp.ok) throw new Error('Falha na API: ' + resp.status + ' ' + (await resp.text()).slice(0, 200));
    const j = await resp.json();
    return (j.choices && j.choices[0] && j.choices[0].message.content) || '';
  }

  // Criação de pin via Pinterest API v5 (opcional; só funciona com Standard access).
  async function publicarPinterest({ token, boardId, titulo, descricao, link, imagemUrl, alt }) {
    const r = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        board_id: boardId,
        title: titulo,
        description: descricao,
        alt_text: alt,
        link,
        media_source: { source_type: 'image_url', url: imagemUrl }
      })
    });
    if (!r.ok) throw new Error('Pinterest API: ' + r.status + ' ' + (await r.text()).slice(0, 300));
    return r.json();
  }

  return {
    carregarTodos, salvar, salvarTodos, abrir, ativo, excluir, novoProjeto, registrar,
    calcularScore, calcularScoreProjeto, estimativa,
    gerarAngulos, gerarPackPins,
    exportarJSON, exportarMarkdown, exportarCSV, download,
    config, salvarConfig, chamarIA, publicarPinterest
  };
})();

if (typeof window !== 'undefined') window.PM_MOTOR = PM_MOTOR;
