/**
 * Growth Design Pro — cliente do AI Growth Stack
 * ===============================================
 *
 * Encadeia as 6 APIs do stack em um funil, com retry, cache em disco e
 * tratamento de erro explícito. Sem dependências externas: usa apenas o `fetch`
 * nativo do Node 18+ e os módulos `fs`/`path`.
 *
 * ANTES DE USAR — leia isto:
 * 1. Os nomes de host e endpoint abaixo são PLACEHOLDERS. Copie os valores reais
 *    na aba "Endpoints" de cada API, no painel do RapidAPI. Eles mudam sem aviso.
 * 2. Os parâmetros de entrada também variam por API. Confirme no painel o nome
 *    exato do campo (algumas esperam `url`, outras `websiteUrl`, outras um POST
 *    com corpo JSON).
 * 3. A chave NUNCA vai no código. Use a variável de ambiente RAPIDAPI_KEY.
 *
 * Uso:
 *   RAPIDAPI_KEY=sua_chave node growth-stack.js https://exemplo.com.br
 *
 * Saída: ./dados/01-extracao.json … 06-social.json
 */

'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------------------------

const API_KEY = process.env.RAPIDAPI_KEY;
const HOST_PADRAO = 'COLE-AQUI-O-HOST.rapidapi.com'; // ex.: exemplo.p.rapidapi.com

/**
 * Definição de cada etapa do funil.
 *
 * A ordem importa: a etapa 3 depende dos resultados das etapas 1 e 2, e a etapa 6
 * depende das etapas 3 e 4. O pipeline respeita essa dependência e para se uma
 * etapa da qual depende falhar.
 *
 * `montarCorpo` recebe o resultado acumulado e devolve o corpo da requisição —
 * é onde você adapta o encadeamento ao formato real de cada API.
 */
const ETAPAS = [
  {
    id: '01-extracao',
    nome: 'Website Data Extraction',
    host: HOST_PADRAO,
    caminho: '/extract',
    metodo: 'POST',
    // Ajuste conforme a documentação: parâmetros de consulta, corpo ou ambos.
    montarCorpo: (ctx) => ({ url: ctx.url }),
  },
  {
    id: '02-seo',
    nome: 'AI SEO Analysis',
    host: HOST_PADRAO,
    caminho: '/seo/analyze',
    metodo: 'POST',
    montarCorpo: (ctx) => ({ url: ctx.url }),
  },
  {
    id: '03-copy',
    nome: 'AI Website Copywriter',
    host: HOST_PADRAO,
    caminho: '/copy/generate',
    metodo: 'POST',
    // A copywriter é alimentada pelo diagnóstico de SEO — não só pela URL.
    montarCorpo: (ctx) => ({
      url: ctx.url,
      seo: resumir(ctx.resultados['02-seo']),
      contexto: resumir(ctx.resultados['01-extracao']),
    }),
  },
  {
    id: '04-landing',
    nome: 'AI Landing Page Optimizer',
    host: HOST_PADRAO,
    caminho: '/landing/optimize',
    metodo: 'POST',
    montarCorpo: (ctx) => ({ url: ctx.url, copy: ctx.resultados['03-copy'] }),
  },
  {
    id: '05-conversao',
    nome: 'AI Conversion Optimization',
    host: HOST_PADRAO,
    caminho: '/conversion/analyze',
    metodo: 'POST',
    montarCorpo: (ctx) => ({ url: ctx.url }),
  },
  {
    id: '06-social',
    nome: 'AI Social Media Generator',
    host: HOST_PADRAO,
    caminho: '/social/generate',
    metodo: 'POST',
    montarCorpo: (ctx) => ({
      url: ctx.url,
      copy: ctx.resultados['03-copy'],
      landing: ctx.resultados['04-landing'],
      plataformas: ['twitter', 'facebook', 'instagram', 'linkedin'],
    }),
  },
];

// Etapas que servem de resumo de entrada para etapas seguintes.
// Mantenha os resumos CURTOS: mandar o JSON inteiro estoura o limite da API e
// encarece a chamada sem melhorar a resposta.
function resumir(dado, limite = 3000) {
  if (dado == null) return null;
  const texto = typeof dado === 'string' ? dado : JSON.stringify(dado);
  return texto.length > limite ? texto.slice(0, limite) + '…' : texto;
}

const CONFIG = {
  timeoutMs: 30_000,
  tentativas: 3,
  esperaBaseMs: 800,
  diretorioSaida: path.resolve(process.cwd(), 'dados'),
  // Cache evita pagar duas vezes pela mesma análise no mesmo dia.
  usarCache: true,
  validadeCacheHoras: 24,
};

// ---------------------------------------------------------------------------
// UTILITÁRIOS
// ---------------------------------------------------------------------------

const cores = {
  ok: (t) => `\x1b[32m${t}\x1b[0m`,
  erro: (t) => `\x1b[31m${t}\x1b[0m`,
  aviso: (t) => `\x1b[33m${t}\x1b[0m`,
  fraco: (t) => `\x1b[90m${t}\x1b[0m`,
};

class ErroDeAPI extends Error {
  constructor(etapa, status, corpo) {
    super(`[${etapa}] HTTP ${status}: ${String(corpo).slice(0, 300)}`);
    this.name = 'ErroDeAPI';
    this.etapa = etapa;
    this.status = status;
    this.corpo = corpo;
    // 429 = cota estourada; 403 = plano sem acesso ao endpoint.
    this.recuperavel = status === 429 || status >= 500;
  }
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function caminhoArquivo(id) {
  return path.join(CONFIG.diretorioSaida, `${id}.json`);
}

async function lerCache(id) {
  if (!CONFIG.usarCache) return null;
  try {
    const bruto = await fs.readFile(caminhoArquivo(id), 'utf8');
    const dados = JSON.parse(bruto);
    const idadeHoras = (Date.now() - new Date(dados._meta.coletadoEm).getTime()) / 3_600_000;
    if (idadeHoras > CONFIG.validadeCacheHoras) return null;
    return dados;
  } catch {
    return null;
  }
}

async function gravar(id, entrada, saida, tentativas) {
  await fs.mkdir(CONFIG.diretorioSaida, { recursive: true });
  const registro = {
    _meta: {
      etapa: id,
      coletadoEm: new Date().toISOString(),
      tentativas,
      custoEstimado: 'confira o preço do seu plano no RapidAPI',
    },
    entrada,
    saida,
  };
  await fs.writeFile(caminhoArquivo(id), JSON.stringify(registro, null, 2), 'utf8');
  return registro;
}

// ---------------------------------------------------------------------------
// CHAMADA COM RETRY
// ---------------------------------------------------------------------------

async function chamarEtapa(etapa, corpo) {
  const url = `https://${etapa.host}${etapa.caminho}`;
  let ultimoErro = null;

  for (let tentativa = 1; tentativa <= CONFIG.tentativas; tentativa++) {
    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), CONFIG.timeoutMs);

    try {
      const resposta = await fetch(url, {
        method: etapa.metodo,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': etapa.host,
        },
        body: etapa.metodo === 'GET' ? undefined : JSON.stringify(corpo),
        signal: controlador.signal,
      });

      clearTimeout(timer);

      if (!resposta.ok) {
        const texto = await resposta.text().catch(() => '');
        throw new ErroDeAPI(etapa.id, resposta.status, texto);
      }

      const tipo = resposta.headers.get('content-type') || '';
      const dados = tipo.includes('application/json')
        ? await resposta.json()
        : { texto: await resposta.text() };

      return { dados, tentativas: tentativa };

    } catch (erro) {
      clearTimeout(timer);
      ultimoErro = erro;

      const recuperavel =
        erro instanceof ErroDeAPI ? erro.recuperavel : erro.name === 'AbortError' || erro.name === 'TypeError';

      if (!recuperavel || tentativa === CONFIG.tentativas) break;

      const espera = CONFIG.esperaBaseMs * 2 ** (tentativa - 1);
      console.log(cores.aviso(`    ↻ tentativa ${tentativa} falhou (${erro.name}); repetindo em ${espera}ms`));
      await dormir(espera);
    }
  }

  throw ultimoErro;
}

// ---------------------------------------------------------------------------
// PIPELINE
// ---------------------------------------------------------------------------

async function executarFunil(url) {
  if (!API_KEY) {
    console.error(cores.erro('RAPIDAPI_KEY não definida.'));
    console.error('  RAPIDAPI_KEY=sua_chave node growth-stack.js https://exemplo.com.br');
    process.exit(1);
  }

  console.log(`\n${cores.ok('Growth Design Pro')} — funil completo`);
  console.log(`URL: ${url}\n`);

  const ctx = { url, resultados: {} };
  const relatorio = [];

  for (const etapa of ETAPAS) {
    const inicio = Date.now();
    process.stdout.write(`  ${etapa.id}  ${etapa.nome} … `);

    const emCache = await lerCache(etapa.id);
    if (emCache) {
      ctx.resultados[etapa.id] = emCache.saida;
      relatorio.push({ etapa: etapa.id, origem: 'cache', ms: 0 });
      console.log(cores.fraco('cache'));
      continue;
    }

    const corpo = etapa.montarCorpo(ctx);

    try {
      const { dados, tentativas } = await chamarEtapa(etapa, corpo);
      ctx.resultados[etapa.id] = dados;
      await gravar(etapa.id, corpo, dados, tentativas);
      relatorio.push({ etapa: etapa.id, origem: 'api', ms: Date.now() - inicio, tentativas });
      console.log(cores.ok('ok'));
    } catch (erro) {
      console.log(cores.erro('falhou'));
      console.error(`\n${cores.erro('Pipeline interrompido')} na etapa ${etapa.id} (${etapa.nome}).`);
      console.error(`  Motivo: ${erro.message}`);

      if (erro instanceof ErroDeAPI && erro.status === 429) {
        console.error('  → Cota do plano estourada. Verifique o limite no painel do RapidAPI.');
      } else if (erro instanceof ErroDeAPI && erro.status === 403) {
        console.error('  → Sem acesso a este endpoint: confira se você assinou o plano correto.');
      } else if (erro instanceof ErroDeAPI && erro.status === 404) {
        console.error('  → Endpoint ou parâmetro mudou. Confira a documentação atual da API.');
      }

      console.error('\n  O pipeline parou de propósito: seguir adiante com dado vazio produziria');
      console.error('  uma análise falsa, pior do que nenhuma análise.\n');
      imprimirRelatorio(relatorio);
      process.exit(2);
    }
  }

  imprimirRelatorio(relatorio);
  console.log(`\n  Arquivos em ${CONFIG.diretorioSaida}\n`);
}

function imprimirRelatorio(relatorio) {
  console.log(`\n  ${'ETAPA'.padEnd(16)}${'ORIGEM'.padEnd(10)}TEMPO`);
  for (const l of relatorio) {
    console.log(`  ${l.etapa.padEnd(16)}${l.origem.padEnd(10)}${l.ms ? (l.ms / 1000).toFixed(1) + 's' : '—'}`);
  }
}

// ---------------------------------------------------------------------------
// ENTRADA
// ---------------------------------------------------------------------------

const url = process.argv[2];

if (!url) {
  console.error('Uso: node growth-stack.js <url>');
  console.error('Ex.: node growth-stack.js https://exemplo.com.br');
  process.exit(1);
}

try {
  // Valida antes de gastar chamada de API com URL inválida.
  const analisada = new URL(url);
  if (!['http:', 'https:'].includes(analisada.protocol)) throw new Error('protocolo');
  executarFunil(analisada.href).catch((erro) => {
    console.error(cores.erro('\nErro inesperado:'), erro);
    process.exit(1);
  });
} catch {
  console.error(cores.erro(`URL inválida: ${url}`));
  process.exit(1);
}

module.exports = { ETAPAS, chamarEtapa, executarFunil };
