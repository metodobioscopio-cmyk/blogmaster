/* Agente Acelera — motor agêntico (regras + personalização).
   100% local/offline: classifica, sugere próxima ação, monta a
   mensagem de 1º contato e a Fila Segura (human-in-the-loop).
   NUNCA dispara sozinho: o envio é click-to-send via wa.me ou
   API Oficial do WhatsApp (Cloud API/BSP) com template aprovado. */

function scoreLead(lead) {
  let s = 0; const motivos = [];
  if (lead.empreendimento) { s += 20; motivos.push("Empreendimento definido (+20)"); }
  if (lead.renda) { s += 15; motivos.push("Renda informada (+15)"); if (lead.renda >= 3200) { s += 5; motivos.push("Renda em faixa MCMV atrativa (+5)"); } }
  if (lead.entrada) { s += 15; motivos.push("Entrada disponível (+15)"); if (lead.entrada >= 10000) { s += 5; motivos.push("Entrada ≥ R$10 mil (+5)"); } }
  if (lead.fgts && !/não informou|sem fgts/i.test(lead.fgts)) { s += 10; motivos.push("FGTS utilizável (+10)"); }
  if (lead.composicao) { s += 5; motivos.push("Composição/comportamento de compra conhecido (+5)"); }
  const docs = lead.docs ? Object.values(lead.docs).filter(Boolean).length : 0;
  if (docs) { s += Math.min(20, docs * 5); motivos.push(`${docs} documento(s) recebido(s) (+${Math.min(20, docs * 5)})`); }
  if (lead.bairro || lead.cidade) { s += 5; motivos.push("Região de interesse informada (+5)"); }
  if ((lead.historico || []).some(h => h.tipo === "resposta")) { s += 10; motivos.push("Já respondeu no WhatsApp (+10)"); }
  return { score: Math.min(100, s), motivos };
}

function classificarLead(lead) {
  const { score } = scoreLead(lead);
  if (lead.estagio === "fechamento") return "quente";
  if (score >= 65) return "quente";
  if (score >= 35) return "em amadurecimento";
  return lead.historico?.length > 1 ? "frio" : "novo";
}

function faixaMCMV(renda) {
  if (!renda) return null;
  if (typeof FAIXAS_MCMV === "undefined") return null;
  const f = FAIXAS_MCMV.find(x => renda <= x.teto);
  return f ? { ...f, renda } : null;
}

function dadosFaltantes(lead) {
  const f = [];
  if (!lead.telefone) f.push("telefone com DDD");
  if (!lead.empreendimento) f.push("empreendimento/região (usar Menu 1–9)");
  if (!lead.renda) f.push("renda mensal (individual x composição)");
  if (lead.entrada == null) f.push("valor de entrada disponível");
  if (!lead.fgts) f.push("FGTS (+3 anos de carteira?)");
  const docsOk = lead.docs && ["doc_id", "doc_end", "doc_renda"].every(k => lead.docs[k]);
  if (!docsOk) f.push("documentos p/ análise Caixa (RG/CNH, endereço, renda)");
  return f;
}

/* Portões de validação (Método Acelera): o que falta p/ promover. */
function portaoPromocao(lead, destinoId) {
  const ordem = ["conexao", "triagem", "regiao", "docs", "simulacao", "visita", "fechamento"];
  const falta = [];
  if (destinoId === "perdido") return { ok: true, falta: [] };
  const idx = ordem.indexOf(destinoId);
  if (idx >= 1 && !(lead.historico || []).some(h => h.tipo === "envio" || h.tipo === "resposta")) falta.push("registrar 1º contato/resposta no Espelho WhatsApp");
  if (idx >= 2 && !lead.renda) falta.push("coletar renda");
  if (idx >= 2 && lead.entrada == null) falta.push("coletar entrada disponível");
  if (idx >= 2 && !lead.empreendimento) falta.push("definir empreendimento principal");
  if (idx >= 3 && !(lead.docs && lead.docs.doc_id && lead.docs.doc_renda)) falta.push("receber RG/CNH + comprovante de renda legíveis");
  if (idx >= 4 && !lead.parcela) falta.push("preencher parcela da simulação");
  if (idx >= 6 && !lead.unidade) falta.push("definir unidade reservada");
  return { ok: falta.length === 0, falta };
}

function proximaAcao(lead) {
  const falta = dadosFaltantes(lead);
  switch (lead.estagio) {
    case "conexao": return lead.empreendimento
      ? { template: "abertura_especifica", acao: "Enviar abertura específica + pedir permissão p/ 3 perguntas" }
      : { template: "menu9", acao: "Enviar abertura com Menu 1–9 (ele responde só o número)" };
    case "triagem": return !lead.renda ? { template: "triagem_renda", acao: "Validar renda (individual x composição)" }
      : !lead.fgts ? { template: "triagem_fgts", acao: "Validar FGTS (+3 anos carteira)" }
      : lead.entrada == null ? { template: "triagem_entrada", acao: "Validar entrada disponível" }
      : { template: "docs", acao: "Triagem completa → pedir documentos (análise Caixa sem custo)" };
    case "regiao": return { template: "validacao_regiao", acao: "Travar empreendimento principal pela rotina do cliente" };
    case "docs": return { template: "docs", acao: "Cobrar documentos faltantes: " + falta.filter(f => f.includes("documentos")).join(", ") };
    case "simulacao": return { template: "simulacao", acao: "Apresentar simulação ancorando parcela + subsídio (tarde ou noite?)" };
    case "visita": return { template: "visita", acao: "Agendar visita com dupla escolha (sábado 10h ou domingo 14h)" };
    case "fechamento": return { template: "fechamento", acao: "Enviar link de assinatura digital e travar a unidade" };
    default: return { template: "followup_d1", acao: "Lead arquivado — só reativar se ele chamar (respeitar opt-out)" };
  }
}

function primeiroNome(nome) { return (nome || "").trim().split(/\s+/)[0] || ""; }

function empDoLead(lead) {
  if (typeof EMPREENDIMENTOS === "undefined") return null;
  return EMPREENDIMENTOS.find(e => lead.empreendimento && normEmp(e.nome) === normEmp(lead.empreendimento)) || null;
}
function normEmp(s) { return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }

function renderMensagem(templateTexto, lead, consultor) {
  const emp = empDoLead(lead);
  const map = {
    "{primeiroNome}": primeiroNome(lead.nome) || "tudo bem",
    "{nome}": lead.nome || "",
    "{corretor}": consultor || "Januário Leal",
    "{consultor}": consultor || "Januário Leal",
    "{empreendimento}": lead.empreendimento || (emp && emp.nome) || "nossos empreendimentos",
    "{bairro}": lead.bairro || (emp && emp.bairro) || "região de seu interesse",
    "{cidade}": (lead.cidade || (emp && emp.cidade) || "Goiânia").replace("/GO", ""),
    "{parcela}": lead.parcela ? (String(lead.parcela).startsWith("R$") ? lead.parcela : "R$ " + lead.parcela) : "[valor]",
    "{subsidio}": lead.subsidio ? (String(lead.subsidio).startsWith("R$") ? lead.subsidio : "R$ " + lead.subsidio) : "[valor]",
    "{unidade}": lead.unidade || "[unidade]",
    "{menu9}": typeof menu9Texto === "function" ? menu9Texto() : "",
  };
  let out = templateTexto;
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}

/* Variação leve anti-spam: sinônimos de saudação/encerramento para
   nenhuma mensagem da fila sair idêntica à outra. Determinística por lead. */
function variarMensagem(texto, seedStr) {
  let h = 0; for (const c of String(seedStr || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const pick = arr => arr[h % arr.length];
  return texto
    .replace("Tudo bem?", pick(["Tudo bem?", "Tudo bem por aí?", "Como vai?"]))
    .replace("excelente dia!", pick(["excelente dia!", "um ótimo dia!", "bom dia!"]))
    .replace("Posso te fazer uma pergunta rápida?", pick(["Posso te fazer uma pergunta rápida?", "Posso te perguntar uma coisinha rápida?", "Me permite uma pergunta rápida?"]));
}

/* Fila Segura: ordena por score, respeita opt-in/telefone/horário,
   espaça envios manuais e limita por dia. Retorna plano, NÃO envia. */
function montarFilaSegura(leads, config, listaId) {
  const cfg = Object.assign({ limiteDia: 40, intervaloMin: 3, horaInicio: 8, horaFim: 20, soOptIn: true }, config || {});
  const elegiveis = leads.filter(l =>
    (!listaId || l.listaId === listaId) &&
    l.estagio === "conexao" && l.telefone && (!cfg.soOptIn || l.optIn) &&
    !(l.historico || []).some(h => h.tipo === "envio"));
  const pulados = leads.filter(l => (!listaId || l.listaId === listaId) && l.estagio === "conexao" && !elegiveis.includes(l))
    .map(l => ({ lead: l, motivo: !l.telefone ? "sem telefone" : (cfg.soOptIn && !l.optIn) ? "sem opt-in/interesse registrado" : "1º contato já registrado" }));
  const ordenados = elegiveis.sort((a, b) => scoreLead(b).score - scoreLead(a).score).slice(0, cfg.limiteDia);
  const inicio = new Date(); inicio.setHours(Math.max(inicio.getHours() + (inicio.getMinutes() > 0 ? 1 : 0), cfg.horaInicio), 0, 0, 0);
  if (inicio.getHours() >= cfg.horaFim) { inicio.setDate(inicio.getDate() + 1); inicio.setHours(cfg.horaInicio, 0, 0, 0); }
  const fila = ordenados.map((lead, i) => {
    const quando = new Date(inicio.getTime() + i * cfg.intervaloMin * 60000);
    const forcado = (cfg.templateId && cfg.templateId !== "auto" && typeof TEMPLATES !== "undefined" && TEMPLATES.some(x => x.id === cfg.templateId)) ? cfg.templateId : null;
    const tId = forcado || (lead.empreendimento ? "abertura_especifica" : "menu9");
    const t = (typeof TEMPLATES !== "undefined" ? TEMPLATES.find(x => x.id === tId) : null);
    const msg = t ? variarMensagem(renderMensagem(t.texto, lead, cfg.consultor), lead.id + lead.telefone) : "";
    return { id: "q-" + lead.id, leadId: lead.id, nome: lead.nome, telefone: lead.telefone, previsao: quando.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }), templateId: tId, mensagem: msg, status: "pendente", score: scoreLead(lead).score };
  });
  return { fila, pulados, config: cfg };
}

const OPTOUT_KEYWORDS = ["parar", "sair", "não quero", "nao quero", "remove", "remover", "cancelar", "chega"];
function ehOptOut(texto) { const t = normEmp(texto); return OPTOUT_KEYWORDS.some(k => t.includes(normEmp(k))); }

/* Interpreta resposta do lead no espelho (número do menu, opt-out etc). */
function interpretarResposta(lead, texto) {
  const t = (texto || "").trim();
  if (ehOptOut(t)) return { tipo: "optout", acao: "Marcar opt-out, mover p/ Perdido e nunca mais disparar p/ este número." };
  const soNum = t.match(/^\D*([1-9])\D*$/);
  if (soNum && typeof EMPREENDIMENTOS !== "undefined") {
    const emp = EMPREENDIMENTOS.find(e => e.num === Number(soNum[1]));
    if (emp) return { tipo: "menu", empreendimento: emp.nome, acao: `Definir empreendimento = ${emp.nome} (${emp.bairro}) → promover p/ Triagem e validar renda.`, proximoTemplate: "triagem_renda" };
  }
  if (/simula|parcela|valor|quanto|pre[çc]o/i.test(t)) return { tipo: "simulacao", acao: "Quer valores → NÃO pular etapa: validar renda/FGTS/entrada primeiro (regra de ouro).", proximoTemplate: "triagem_renda" };
  if (/visita|conhec|estande|presencial|endere[çc]o/i.test(t)) return { tipo: "visita", acao: "Quer conhecer → oferecer visita com dupla escolha.", proximoTemplate: "visita" };
  const renda = t.match(/R?\$?\s*([\d.,]{3,})/);
  if (renda && /renda|ganho|recebo|sal[aá]rio/i.test(t)) return { tipo: "renda", acao: "Registrar renda informada e validar FGTS em seguida.", proximoTemplate: "triagem_fgts" };
  return { tipo: "generica", acao: "Responder mantendo o controle: terminar com pergunta da etapa atual.", proximoTemplate: proximaAcao(lead).template };
}

if (typeof module !== "undefined") module.exports = { scoreLead, classificarLead, faixaMCMV, dadosFaltantes, portaoPromocao, proximaAcao, renderMensagem, variarMensagem, montarFilaSegura, interpretarResposta, ehOptOut };
