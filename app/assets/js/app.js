/* =========================================================================
   BLOGMASTER — PINMIND · APLICAÇÃO
   11 etapas que pegam na mão: do nicho ao pack de pins pronto para publicar.
   ========================================================================= */
(() => {
  const D = window.PM_DADOS, P = window.PM_PROMPTS, M = window.PM_MOTOR;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const L = (pt, en) => (proj && proj.lang === 'en') ? en : pt;

  let proj = null;
  let passo = 0;

  /* =====================================================================
     PASSOS
     ===================================================================== */
  const PASSOS = [
    { id:'fundacao',   n:0,  titulo:'Fundação da conta', sub:'business, perfil, boards, claim' },
    { id:'nicho',      n:1,  titulo:'Escolher o nicho',  sub:'demanda × monetização × IA' },
    { id:'oferta',     n:2,  titulo:'Validar produto',    sub:'12 critérios + comissão' },
    { id:'angulos',    n:3,  titulo:'Gerar ângulos',      sub:'1 keyword → 10 ângulos' },
    { id:'visual',     n:4,  titulo:'Validar o visual',   sub:'o estilo que mais se vê' },
    { id:'copy',       n:5,  titulo:'Texto do pin',       sub:'título, descrição, alt, tags' },
    { id:'video',      n:6,  titulo:'Vídeo e carrossel',  sub:'formatos que escalam' },
    { id:'destino',    n:7,  titulo:'Página e link',      sub:'onde o link é colado à mão' },
    { id:'validacao',  n:8,  titulo:'Validação final',    sub:'4 checklists com nota' },
    { id:'pack',       n:9,  titulo:'Pack de produção',   sub:'15-25 pins prontos' },
    { id:'publicar',   n:10, titulo:'Publicar e medir',   sub:'calendário 30 dias + KPIs' },
    { id:'prompts',    n:11, titulo:'Biblioteca de prompts', sub:'os 15 prompts completos' },
    { id:'biblia',     n:12, titulo:'A Bíblia',           sub:'16 capítulos do método' },
    { id:'config',     n:13, titulo:'Integrações',        sub:'opcional: IA e Pinterest API' }
  ];

  /* =====================================================================
     PERSISTÊNCIA
     ===================================================================== */
  function carregarOuCriar() {
    let p = M.ativo();
    const todos = M.carregarTodos();
    if (!p) {
      const ids = Object.keys(todos);
      p = ids.length ? todos[ids[0]] : M.novoProjeto('Meu primeiro projeto', 'both');
      M.salvar(p);
    }
    return p;
  }
  function guardar(silencioso) {
    M.salvar(proj);
    atualizarLateral();
    if (!silencioso) atualizarSeletor();
  }
  function redesenhar() { guardar(true); renderConteudo(); atualizarLateral(); }

  /* =====================================================================
     COMPONENTES
     ===================================================================== */
  function copiar(texto, btn) {
    const fim = () => {
      if (!btn) return;
      const t = btn.textContent; btn.textContent = '✓ copiado';
      setTimeout(() => { btn.textContent = t; }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(fim).catch(() => copiarFallback(texto, fim));
    } else copiarFallback(texto, fim);
  }
  function copiarFallback(texto, fim) {
    const ta = document.createElement('textarea');
    ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove(); fim();
  }

  function caixaPrompt(idPrompt, ctx, lang, { titulo, altura } = {}) {
    const p = P.gerar(idPrompt, ctx, lang);
    if (!p) return '';
    const texto = p.texto;
    return `
      <div class="card">
        <div class="barra-prompt">
          <h3 style="margin:0">${esc(p.titulo)}</h3>
          <div class="linha">
            <span class="pill accent">${p.texto.length.toLocaleString('pt-BR')} caracteres</span>
            <button class="btn mini" data-copiar-id="pp-${idPrompt}-${lang}">📋 Copiar prompt</button>
          </div>
        </div>
        <p class="mini">Cole no ChatGPT, Gemini ou Claude (versões grátis). Depois traga a resposta de volta para cá.
        ${p.papeis && p.papeis.length ? ' Prepare o modelo dizendo: <em>"Atue como ' + esc(p.papeis.join(' e ')) + '."</em>' : ''}</p>
        <div class="prompt ${altura || ''}" id="pp-${idPrompt}-${lang}">${esc(texto)}</div>
        <button class="btn suave mini mt" data-copiar-id="pp-${idPrompt}-${lang}">📋 Copiar</button>
      </div>`;
  }

  function botaoCopiar(texto, rotulo, classe) {
    const id = 'cp' + Math.random().toString(36).slice(2, 8);
    textoMap[id] = texto;
    return `<button class="btn ${classe || 'mini'}" data-copiar-id="${id}">${rotulo}</button>`;
  }
  const textoMap = {};

  function card(titulo, corpo, extra) {
    return `<div class="card"><h3>${titulo}${extra || ''}</h3>${corpo}</div>`;
  }

  function scoreHTML(res) {
    const pct = res.score + '%';
    return `<div class="score-caixa">
      <div class="anel ${res.cor}" style="--pct:${pct}"><span>${res.score}</span></div>
      <div style="flex:1;min-width:220px">
        <div class="b">${esc(res.veredito)}</div>
        <div class="mini">${res.pesoOk} de ${res.pesoTotal} pontos de peso · ${res.falhas.length} item(ns) reprovado(s) · ${res.pendentes.length} a responder</div>
        ${res.bloqueios.length ? '<div class="mini" style="color:var(--erro)">⛔ ' + res.bloqueios.length + ' bloqueio(s) de peso 3 precisam ser resolvidos</div>' : ''}
      </div>
    </div>`;
  }

  function checklistHTML(qual) {
    const lista = D.CHECKS[qual];
    const resp = proj.checks[qual] || {};
    const res = M.calcularScore(lista, resp);
    const itens = lista.map(c => `
      <div class="check peso${c.peso}">
        <div class="q">
          ${esc(L(c.pt, c.en))}
          <span class="dica">${esc(c.dica)}</span>
        </div>
        <div class="botoes-sim">
          <button class="sim ${resp[c.id] === true ? 'on' : ''}" data-check="${qual}:${c.id}:1" title="Sim">✓</button>
          <button class="nao ${resp[c.id] === false ? 'on' : ''}" data-check="${qual}:${c.id}:0" title="Não">✕</button>
        </div>
      </div>`).join('');
    return scoreHTML(res) + '<div class="mt">' + itens + '</div>';
  }

  /* =====================================================================
     RENDER · LATERAL
     ===================================================================== */
  function atualizarLateral() {
    const feito = [proj.nicho.id, proj.oferta.nome, proj.angulos.some(a => a.escolhido), proj.estilo.id,
      proj.pins.length > 0, proj.oferta.linkAfiliado];
    const totalOk = feito.filter(Boolean).length;
    const pct = Math.round(totalOk / feito.length * 100);

    $('#lateral').innerHTML = `
      <div style="padding:0 .5rem">
        <div class="mini b">Progresso do projeto</div>
        <div class="barra"><i style="width:${pct}%"></i></div>
        <div class="mini">${pct}% · ${proj.pins.length} pin(s) no pack</div>
      </div>
      <h4>Produção</h4>
      ${PASSOS.filter(p => p.n <= 10).map(p => botaoPasso(p)).join('')}
      <h4>Referência</h4>
      ${PASSOS.filter(p => p.n > 10).map(p => botaoPasso(p)).join('')}
    `;
  }
  function botaoPasso(p) {
    return `<button class="passo ${passo === p.n ? 'on' : ''}" data-passo="${p.n}">
      <span class="num">${p.n}</span>
      <span class="txt">${esc(p.titulo)}<span class="sub">${esc(p.sub)}</span></span>
    </button>`;
  }

  function atualizarSeletor() {
    const todos = M.carregarTodos();
    const ids = Object.keys(todos).sort((a, b) => (todos[b].atualizadoEm || '').localeCompare(todos[a].atualizadoEm || ''));
    $('#seletorProjeto').innerHTML = ids.map(id =>
      `<option value="${id}" ${id === proj.id ? 'selected' : ''}>${esc(todos[id].nome)}</option>`).join('');
  }

  /* =====================================================================
     RENDER · CONTEÚDO
     ===================================================================== */
  function renderConteudo() {
    const p = PASSOS[passo];
    const mapa = {
      fundacao: passoFundacao, nicho: passoNicho, oferta: passoOferta, angulos: passoAngulos,
      visual: passoVisual, copy: passoCopy, video: passoVideo, destino: passoDestino,
      validacao: passoValidacao, pack: passoPack, publicar: passoPublicar,
      prompts: passoPrompts, biblia: passoBiblia, config: passoConfig
    };
    const rotulo = p.n <= 10 ? `Etapa ${p.n} de 10` : 'Referência';
    $('#conteudo').innerHTML = `
      <div class="cabecalho-passo">
        <div class="etapa">${rotulo}</div>
        <h1>${esc(p.titulo)}</h1>
        <div class="cinza">${esc(p.sub)}</div>
      </div>
      ${(mapa[p.id] || (() => ''))()}
      <div class="linha espaco mt2">
        <button class="btn" data-passo="${Math.max(0, passo - 1)}">← Anterior</button>
        <button class="btn primario" data-passo="${Math.min(PASSOS.length - 1, passo + 1)}">Próxima etapa →</button>
      </div>`;
    $$('[data-copiar-id]').forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('data-copiar-id');
      const alvo = document.getElementById(id);
      copiar(alvo ? alvo.innerText : (textoMap[id] || ''), b);
    }));
  }

  /* ---------- 0 · FUNDAÇÃO ---------- */
  function passoFundacao() {
    const ctx = { nicho: proj.nicho.nome, sub: proj.nicho.sub, keyword: proj.keyword, marca: proj.marca, publico: proj.publico };
    return `
      ${card('O que fazer antes do primeiro pin', `
        <p>Sem isso, o Pinterest não te distribui e você não tem analytics. São 4 passos, uns 25 minutos:</p>
        <ol>
          <li><b>Conta business</b> (grátis): pinterest.com → Configurações → Gestão de conta → Converter em conta business.</li>
          <li><b>Perfil otimizado</b>: nome com palavra-chave, bio de até 160 caracteres com promessa clara.</li>
          <li><b>5 boards temáticos</b> com título e descrição contendo a palavra-chave.</li>
          <li><b>Claim do site</b> (Reivindicar): valida o domínio e libera Rich Pins + analytics.</li>
        </ol>
        <div class="info-caixa">Conta business é gratuita e é o que dá acesso ao agendador nativo (até 10 pins na fila, 2 semanas no desktop / 30 dias no app).</div>
      `)}
      <div class="grid c2">
        <div>${card('Seu contexto (o app usa isto em todos os prompts)', `
          <label>Nome/marca da conta</label>
          <input type="text" data-campo="marca" value="${esc(proj.marca)}" placeholder="ex.: Casa Organizada">
          <label>Público-alvo em 1 linha</label>
          <input type="text" data-campo="publico" value="${esc(proj.publico)}" placeholder="ex.: mulheres 28-45 que alugam apartamento pequeno">
          <label>Palavra-chave principal (se já souber)</label>
          <input type="text" data-campo="keyword" value="${esc(proj.keyword)}" placeholder="ex.: organização de cozinha pequena">
        `)}</div>
        <div>${caixaPrompt('perfil', ctx, proj.lang, { altura: 'curto' })}</div>
      </div>
      ${card('Checklist de fundação', `
        <div class="check"><div class="q">Conta convertida em business</div></div>
        <div class="check"><div class="q">Bio com palavra-chave e promessa</div></div>
        <div class="check"><div class="q">5 boards criados com título/descrição otimizados</div></div>
        <div class="check"><div class="q">Site reivindicado (claim) — ou perfil, se ainda não tiver site</div></div>
        <div class="check"><div class="q">Foto de perfil e capa coerentes com o nicho</div></div>
      `)}`;
  }

  /* ---------- 1 · NICHO ---------- */
  function passoNicho() {
    const ctx = { keyword: proj.keyword, publico: proj.publico };
    const cards = D.NICHOS.map(n => {
      const score = Math.round((n.demanda * 0.4 + n.monet * 0.35 + n.ia * 0.25) * 10);
      const on = proj.nicho.id === n.id;
      return `<button class="opcao ${on ? 'on' : ''}" data-nicho="${n.id}">
        <div class="tt">${esc(L(n.pt, n.en))}</div>
        <div class="ds">${esc(n.obs)}</div>
        <div class="tags">
          <span class="pill ${score >= 85 ? 'ok' : score >= 70 ? 'aviso' : ''}">score ${score}</span>
          <span class="pill">demanda ${n.demanda}/10</span>
          <span class="pill">R$ ${esc(n.ticketMedio)}</span>
        </div>
      </button>`;
    }).join('');

    const n = D.NICHOS.find(x => x.id === proj.nicho.id);
    const sub = n ? `<div class="card">
      <h3>Sub-nicho de ${esc(L(n.pt, n.en))}</h3>
      <p class="mini">Escolher um sub-nicho específico vale mais que 10 pins genéricos. Palavra-chave long-tail ganha de palavra-chave curta.</p>
      <div class="linha">${n.sub.map(s => `<button class="btn mini ${proj.nicho.sub === s ? 'primario' : ''}" data-sub="${esc(s)}">${esc(s)}</button>`).join('')}</div>
      <label class="mt">Onde este nicho monetiza</label>
      <p class="mini">${n.ofertas.map(o => '• ' + esc(o)).join('<br>')}</p>
      ${n.sub.includes(proj.nicho.sub) || proj.nicho.sub ? `<div class="destaque mt">Sua palavra-chave sugerida: <b>${esc(proj.nicho.sub || '')}</b> — use esta (ou uma variação) como keyword principal da etapa 5.</div>` : ''}
    </div>` : '';

    return `
      <div class="aviso-caixa mb"><b>Regra de ouro:</b> escolha o nicho pelo <b>dinheiro</b> (existe oferta que paga?) e pela <b>facilidade de produzir com IA grátis</b>. Paixão vem em terceiro lugar.</div>
      <div class="grid c3">${cards}</div>
      ${sub}
      <div class="mt">${caixaPrompt('nichos', ctx, proj.lang, { altura: 'curto' })}</div>`;
  }

  /* ---------- 2 · OFERTA ---------- */
  function passoOferta() {
    const o = proj.oferta;
    const res = M.calcularScoreProjeto(proj, 'produto');
    const est = M.estimativa(proj);
    const tabela = D.OFERTAS.map(x => `
      <tr>
        <td><b>${esc(x.tipo)}</b><br><span class="mini">${esc(x.onde)}</span></td>
        <td>${esc(x.comissao)}</td>
        <td class="nowrap">${esc(x.cookie)}</td>
        <td>${x.linkDireto ? '<span class="pill ok">link direto</span>' : '<span class="pill aviso">via página</span>'}</td>
        <td><span class="pill ${x.risco === 'baixo' ? 'ok' : 'aviso'}">risco ${esc(x.risco)}</span></td>
        <td class="mini">${esc(x.obs)}</td>
      </tr>`).join('');

    return `
      <div class="grid c2">
        <div>${card('Sua oferta', `
          <label>Produto / oferta</label>
          <input type="text" data-campo="oferta.nome" value="${esc(o.nome)}" placeholder="ex.: Curso Organização que Cabe">
          <label>Plataforma</label>
          <input type="text" data-campo="oferta.plataforma" value="${esc(o.plataforma)}" placeholder="Hotmart, Kiwify, Amazon, Gumroad...">
          <div class="grid c3">
            <div><label>Preço (R$)</label><input type="text" data-campo="oferta.preco" value="${esc(o.preco)}" placeholder="97"></div>
            <div><label>Comissão (%)</label><input type="text" data-campo="oferta.comissaoPct" value="${esc(o.comissaoPct)}" placeholder="50"></div>
            <div><label>Cookie</label><input type="text" data-campo="oferta.cookie" value="${esc(o.cookie)}" placeholder="180 dias"></div>
          </div>
          <label>Categoria</label>
          <input type="text" data-campo="oferta.categoria" value="${esc(o.categoria)}" placeholder="ex.: decoração / infoproduto de casa">
          <label>Página de destino que o pin vai abrir</label>
          <input type="text" data-campo="oferta.destino" value="${esc(o.destino)}" placeholder="https:// sua página com o aviso de afiliado">
          <div class="ajuda">O link de afiliado em si você cola dentro da página (ou direto no pin, se o programa permitir). Veja a etapa 7.</div>
        `)}</div>
        <div>${card('Quanto isso paga', `
          <div class="grid c2">
            <div class="destaque"><div class="mini">Por venda</div><div class="b" style="font-size:1.5rem">R$ ${est.porVenda.toFixed(2).replace('.', ',')}</div></div>
            <div class="info-caixa"><div class="mini">Cliques por venda (est.)</div><div class="b" style="font-size:1.5rem">${est.precisa.cliquesPorVenda || '—'}</div></div>
          </div>
          <table class="mt"><thead><tr><th>Impressões/mês</th><th>Cliques</th><th>Vendas</th><th>Receita</th></tr></thead>
          <tbody>${est.linhas.map(l => `<tr><td>${l.imp.toLocaleString('pt-BR')}</td><td>${l.cliques.toLocaleString('pt-BR')}</td><td>${l.vendas}</td><td><b>R$ ${l.receita.toFixed(0)}</b></td></tr>`).join('')}</tbody></table>
          <p class="mini mt">Estimativa conservadora (CTR 0,4% · conversão 1%). Serve para comparar ofertas, não para prometer resultado.</p>
        `)}</div>
      </div>

      ${card('Validação do produto — 12 critérios', checklistHTML('produto'), `<span class="pill ${res.cor === 'verde' ? 'ok' : res.cor === 'vermelho' ? 'erro' : 'aviso'}">${res.score}/100</span>`)}

      ${caixaPrompt('ofertas', { nicho: proj.nicho.nome, sub: proj.nicho.sub, produto: o.nome, tipoOferta: o.categoria, publico: proj.publico }, proj.lang, { altura: 'curto' })}

      ${card('Onde encontrar as ofertas (dados de 2026)', `
        <div class="rolagem"><table>
          <thead><tr><th>Tipo</th><th>Comissão</th><th>Cookie</th><th>Pinterest</th><th>Risco</th><th>Observação</th></tr></thead>
          <tbody>${tabela}</tbody>
        </table></div>
        <p class="mini mt">Sempre confirme os termos atuais no painel do programa — eles mudam. Regra prática: comece por 1 oferta principal + 2 secundárias do mesmo nicho.</p>
      `)}`;
  }

  /* ---------- 3 · ÂNGULOS ---------- */
  function passoAngulos() {
    if (!proj.angulos.length) {
      return card('Gere seus ângulos', `
        <p>Um único tema rende 10 ângulos diferentes. O Pinterest premia volume de <b>designs frescos</b> (imagem inédita), e o top 1% dos pins puxa mais de 50% dos resultados — ou seja, é jogo de testar muitos ângulos.</p>
        <p class="mini">Preencha a palavra-chave na etapa 1 ou no topo e clique abaixo.</p>
        <button class="btn primario" id="btnGerarAngulos">⚡ Gerar 10 ângulos agora</button>
        ${caixaPrompt('angulos', { keyword: proj.keyword, nicho: proj.nicho.nome, sub: proj.nicho.sub, produto: proj.oferta.nome }, proj.lang, { altura: 'curto' })}
      `);
    }
    const linhas = proj.angulos.map(a => `
      <tr>
        <td><input type="checkbox" data-angulo="${a.id}" ${a.escolhido ? 'checked' : ''}></td>
        <td><b>${esc(a.formato)}</b><br><span class="mini">${esc(a.gatilho)}</span></td>
        <td>${esc(a.titulo)}</td>
        <td class="mini">${esc(a.estiloNome)}</td>
        <td class="mini">${esc(a.destino)}</td>
      </tr>`).join('');
    const marcados = proj.angulos.filter(a => a.escolhido);
    return `
      ${card('Seus 10 ângulos', `
        <p class="mini">Marque de 3 a 5 ângulos para produzir primeiro. Cada um vira de 3 a 5 pins diferentes.</p>
        <div class="rolagem"><table>
          <thead><tr><th></th><th>Formato</th><th>Título (overlay)</th><th>Estilo</th><th>Destino</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table></div>
        <div class="linha mt">
          <button class="btn" id="btnGerarAngulos">🔄 Regerar</button>
          <button class="btn primario" data-passo="4">Ir para o visual →</button>
          <span class="pill accent">${marcados.length} ângulo(s) marcado(s)</span>
        </div>
      `)}
      ${caixaPrompt('angulos', { keyword: proj.keyword, nicho: proj.nicho.nome, produto: proj.oferta.nome, publico: proj.publico }, proj.lang, { altura: 'curto' })}
      ${caixaPrompt('titulo', { keyword: proj.keyword, nicho: proj.nicho.nome, estilo: proj.estilo.nome, tituloAtual: marcados[0] ? marcados[0].titulo : '' }, proj.lang, { altura: 'curto' })}`;
  }

  /* ---------- 4 · VISUAL ---------- */
  function passoVisual() {
    const doNicho = D.ESTILOS.filter(e => !proj.nicho.id || e.nichos.includes(proj.nicho.id));
    const outros = D.ESTILOS.filter(e => !doNicho.includes(e));
    const cartaoEstilo = (e) => `
      <button class="opcao ${proj.estilo.id === e.id ? 'on' : ''}" data-estilo="${e.id}">
        <div class="tt">${esc(L(e.nome, e.en))} ${e.forca === 'alta' ? '<span class="pill ok">mais visto</span>' : '<span class="pill">nicho</span>'}</div>
        <div class="ds">${esc(e.porque)}</div>
        <div class="tags">${e.nichos.slice(0, 5).map(x => `<span class="pill">${esc(x)}</span>`).join('')}</div>
      </button>`;
    const sel = D.ESTILOS.find(e => e.id === proj.estilo.id);
    return `
      <div class="info-caixa mb"><b>O visual que mais se vê no Pinterest em 2026:</b> ${esc(D.BM.design.proporcao)} · texto de ${esc(D.BM.design.texto)} · ${esc(D.BM.design.fundo)} · ${esc(D.BM.design.impressoes)}.</div>
      <h3>Recomendados para o seu nicho</h3>
      <div class="grid c3">${doNicho.map(cartaoEstilo).join('')}</div>
      <h3 class="mt2">Outros estilos que funcionam</h3>
      <div class="grid c3">${outros.map(cartaoEstilo).join('')}</div>
      ${sel ? `<div class="card mt2">
        <h3>Fragmento de prompt do estilo escolhido <span class="pill accent">${esc(sel.nome)}</span></h3>
        <p class="mini">Use esta base em inglês em TODOS os pins para a conta ficar reconhecível no feed.</p>
        <div class="prompt curto" id="fragEstilo">${esc(sel.en)}</div>
        <div class="linha mt">
          <button class="btn mini" data-copiar-id="fragEstilo">📋 Copiar base</button>
          <span class="pill ${sel.forca === 'alta' ? 'ok' : ''}">força no feed: ${esc(sel.forca)}</span>
        </div>
        <div class="aviso-caixa mt"><b>Evite:</b> ${esc(sel.evitar)}</div>
      </div>` : ''}
      <div class="mt">${caixaPrompt('visual', { keyword: proj.keyword, nicho: proj.nicho.nome, sub: proj.nicho.sub, estilo: sel ? sel.nome : '', produto: proj.oferta.nome, publico: proj.publico }, proj.lang, { altura: 'curto' })}</div>
      <div class="mt">${caixaPrompt('packImagens', { keyword: proj.keyword, nicho: proj.nicho.nome, estilo: sel ? sel.nome : '', produto: proj.oferta.nome }, proj.lang, { altura: 'curto' })}</div>
      ${card('Onde gerar as imagens de graça (2026)', `
        <div class="rolagem"><table>
          <thead><tr><th>Ferramenta</th><th>Grátis por dia/mês</th><th>Marca d'água</th><th>Uso comercial no plano grátis</th><th>Melhor para</th></tr></thead>
          <tbody>
            <tr><td><b>Bing Image Creator / Microsoft Designer</b></td><td>Gerações lentas ilimitadas + boosts semanais</td><td>Não (só um selo discreto)</td><td>Verifique os termos — a versão de consumidor do Designer restringe uso comercial</td><td>Volume alto, DALL·E 3</td></tr>
            <tr><td><b>Leonardo AI</b></td><td>~150 tokens/dia (≈30-50 imagens)</td><td>Não</td><td>Sim, licença não exclusiva (saída é pública)</td><td>Variedade de estilos</td></tr>
            <tr><td><b>Ideogram</b></td><td>~10 a 25/dia (fila lenta)</td><td>Não</td><td>Sim</td><td>Texto dentro da imagem</td></tr>
            <tr><td><b>Adobe Firefly</b></td><td>~25 créditos/mês</td><td>Não</td><td>Sim — treinado em conteúdo licenciado</td><td>Segurança jurídica</td></tr>
            <tr><td><b>Canva (grátis)</b></td><td>Recursos de IA limitados no plano grátis</td><td>Não</td><td>Sim, para os seus designs</td><td>Montar o pin e o overlay</td></tr>
          </tbody>
        </table></div>
        <div class="aviso-caixa mt">Duas regras que evitam dor de cabeça: (1) gere em <b>vertical 2:3</b> desde o começo; (2) <b>nunca</b> peça texto dentro da imagem — texto torto de IA é o principal sinal de "pin amador". O texto entra no Canva.</div>
      `)}`;
  }

  /* ---------- 5 · COPY ---------- */
  function passoCopy() {
    const marcadoss = proj.angulos.filter(a => a.escolhido);
    const ctx = {
      keyword: proj.keyword, nicho: proj.nicho.nome, sub: proj.nicho.sub, produto: proj.oferta.nome,
      estilo: proj.estilo.nome, angulo: marcadoss[0] ? marcadoss[0].titulo : '', tituloAtual: marcadoss[0] ? marcadoss[0].titulo : ''
    };
    return `
      ${card('As 5 regras do texto que rankeia', `
        <div class="grid c2">
          <div>
            <p><b>1. Título 40-60 caracteres.</b> Títulos ricos em palavra-chave rendem +67% de impressões. Sem CAIXA ALTA.</p>
            <p><b>2. Overlay de 5 a 8 palavras</b> em bold. Pin com texto bem feito soma +110% de cliques contra pin sem texto.</p>
            <p><b>3. Descrição de 2 a 4 linhas naturais.</b> Palavra-chave + 1 sinônimo, escrita para humano.</p>
          </div>
          <div>
            <p><b>4. Hashtags: no máximo 5.</b> Elas pesam ~1% hoje. A keyword no título, na descrição e no nome do arquivo pesa muito mais.</p>
            <p><b>5. Alt text sempre preenchido.</b> Descreva a imagem em uma frase. Ajuda no ranking e na acessibilidade.</p>
            <div class="destaque">Nomeie o arquivo com a keyword: <code>organizacao-cozinha-pequena-1.png</code> e nunca <code>IMG_2931.png</code>.</div>
          </div>
        </div>
      `)}
      <div class="grid c2">
        <div>${caixaPrompt('fichaPin', ctx, proj.lang, { altura: 'curto' })}</div>
        <div>${caixaPrompt('titulo', ctx, proj.lang, { altura: 'curto' })}</div>
      </div>
      ${card('Anatomia de um pin que converte', `
        <div class="grid c3">
          <div class="ok-caixa"><b>Faça</b><br>• 1000×1500 px<br>• 1 foco visual só<br>• Fundo claro ou quente<br>• 5-8 palavras em bold<br>• Margem de 8-10%</div>
          <div class="perigo-caixa"><b>Não faça</b><br>• Pin quadrado ou horizontal<br>• Borda grossa (-9% impressões)<br>• 3 fontes diferentes<br>• Texto pequeno demais<br>• Marca d'água de outra rede</div>
          <div class="info-caixa"><b>Testar sempre</b><br>• 3-5 designs por ângulo<br>• Variação de fundo<br>• Variação de verbo no título<br>• 72h entre pins do mesmo link</div>
        </div>
      `)}`;
  }

  /* ---------- 6 · VÍDEO E CARROSSEL ---------- */
  function passoVideo() {
    const ctx = { keyword: proj.keyword, nicho: proj.nicho.nome, produto: proj.oferta.nome, estilo: proj.estilo.nome, angulo: (proj.angulos.find(a => a.escolhido) || {}).titulo || '' };
    return `
      <div class="grid c2">
        <div class="info-caixa"><b>Vídeo:</b> +185% de impressões, porém ~3x menos cliques de saída que o estático. Use para alcance e novos seguidores.</div>
        <div class="ok-caixa"><b>Estático:</b> 4,8 cliques de saída por 1.000 impressões contra 1,6 do vídeo. Use para vender e levar tráfego.</div>
      </div>
      <div class="mt">${card('Como montar o mix de formatos', `
        <table>
          <thead><tr><th>Meta</th><th>Formato</th><th>Por quê</th><th>Proporção sugerida</th></tr></thead>
          <tbody>
            <tr><td>Vender / levar tráfego</td><td>Estático 1000×1500</td><td>3x mais cliques de saída</td><td class="b">60-70%</td></tr>
            <tr><td>Alcance e novos olhos</td><td>Video pin 1080×1920 (6-15s)</td><td>+185% impressões</td><td class="b">20-30%</td></tr>
            <tr><td>Contar história / tutorial</td><td>Carrossel (até 5 slides)</td><td>+112 impressões mantendo cliques</td><td class="b">10%</td></tr>
          </tbody>
        </table>
      `)}</div>
      <div class="grid c2">
        <div>${caixaPrompt('video', ctx, proj.lang, { altura: 'curto' })}</div>
        <div>${caixaPrompt('carrossel', ctx, proj.lang, { altura: 'curto' })}</div>
      </div>
      ${card('Produção de vídeo grátis (e sem marca d´água)', `
        <div class="rolagem"><table>
          <thead><tr><th>Ferramenta</th><th>Grátis</th><th>Marca d'água</th><th>Uso comercial no grátis</th><th>Papel no fluxo</th></tr></thead>
          <tbody>
            <tr><td><b>CapCut (desktop)</b></td><td>Editor completo, exporta até 1080p/4K</td><td>Não, no desktop</td><td>Sim, para conteúdo seu</td><td>Camada de finalização, legendas automáticas, TTS</td></tr>
            <tr><td><b>Canva grátis</b></td><td>Editor de vídeo + templates</td><td>Não</td><td>Sim, para seus designs</td><td>Montar o video pin com overlay fixo</td></tr>
            <tr><td><b>Kling AI</b></td><td>~66 créditos/dia (~3-6 clipes)</td><td>Sim no grátis</td><td>Não no grátis</td><td>Testar image-to-video antes de pagar</td></tr>
            <tr><td><b>Hailuo / MiniMax</b></td><td>~3-5 gerações/dia</td><td>Sim no grátis</td><td>Não no grátis</td><td>Testar movimento realista</td></tr>
          </tbody>
        </table></div>
        <div class="perigo-caixa mt"><b>Atenção jurídica:</b> em 2026 a maioria dos planos grátis de geradores de vídeo <b>proíbe uso comercial</b>. Para monetizar com segurança: gere as imagens em ferramenta com uso comercial liberado, <b>anime você mesmo</b> no CapCut (zoom, parallax, cortes) usando apenas material próprio. Isso é 100% seu e sem marca d'água.</div>
      `)}`;
  }

  /* ---------- 7 · DESTINO E LINK ---------- */
  function passoDestino() {
    const o = proj.oferta;
    const ctx = { keyword: proj.keyword, nicho: proj.nicho.nome, produto: o.nome, tipoOferta: o.categoria, publico: proj.publico, linkAfiliado: o.linkAfiliado, estilo: proj.estilo.nome };
    return `
      ${card('Como o link entra (e por que ele é manual)', `
        <p>O app <b>não</b> guarda nem publica seu link de afiliado automaticamente. Isso é proposital e é mais seguro:</p>
        <ul>
          <li>Você mantém o controle de qual link está em qual pin;</li>
          <li>Encurtadores (bit.ly, tinyurl) <b>são bloqueados pelo Pinterest</b> — use sempre a URL completa;</li>
          <li>Se um link for derrubado, você troca em segundos sem perder os pins.</li>
        </ul>
        <div class="destaque"><b>Fluxo recomendado:</b> pin → sua página com o aviso de afiliado → oferta. Assim você fica imune à restrição de programas que proíbem link direto (Etsy é o caso clássico) e ainda ganha uma camada de conteúdo que ranqueia no Google.</div>
      `)}
      <div class="grid c2">
        <div>${card('Seu link (fica salvo só no seu navegador)', `
          <label>Link de afiliado completo</label>
          <input type="text" data-campo="oferta.linkAfiliado" value="${esc(o.linkAfiliado)}" placeholder="https://pay.hotmart.com/XXXX?ref=XXXX">
          <div class="ajuda">Cole aqui só para o app montar o pack. Nada é enviado para servidor nenhum.</div>
          <label>URL da sua página de destino</label>
          <input type="text" data-campo="oferta.destino" value="${esc(o.destino)}" placeholder="https://seusite.com/organizacao-cozinha">
          <div class="linha mt">
            <span class="pill ${o.linkDireto ? 'ok' : 'aviso'}">${o.linkDireto ? 'programa permite link direto' : 'usar página intermediária'}</span>
            <button class="btn mini" data-toggle="linkDireto">alternar</button>
          </div>
          <div class="perigo-caixa mt"><b>Antes de publicar:</b> teste o link em janela anônima. Link quebrado derruba a confiança do domínio no Pinterest.</div>
        `)}</div>
        <div>${caixaPrompt('pagina', ctx, proj.lang, { altura: 'curto' })}</div>
      </div>
      ${card('Modelo de aviso de afiliado (copie e cole)', `
        <div class="grid c2">
          <div>
            <div class="mini b">Português</div>
            <div class="prompt curto" id="avisoPt">Este conteúdo contém link de afiliado. Se você comprar por ele, eu posso receber uma comissão, sem nenhum custo extra para você. #afiliado #ad

Como associado(a) [Amazon/plataforma], eu ganho por compras qualificadas.</div>
            <button class="btn mini mt" data-copiar-id="avisoPt">📋 Copiar</button>
          </div>
          <div>
            <div class="mini b">English</div>
            <div class="prompt curto" id="avisoEn">This post contains affiliate links. If you buy through them, I may earn a commission at no extra cost to you. #affiliate #ad

As an [Amazon/other] Associate I earn from qualifying purchases.</div>
            <button class="btn mini mt" data-copiar-id="avisoEn">📋 Copiar</button>
          </div>
        </div>
      `)}`;
  }

  /* ---------- 8 · VALIDAÇÃO ---------- */
  function passoValidacao() {
    const bloco = (qual, titulo, desc) => {
      const res = M.calcularScoreProjeto(proj, qual);
      const cor = res.cor === 'verde' ? 'ok' : res.cor === 'vermelho' ? 'erro' : res.cor === 'cinza' ? '' : 'aviso';
      return card(titulo, `<p class="mini">${desc}</p>` + checklistHTML(qual), `<span class="pill ${cor}">${res.score}/100</span>`);
    };
    const geral = ['produto', 'visual', 'seo', 'compliance'].map(q => M.calcularScoreProjeto(proj, q));
    const media = Math.round(geral.reduce((s, r) => s + r.score, 0) / 4);
    const bloqueios = geral.reduce((s, r) => s + r.bloqueios.length, 0);
    return `
      ${card('Placar geral', scoreHTML({ score: media, veredito: bloqueios ? 'Existem ' + bloqueios + ' bloqueio(s) de peso 3 — resolva antes de escalar' : media >= 85 ? 'Aprovado para escalar' : media >= 65 ? 'Viável com ajustes' : 'Fraco — revise as etapas anteriores', cor: bloqueios ? 'vermelho' : media >= 85 ? 'verde' : media >= 65 ? 'amarelo' : 'vermelho', pesoOk: 0, pesoTotal: 0, falhas: [], bloqueios: [], pendentes: [] }) + '<div class="mini">Média dos 4 checklists: produto, visual, SEO e compliance.</div>')}
      ${bloco('produto', '1 · Produto e oferta', 'Os itens de peso 3 bloqueiam: sem oferta aprovada, sem dor concreta ou com link proibido, não há projeto.')}
      ${bloco('visual', '2 · Visual', 'Peso 3 aqui são os erros que jogam contra o próprio algoritmo do Pinterest.')}
      ${bloco('seo', '3 · SEO', 'Peso 3: keyword definida, título 40-60 caracteres e descrição com contexto.')}
      ${bloco('compliance', '4 · Compliance e risco', 'É aqui que contas morrem. Peso 3: aviso de afiliado no pin e na página + ausência de encurtador.')}
      <div class="mt">${caixaPrompt('compliance', { keyword: proj.keyword, produto: proj.oferta.nome, tipoOferta: proj.oferta.categoria, linkAfiliado: proj.oferta.linkAfiliado, tituloAtual: (proj.pins[0] || {}).titulo || '' }, proj.lang, { altura: 'curto' })}</div>`;
  }

  /* ---------- 9 · PACK ---------- */
  function passoPack() {
    const pins = proj.pins;
    const lista = pins.map((pin, i) => `
      <div class="pin-card">
        <div class="pin-thumb">2:3<br>1000×1500<br><span class="mini">${esc(pin.estiloNome || '')}</span></div>
        <div class="pin-corpo">
          <h4>${i + 1}. ${esc(pin.titulo)}</h4>
          <div class="linha">
            <span class="pill">${esc(pin.formato)}</span>
            <span class="pill accent">${esc(pin.board)}</span>
            <span class="pill">${pin.titulo.length} car.</span>
            <span class="pill ${pin.titulo.length >= 40 && pin.titulo.length <= 60 ? 'ok' : 'aviso'}">${pin.titulo.length >= 40 && pin.titulo.length <= 60 ? 'tamanho ideal' : 'ajustar 40-60'}</span>
          </div>
          <p class="mini mt">${esc(pin.descricao)}</p>
          <details>
            <summary class="mini" style="cursor:pointer">Prompt da imagem · arquivo · hashtags</summary>
            <div class="prompt curto mt" id="ppin${i}">${esc(pin.promptImagem)}</div>
            <div class="mini mt"><b>Arquivo:</b> ${esc(pin.arquivo)} · <b>Hashtags:</b> ${esc(pin.hashtags)} · <b>Destino:</b> ${esc(proj.oferta.destino || proj.oferta.linkAfiliado || '[COLAR LINK]')}</div>
            <div class="linha mt"><button class="btn mini" data-copiar-id="ppin${i}">📋 Copiar prompt</button></div>
          </details>
        </div>
      </div>`).join('');

    return `
      ${card('Produza o pack', `
        <p>O pack é a sua linha de produção. Regra: <b>3 a 5 pins por dia, por 90 dias</b> — é o que aumenta as impressões por pin em 22% e o que o Pinterest premia (pin fresco).</p>
        <div class="linha">
          <button class="btn primario" id="btnGerarPack">⚡ Gerar 10 pins</button>
          <button class="btn" id="btnGerarPack20">⚡ Gerar 20 pins</button>
          ${pins.length ? '<button class="btn" id="btnExportMD">⬇ Markdown</button><button class="btn" id="btnExportCSV">⬇ CSV</button><button class="btn" id="btnExportJSON">⬇ JSON</button>' : ''}
          ${pins.length ? '<button class="btn perigo" id="btnLimparPins">Limpar pack</button>' : ''}
        </div>
        <div class="mini mt">${pins.length} pin(s) no pack · ${pins.filter(p => p.formato === 'video' || p.formato === 'vídeo').length} em vídeo</div>
      `)}
      ${pins.length ? lista : `<div class="aviso-caixa">Nenhum pin ainda. Volte à etapa 3 se não tiver ângulos marcados — o gerador usa os ângulos selecionados.</div>`}
      ${pins.length ? card('Como executar o pack (1 hora de trabalho)', `
        <ol>
          <li><b>15 min</b> — cole cada prompt de imagem no gerador grátis e baixe as que passarem no teste do olho (teste no celular, brilho a 30%).</li>
          <li><b>20 min</b> — Canva: monte um template mestre 1000×1500 e duplique. Só troque imagem e overlay.</li>
          <li><b>10 min</b> — renomeie os arquivos com a keyword e exporte em PNG.</li>
          <li><b>15 min</b> — publique ou agende (agendador nativo grátis, Metricool grátis ou Buffer grátis) e cole o link na mão em cada pin.</li>
        </ol>
        <div class="perigo-caixa">Antes de publicar, confira: aviso de afiliado na descrição ✓ · link completo sem encurtador ✓ · board relevante ✓ · mínimo 72h entre pins do mesmo link ✓</div>
      `) : ''}`;
  }

  /* ---------- 10 · PUBLICAR E MEDIR ---------- */
  function passoPublicar() {
    const m = proj.metricas;
    const imp = parseFloat(m.impressoes) || 0, cli = parseFloat(m.cliques) || 0, ven = parseFloat(m.vendas) || 0;
    const ctr = imp ? (cli / imp * 100) : 0;
    const conv = cli ? (ven / cli * 100) : 0;
    const calc = (v, bom, medio) => v >= bom ? 'ok' : v >= medio ? 'aviso' : 'erro';
    const fases = ['Fundação', 'Pesquisa', 'Validação', 'Ângulos', 'Visual', 'Produção', 'Publicação', 'Métricas', 'Escala', 'Compliance', 'Otimização', 'Decisão'];
    return `
      ${card('Calendário de 30 dias (o caminho completo)', `
        <p class="mini">Cada dia tem uma tarefa. Marque conforme avança — leva de 30 a 60 minutos por dia.</p>
        <div class="rolagem"><table>
          <thead><tr><th>Dia</th><th>Fase</th><th>Tarefa</th></tr></thead>
          <tbody>${D.ROTINA_30.map(r => `<tr><td class="b">${r.d}</td><td><span class="pill ${r.fase === 'Compliance' ? 'erro' : r.fase === 'Decisão' ? 'accent' : ''}">${esc(r.fase)}</span></td><td>${esc(r.tarefa)}</td></tr>`).join('')}</tbody>
        </table></div>
        <div class="linha mt">${botaoCopiar(D.ROTINA_30.map(r => 'Dia ' + r.d + ' — ' + r.tarefa).join('\n'), '📋 Copiar os 30 dias', 'suave')}</div>
      `)}
      <div class="grid c2">
        <div>${card('Suas métricas dos últimos 30 dias', `
          <div class="grid c2">
            <div><label>Impressões</label><input type="number" data-campo="metricas.impressoes" value="${esc(m.impressoes)}" placeholder="12000"></div>
            <div><label>Cliques de saída</label><input type="number" data-campo="metricas.cliques" value="${esc(m.cliques)}" placeholder="60"></div>
            <div><label>Saves</label><input type="number" data-campo="metricas.saves" value="${esc(m.saves)}" placeholder="140"></div>
            <div><label>Sessões na página</label><input type="number" data-campo="metricas.sessoes" value="${esc(m.sessoes)}" placeholder="45"></div>
            <div><label>Vendas</label><input type="number" data-campo="metricas.vendas" value="${esc(m.vendas)}" placeholder="1"></div>
            <div><label>Receita (R$)</label><input type="number" data-campo="metricas.receita" value="${esc(m.receita)}" placeholder="48"></div>
          </div>
          <div class="grid c3 mt">
            <div class="card tight"><div class="mini">CTR de saída</div><div class="b" style="font-size:1.3rem">${ctr.toFixed(2)}%</div><span class="pill ${calc(ctr, 0.5, 0.3)}">${ctr >= 0.5 ? 'bom' : ctr >= 0.3 ? 'ok' : 'baixo'}</span></div>
            <div class="card tight"><div class="mini">Conversão</div><div class="b" style="font-size:1.3rem">${conv.toFixed(2)}%</div><span class="pill ${calc(conv, 1, 0.5)}">${conv >= 1 ? 'bom' : conv >= 0.5 ? 'ok' : 'baixo'}</span></div>
            <div class="card tight"><div class="mini">Receita / 1k impressões</div><div class="b" style="font-size:1.3rem">R$ ${imp ? (parseFloat(m.receita) || 0) / imp * 1000 : 0}</div><span class="pill">${imp ? 'comparável' : 'informe os dados'}</span></div>
          </div>
          <div class="info-caixa mt"><b>Benchmarks:</b> CTR de saída 0,3% a 1% · save 5+/1k em estático · conversão 0,5% a 2%. Não olhe likes: eles não são o objetivo.</div>
        `)}</div>
        <div>${caixaPrompt('diagnostico', {
          keyword: proj.keyword, nicho: proj.nicho.nome, produto: proj.oferta.nome, estilo: proj.estilo.nome,
          metricas: `impressões: ${m.impressoes || '-'} | saves: ${m.saves || '-'} | cliques: ${m.cliques || '-'} | sessões: ${m.sessoes || '-'} | vendas: ${m.vendas || '-'} | receita: R$ ${m.receita || '-'}`
        }, proj.lang, { altura: 'curto' })}</div>
      </div>
      ${card('O que medir e como ler', `
        <table>
          <thead><tr><th>KPI</th><th>Meta</th><th>Como ler</th></tr></thead>
          <tbody>${D.METRICAS_GUIA.map(k => `<tr><td class="b">${esc(k.kpi)}</td><td>${esc(k.meta)}</td><td class="mini">${esc(k.leitura)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="destaque mt"><b>A decisão olímpica:</b> se impressões sobem mas cliques não → o problema é a promessa/visual do pin. Se cliques sobem mas vendas não → o problema é a página de destino ou a oferta. Um problema por vez.</div>
      `)}
      ${card('Calendário em lote', caixaPrompt('calendario', { nicho: proj.nicho.nome, keyword: proj.keyword, produto: proj.oferta.nome, ofertas: proj.oferta.nome }, proj.lang, { altura: 'curto' }))}`;
  }

  /* ---------- 11 · BIBLIOTECA DE PROMPTS ---------- */
  function passoPrompts() {
    const ctx = {
      nicho: proj.nicho.nome, sub: proj.nicho.sub, keyword: proj.keyword, produto: proj.oferta.nome,
      tipoOferta: proj.oferta.categoria, comissao: proj.oferta.comissaoPct, publico: proj.publico,
      estilo: proj.estilo.nome, marca: proj.marca, linkAfiliado: proj.oferta.linkAfiliado,
      tituloAtual: (proj.pins[0] || {}).titulo || '', angulo: (proj.angulos.find(a => a.escolhido) || {}).titulo || ''
    };
    const todos = P.CATALOGO.map(c => c.id);
    const pt = todos.map(id => caixaPrompt(id, ctx, 'pt')).join('');
    const en = todos.map(id => caixaPrompt(id, ctx, 'en')).join('');
    return `
      <div class="info-caixa mb">São 15 geradores. Os prompts usam automaticamente o que você já preencheu (nicho, keyword, produto, estilo, link).
      Funcionam 100% grátis: copie e cole no ChatGPT / Gemini / Claude. Se quiser gerar direto pelo app, configure a chave na aba <b>Integrações</b> (opcional).</div>
      <div class="abas">
        <button class="aba on" data-aba="pt">🇧🇷 Português (15)</button>
        <button class="aba" data-aba="en">🇺🇸 English (15)</button>
      </div>
      <div id="aba-pt">${pt}</div>
      <div id="aba-en" class="escondido">${en}</div>`;
  }

  /* ---------- 12 · BÍBLIA ---------- */
  function passoBiblia() {
    const B = window.PM_BIBLIA || {};
    const caps = B.capitulos || [];
    if (!caps.length) return '<div class="aviso-caixa">A Bíblia não foi carregada. Os capítulos estão na pasta <code>BIBLIA/</code> do repositório.</div>';
    return `
      <div class="info-caixa mb">A Bíblia é o método completo em 16 capítulos — os mesmos que alimentam este app.</div>
      <div class="card">
        <h3>Capítulos</h3>
        <div class="biblia-nav">
          ${caps.map((c, i) => `<a href="#cap${i}" data-cap="${i}">${String(i + 1).padStart(2, '0')} · ${esc(c.titulo)}</a>`).join('')}
        </div>
      </div>
      <div id="capConteudo"></div>`;
  }

  /* ---------- 13 · CONFIG ---------- */
  function passoConfig() {
    const cfg = M.config();
    return `
      ${card('Modo offline (padrão — nada a configurar)', `
        <p>O app funciona inteiro <b>sem nenhuma chave</b>. Você copia o prompt, cola no ChatGPT/Gemini grátis e traz a resposta de volta. É o caminho recomendado: custo zero e nenhum dado seu sai do navegador.</p>
        <div class="ok-caixa">Todos os seus projetos ficam no <code>localStorage</code> deste navegador. Use o botão <b>Exportar</b> no topo para salvar em JSON.</div>
      `)}
      ${card('Opcional 1 · Gerar texto direto pelo app (API de IA)', `
        <p class="mini">Qualquer endpoint compatível com OpenAI funciona (OpenAI, Groq, OpenRouter, Together, Ollama local). Deixe em branco para não usar.</p>
        <div class="grid c2">
          <div><label>Endpoint base</label><input type="text" data-cfg="baseIA" value="${esc(cfg.baseIA || '')}" placeholder="https://api.openai.com/v1"></div>
          <div><label>Modelo</label><input type="text" data-cfg="modeloIA" value="${esc(cfg.modeloIA || '')}" placeholder="gpt-4o-mini"></div>
        </div>
        <label>Chave da API</label>
        <input type="password" data-cfg="chaveIA" value="${esc(cfg.chaveIA || '')}" placeholder="sk-...">
        <div class="perigo-caixa mt"><b>Aviso:</b> a chave fica salva no seu navegador em texto simples. Não use em computador compartilhado, não comite esse valor no Git e prefira chaves com limite de gasto.</div>
      `)}
      ${card('Opcional 2 · Publicar direto no Pinterest (API v5)', `
        <p class="mini">A API v5 do Pinterest é gratuita, mas tem dois degraus:</p>
        <table>
          <thead><tr><th>Degrau</th><th>Como obtém</th><th>Pins criados</th><th>Limite</th></tr></thead>
          <tbody>
            <tr><td><b>Trial</b></td><td>Automático após aprovar o app em developers.pinterest.com</td><td>Ficam <b>visíveis só para você</b> (sandbox)</td><td>1.000 requisições/dia</td></tr>
            <tr><td><b>Standard</b></td><td>Requer revisão com <b>vídeo demonstrando o OAuth</b></td><td>Públicos, iguais a um pin normal</td><td>100 req/s por usuário</td></tr>
          </tbody>
        </table>
        <div class="aviso-caixa mt"><b>Importante:</b> as diretrizes do Pinterest proíbem apps que <b>executam ações automaticamente sem que o usuário considere cada ação</b>. Ou seja: publicar em massa por API viola os termos. Use a API para publicar pin a pin, com revisão humana — ou simplesmente cole na interface (que é grátis e funciona).</div>
        <div class="grid c2">
          <div><label>Access token (30 dias)</label><input type="password" data-cfg="tokenPinterest" value="${esc(cfg.tokenPinterest || '')}" placeholder="pina_..."></div>
          <div><label>Board ID</label><input type="text" data-cfg="boardId" value="${esc(cfg.boardId || '')}" placeholder="123456789012345678"></div>
        </div>
        <div class="linha mt">
          <button class="btn mini" id="btnTestarPinterest">Testar conexão (listar boards)</button>
          <span class="mini">Escopos necessários: boards:read, boards:write, pins:read, pins:write</span>
        </div>
      `)}
      ${card('Ferramentas grátis que completam o fluxo', `
        <table>
          <thead><tr><th>Etapa</th><th>Ferramenta grátis</th><th>Limite do plano grátis</th></tr></thead>
          <tbody>
            <tr><td>Imagem</td><td>Bing Image Creator, Leonardo, Ideogram, Firefly</td><td>ver tabela na etapa 4</td></tr>
            <tr><td>Design do pin</td><td>Canva grátis</td><td>sem limite de designs</td></tr>
            <tr><td>Vídeo</td><td>CapCut desktop, Canva</td><td>exporta sem marca d'água</td></tr>
            <tr><td>Agendamento</td><td>Agendador nativo do Pinterest</td><td>10 pins na fila, 14 dias (desktop) / 30 dias (app)</td></tr>
            <tr><td>Agendamento</td><td>Metricool grátis</td><td>~20 publicações/mês</td></tr>
            <tr><td>Agendamento</td><td>Buffer grátis</td><td>até 10 posts na fila por canal</td></tr>
            <tr><td>Pesquisa de tendência</td><td>Pinterest Trends + busca guiada</td><td>grátis</td></tr>
            <tr><td>Documentos do pack</td><td>Este app (Markdown / CSV / JSON)</td><td>ilimitado</td></tr>
          </tbody>
        </table>
      `)}`;
  }

  /* =====================================================================
     EVENTOS
     ===================================================================== */
  function ligarEventos() {
    document.addEventListener('click', (ev) => {
      const alvo = ev.target.closest('[data-passo],[data-nicho],[data-sub],[data-estilo],[data-angulo],[data-check],[data-cfg],[data-toggle],[data-aba],[data-cap],#btnGerarAngulos,#btnGerarPack,#btnGerarPack20,#btnExportar,#btnNovo,#btnConfig,#btnExportMD,#btnExportCSV,#btnExportJSON,#btnLimparPins,#btnTestarPinterest');
      if (!alvo) return;

      /* navegação */
      if (alvo.dataset.passo !== undefined) { passo = parseInt(alvo.dataset.passo, 10); renderConteudo(); atualizarLateral(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

      /* nicho */
      if (alvo.dataset.nicho) {
        const n = D.NICHOS.find(x => x.id === alvo.dataset.nicho);
        proj.nicho = { id: n.id, nome: L(n.pt, n.en), sub: '', demanda: n.demanda, monet: n.monet, ia: n.ia };
        M.registrar(proj, 'Nicho definido: ' + proj.nicho.nome);
        redesenhar(); return;
      }
      if (alvo.dataset.sub !== undefined) {
        proj.nicho.sub = alvo.dataset.sub;
        proj.keyword = alvo.dataset.sub;
        M.registrar(proj, 'Sub-nicho: ' + proj.nicho.sub);
        redesenhar(); return;
      }

      /* estilo */
      if (alvo.dataset.estilo) {
        const e = D.ESTILOS.find(x => x.id === alvo.dataset.estilo);
        proj.estilo = { id: e.id, nome: L(e.nome, e.en) };
        M.registrar(proj, 'Estilo visual: ' + proj.estilo.nome);
        redesenhar(); return;
      }

      /* ângulos */
      if (alvo.id === 'btnGerarAngulos') {
        proj.angulos = M.gerarAngulos(proj, proj.lang === 'en' ? 'en' : 'pt');
        M.registrar(proj, proj.angulos.length + ' ângulos gerados');
        redesenhar(); return;
      }

      /* pack */
      if (alvo.id === 'btnGerarPack' || alvo.id === 'btnGerarPack20') {
        const qtd = alvo.id === 'btnGerarPack20' ? 20 : 10;
        const lang = proj.lang === 'en' ? 'en' : 'pt';
        const novos = M.gerarPackPins(proj, lang, qtd);
        proj.pins = proj.pins.concat(novos);
        M.registrar(proj, qtd + ' pins gerados no pack');
        redesenhar(); return;
      }
      if (alvo.id === 'btnLimparPins') { proj.pins = []; M.registrar(proj, 'Pack limpo'); redesenhar(); return; }

      /* exportação */
      if (alvo.id === 'btnExportMD') { M.download('pack-pinterest.md', M.exportarMarkdown(proj), 'text/markdown'); return; }
      if (alvo.id === 'btnExportCSV') { M.download('pack-pinterest.csv', '\ufeff' + M.exportarCSV(proj), 'text/csv'); return; }
      if (alvo.id === 'btnExportJSON') { M.exportarJSON(proj); return; }

      /* projeto */
      if (alvo.id === 'btnNovo') {
        const nome = prompt('Nome do novo projeto:', 'Projeto Pinterest');
        if (!nome) return;
        proj = M.novoProjeto(nome, proj.lang);
        M.salvar(proj); atualizarSeletor(); renderConteudo(); atualizarLateral(); return;
      }
      if (alvo.id === 'btnConfig') { passo = 13; renderConteudo(); atualizarLateral(); window.scrollTo(0, 0); return; }
      if (alvo.id === 'btnExportar') {
        passo = 9; renderConteudo(); atualizarLateral(); window.scrollTo(0, 0); return;
      }

      /* checks */
      if (alvo.dataset.check) {
        const [qual, id, v] = alvo.dataset.check.split(':');
        proj.checks[qual] = proj.checks[qual] || {};
        proj.checks[qual][id] = v === '1';
        guardar(); renderConteudo(); return;
      }

      /* aba de idioma */
      if (alvo.dataset.aba) {
        $$('.aba').forEach(a => a.classList.toggle('on', a === alvo));
        $('#aba-pt').classList.toggle('escondido', alvo.dataset.aba !== 'pt');
        $('#aba-en').classList.toggle('escondido', alvo.dataset.aba !== 'en');
        return;
      }

      /* capítulo da bíblia */
      if (alvo.dataset.cap !== undefined) {
        ev.preventDefault();
        const B = window.PM_BIBLIA || {};
        const c = (B.capitulos || [])[parseInt(alvo.dataset.cap, 10)];
        if (!c) return;
        $('#capConteudo').innerHTML = `<div class="card"><h3>${esc(c.titulo)}</h3><div class="md">${c.html}</div></div>`;
        $('#capConteudo').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      /* toggle link direto */
      if (alvo.dataset.toggle === 'linkDireto') { proj.oferta.linkDireto = !proj.oferta.linkDireto; redesenhar(); return; }

      /* testar pinterest */
      if (alvo.id === 'btnTestarPinterest') { testarPinterest(alvo); return; }
    });

    /* inputs */
    document.addEventListener('input', (ev) => {
      const c = ev.target.closest('[data-campo]');
      if (c) {
        const caminho = c.dataset.campo.split('.');
        if (caminho.length === 1) proj[caminho[0]] = c.value;
        else proj[caminho[0]][caminho[1]] = c.value;
        clearTimeout(window.__t); window.__t = setTimeout(() => guardar(), 500);
        return;
      }
      const k = ev.target.closest('[data-cfg]');
      if (k) {
        const cfg = M.config(); cfg[k.dataset.cfg] = k.value; M.salvarConfig(cfg);
        if (k.dataset.cfg === 'chaveIA') proj.iaLigada = !!k.value;
      }
    });

    document.addEventListener('change', (ev) => {
      const a = ev.target.closest('[data-angulo]');
      if (a) {
        const ang = proj.angulos.find(x => x.id === a.dataset.angulo);
        if (ang) ang.escolhido = a.checked;
        guardar(); atualizarLateral();
        return;
      }
      if (ev.target.id === 'seletorProjeto') {
        proj = M.abrir(ev.target.value) || proj; M.salvar(proj); renderConteudo(); atualizarLateral();
      }
    });
  }

  async function testarPinterest(btn) {
    const cfg = M.config();
    if (!cfg.tokenPinterest) { alert('Cole o access token primeiro.'); return; }
    btn.textContent = 'Testando...';
    try {
      const r = await fetch('https://api.pinterest.com/v5/boards', { headers: { Authorization: 'Bearer ' + cfg.tokenPinterest } });
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 160));
      const j = await r.json();
      const n = (j.items || []).length;
      alert('✅ Conexão OK. ' + n + ' board(s) encontrado(s).' + (n ? '\n\nPrimeiros: ' + (j.items || []).slice(0, 5).map(b => b.name + ' — ' + b.id).join('\n') : ''));
    } catch (e) {
      alert('❌ Falhou: ' + e.message + '\n\nLembre-se: no degrau Trial a API responde, mas seus pins ficam privados. Publique em volume apenas pela interface.');
    } finally { btn.textContent = 'Testar conexão (listar boards)'; }
  }

  /* =====================================================================
     INICIALIZAÇÃO
     ===================================================================== */
  function init() {
    proj = carregarOuCriar();
    atualizarSeletor();
    ligarEventos();
    renderConteudo();
    atualizarLateral();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
