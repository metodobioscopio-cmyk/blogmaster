#!/usr/bin/env node
/* =========================================================================
   build-biblia.js
   Converte os capítulos em BIBLIA/*.md para app/assets/js/biblia.js
   (assim a Bíblia abre dentro do app mesmo offline, sem fetch/file://)

   Uso:  node scripts/build-biblia.js
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DIR_BIBLIA = path.join(RAIZ, 'BIBLIA');
const SAIDA = path.join(RAIZ, 'app', 'assets', 'js', 'biblia.js');

/* ---------- conversor markdown → html (suficiente para este material) ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(txt) {
  let t = esc(txt);
  // código inline
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  // negrito + itálico
  t = t.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  // riscado
  t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  // links [texto](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, texto, url) => {
    const externo = /^https?:/.test(url);
    return '<a href="' + esc(url) + '"' + (externo ? ' target="_blank" rel="noopener"' : '') + '>' + texto + '</a>';
  });
  // setas de fluxo viram monoespaçado visual (mantém como estão)
  return t;
}

function converter(md) {
  const linhas = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let dentroCodigo = false;
  let bufferCodigo = [];
  let dentroLista = null; // 'ul' | 'ol'
  let dentroTabela = false;
  let bufferTabela = [];
  let dentroCitacao = false;
  let bufferCitacao = [];

  const fecharTudo = () => {
    if (dentroLista) { out.push('</' + dentroLista + '>'); dentroLista = null; }
    if (dentroTabela) { out.push(fecharTabela()); dentroTabela = false; bufferTabela = []; }
    if (dentroCitacao) { out.push('</blockquote>'); dentroCitacao = false; bufferCitacao = []; }
  };

  const fecharTabela = () => {
    const linhasTab = bufferTabela.filter(l => l.trim());
    if (!linhasTab.length) return '';
    const celulas = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const cab = celulas(linhasTab[0]);
    const corpo = linhasTab.slice(1).filter(l => !/^\|?[\s:|-]+\|?$/.test(l)).map(celulas);
    let h = '<div class="rolagem"><table><thead><tr>' + cab.map(c => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>';
    corpo.forEach(l => { h += '<tr>' + l.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>'; });
    return h + '</tbody></table></div>';
  };

  while (i < linhas.length) {
    const linha = linhas[i];

    // bloco de código
    if (/^```/.test(linha.trim())) {
      if (!dentroCodigo) { fecharTudo(); dentroCodigo = true; bufferCodigo = []; }
      else { out.push('<pre class="prompt curto">' + esc(bufferCodigo.join('\n')) + '</pre>'); dentroCodigo = false; }
      i++; continue;
    }
    if (dentroCodigo) { bufferCodigo.push(linha); i++; continue; }

    // tabela
    if (/^\s*\|.*\|\s*$/.test(linha)) {
      if (dentroLista) { out.push('</' + dentroLista + '>'); dentroLista = null; }
      if (dentroCitacao) { out.push('</blockquote>'); dentroCitacao = false; bufferCitacao = []; }
      dentroTabela = true; bufferTabela.push(linha); i++;
      // se a próxima linha não é tabela, fecha
      if (!(linhas[i] && /^\s*\|.*\|\s*$/.test(linhas[i]))) { out.push(fecharTabela()); dentroTabela = false; bufferTabela = []; }
      continue;
    }

    // citação
    if (/^>\s?/.test(linha)) {
      if (dentroLista) { out.push('</' + dentroLista + '>'); dentroLista = null; }
      dentroCitacao = true; bufferCitacao.push(linha.replace(/^>\s?/, '')); i++;
      if (!(linhas[i] && /^>\s?/.test(linhas[i]))) {
        out.push('<blockquote>' + bufferCitacao.map(inline).join('<br>') + '</blockquote>');
        dentroCitacao = false; bufferCitacao = [];
      }
      continue;
    }

    // títulos
    const h = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (h) {
      fecharTudo();
      const n = h[1].length;
      out.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>');
      i++; continue;
    }

    // linha horizontal
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(linha)) { fecharTudo(); out.push('<hr>'); i++; continue; }

    // checkbox
    const cb = /^\s*-\s*\[([ xX])\]\s+(.*)$/.exec(linha);
    if (cb) {
      if (dentroLista !== 'ul') { if (dentroLista) out.push('</' + dentroLista + '>'); out.push('<ul class="lista-check">'); dentroLista = 'ul'; }
      out.push('<li>' + (cb[1].toLowerCase() === 'x' ? '☑ ' : '☐ ') + inline(cb[2]) + '</li>');
      i++; continue;
    }

    // lista não ordenada
    const ul = /^\s*[-*+]\s+(.*)$/.exec(linha);
    if (ul) {
      if (dentroLista !== 'ul') { if (dentroLista) out.push('</' + dentroLista + '>'); out.push('<ul>'); dentroLista = 'ul'; }
      out.push('<li>' + inline(ul[1]) + '</li>');
      i++; continue;
    }

    // lista ordenada
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(linha);
    if (ol) {
      if (dentroLista !== 'ol') { if (dentroLista) out.push('</' + dentroLista + '>'); out.push('<ol>'); dentroLista = 'ol'; }
      out.push('<li>' + inline(ol[1]) + '</li>');
      i++; continue;
    }

    // linha vazia
    if (!linha.trim()) { fecharTudo(); i++; continue; }

    // parágrafo
    if (dentroLista) { out.push('</' + dentroLista + '>'); dentroLista = null; }
    out.push('<p>' + inline(linha) + '</p>');
    i++;
  }
  fecharTudo();
  return out.join('\n');
}

/* ---------- leitura e montagem ---------- */
function tituloDoCapitulo(md, arquivo) {
  const m = /^#\s+(.*)$/m.exec(md);
  if (m) {
    return m[1]
      .replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}·°º#-]+/u, '') // emoji + símbolos iniciais
      .replace(/^\d+\s*[·.\-–—]\s*/, '')                                              // número do capítulo
      .trim();
  }
  return arquivo.replace(/\.md$/, '');
}

function main() {
  if (!fs.existsSync(DIR_BIBLIA)) {
    console.error('❌ Pasta BIBLIA/ não encontrada em ' + DIR_BIBLIA);
    process.exit(1);
  }

  const arquivos = fs.readdirSync(DIR_BIBLIA)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const capitulos = arquivos.map(arq => {
    const md = fs.readFileSync(path.join(DIR_BIBLIA, arq), 'utf8');
    return {
      arquivo: arq,
      titulo: tituloDoCapitulo(md, arq),
      html: converter(md)
    };
  });

  const js = `/* =========================================================================
   BÍBLIA embutida — GERADO AUTOMATICAMENTE por scripts/build-biblia.js
   Não edite este arquivo à mão: edite os .md em BIBLIA/ e rode:
       node scripts/build-biblia.js
   Gerado em: ${new Date().toISOString()}
   Capítulos: ${capitulos.length}
   ========================================================================= */
window.PM_BIBLIA = ${JSON.stringify({ geradoEm: new Date().toISOString(), capitulos }, null, 0)};
`;

  fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
  fs.writeFileSync(SAIDA, js, 'utf8');

  const kb = (Buffer.byteLength(js, 'utf8') / 1024).toFixed(1);
  console.log('✅ Bíblia embutida gerada: ' + path.relative(RAIZ, SAIDA));
  console.log('   ' + capitulos.length + ' capítulos · ' + kb + ' KB');
  capitulos.forEach((c, i) => console.log('   ' + String(i).padStart(2, '0') + ' · ' + c.titulo + '  (' + c.arquivo + ')'));
}

main();
