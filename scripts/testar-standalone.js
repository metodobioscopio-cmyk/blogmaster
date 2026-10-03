#!/usr/bin/env node
/* =========================================================================
   testar-standalone.js
   Testa o ARQUIVO ÚNICO (PinMind-app-completo.html) num DOM real, simulando
   um navegador abrindo o arquivo direto do disco (file://) — cenário em que
   alguns navegadores BLOQUEIAM o localStorage.

   Uso: node scripts/testar-standalone.js
   Requer jsdom (npm i jsdom). Sem jsdom, o teste é ignorado com aviso.
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ARQUIVO = path.join(RAIZ, 'PinMind-app-completo.html');

let JSDOM;
try { ({ JSDOM } = require('jsdom')); }
catch (e) {
  try { ({ JSDOM } = require(process.env.JSDOM_PATH || '/tmp/domtest/node_modules/jsdom')); }
  catch (e2) {
    console.log('⚠️  jsdom não encontrado — teste do arquivo único ignorado.');
    console.log('   Instale com: npm i jsdom   (ou defina JSDOM_PATH=/caminho/do/jsdom)');
    process.exit(0);
  }
}

if (!fs.existsSync(ARQUIVO)) {
  console.error('❌ ' + path.relative(RAIZ, ARQUIVO) + ' não existe.');
  console.error('   Gere primeiro com: node scripts/gerar-standalone.js');
  process.exit(1);
}

let falhas = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) falhas++; };

const html = fs.readFileSync(ARQUIVO, 'utf8');
const erros = [];

// file:// de propósito: é como o usuário abre ao dar duplo-clique,
// e é o cenário em que o localStorage pode estar bloqueado.
const dom = new JSDOM(html, { url: 'file:///PinMind-app-completo.html', runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
window.addEventListener('error', e => erros.push(String(e.error || e.message)));
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = function () {};

const q = s => window.document.querySelector(s);
const clicar = el => el && el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

async function main() {
  // jsdom constrói o DOM antes de disparar o DOMContentLoaded — esperamos.
  if (window.document.readyState === 'loading') {
    await new Promise(r => {
      window.document.addEventListener('DOMContentLoaded', () => r());
      window.addEventListener('load', () => r());
      setTimeout(r, 3000);
    });
  }

  console.log('\nVERIFICAÇÃO DO ARQUIVO ÚNICO (protocolo file://)');

  ok(!!window.PM_DADOS, 'base de dados carregada');
  ok(!!window.PM_PROMPTS && window.PM_PROMPTS.CATALOGO.length === 15, '15 prompts carregados');
  ok(!!window.PM_MOTOR, 'motor carregado');
  ok(!!window.PM_BIBLIA && window.PM_BIBLIA.capitulos.length === 16, 'Bíblia completa embutida (16 capítulos)');
  ok(!!q('#lateral').innerHTML.trim(), 'sidebar renderizou');
  ok(q('#conteudo').innerHTML.includes('Etapa 0'), 'etapa 0 renderizou');

  const semStorage = !window.PM_MOTOR.armazenamentoDisponivel();
  ok(true, 'localStorage ' + (semStorage ? 'INDisponível neste teste → app deve funcionar mesmo assim' : 'disponível'));

  clicar(q('#lateral [data-passo="1"]'));
  clicar(q('[data-nicho="financas"]'));
  clicar(q('[data-sub]'));
  ok(q('#conteudo').innerHTML.includes('palavra-chave sugerida'), 'fluxo de nicho funciona');

  clicar(q('#lateral [data-passo="3"]'));
  clicar(q('#btnGerarAngulos'));
  ok(window.document.querySelectorAll('[data-angulo]').length === 10, '10 ângulos gerados');

  clicar(q('#lateral [data-passo="9"]'));
  clicar(q('#btnGerarPack'));
  ok(window.document.querySelectorAll('.pin-card').length === 10, '10 pins gerados');

  clicar(q('#lateral [data-passo="12"]'));
  ok(window.document.querySelectorAll('[data-cap]').length === 16, 'Bíblia navegável dentro do arquivo');
  clicar(q('[data-cap="6"]'));
  ok(q('#capConteudo') && q('#capConteudo').innerHTML.length > 3000, 'capítulo de prompts abre');

  if (semStorage) {
    ok(!!q('.aviso-caixa'), 'app avisa o usuário sobre o modo sessão');
  }

  ok(erros.length === 0, 'zero erros de runtime' + (erros.length ? ' → ' + erros.slice(0, 2).join(' | ') : ''));

  console.log('\n' + (falhas ? '❌ ' + falhas + ' falha(s)' : '✅ Arquivo único 100% funcional — pode abrir com duplo-clique'));
  process.exit(falhas ? 1 : 0);
}

main();
