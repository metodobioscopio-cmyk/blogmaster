#!/usr/bin/env node
/* =========================================================================
   testar-ui.js — carrega o app num DOM real (jsdom) e simula o fluxo completo
   Uso: node scripts/testar-ui.js      (requer jsdom disponível)
   ========================================================================= */
const fs = require('fs');
const path = require('path');

let JSDOM;
try { ({ JSDOM } = require(process.env.JSDOM_PATH || '/tmp/domtest/node_modules/jsdom')); }
catch (e) {
  try { ({ JSDOM } = require('jsdom')); }
  catch (e2) {
    console.log('⚠️  jsdom não encontrado — pulando teste de UI.');
    console.log('   Instale com: npm i jsdom   (ou defina JSDOM_PATH)');
    process.exit(0);
  }
}

const RAIZ = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'app/index.html'), 'utf8');

let falhas = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) falhas++; };

const erros = [];
const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});
const { window } = dom;

// captura erros de runtime
window.addEventListener('error', e => erros.push(String(e.error || e.message)));
window.onerror = (m) => { erros.push(String(m)); };

// polyfills que o jsdom não implementa
window.HTMLElement.prototype.scrollIntoView = function () {};
window.HTMLElement.prototype.scrollTo = function () {};
window.scrollTo = function () {};
window.alert = (m) => { window.__alertas = (window.__alertas || []).concat(m); };
window.prompt = (m, d) => d;
if (!window.navigator.clipboard) window.navigator.clipboard = { writeText: () => Promise.resolve() };
if (!window.URL.createObjectURL) window.URL.createObjectURL = () => 'blob:x';

function carregarScript(rel) {
  const codigo = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  window.eval(codigo);
}

console.log('\n1) Carregamento no DOM');
const scripts = ['app/dados/dados.js', 'app/assets/js/prompts.js', 'app/assets/js/motor.js', 'app/assets/js/biblia.js', 'app/assets/js/app.js'];
scripts.forEach(s => { try { carregarScript(s); } catch (e) { erros.push(s + ': ' + e.message); } });
ok(window.PM_DADOS && window.PM_PROMPTS && window.PM_MOTOR && window.PM_BIBLIA && window.PM_BIBLIA.capitulos.length === 16,
  'os 4 módulos + Bíblia (16 capítulos) carregam sem erro');

// dispara DOMContentLoaded
window.eval('document.dispatchEvent(new Event("DOMContentLoaded"))');
ok(erros.length === 0, 'nenhum erro de runtime na inicialização' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));

const $ = s => window.document.querySelector(s);
ok(!!$('#lateral').innerHTML.trim(), 'sidebar renderizada');
ok(!!$('#conteudo').innerHTML.trim(), 'conteúdo da etapa 0 renderizado');
ok(window.document.querySelectorAll('#lateral .passo').length === 14, 'sidebar tem os 14 passos (10 de produção + 4 de referência)');
ok($('#conteudo').innerHTML.includes('Etapa 0'), 'cabeçalho mostra "Etapa 0"');
ok($('#conteudo').innerHTML.includes('Conta business'), 'etapa 0 fala de conta business');

const clicar = (sel) => {
  const el = typeof sel === 'string' ? $(sel) : sel;
  if (!el) { falhas++; console.log('  ✗ elemento não encontrado: ' + sel); return false; }
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  return true;
};
const clicarTexto = (txt) => {
  const el = Array.from(window.document.querySelectorAll('button, a')).find(b => b.textContent.includes(txt));
  return el ? clicar(el) : (falhas++, console.log('  ✗ botão não encontrado: ' + txt), false);
};
const preencher = (campo, valor, tipo) => {
  const el = document.querySelector('[data-campo="' + campo + '"]');
  if (!el) { falhas++; console.log('  ✗ campo não encontrado: ' + campo); return false; }
  el.value = valor;
  el.dispatchEvent(new window.Event(tipo || 'input', { bubbles: true }));
  return true;
};

console.log('\n2) Navegação pelas 11 etapas');
for (let i = 1; i <= 10; i++) {
  const btn = window.document.querySelector('#lateral [data-passo="' + i + '"]');
  if (!btn) { falhas++; console.log('  ✗ passo ' + i + ' sem botão'); continue; }
  clicar(btn);
  const c = $('#conteudo').innerHTML;
  ok(c.includes('Etapa ' + i), 'etapa ' + i + ' renderiza');
}
clicar('#lateral [data-passo="11"]');
ok($('#conteudo').innerHTML.includes('Português (15)'), 'biblioteca de prompts renderiza com abas');
ok(window.document.querySelectorAll('#conteudo [data-copiar-id]').length >= 15, 'biblioteca mostra 15+ prompts copiáveis');
clicar('#lateral [data-passo="12"]');
ok(window.document.querySelectorAll('#conteudo [data-cap]').length === 16, 'Bíblia lista os 16 capítulos');
clicar('#lateral [data-passo="13"]');
ok($('#conteudo').innerHTML.includes('opcional'), 'aba de integrações renderiza');

console.log('\n3) Fluxo real: nicho → estilo → ângulos → pack');
clicar('#lateral [data-passo="1"]');
const cardNicho = $('[data-nicho="decor"]');
ok(!!cardNicho, 'card do nicho "decor" existe');
clicar(cardNicho);
ok($('#conteudo').innerHTML.includes('Sub-nicho de'), 'ao escolher nicho, aparecem os sub-nichos');
const btnSub = $('[data-sub]');
ok(!!btnSub, 'há botões de sub-nicho');
clicar(btnSub);
ok($('#conteudo').innerHTML.includes('Sua palavra-chave sugerida'), 'sub-nicho define a keyword');

clicar('#lateral [data-passo="4"]');
const btnEstilo = $('[data-estilo]');
ok(!!btnEstilo, 'há cards de estilo visual');
clicar(btnEstilo);
ok($('#conteudo').innerHTML.includes('Fragmento de prompt do estilo escolhido'), 'estilo escolhido mostra o fragmento de prompt');
ok($('#fragEstilo') && $('#fragEstilo').textContent.length > 50, 'fragmento de prompt em inglês presente');

clicar('#lateral [data-passo="3"]');
clicar('#btnGerarAngulos');
ok(window.document.querySelectorAll('[data-angulo]').length === 10, 'gerador cria 10 checkboxes de ângulo');
ok($('#conteudo').innerHTML.includes('ângulo(s) marcado(s)'), 'contador de ângulos marcados aparece');

clicar('#lateral [data-passo="5"]');
ok($('#conteudo').innerHTML.includes('As 5 regras do texto'), 'etapa de copy traz as regras de texto');
ok(window.document.querySelectorAll('#conteudo .prompt').length >= 2, 'etapa de copy mostra os prompts');

console.log('\n4) Validação por checklist e score');
clicar('#lateral [data-passo="2"]');
ok(window.document.querySelectorAll('[data-check^="produto:"]').length === 24, 'checklist de produto tem 12 itens (24 botões sim/não)');
clicar('[data-check="produto:p1:1"]');
ok($('#conteudo').innerHTML.includes('pontos de peso'), 'score é recalculado após marcar item');
// reprova um item de peso 3
clicar('#lateral [data-passo="8"]');
clicar('[data-check="produto:p2:0"]');
ok($('#conteudo').innerHTML.includes('bloqueio') || $('#conteudo').innerHTML.includes('BLOQUEADO'), 'reprovar item de peso 3 gera alerta de bloqueio');

// preenche tudo de produto como OK e confere 100
clicar('#lateral [data-passo="2"]');
window.PM_DADOS.CHECKS.produto.forEach(c => {
  const el = window.document.querySelector('[data-check="produto:' + c.id + ':1"]');
  if (el) el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
});
clicar('#lateral [data-passo="2"]');
ok(window.document.querySelector('#conteudo .anel span').textContent.trim() === '100', 'checklist 100% aprovado mostra score 100 no anel');

console.log('\n5) Pack, exportação e integrações');
clicar('#lateral [data-passo="9"]');
clicar('#btnGerarPack');
const pins10 = window.document.querySelectorAll('.pin-card').length;
ok(pins10 === 10, 'botão "Gerar 10 pins" cria 10 cards (criou ' + pins10 + ')');
clicar('#btnGerarPack20');
ok(window.document.querySelectorAll('.pin-card').length === 30, 'botão "Gerar 20 pins" soma ao pack (30 no total)');
ok(!!$('#btnExportMD') && !!$('#btnExportCSV') && !!$('#btnExportJSON'), 'botões de exportação aparecem após gerar o pack');
const mdBody = $('#conteudo').innerHTML;
ok(mdBody.includes('1000×1500') || mdBody.includes('Como executar o pack'), 'etapa do pack mostra o roteiro de execução');

// exportação real (intercepta o download)
const proj = window.PM_MOTOR.ativo();
const md = window.PM_MOTOR.exportarMarkdown(proj);
const csv = window.PM_MOTOR.exportarCSV(proj);
ok(md.split('### Pin').length - 1 === 30, 'Markdown exporta os 30 pins');
ok(csv.trim().split('\n').length === 31, 'CSV exporta cabeçalho + 30 linhas');

clicar('#lateral [data-passo="10"]');
ok($('#conteudo').innerHTML.includes('Dia 30') || window.document.querySelectorAll('#conteudo table tr').length > 30, 'etapa 10 mostra o calendário de 30 dias');
const inpImp = window.document.querySelector('[data-campo="metricas.impressoes"]');
ok(!!inpImp, 'campo de métricas existe');
inpImp.value = '80000';
inpImp.dispatchEvent(new window.Event('input', { bubbles: true }));
const inpCli = window.document.querySelector('[data-campo="metricas.cliques"]');
inpCli.value = '320';
inpCli.dispatchEvent(new window.Event('input', { bubbles: true }));
clicar('#lateral [data-passo="10"]');
ok($('#conteudo').innerHTML.includes('0.40%') || $('#conteudo').innerHTML.includes('0,40%'), 'app calcula o CTR (0,40%)');

console.log('\n6) Persistência e troca de projeto');
ok(!!window.localStorage.getItem('pinmind.projetos.v1'), 'projeto salvo no localStorage');
ok(!!window.localStorage.getItem('pinmind.ativo.v1'), 'projeto ativo registrado');
const antes = window.PM_MOTOR.carregarTodos();
const ids = Object.keys(antes);
ok(ids.length >= 1, 'há ' + ids.length + ' projeto(s) salvo(s)');

console.log('\n7) Bíblia dentro do app');
clicar('#lateral [data-passo="12"]');
const linkCap = $('[data-cap="4"]');
ok(!!linkCap, 'link do capítulo 5 existe');
clicar(linkCap);
ok($('#capConteudo').innerHTML.length > 2000, 'capítulo renderiza HTML com conteúdo');
ok($('#capConteudo').innerHTML.includes('<table'), 'capítulo renderiza tabelas markdown');
ok(!$('#capConteudo').innerHTML.includes('undefined'), 'nenhum "undefined" no HTML gerado');

console.log('\n8) Erros de runtime');
ok(erros.length === 0, 'zero erros acumulados' + (erros.length ? ' → ' + erros.slice(0, 5).join(' || ') : ''));

console.log('\n' + (falhas ? '❌ ' + falhas + ' verificação(ões) falharam' : '✅ Interface validada: fluxo completo funciona') + '\n');
process.exit(falhas ? 1 : 0);
