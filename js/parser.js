/* Parser de listas BlogMaster — TXT colado, CSV, texto extraído de PDF/DOCX.
   Extrai: nome, telefone, renda, entrada, FGTS, empreendimento, bairro, cidade.
   Funciona no navegador e no Node (testes). */

const EMP_NOMES = [
  "Gran Essence", "Gran Safira", "Gran Parma", "Gran Verona", "Gran Terrazzo",
  "Golden Ville", "Priville", "Gran Aurora", "Gran Porto", "Vert",
];

function norm(s) {
  return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function parseMoeda(str) {
  if (!str) return null;
  const m = String(str).replace(/R\$\s?/gi, "").match(/([\d.,]+)/);
  if (!m) return null;
  let v = m[1];
  if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, ""); // 4.200 / 10.000 = milhar BR
  else if (v.includes(",") && v.includes(".")) v = v.replace(/\./g, "").replace(",", ".");
  else if (v.includes(",")) v = v.replace(",", ".");
  else if ((v.match(/\./g) || []).length > 1) v = v.replace(/\./g, "");
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function extrairTelefone(bloco) {
  const m = bloco.replace(/[^\d+\n:;,-]/g, " ").match(/(?:\+?55[\s-]*)?(\d{2})[\s-]*(\d{4,5})-?(\d{4})/);
  if (m) return `${m[1]}${m[2]}${m[3]}`;
  const d = bloco.match(/\b(\d{10,13})\b/);
  return d ? d[1].slice(-11) : "";
}

const BAIRROS_CONHECIDOS = ["Papillon Park", "Parque Atheneu", "Parque das Nações", "Jardim Nova Esperança", "Carolina Parque", "Jardim Gardênia", "Jardim Novo Mundo", "Parque Amazônia"];
const CIDADES_CONHECIDAS = ["Aparecida de Goiânia", "Goiânia"];

function extrairNome(bloco) {
  // Formato 1-por-linha do box de importação: "Nome - (62) 99999-0000 - ..."
  const antesTel = bloco.split(/\r?\n/)[0].match(/^([A-ZÀ-Ú][A-Za-zÀ-ú' ]{2,60}?)\s*[-–—;|]\s*(?:\+?55|\(?\d{2}\)?|\d{10,})/);
  if (antesTel) return limparNome(antesTel[1]);
  const padroes = [
    /nome\s*[:\-]\s*([^\n\r;]+)/i,
    /lead\s*[:\-]\s*([^\n\r;]+)/i,
    /cliente\s*[:\-]\s*([^\n\r;]+)/i,
    /(?:^|\s)(?:é|eh)\s+([A-ZÀ-Ú][A-Za-zÀ-ú]+(?:\s+[A-ZÀ-Ú][A-Za-zÀ-ú]+){1,4})(?:\s*$|\n|\s📞)/m,
  ];
  for (const p of padroes) {
    const m = bloco.match(p);
    if (m && m[1].trim().length >= 3) return limparNome(m[1]);
  }
  // primeira linha "nome próprio" (2+ palavras capitalizadas, sem R$/emoji/dígito)
  for (const linha of bloco.split(/\r?\n/)) {
    const l = linha.trim();
    if (/^[A-ZÀ-Ú][a-zà-ú]+(\s+(de|da|do|dos|das)\s+|\s+)[A-ZÀ-Ú][a-zà-ú]+/.test(l) && !/R\$|\d{4}/.test(l) && l.length < 60) {
      return limparNome(l);
    }
  }
  return "";
}

function limparNome(n) {
  return n.replace(/[📞💰📍*_:;–—-]+$/g, "").replace(/\s+/g, " ").trim();
}

function extrairCampoMoeda(bloco, rotulos) {
  for (const r of rotulos) {
    const m = bloco.match(new RegExp(r + "[^R$\\d\\n]{0,25}R?\\$?\\s*([\\d.,]+\\s*(?:mil)?)", "i"));
    if (m) {
      let v = m[1];
      const mil = /mil/i.test(v);
      const n = parseMoeda(v);
      if (n != null) return mil && n < 1000 ? n * 1000 : n;
    }
  }
  return null;
}

function extrairTexto(bloco, rotulos) {
  for (const r of rotulos) {
    const m = bloco.match(new RegExp(r + "\\s*[:\\-]\\s*([^\\n\\r]+)", "i"));
    if (m && m[1].trim()) return m[1].replace(/[*_]/g, "").trim();
  }
  return "";
}

function parseBloco(bloco) {
  const nb = norm(bloco);
  const emp = EMP_NOMES.find(e => nb.includes(norm(e))) || extrairTexto(bloco, ["empreendimento"]);
  let fgts = "";
  if (/fgts[^.\n]{0,40}(n(ã|a)o informou|sem fgts|n(ã|a)o possui|indispon)/i.test(bloco)) fgts = "não informou / sem FGTS";
  else if (/fgts/i.test(bloco)) fgts = extrairTexto(bloco, ["fgts"]) || "informado";
  return {
    nome: extrairNome(bloco),
    telefone: extrairTelefone(bloco),
    renda: extrairCampoMoeda(bloco, ["renda\\s*mensal", "renda"]),
    entrada: extrairCampoMoeda(bloco, ["entrada\\s*dispon[ií]vel", "entrada"]),
    fgts,
    composicao: /sozinh/i.test(bloco) ? "sozinho" : /(c[ôo]njuge|espos|marido|companheir|comp(or|osi[çc][aã]o))/i.test(bloco) ? "composição de renda" : "",
    empreendimento: emp || "",
    bairro: extrairTexto(bloco, ["bairro de interesse inicial", "bairro"]) || BAIRROS_CONHECIDOS.find(b => norm(bloco).includes(norm(b))) || "",
    cidade: extrairTexto(bloco, ["cidade de interesse inicial", "cidade"]) || CIDADES_CONHECIDAS.find(c => norm(bloco).includes(norm(c))) || "",
    obs: bloco.replace(/\s+/g, " ").trim().slice(0, 600),
    optIn: true,
  };
}

function parseCSV(texto) {
  const linhas = texto.split(/\r?\n/).filter(l => l.trim());
  if (linhas.length < 2) return null;
  const delim = linhas[0].includes(";") ? ";" : ",";
  const head = linhas[0].split(delim).map(h => norm(h).trim());
  const idx = (...termos) => head.findIndex(h => termos.some(t => h.includes(t)));
  const iNome = idx("nome", "name", "cliente"), iTel = idx("tel", "whats", "celular", "fone"),
        iRenda = idx("renda"), iEntrada = idx("entrada"), iEmp = idx("empreend", "produto"),
        iBairro = idx("bairro"), iCidade = idx("cidade"), iFgts = idx("fgts");
  const reconhecidas = [iNome, iTel, iRenda, iEntrada, iEmp, iBairro, iCidade, iFgts].filter(i => i >= 0).length;
  if (head.length < 2 || reconhecidas < 2 || (iNome < 0 && iTel < 0)) return null;
  return linhas.slice(1).map(l => {
    const c = l.split(delim).map(x => x.trim().replace(/^"|"$/g, ""));
    return {
      nome: iNome >= 0 ? c[iNome] || "" : "", telefone: (iTel >= 0 ? c[iTel] : "").replace(/\D/g, "").replace(/^55/, ""),
      renda: iRenda >= 0 ? parseMoeda(c[iRenda]) : null, entrada: iEntrada >= 0 ? parseMoeda(c[iEntrada]) : null,
      fgts: iFgts >= 0 ? c[iFgts] || "" : "", composicao: "",
      empreendimento: iEmp >= 0 ? c[iEmp] || "" : "", bairro: iBairro >= 0 ? c[iBairro] || "" : "",
      cidade: iCidade >= 0 ? c[iCidade] || "" : "", obs: l.slice(0, 300), optIn: true,
    };
  });
}

function parseTextoParaLeads(texto) {
  if (!texto || !texto.trim()) return [];
  const csv = parseCSV(texto);
  let leads;
  if (csv && csv.length) {
    leads = csv;
  } else {
    let blocos = texto.split(/\n\s*---\s*\n|\n{3,}|(?=\n\s*(?:nome|lead|cliente)\s*[:\-])/i).map(b => b.trim()).filter(b => b.length > 3);
    // formato 1 por linha: "Nome; 62 99999-9999" / "Nome - telefone"
    if (blocos.length === 1 && blocos[0].split("\n").length > 1) {
      const linhas = blocos[0].split(/\r?\n/).filter(l => l.trim());
      const comTel = linhas.filter(l => /\d{10,}/.test(l.replace(/\D/g, "x")) || /\(\d{2}\)/.test(l)).length;
      if (comTel >= Math.ceil(linhas.length / 2)) blocos = linhas;
    }
    leads = blocos.map(parseBloco);
  }
  // dedup por telefone (mantém o registro mais completo) + descarta vazios
  const porTel = new Map();
  const semTel = [];
  for (const l of leads) {
    if (!l.nome && !l.telefone) continue;
    if (l.nome && /n(ã|a)o inform/i.test(l.nome)) l.nome = "";
    if (l.telefone) {
      const prev = porTel.get(l.telefone);
      if (!prev || Object.values(l).filter(Boolean).length > Object.values(prev).filter(Boolean).length) porTel.set(l.telefone, l);
    } else semTel.push(l);
  }
  return [...porTel.values(), ...semTel];
}

/* Integração onboarding.js: o box de importação usa window.parseLista
   (este parser completo tem prioridade sobre o fallback do onboarding). */
if (typeof window !== "undefined") window.parseLista = parseTextoParaLeads;
if (typeof module !== "undefined") module.exports = { parseTextoParaLeads, parseMoeda, parseBloco, extrairTelefone };
