#!/usr/bin/env node
/* =========================================================================
   gerar-standalone.js
   Gera um ÚNICO arquivo HTML com o app inteiro embutido (CSS + JS + Bíblia).
   Serve para abrir com duplo-clique em qualquer computador/celular, offline,
   sem pasta nenhuma ao lado.

   Uso: node scripts/gerar-standalone.js
   Saída: PinMind-app-completo.html (na raiz do repositório)
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const APP = path.join(RAIZ, 'app');
const SAIDA = path.join(RAIZ, 'PinMind-app-completo.html');

const ler = (rel) => fs.readFileSync(path.join(APP, rel), 'utf8');

// proteção: nunca deixe um "</script" dentro do JS embutido quebrar o HTML
const seguro = (js) => js.replace(/<\/script/gi, '<\\/script');

const SCRIPTS = [
  'dados/dados.js',
  'assets/js/prompts.js',
  'assets/js/motor.js',
  'assets/js/biblia.js',
  'assets/js/app.js'
];

/* IMPORTANTE: todo .replace() abaixo usa FUNÇÃO como replacement.
   Se usarmos string, o JavaScript interpreta sequências especiais do conteúdo
   embutido ($$ vira $, $& vira o match, etc.) e CORROMPE o código gerado. */
function montar() {
  const html = ler('index.html');
  const css = ler('assets/css/style.css');

  const jsEmbutido = SCRIPTS
    .map(rel => '/* ===== ' + rel + ' ===== */\n' + seguro(ler(rel)))
    .join('\n\n');

  return html
    .replace(
      /<link rel="stylesheet" href="assets\/css\/style\.css">/,
      () => '<style>\n' + css + '\n</style>'
    )
    .replace(/[ \t]*<script src="[^"]+"><\/script>\r?\n/g, () => '')
    .replace(
      '</body>',
      () => '<script>\n' + jsEmbutido + '\n</script>\n</body>'
    )
    .replace(
      '<title>',
      () => '<!-- PinMind — ARQUIVO ÚNICO PORTÁTIL. Basta abrir este arquivo no navegador. Nada para instalar. -->\n<title>'
    );
}

function verificar(saida) {
  const problemas = [];
  if ((saida.match(/<script/g) || []).length !== 1) problemas.push('deveria haver exatamente 1 tag <script>');
  if (/<script src=/.test(saida)) problemas.push('sobrou <script src> externo');
  if (!saida.includes('PM_BIBLIA')) problemas.push('Bíblia não foi embutida');
  if (!saida.includes('const $$ =')) problemas.push('atenção: "const $$ =" ausente (possível corrupção por replacement)');
  if (/src="(assets|dados)\//.test(saida)) problemas.push('sobrou referência externa a assets/dados');
  return problemas;
}

function main() {
  const saida = montar();
  fs.writeFileSync(SAIDA, saida, 'utf8');

  const kb = (Buffer.byteLength(saida, 'utf8') / 1024).toFixed(0);
  const problemas = verificar(saida);

  console.log('✅ Arquivo único gerado: ' + path.relative(RAIZ, SAIDA) + '  (' + kb + ' KB)');
  console.log('   Scripts embutidos: ' + SCRIPTS.length + ' · CSS embutido: sim');

  if (problemas.length) {
    console.error('\n❌ Verificação falhou:');
    problemas.forEach(p => console.error('   · ' + p));
    process.exit(1);
  }
  console.log('   Verificação: nenhuma referência externa, código íntegro ✔');
  console.log('   Abra com duplo-clique. Funciona offline, em qualquer navegador.');
}

main();
