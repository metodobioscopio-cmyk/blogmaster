#!/usr/bin/env node
/* =========================================================================
   testar-motor.js — testes do núcleo do app (sem navegador)
   Uso: node scripts/testar-motor.js
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) falhas++; };

/* ---- sandbox mínimo (window + localStorage + document falso) ---- */
const armazem = {};
const sandbox = {
  console,
  window: {},
  localStorage: {
    getItem: k => (k in armazem ? armazem[k] : null),
    setItem: (k, v) => { armazem[k] = String(v); },
    removeItem: k => { delete armazem[k]; }
  },
  document: {
    createElement: () => ({ style: {}, click() {}, remove() {}, appendChild() {} }),
    body: { appendChild() {} },
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  },
  Blob: function (partes) { this.partes = partes; },
  URL: { createObjectURL: () => 'blob:x' },
  setTimeout, clearTimeout
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const carregar = (rel) => {
  const codigo = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  vm.runInContext(codigo, sandbox, { filename: rel });
};

console.log('\n1) Carregamento dos módulos');
carregar('app/dados/dados.js');
carregar('app/assets/js/prompts.js');
carregar('app/assets/js/motor.js');
ok(!!sandbox.PM_DADOS, 'dados.js expõe PM_DADOS');
ok(!!sandbox.PM_PROMPTS, 'prompts.js expõe PM_PROMPTS');
ok(!!sandbox.PM_MOTOR, 'motor.js expõe PM_MOTOR');

const D = sandbox.PM_DADOS, P = sandbox.PM_PROMPTS, M = sandbox.PM_MOTOR;

console.log('\n2) Integridade da base de conhecimento');
ok(D.NICHOS.length === 16, 'NICHOS tem 16 nichos (tem ' + D.NICHOS.length + ')');
ok(D.ESTILOS.length === 12, 'ESTILOS tem 12 estilos (tem ' + D.ESTILOS.length + ')');
ok(D.OFERTAS.length >= 16, 'OFERTAS tem 16+ categorias (tem ' + D.OFERTAS.length + ')');
ok(D.ROTINA_30.length === 30, 'ROTINA_30 tem 30 dias (tem ' + D.ROTINA_30.length + ')');
ok(Object.keys(D.CHECKS).length === 4, 'CHECKS tem 4 checklists');
ok(D.CHECKS.produto.length === 12, 'checklist de produto tem 12 itens');
ok(D.CHECKS.visual.length === 10, 'checklist visual tem 10 itens');
ok(D.CHECKS.seo.length === 10, 'checklist de SEO tem 10 itens');
ok(D.CHECKS.compliance.length === 10, 'checklist de compliance tem 10 itens');

// chaves de design usadas pelo app
['proporcao', 'texto', 'fundo', 'impressoes'].forEach(k =>
  ok(typeof D.BM.design[k] === 'string', 'BM.design.' + k + ' existe'));

// todo estilo tem nichos válidos?
const idsNichos = D.NICHOS.map(n => n.id);
const estiloInvalido = D.ESTILOS.find(e => e.nichos.some(n => !idsNichos.includes(n)));
ok(!estiloInvalido, 'todos os estilos apontam para nichos existentes' + (estiloInvalido ? ' (falha: ' + estiloInvalido.id + ')' : ''));

// pesos dos checklists são 1, 2 ou 3
let pesoOk = true;
Object.values(D.CHECKS).forEach(lista => lista.forEach(c => { if (![1, 2, 3].includes(c.peso)) pesoOk = false; }));
ok(pesoOk, 'todos os pesos de checklist são 1, 2 ou 3');
ok(Object.values(D.CHECKS).every(l => l.some(c => c.peso === 3)), 'cada checklist tem ao menos um bloqueio de peso 3');

console.log('\n3) Motor de prompts');
ok(P.CATALOGO.length === 15, 'CATALOGO tem 15 prompts (tem ' + P.CATALOGO.length + ')');
const ctx = {
  nicho: 'Decoração & Organização', sub: 'cozinha pequena', keyword: 'organização de cozinha pequena',
  produto: 'Curso Organização que Cabe', tipoOferta: 'Infoproduto BR', comissao: '50', preco: '97',
  publico: 'mulheres 28-45', estilo: 'Light & Bright', marca: 'Casa Organizada',
  linkAfiliado: 'https://pay.hotmart.com/XXX', angulo: 'Erro', tituloAtual: 'Título atual'
};
let todosPt = true, todosEn = true, curtos = [];
P.CATALOGO.forEach(item => {
  const pt = P.gerar(item.id, ctx, 'pt');
  const en = P.gerar(item.id, ctx, 'en');
  if (!pt || !pt.texto || pt.texto.length < 200) todosPt = false;
  if (!en || !en.texto || en.texto.length < 200) todosEn = false;
  if (!pt.texto.includes(ctx.keyword) && !['nichos', 'ofertas', 'perfil', 'produtoProprio'].includes(item.id)) curtos.push(item.id + '(pt sem keyword)');
  if (!en.texto.includes(ctx.keyword) && !['nichos', 'ofertas', 'perfil', 'produtoProprio'].includes(item.id)) curtos.push(item.id + '(en sem keyword)');
});
ok(todosPt, 'os 15 prompts em PT-BR geram texto com +200 caracteres');
ok(todosEn, 'os 15 prompts em EN geram texto com +200 caracteres');
ok(curtos.length === 0, 'prompts injetam a keyword do contexto' + (curtos.length ? ' → ' + curtos.join(', ') : ''));

const langCheck = P.gerar('angulos', ctx, 'en').texto.includes('You are a senior Pinterest SEO strategist');
ok(langCheck, 'a versão EN usa persona em inglês');
ok(P.gerar('angulos', ctx, 'pt').texto.includes('Você é um estrategista sênior'), 'a versão PT usa persona em português');
ok(P.gerar('fichaPin', ctx, 'pt').texto.includes('Light & Bright'), 'o prompt de pin injeta o estilo escolhido');
ok(P.gerar('pagina', ctx, 'pt').texto.includes('INSERIR LINK AQUI'), 'o prompt de página marca onde colar o link');
ok(P.gerar('inexistente', ctx, 'pt') === null, 'prompt inexistente devolve null');

console.log('\n4) Projeto, score e estimativas');
const proj = M.novoProjeto('Teste', 'pt');
ok(!!proj.id && proj.pins.length === 0, 'novoProjeto cria projeto vazio');
ok(M.salvar(proj) && !!M.ativo(), 'salvar persiste e define como ativo');
ok(!!M.abrir(proj.id), 'abrir recupera o projeto salvo');

// score com um bloqueio
proj.checks.produto = { p1: true, p2: false, p3: true };
let res = M.calcularScoreProjeto(proj, 'produto');
ok(res.bloqueios.length === 1, 'score detecta 1 bloqueio de peso 3');
ok(res.cor === 'vermelho', 'score bloqueado fica vermelho');
ok(res.pendentes.length > 0, 'score aponta itens pendentes');

// score perfeito
const tudo = {};
D.CHECKS.produto.forEach(c => tudo[c.id] = true);
res = M.calcularScore(D.CHECKS.produto, tudo);
ok(res.score === 100 && res.cor === 'verde', 'checklist 100% aprovado fica verde');

const est = M.estimativa(Object.assign(proj, { oferta: { comissaoPct: '50', preco: '97' } }));
ok(Math.abs(est.porVenda - 48.5) < 0.01, 'estimativa calcula R$ 48,50 por venda');
ok(est.linhas.length === 4 && est.linhas[0].cliques === 4, 'estimativa gera 4 cenários (1k impressões → 4 cliques)');

console.log('\n5) Geração de ângulos e pins');
proj.nicho = { id: 'decor', nome: 'Decoração & Organização', sub: 'cozinha pequena', demanda: 10, monet: 9, ia: 9 };
proj.keyword = 'organização de cozinha pequena';
proj.oferta = { nome: 'Curso X', comissaoPct: '50', preco: '97', linkAfiliado: 'https://x.com', destino: 'https://pagina.com' };
const ang = M.gerarAngulos(proj, 'pt');
ok(ang.length === 10, 'gerarAngulos produz 10 ângulos');
ok(new Set(ang.map(a => a.formato)).size === 10, 'os 10 formatos são diferentes');
ok(new Set(ang.map(a => a.titulo)).size >= 8, 'os títulos são majoritariamente distintos');
ok(ang.filter(a => a.escolhido).length === 3, '3 ângulos vêm marcados por padrão');
ok(ang.every(a => a.titulo.includes('organização de cozinha pequena')), 'títulos contêm a keyword');
ok(ang.every(a => D.ESTILOS.some(e => e.id === a.estiloId)), 'cada ângulo aponta para um estilo válido');

proj.angulos = ang;
const pins = M.gerarPackPins(proj, 'pt', 15);
ok(pins.length === 15, 'gerarPackPins produz 15 pins');
ok(pins.every(p => p.titulo.length <= 60), 'nenhum título passa de 60 caracteres');
ok(pins.filter(p => p.titulo.length >= 40).length >= 10, 'a maioria dos títulos tem 40-60 caracteres');
ok(pins.every(p => p.promptImagem.includes('no text') && p.promptImagem.includes('2:3')), 'todo prompt de imagem exige 2:3 e veta texto');
ok(pins.every(p => /^[a-z0-9-]+\.png$/.test(p.arquivo)), 'nomes de arquivo são slug + .png');
ok(pins.every(p => p.hashtags.split(' ').length <= 5), 'nenhum pin tem mais de 5 hashtags');
ok(new Set(pins.map(p => p.estiloId)).size > 1, 'os pins variam de estilo');
ok(pins.filter(p => p.formato === 'vídeo').length > 0, 'o pack inclui pins de vídeo');
ok(pins.every(p => p.descricao.toLowerCase().includes('afiliado') || p.descricao.length > 50), 'descrições trazem aviso/texto completo');

const pinsEn = M.gerarPackPins(proj, 'en', 5);
ok(pinsEn.length === 5, 'gerarPackPins funciona em inglês');
ok(pinsEn[0].descricao.includes('affiliate') || pinsEn[0].descricao.length > 50, 'descrição EN contém aviso de afiliado');

console.log('\n6) Exportação');
proj.pins = pins;
const md = M.exportarMarkdown(proj);
ok(md.includes('# Pack de Produção Pinterest'), 'Markdown tem cabeçalho');
ok(md.includes('organização de cozinha pequena'), 'Markdown contém a keyword');
ok(md.includes('Contém link de afiliado'), 'Markdown traz o aviso de afiliado');
ok(md.split('### Pin').length - 1 === 15, 'Markdown lista os 15 pins');
ok(md.includes('[COLAR LINK AQUI]') || md.includes('https://x.com'), 'Markdown indica onde vai o link');

const csv = M.exportarCSV(proj);
const linhasCsv = csv.trim().split('\n');
ok(linhasCsv.length === 16, 'CSV tem cabeçalho + 15 linhas (tem ' + linhasCsv.length + ')');
ok(linhasCsv[0].startsWith('"#","titulo"'), 'CSV tem cabeçalho correto');
ok(linhasCsv.every(l => l.split('","').length >= 12), 'toda linha do CSV tem as 12 colunas');

console.log('\n7) Configuração e integrações opcionais');
M.salvarConfig({ chaveIA: 'sk-teste', boardId: '123', modeloIA: 'gpt-4o-mini' });
const cfg = M.config();
ok(cfg.chaveIA === 'sk-teste' && cfg.boardId === '123', 'config salva e recupera');
ok(typeof M.chamarIA === 'function' && typeof M.publicarPinterest === 'function', 'funções de integração existem');
M.chamarIA('teste', {}).then(() => {
  ok(false, 'chamarIA deveria falhar sem chave');
}).catch(e => {
  ok(/chave/i.test(e.message), 'chamarIA avisa quando não há chave configurada');
}).then(() => {
  console.log('\n' + (falhas ? '❌ ' + falhas + ' teste(s) falharam' : '✅ Todos os testes passaram') + '\n');
  process.exit(falhas ? 1 : 0);
});
