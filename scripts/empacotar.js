#!/usr/bin/env node
/* =========================================================================
   empacotar.js — gera o arquivo ZIP para download

   O ZIP sai FORA do repositório (não versionamos binário).
   Por padrão: ../pinterest-ia-custo-zero.zip

   Uso: node scripts/empacotar.js [caminho-de-saida.zip]
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const NOME_PASTA = 'pinterest-ia-custo-zero';
const SAIDA = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(RAIZ, '..', NOME_PASTA + '.zip');

const IGNORAR = ['.git', 'node_modules', '.DS_Store', '*.log', '*.zip'];

const LEIA_ME = `========================================================
  PINTEREST + IA DE GRAÇA — COMECE POR AQUI
========================================================

VOCÊ RECEBEU DUAS COISAS:

  1) PinMind-app-completo.html
     -> O APP. Dê DUPLO-CLIQUE neste arquivo.
        Abre no navegador, funciona offline, nada para instalar.
        Seus projetos ficam salvos no próprio navegador.

  2) A pasta BIBLIA/
     -> O MÉTODO, em 16 capítulos.
        Comece pelo arquivo 00-INDICE.md
        Você também pode ler tudo dentro do app (aba "A Bíblia").

--------------------------------------------------------
O QUE FAZER NO PRIMEIRO DIA (1 hora)

  1. Abra o PinMind-app-completo.html
  2. Etapa 1: escolha um nicho
  3. Etapa 2: valide a oferta (12 critérios)
  4. Etapa 3: gere 10 ângulos
  5. Etapa 9: gere o pack de 10 pins e exporte em CSV
  6. Leia a Bíblia, capítulo 10 (Plano 30-60-90)

--------------------------------------------------------
SE O NAVEGADOR AVISAR "MODO SESSÃO"

  Significa que o navegador bloqueou o salvamento automático
  (acontece ao abrir arquivo direto do disco em alguns
  navegadores, e em janela anônima).
  O app funciona igual, mas use o botão "Exportar" para
  guardar seus projetos.

--------------------------------------------------------
AVISO IMPORTANTE

  Nada aqui é promessa de renda. Os números são referências
  de mercado (2025-2026), citadas no capítulo 15.
  Pinterest e programas de afiliados mudam de regra com
  frequência: revalide sempre nos links oficiais.

========================================================
`;

function rodar(cmd, args, opts) {
  return execFileSync(cmd, args, Object.assign({ stdio: 'pipe', cwd: RAIZ }, opts || {}));
}

function main() {
  // 1) garante que os artefatos gerados estão atualizados
  console.log('· Reconstruindo artefatos...');
  rodar(process.execPath, ['scripts/build-biblia.js']);
  rodar(process.execPath, ['scripts/gerar-standalone.js']);

  // 2) monta a pasta temporária de empacotamento
  const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'pinmind-'));
  const DESTINO = path.join(TMP, NOME_PASTA);
  fs.mkdirSync(DESTINO, { recursive: true });

  const copiarRecursivo = (origem, destino) => {
    for (const item of fs.readdirSync(origem, { withFileTypes: true })) {
      if (IGNORAR.includes(item.name)) continue;
      if (item.name.endsWith('.zip') || item.name.endsWith('.log')) continue;
      const de = path.join(origem, item.name);
      const para = path.join(destino, item.name);
      if (item.isDirectory()) {
        fs.mkdirSync(para, { recursive: true });
        copiarRecursivo(de, para);
      } else {
        fs.copyFileSync(de, para);
      }
    }
  };
  copiarRecursivo(RAIZ, DESTINO);

  // 3) arquivos de cortesia
  fs.writeFileSync(path.join(DESTINO, 'LEIA-ME-PRIMEIRO.txt'), LEIA_ME, 'utf8');

  // 4) zipa
  console.log('· Compactando...');
  try {
    fs.rmSync(SAIDA, { force: true });
    rodar('zip', ['-r', '-q', '-9', SAIDA, NOME_PASTA], { cwd: TMP });
  } catch (e) {
    console.error('❌ Falha ao executar "zip". O utilitário está instalado?');
    console.error('   Alternativa: compacte manualmente a pasta do projeto.');
    process.exit(1);
  }

  // 5) relatório
  const tamanho = (fs.statSync(SAIDA).size / 1024 / 1024).toFixed(2);
  let conteudo = '';
  try { conteudo = rodar('unzip', ['-l', SAIDA]).toString(); } catch (e) {}
  const arquivos = (conteudo.match(/pinterest-ia-custo-zero\//g) || []).length;

  fs.rmSync(TMP, { recursive: true, force: true });

  console.log('');
  console.log('✅ ZIP pronto: ' + SAIDA);
  console.log('   Tamanho: ' + tamanho + ' MB · ' + arquivos + ' arquivos');
  console.log('   Contém: LEIA-ME-PRIMEIRO.txt, PinMind-app-completo.html, BIBLIA/, app/, templates/, scripts/');
}

main();
