/* BlogMaster CRM — app principal (SPA, localStorage) */
const LS = "blogmaster_crm_v1";
let state = carregar();
let importPreview = [];
let filaAtual = [];
let leadSelecionadoId = null;
let drawerLeadId = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const uid = p => p + "-" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const fmtR$ = v => v == null || v === "" ? "—" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const agora = () => new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const telWA = t => { const d = String(t || "").replace(/\D/g, ""); return d ? (d.startsWith("55") ? d : "55" + d) : ""; };
const fmtTel = t => { const d = String(t || "").replace(/\D/g, "").replace(/^55/, ""); return d.length >= 10 ? `(${d.slice(0,2)}) ${d.slice(2, d.length-4)}-${d.slice(-4)}` : (t || "—"); };

function carregar() {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) { const s = JSON.parse(raw); if (s && Array.isArray(s.leads)) return s; }
  } catch (e) { /* ignora */ }
  return {
    config: { consultor: "Januário Leal", bsp: "", numero: "", templateApi: "" },
    listas: JSON.parse(JSON.stringify(SEED_LISTAS)),
    leads: JSON.parse(JSON.stringify(SEED_LEADS)),
    filaHistorico: [],
  };
}
function salvar() { localStorage.setItem(LS, JSON.stringify(state)); }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3400); }
/* Personalização global {corretor}: usa onboarding.js (Corretor) com fallback no state. */
function personalizeSeguro(texto) {
  if (typeof window !== "undefined" && window.Corretor && Corretor.personalize) return Corretor.personalize(texto);
  const nome = state.config.consultor || "Januário Leal";
  return String(texto).replace(/\{\{\s*(corretor|consultor)\s*\}\}/gi, nome).replace(/\{\s*(corretor|consultor)\s*\}/gi, nome);
}
function lead(id) { return state.leads.find(l => l.id === id); }
function listaNome(id) { const l = state.listas.find(x => x.id === id); return l ? l.nome : "Sem lista"; }
function estagioNome(id) { const e = ESTAGIOS.find(x => x.id === id); return e ? `${e.n || "✕"} · ${e.nome}` : id; }
function registrar(l, tipo, texto) { l.historico = l.historico || []; l.historico.push({ quando: agora(), tipo, texto }); }
function pillClasse(l) {
  const c = classificarLead(l);
  const map = { "quente": "quente", "em amadurecimento": "amad", "frio": "frio", "novo": "novo" };
  return `<span class="pill ${map[c] || "cinza"}">${esc(c)}</span>`;
}
function scoreHtml(l) { const { score } = scoreLead(l); return `<span class="score-ring" style="--p:${score}" title="Score do Agente"><i>${score}</i></span>`; }

/* ================= Navegação ================= */
const TITULOS = {
  dashboard: ["Visão Geral", "Funil Método Acelera · Goiânia & Aparecida de Goiânia"],
  listas: ["Painel por Listas", "Cole TXT ou envie TXT/CSV/PDF/DOCX — o Agente classifica e prepara o 1º contato"],
  leads: ["Leads / CRM", "Clique num lead para abrir a ficha completa, documentos e linha do tempo"],
  espelho: ["Espelho WhatsApp do Lead", "Prévia fiel da conversa + scripts do Método Acelera + envio manual 1 clique"],
  fila: ["Fila Segura Anti-Ban", "Processo agêntico de 1º contato com human-in-the-loop (sem robô de disparo)"],
  empreendimentos: ["9 Empreendimentos MRV", "Fichas prontas p/ WhatsApp · Goiânia & Aparecida de Goiânia"],
  manual: ["Manual de Conduta & Scripts — Método Acelera MRV", "Do 1º 'olá' ao fechamento: abertura, validação por etapas, docs, simulação, visita e assinatura"],
  pesquisa: ["Pesquisa · Sales & Marketing — Real Estate", "Playbook de aquisição e conversão para habitação econômica / MCMV em Goiânia e Aparecida"],
  config: ["Configurações", "Consultor, API Oficial do WhatsApp e backup dos seus dados"],
};
function irPara(view) {
  $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + view));
  $$("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  const [t, s] = TITULOS[view] || ["BlogMaster", ""];
  $("#view-title").textContent = t; $("#view-sub").textContent = s;
  $("#sidebar").classList.remove("open");
  if (view === "espelho") renderEspelho();
  if (view === "listas") renderListas();
  if (view === "leads") renderLeads();
  if (view === "dashboard") renderDashboard();
  if (view === "fila") renderFilaSelectors();
}
$$("#nav button").forEach(b => b.addEventListener("click", () => irPara(b.dataset.view)));
$("#btn-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$("#busca-global").addEventListener("input", e => { irPara("leads"); renderLeads(e.target.value); });

/* ================= Dashboard ================= */
function renderDashboard() {
  $("#badge-leads").textContent = state.leads.length;
  const ativos = state.leads.filter(l => l.estagio !== "perdido");
  const quentes = state.leads.filter(l => classificarLead(l) === "quente").length;
  const novos = state.leads.filter(l => l.estagio === "conexao").length;
  const docsPend = state.leads.filter(l => ["triagem", "regiao", "docs"].includes(l.estagio)).length;
  const visitas = state.leads.filter(l => l.estagio === "visita").length;
  const fechados = state.leads.filter(l => l.estagio === "fechamento").length;
  const semTel = state.leads.filter(l => !l.telefone).length;
  $("#kpis").innerHTML = [
    ["👥", state.leads.length, "Leads na base", ""],
    ["🆕", novos, "Aguardando 1º contato", "orange"],
    ["🔥", quentes, "Quentes (score ≥ 65)", "orange"],
    ["🗂️", docsPend, "Em qualificação/docs", ""],
    ["📅", visitas, "Visitas agendadas", ""],
    ["🏆", fechados, "Fechamentos", ""],
    ["⚠️", semTel, "Sem telefone (completar)", semTel ? "red" : ""],
  ].map(([i, v, t, c]) => `<div class="kpi ${c}"><b>${i} ${v}</b><span>${t} · ${ativos.length} ativos no funil</span></div>`).join("");

  const max = Math.max(1, ...ESTAGIOS.slice(0, 7).map(e => state.leads.filter(l => l.estagio === e.id).length));
  $("#funil").innerHTML = ESTAGIOS.slice(0, 7).map(e => {
    const n = state.leads.filter(l => l.estagio === e.id).length;
    return `<div class="funil-row"><span>${e.n}. ${e.nome}</span><span class="funil-bar"><i style="width:${Math.round(n / max * 100)}%"></i></span><b>${n}</b></div>`;
  }).join("") + `<p class="muted">Gatilho de avanço: ver matriz completa no Manual Acelera. Perdidos/opt-out: ${state.leads.filter(l => l.estagio === "perdido").length}.</p>`;

  const ordenados = [...ativos].sort((a, b) => scoreLead(b).score - scoreLead(a).score).slice(0, 6);
  $("#agente-acoes").innerHTML = ordenados.length ? ordenados.map(l => {
    const p = proximaAcao(l);
    return `<div class="acao-item"><b>${esc(l.nome || "Sem nome")}</b> ${pillClasse(l)} <span class="pill cinza">${estagioNome(l.estagio)}</span><br>
      🤖 ${esc(p.acao)}<br><button class="btn sm primary" onclick="abrirEspelhoLead('${l.id}')">Abrir no Espelho WhatsApp →</button>
      <button class="btn sm" onclick="abrirDrawer('${l.id}')">Ficha</button></div>`;
  }).join("") : `<p class="muted">Importe uma lista em <b>Painel por Listas</b> para o Agente começar a trabalhar.</p>`;

  $("#kanban").innerHTML = ESTAGIOS.slice(0, 7).map(e => {
    const cards = state.leads.filter(l => l.estagio === e.id);
    return `<div class="kcol"><h3>${e.n}. ${esc(e.curto)} <span>${cards.length}</span></h3>${cards.map(l => `
      <div class="kcard" onclick="abrirDrawer('${l.id}')">
        <b>${esc(l.nome || "Sem nome")}</b> ${pillClasse(l)}
        <small>${esc(l.empreendimento || "Sem empreendimento — Menu 1–9")} · ${fmtTel(l.telefone)}</small>
        <small>Score ${scoreLead(l).score} · ${esc(listaNome(l.listaId))}</small>
        <div class="row gap" style="margin-top:6px">
          <button class="btn sm" onclick="event.stopPropagation();abrirEspelhoLead('${l.id}')">📱</button>
          <button class="btn sm primary" onclick="event.stopPropagation();promoverLead('${l.id}')" title="Promover (valida portão da etapa)">Promover ▶</button>
        </div></div>`).join("") || `<p class="muted">—</p>`}</div>`;
  }).join("");
}

function promoverLead(id, forcar = false) {
  const l = lead(id); if (!l) return;
  const ordem = ["conexao", "triagem", "regiao", "docs", "simulacao", "visita", "fechamento"];
  const i = ordem.indexOf(l.estagio);
  if (i < 0 || i >= ordem.length - 1) { toast("Lead já está na etapa final (ou perdido)."); return; }
  const destino = ordem[i + 1];
  const portao = portaoPromocao(l, destino);
  if (!portao.ok && !forcar) {
    if (!confirm(`⛔ Portão do Método Acelera — falta para promover p/ "${estagioNome(destino)}":\n\n• ${portao.falta.join("\n• ")}\n\nPromover mesmo assim? (não recomendado)`)) return;
  }
  l.estagio = destino;
  registrar(l, "sistema", `Promovido para ${estagioNome(destino)}${!portao.ok ? " (portão ignorado manualmente)" : ""}.`);
  salvar(); renderDashboard(); renderLeads();
  if (drawerLeadId === id) abrirDrawer(id);
  toast(`▶ ${l.nome} promovido: ${estagioNome(destino)}`);
}

/* ================= Listas / Import ================= */
function renderListaSelects() {
  const opts = state.listas.map(l => `<option value="${l.id}">${esc(l.nome)}</option>`).join("");
  $("#imp-lista-select").innerHTML = opts;
  $("#nl-lista").innerHTML = opts;
  $("#f-lista").innerHTML = `<option value="">Todas as listas</option>` + opts;
  $("#fila-lista").innerHTML = `<option value="">Todas</option>` + opts;
  $("#f-estagio").innerHTML = `<option value="">Todas as etapas</option>` + ESTAGIOS.map(e => `<option value="${e.id}">${e.n || "✕"} · ${e.nome}</option>`).join("");
  $("#f-emp").innerHTML = `<option value="">Todos os empreendimentos</option>` + EMPREENDIMENTOS.map(e => `<option>${e.nome}</option>`).join("");
  $("#nl-emp").innerHTML = `<option value="">— definir pelo Menu 1–9 —</option>` + EMPREENDIMENTOS.map(e => `<option>${e.nome}</option>`).join("");
}
function renderListas() {
  renderListaSelects();
  $("#listas-cards").innerHTML = state.listas.map(lst => {
    const leads = state.leads.filter(l => l.listaId === lst.id);
    const novosL = leads.filter(l => l.estagio === "conexao").length;
    const resp = leads.filter(l => (l.historico || []).some(h => h.tipo === "resposta")).length;
    const semTel = leads.filter(l => !l.telefone).length;
    return `<div class="lista-card"><h3>🗂️ ${esc(lst.nome)}</h3>
      <small class="muted">${esc(lst.origem || "")} · criada em ${esc(lst.criadaEm || "")}</small>
      <div class="mini-stats"><span>👥 ${leads.length} leads</span><span>🆕 ${novosL} p/ 1º contato</span><span>💬 ${resp} responderam</span>${semTel ? `<span>⚠️ ${semTel} sem telefone</span>` : ""}</div>
      <div class="row gap wrap">
        <button class="btn sm primary" onclick="irFilaLista('${lst.id}')">🤖 Rodar Agente (1º contato)</button>
        <button class="btn sm" onclick="filtrarPorLista('${lst.id}')">Ver leads</button>
        <button class="btn sm danger" onclick="excluirLista('${lst.id}')">Excluir lista</button>
      </div></div>`;
  }).join("") || `<p class="muted">Nenhuma lista ainda — importe a primeira ao lado.</p>`;
}
function irFilaLista(id) { irPara("fila"); $("#fila-lista").value = id; montarFila(); }
function filtrarPorLista(id) { irPara("leads"); $("#f-lista").value = id; renderLeads(); }
function excluirLista(id) {
  const n = state.leads.filter(l => l.listaId === id).length;
  if (!confirm(`Excluir a lista e os ${n} lead(s) dela? Faça backup antes.`)) return;
  state.leads = state.leads.filter(l => l.listaId !== id);
  state.listas = state.listas.filter(l => l.id !== id);
  salvar(); renderListas(); renderDashboard(); toast("Lista excluída.");
}

const EXEMPLO_IMPORT = `José Fernando Ribeiro Matos
📞 Contato: 62991074310
Renda Mensal: R$ 5.000,00
FGTS: não informou
Entrada disponível: R$ 5.000,00
Empreendimento: Gran Verona
Bairro de interesse inicial: Papillon Park
Classificação: em amadurecimento — compra sozinho, interesse na vizinhança.

---

Maryana
(cole aqui mais fichas — uma por bloco, separadas por linha em branco ou ---)`;

$("#btn-imp-exemplo").addEventListener("click", () => { $("#imp-texto").value = EXEMPLO_IMPORT; toast("Exemplo carregado — clique em Analisar com o Agente."); });

async function lerArquivo(file) {
  const ext = file.name.toLowerCase().split(".").pop();
  if (["txt", "csv", "md", "json"].includes(ext)) return await file.text();
  if (ext === "pdf") {
    if (!window.pdfjsLib) throw new Error("Leitor de PDF não carregou (sem internet?). Cole o texto do PDF na caixa ao lado — funciona igual.");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let txt = "";
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      txt += content.items.map(i => i.str).join(" ") + "\n\n";
    }
    return txt;
  }
  if (ext === "docx") {
    if (!window.mammoth) throw new Error("Leitor DOCX não carregou (sem internet?). Cole o texto do documento na caixa ao lado.");
    const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return res.value;
  }
  throw new Error("Formato não suportado. Use .txt, .csv, .md, .pdf ou .docx — ou cole o texto.");
}
$("#imp-file").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f) return;
  try { $("#imp-texto").value = await lerArquivo(f); toast(`Arquivo "${f.name}" lido. Clique em Analisar com o Agente.`); }
  catch (err) { alert("⚠️ " + err.message); }
});
const dz = $("#dropzone");
dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("drag"); });
dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
dz.addEventListener("drop", async e => {
  e.preventDefault(); dz.classList.remove("drag");
  const f = e.dataTransfer.files[0]; if (!f) return;
  try { $("#imp-texto").value = await lerArquivo(f); toast(`Arquivo "${f.name}" lido.`); } catch (err) { alert("⚠️ " + err.message); }
});

$("#btn-imp-preview").addEventListener("click", () => {
  const txt = $("#imp-texto").value;
  importPreview = parseTextoParaLeads(txt);
  const el = $("#imp-preview");
  if (!importPreview.length) { el.innerHTML = `<div class="warn-box">Nenhum lead reconhecido. Verifique se há nomes e telefones no texto (1 ficha por bloco, separado por linha em branco, ou CSV com cabeçalho).</div>`; return; }
  el.innerHTML = `<div class="ok-box">🤖 Agente encontrou <b>${importPreview.length} lead(s)</b> (duplicados por telefone já removidos). Confira e confirme:</div>
    <div class="table-wrap"><table><thead><tr><th>#</th><th>Nome</th><th>Telefone</th><th>Emp.</th><th>Renda</th><th>Entrada</th><th>Score prévio</th></tr></thead>
    <tbody>${importPreview.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.nome || "⚠️ sem nome")}</td><td>${esc(fmtTel(p.telefone))}</td><td>${esc(p.empreendimento || "Menu 1–9")}</td><td>${fmtR$(p.renda)}</td><td>${fmtR$(p.entrada)}</td><td>${scoreLead({ ...p, docs: {}, historico: [] }).score}</td></tr>`).join("")}</tbody></table></div>
    <div class="row gap" style="margin-top:10px"><button class="btn primary" id="btn-imp-confirmar">✅ Confirmar importação (${importPreview.length})</button>
    <button class="btn" id="btn-imp-cancelar">Cancelar</button></div>`;
  $("#btn-imp-confirmar").addEventListener("click", confirmarImport);
  $("#btn-imp-cancelar").addEventListener("click", () => { importPreview = []; el.innerHTML = ""; });
});

function criarLista(nome, origem) {
  const id = uid("lista");
  state.listas.push({ id, nome, origem: origem || "Importação", criadaEm: new Date().toISOString().slice(0, 10) });
  return id;
}

/* Núcleo único de importação (Painel por Listas + box do onboarding):
   deduplica por telefone, cria leads na etapa Conexão e devolve contadores. */
function adicionarLeadsAoCRM(parsed, listaId) {
  const tels = new Set(state.leads.map(l => l.telefone).filter(Boolean));
  let add = 0, dup = 0;
  for (const p of (parsed || [])) {
    const tel = String(p.telefone || "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (tel && tels.has(tel)) { dup++; continue; }
    const novo = {
      id: uid("lead"), listaId, nome: p.nome || "Lead sem nome", telefone: tel,
      renda: (p.renda === "" || p.renda == null) ? null : (typeof p.renda === "number" ? p.renda : parseMoeda(p.renda)),
      entrada: (p.entrada === "" || p.entrada == null) ? null : (typeof p.entrada === "number" ? p.entrada : parseMoeda(p.entrada)),
      fgts: p.fgts || "", composicao: p.composicao || "",
      empreendimento: p.empreendimento || "", bairro: p.bairro || "", cidade: p.cidade || "",
      estagio: "conexao", optIn: p.optIn !== false, canal: "WhatsApp", docs: {}, parcela: "", subsidio: "", unidade: "",
      obs: p.obs || "", insights: [], criadoEm: new Date().toISOString().slice(0, 10), historico: [],
    };
    registrar(novo, "sistema", `Importado da lista "${listaNome(listaId)}". Falta: ${dadosFaltantes(novo).join("; ") || "nada — pronto p/ análise"}.`);
    state.leads.push(novo); if (tel) tels.add(tel); add++;
  }
  salvar(); renderListas(); renderDashboard(); renderLeads();
  return { add, dup, listaId };
}

function confirmarImport() {
  let listaId = $("#imp-lista-select").value;
  const novoNome = $("#imp-lista-nome").value.trim();
  if (novoNome) listaId = criarLista(novoNome, "Importação (TXT/arquivo)");
  if (!listaId) { toast("Crie ou selecione uma lista destino."); return; }
  const { add, dup } = adicionarLeadsAoCRM(importPreview, listaId);
  importPreview = []; $("#imp-preview").innerHTML = ""; $("#imp-lista-nome").value = "";
  toast(`✅ ${add} lead(s) importado(s)${dup ? ` · ${dup} duplicado(s) ignorado(s)` : ""}. Rode o Agente na Fila Segura!`);
  irFilaLista(listaId);
}

/* ================= Leads / CRM ================= */
function renderLeads(busca = "") {
  renderListaSelectsKeep();
  const fLista = $("#f-lista").value, fEst = $("#f-estagio").value, fCls = $("#f-classe").value, fEmp = $("#f-emp").value;
  const q = (busca || $("#busca-global").value || "").toLowerCase();
  const rows = state.leads.filter(l =>
    (!fLista || l.listaId === fLista) && (!fEst || l.estagio === fEst) &&
    (!fCls || classificarLead(l) === fCls) && (!fEmp || l.empreendimento === fEmp) &&
    (!q || JSON.stringify(l).toLowerCase().includes(q)));
  $("#tbl-leads tbody").innerHTML = rows.map(l => {
    const p = proximaAcao(l);
    return `<tr data-lead onclick="abrirDrawer('${l.id}')">
      <td><b>${esc(l.nome || "Sem nome")}</b><br><small class="muted">${esc(listaNome(l.listaId))}</small></td>
      <td>${fmtTel(l.telefone)}${l.telefone ? "" : ' <span class="pill quente">sem tel</span>'}</td>
      <td>${esc(l.empreendimento || "— (Menu 1–9)")}<br><small class="muted">${esc([l.bairro, l.cidade].filter(Boolean).join(" · "))}</small></td>
      <td>${fmtR$(l.renda)} · ${fmtR$(l.entrada)}<br><small class="muted">${l.renda ? esc(faixaMCMV(l.renda)?.faixa || "") + " MCMV (estim.)" : ""}</small></td>
      <td>${scoreHtml(l)} ${pillClasse(l)}</td>
      <td>${esc(estagioNome(l.estagio))}</td>
      <td><small>🤖 ${esc(p.acao)}</small></td>
      <td><button class="btn sm whatsapp" onclick="event.stopPropagation();abrirEspelhoLead('${l.id}')">📱 Espelho</button></td></tr>`;
  }).join("") || `<tr><td colspan="8" class="muted">Nenhum lead com esses filtros.</td></tr>`;
  $("#badge-leads").textContent = state.leads.length;
}
function renderListaSelectsKeep() {
  const keep = ["f-lista", "f-estagio", "f-classe", "f-emp"].map(id => [id, document.getElementById(id)?.value]);
  renderListaSelects();
  for (const [id, v] of keep) { const el = document.getElementById(id); if (el && v != null) el.value = v; }
}
["f-lista", "f-estagio", "f-classe", "f-emp"].forEach(id => document.getElementById(id).addEventListener("change", () => renderLeads()));

function exportCSV() {
  const head = "nome;telefone;lista;empreendimento;bairro;cidade;renda;entrada;fgts;composicao;etapa;classificacao;score;observacoes";
  const linhas = state.leads.map(l => [l.nome, l.telefone, listaNome(l.listaId), l.empreendimento, l.bairro, l.cidade, l.renda ?? "", l.entrada ?? "", l.fgts, l.composicao, estagioNome(l.estagio), classificarLead(l), scoreLead(l).score, (l.obs || "").replace(/[\n;]/g, " ")].join(";"));
  baixar("leads-blogmaster.csv", "﻿" + head + "\n" + linhas.join("\n"), "text/csv");
  toast("CSV exportado (abre no Excel).");
}
$("#btn-export-csv").addEventListener("click", exportCSV);
$("#btn-export-csv2").addEventListener("click", exportCSV);
function baixar(nome, conteudo, tipo) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

/* ================= Drawer (ficha do lead) ================= */
function abrirDrawer(id) {
  const l = lead(id); if (!l) return;
  drawerLeadId = id;
  $("#drawer-overlay").hidden = false; $("#drawer").hidden = false;
  $("#dr-titulo").textContent = l.nome || "Lead";
  const { score, motivos } = scoreLead(l);
  const faixa = faixaMCMV(l.renda);
  const p = proximaAcao(l);
  $("#dr-body").innerHTML = `
    <div class="row gap wrap">${scoreHtml(l)} ${pillClasse(l)} <span class="pill cinza">${esc(estagioNome(l.estagio))}</span>
    ${faixa ? `<span class="pill novo">${faixa.faixa} MCMV (estimativa)</span>` : ""}</div>
    <div class="ok-box">🤖 <b>Próxima ação:</b> ${esc(p.acao)}<br>
      <small>Score ${score}: ${motivos.map(esc).join(" · ") || "sem dados ainda"}</small><br>
      <small><b>Falta coletar:</b> ${dadosFaltantes(l).join("; ") || "nada 🎉"}</small></div>
    <label>Nome <input id="dr-nome" value="${esc(l.nome)}"></label>
    <div class="row gap"><label style="flex:1">Telefone <input id="dr-tel" value="${esc(l.telefone)}"></label>
    <label style="flex:1">Lista <select id="dr-lista">${state.listas.map(x => `<option value="${x.id}" ${x.id === l.listaId ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</select></label></div>
    <div class="row gap"><label style="flex:1">Empreendimento <select id="dr-emp"><option value="">— Menu 1–9 —</option>${EMPREENDIMENTOS.map(e => `<option ${e.nome === l.empreendimento ? "selected" : ""}>${e.nome}</option>`).join("")}</select></label>
    <label style="flex:1">Etapa <select id="dr-estagio">${ESTAGIOS.map(e => `<option value="${e.id}" ${e.id === l.estagio ? "selected" : ""}>${e.n || "✕"} · ${e.nome}</option>`).join("")}</select></label></div>
    <div class="row gap"><label style="flex:1">Bairro <input id="dr-bairro" value="${esc(l.bairro)}"></label>
    <label style="flex:1">Cidade <input id="dr-cidade" value="${esc(l.cidade)}"></label></div>
    <div class="row gap"><label style="flex:1">Renda (R$) <input id="dr-renda" type="number" value="${l.renda ?? ""}"></label>
    <label style="flex:1">Entrada (R$) <input id="dr-entrada" type="number" value="${l.entrada ?? ""}"></label>
    <label style="flex:1">FGTS <input id="dr-fgts" value="${esc(l.fgts)}"></label></div>
    <div class="row gap"><label style="flex:1">Composição <select id="dr-comp"><option value="" ${!l.composicao ? "selected" : ""}>—</option><option ${l.composicao === "sozinho" ? "selected" : ""}>sozinho</option><option ${l.composicao === "composição de renda" ? "selected" : ""}>composição de renda</option></select></label>
    <label style="flex:1">Parcela simulação <input id="dr-parcela" placeholder="Ex.: 890" value="${esc(l.parcela)}"></label>
    <label style="flex:1">Subsídio <input id="dr-subsidio" placeholder="Ex.: 16000" value="${esc(l.subsidio)}"></label>
    <label style="flex:1">Unidade <input id="dr-unidade" placeholder="Bloco/Apto" value="${esc(l.unidade)}"></label></div>
    <label class="check"><input type="checkbox" id="dr-optin" ${l.optIn ? "checked" : ""}> Opt-in / interesse demonstrado (pode receber contato)</label>
    <h3>🗂️ Documentos (portão p/ Análise de Crédito)</h3>
    ${DOCS_CHECKLIST.map(d => `<label class="check"><input type="checkbox" data-doc="${d.id}" ${l.docs?.[d.id] ? "checked" : ""}> ${d.label}</label>`).join("")}
    <label>Observações / Insights <textarea id="dr-obs" rows="4">${esc(l.obs || "")}</textarea></label>
    ${l.insights?.length ? `<div class="warn-box">🎯 <b>Insights:</b><ul style="margin:6px 0 0;padding-left:18px">${l.insights.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>` : ""}
    <div class="row gap wrap">
      <button class="btn primary" id="dr-salvar">💾 Salvar ficha</button>
      <button class="btn whatsapp" onclick="abrirEspelhoLead('${l.id}')">📱 Espelho WhatsApp</button>
      <button class="btn" onclick="promoverLead('${l.id}')">Promover etapa ▶</button>
      <button class="btn danger" id="dr-excluir">Excluir lead</button>
    </div>
    <h3>🕘 Linha do tempo</h3>
    <div class="timeline">${(l.historico || []).slice().reverse().map(h => `<div><small>${esc(h.quando)} · ${esc(h.tipo)}</small>${esc(h.texto)}</div>`).join("") || "<div class='muted'>Sem registros.</div>"}</div>`;
  $("#dr-salvar").addEventListener("click", () => {
    l.nome = $("#dr-nome").value.trim(); l.telefone = $("#dr-tel").value.replace(/\D/g, "").replace(/^55/, "");
    l.listaId = $("#dr-lista").value; l.empreendimento = $("#dr-emp").value;
    const novoEst = $("#dr-estagio").value;
    if (novoEst !== l.estagio) registrar(l, "sistema", `Etapa alterada manualmente: ${estagioNome(l.estagio)} → ${estagioNome(novoEst)}.`);
    l.estagio = novoEst; l.bairro = $("#dr-bairro").value.trim(); l.cidade = $("#dr-cidade").value.trim();
    l.renda = $("#dr-renda").value ? Number($("#dr-renda").value) : null;
    l.entrada = $("#dr-entrada").value ? Number($("#dr-entrada").value) : null;
    l.fgts = $("#dr-fgts").value.trim(); l.composicao = $("#dr-comp").value;
    l.parcela = $("#dr-parcela").value.trim(); l.subsidio = $("#dr-subsidio").value.trim(); l.unidade = $("#dr-unidade").value.trim();
    l.optIn = $("#dr-optin").checked; l.obs = $("#dr-obs").value;
    l.docs = l.docs || {};
    $$("[data-doc]").forEach(c => { const tinha = l.docs[c.dataset.doc]; l.docs[c.dataset.doc] = c.checked; if (c.checked && !tinha) registrar(l, "docs", `Documento recebido: ${DOCS_CHECKLIST.find(d => d.id === c.dataset.doc).label}`); });
    registrar(l, "sistema", "Ficha atualizada.");
    salvar(); renderLeads(); renderDashboard(); abrirDrawer(id); toast("Ficha salva ✅");
  });
  $("#dr-excluir").addEventListener("click", () => {
    if (!confirm(`Excluir ${l.nome}?`)) return;
    state.leads = state.leads.filter(x => x.id !== id); salvar(); fecharDrawer(); renderLeads(); renderDashboard(); toast("Lead excluído.");
  });
}
function fecharDrawer() { $("#drawer-overlay").hidden = true; $("#drawer").hidden = true; drawerLeadId = null; }
$("#dr-fechar").addEventListener("click", fecharDrawer);
$("#drawer-overlay").addEventListener("click", fecharDrawer);

/* ================= Novo lead ================= */
$("#btn-novo-lead").addEventListener("click", () => { renderListaSelects(); $("#modal-lead").showModal(); });
$("#btn-salvar-lead").addEventListener("click", e => {
  e.preventDefault();
  const f = new FormData($("#form-lead"));
  const novo = {
    id: uid("lead"), nome: String(f.get("nome") || "").trim(), telefone: String(f.get("telefone") || "").replace(/\D/g, "").replace(/^55/, ""),
    listaId: String(f.get("listaId") || ""), empreendimento: String(f.get("empreendimento") || ""),
    renda: f.get("renda") ? Number(f.get("renda")) : null, entrada: f.get("entrada") ? Number(f.get("entrada")) : null,
    fgts: "", composicao: "", bairro: "", cidade: "", estagio: "conexao", optIn: !!f.get("optIn"),
    canal: "WhatsApp", docs: {}, parcela: "", subsidio: "", unidade: "", obs: String(f.get("obs") || ""),
    insights: [], criadoEm: new Date().toISOString().slice(0, 10), historico: [],
  };
  if (!novo.nome) { toast("Informe o nome."); return; }
  registrar(novo, "sistema", "Lead criado manualmente.");
  state.leads.unshift(novo); salvar();
  $("#modal-lead").close(); $("#form-lead").reset();
  renderDashboard(); abrirEspelhoLead(novo.id); toast("Lead criado — mensagem de 1º contato gerada 👇");
});

/* ================= Espelho WhatsApp ================= */
function abrirEspelhoLead(id) { leadSelecionadoId = id; irPara("espelho"); }
function renderEspelho() {
  const sel = $("#esp-lead");
  sel.innerHTML = state.leads.map(l => `<option value="${l.id}">${esc(l.nome || "Sem nome")} — ${estagioNome(l.estagio)}</option>`).join("");
  if (leadSelecionadoId && lead(leadSelecionadoId)) sel.value = leadSelecionadoId;
  else if (state.leads[0]) leadSelecionadoId = state.leads[0].id;
  $("#esp-template").innerHTML = TEMPLATES.map(t => `<option value="${t.id}">${esc(t.titulo)}</option>`).join("");
  atualizarEspelho(true);
}
$("#esp-lead")?.addEventListener("change", e => { leadSelecionadoId = e.target.value; atualizarEspelho(true); });
$("#esp-template")?.addEventListener("change", () => atualizarEspelho(false));

function atualizarEspelho(sugerirTemplate) {
  const l = lead(leadSelecionadoId); if (!l) return;
  const sel = $("#esp-lead"); if (sel.value !== l.id) sel.value = l.id;
  const p = proximaAcao(l);
  if (sugerirTemplate) $("#esp-template").value = p.template;
  const t = TEMPLATES.find(x => x.id === $("#esp-template").value) || TEMPLATES[0];
  $("#esp-template-quando").textContent = "Quando usar: " + t.quando;
  $("#esp-mensagem").value = personalizeSeguro(renderMensagem(t.texto, l, state.config.consultor));
  const faixa = faixaMCMV(l.renda);
  $("#esp-resumo").innerHTML = `<div class="ok-box">🤖 <b>Agente:</b> ${esc(p.acao)}<br>
    <small>Score ${scoreLead(l).score} · ${esc(classificarLead(l))} · ${esc(estagioNome(l.estagio))}${faixa ? ` · ${faixa.faixa} MCMV (estimativa)` : ""}<br>
    Renda ${fmtR$(l.renda)} · Entrada ${fmtR$(l.entrada)} · FGTS: ${esc(l.fgts || "não coletado")} · ${esc(l.empreendimento || "sem empreendimento → Menu 1–9")}<br>
    <b>Falta:</b> ${dadosFaltantes(l).join("; ") || "nada 🎉"}</small></div>`;
  pintarWA(l);
}
function pintarWA(l) {
  $("#wa-nome").textContent = l.nome || "Lead";
  $("#wa-avatar").textContent = (l.nome || "?").trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
  $("#wa-status").textContent = l.telefone ? fmtTel(l.telefone) + " · online" : "⚠️ sem telefone cadastrado";
  const hist = (l.historico || []).filter(h => h.tipo === "envio" || h.tipo === "resposta");
  $("#wa-body").innerHTML = `<div class="wa-date">HOJE</div>
    <div class="wa-system">🔒 Espelho de prévia do BlogMaster CRM. O envio real é manual, no seu WhatsApp.</div>` +
    hist.map(h => `<div class="wa-msg ${h.tipo === "envio" ? "out" : "in"}">${esc(h.texto)}<time>${esc(h.quando.split(" ").slice(-1)[0] || "")} ${h.tipo === "envio" ? "✓✓" : ""}</time></div>`).join("") +
    `<div class="wa-msg out" style="outline:2px dashed #f97316">${esc($("#esp-mensagem").value)}<time>prévia · não enviada</time></div>`;
  $("#wa-body").scrollTop = $("#wa-body").scrollHeight;
}
$("#esp-mensagem")?.addEventListener("input", () => { const l = lead(leadSelecionadoId); if (l) pintarWA(l); });
$("#btn-esp-regenerar")?.addEventListener("click", () => atualizarEspelho(true));
$("#btn-esp-variar")?.addEventListener("click", () => {
  const l = lead(leadSelecionadoId); if (!l) return;
  $("#esp-mensagem").value = variarMensagem($("#esp-mensagem").value, l.id + Date.now());
  pintarWA(l); toast("Texto variado (anti-padrão de spam). Confira antes de enviar.");
});
$("#btn-esp-copiar")?.addEventListener("click", async () => {
  await navigator.clipboard.writeText($("#esp-mensagem").value).catch(() => {});
  toast("Mensagem copiada 📋");
});
$("#btn-esp-enviar")?.addEventListener("click", () => {
  const l = lead(leadSelecionadoId); if (!l) return;
  const tel = telWA(l.telefone);
  if (!tel) { alert("⚠️ Este lead não tem telefone. Abra a Ficha e cadastre DDD+número para enviar."); abrirDrawer(l.id); return; }
  const msg = $("#esp-mensagem").value.trim();
  if (!msg) return;
  if (/\[valor\]|\[unidade\]/.test(msg) && !confirm("A mensagem ainda tem [valor]/[unidade] sem preencher. Enviar mesmo assim?")) return;
  window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
  registrar(l, "envio", msg);
  if (l.estagio === "conexao") registrar(l, "sistema", "1º contato enviado (aguardando resposta p/ promover).");
  salvar(); pintarWA(l); renderDashboard();
  toast("WhatsApp aberto com a mensagem pronta — confira e toque em enviar lá 💬 (envio humano = sem ban)");
});
$("#btn-esp-resposta")?.addEventListener("click", () => {
  const l = lead(leadSelecionadoId); if (!l) return;
  const txt = $("#esp-resposta").value.trim(); if (!txt) return;
  registrar(l, "resposta", txt);
  const r = interpretarResposta(l, txt);
  let extra = "";
  if (r.tipo === "menu") {
    l.empreendimento = r.empreendimento;
    const emp = empDoLead(l); if (emp) { l.bairro = emp.bairro; l.cidade = emp.cidade; }
    if (l.estagio === "conexao") l.estagio = "triagem";
    extra = `✅ Empreendimento definido: <b>${esc(r.empreendimento)}</b> e lead promovido p/ Triagem.`;
  }
  if (r.tipo === "optout") { l.optIn = false; l.estagio = "perdido"; extra = "🛑 Opt-out aplicado: lead movido p/ Perdido e fora de qualquer fila futura."; }
  if (l.estagio === "conexao") l.estagio = "triagem";
  salvar(); $("#esp-resposta").value = "";
  if (r.proximoTemplate) $("#esp-template").value = r.proximoTemplate;
  atualizarEspelho(false);
  $("#esp-agente-dica").innerHTML = `<div class="ok-box">🤖 <b>Agente interpretou:</b> ${esc(r.acao)} ${extra}<br><small>Próximo script já carregado acima — revise e envie mantendo a pergunta no final.</small></div>`;
  renderDashboard();
});

/* ================= Fila Segura ================= */
function renderFilaSelectors() { renderListaSelectsKeep(); pintarFila(); }
function cfgFila() {
  return { limiteDia: Number($("#fila-limite").value) || 40, intervaloMin: Number($("#fila-intervalo").value) || 3, horaInicio: Number($("#fila-hini").value) || 8, horaFim: Number($("#fila-hfim").value) || 20, soOptIn: $("#fila-optin").checked, consultor: state.config.consultor };
}
function montarFila() {
  const { fila, pulados } = montarFilaSegura(state.leads, cfgFila(), $("#fila-lista").value || null);
  filaAtual = fila;
  $("#badge-fila").textContent = fila.length;
  $("#fila-resumo").innerHTML = `<div class="${fila.length ? "ok-box" : "warn-box"}">🤖 Fila montada: <b>${fila.length} contato(s)</b> personalizado(s), ordenados por score, espaçados em ${cfgFila().intervaloMin} min em horário comercial.
    ${pulados.length ? `<br>⏭️ <b>${pulados.length} pulado(s):</b> ${pulados.map(p => `${esc(p.lead.nome)} (${esc(p.motivo)})`).join(" · ")}` : ""}
    <br><small>Nada foi enviado. Envie 1 a 1 abaixo — clique humano abre seu WhatsApp com o texto pronto.</small></div>`;
  pintarFila();
}
$("#btn-fila-montar")?.addEventListener("click", montarFila);
function pintarFila() {
  const el = $("#fila-lista-ui"); if (!el) return;
  const feitos = filaAtual.filter(f => f.status === "enviado").length;
  el.innerHTML = filaAtual.length ? `<div class="progress"><i style="width:${filaAtual.length ? Math.round(feitos / filaAtual.length * 100) : 0}%"></i></div>
    <p class="muted">${feitos}/${filaAtual.length} enviados nesta sessão de fila.</p>` +
    filaAtual.map((f, i) => `<div class="fila-item ${f.status === "enviado" ? "done" : ""}" id="fila-${f.id}">
      <div>${scoreHtml(lead(f.leadId) || { docs: {}, historico: [] })}</div>
      <div><b>${i + 1}. ${esc(f.nome || "Sem nome")}</b> · ${fmtTel(f.telefone)} · <small class="muted">sugerido ${esc(f.previsao)} · script: ${f.templateId === "menu9" ? "Menu 1–9" : "Abertura específica"}</small>
      <details><summary>Ver mensagem personalizada</summary><pre>${esc(f.mensagem)}</pre></details></div>
      <div class="row gap">${f.status === "enviado" ? '<span class="pill novo">✅ enviado</span>' :
        `<button class="btn sm" onclick="abrirEspelhoLead('${f.leadId}')">Revisar 📱</button>
         <button class="btn sm whatsapp" onclick="enviarDaFila('${f.id}')">💬 Enviar agora</button>
         <button class="btn sm" onclick="pularDaFila('${f.id}')">Pular</button>`}</div></div>`).join("")
    : `<p class="muted">Nenhuma fila montada. Escolha a lista e clique em <b>Montar fila de 1º contato</b>.</p>`;
  $("#badge-fila").textContent = filaAtual.filter(f => f.status === "pendente").length;
}
function enviarDaFila(fid) {
  const f = filaAtual.find(x => x.id === fid); if (!f) return;
  const l = lead(f.leadId); if (!l) return;
  window.open(`https://wa.me/${telWA(f.telefone)}?text=${encodeURIComponent(f.mensagem)}`, "_blank");
  registrar(l, "envio", f.mensagem);
  registrar(l, "sistema", "1º contato enviado pela Fila Segura (envio manual human-in-the-loop).");
  f.status = "enviado";
  state.filaHistorico.push({ quando: agora(), leadId: f.leadId, templateId: f.templateId });
  salvar(); pintarFila(); renderDashboard();
  toast(`💬 WhatsApp aberto p/ ${f.nome}. Confira e envie lá. Respeite o intervalo sugerido!`);
}
function pularDaFila(fid) { filaAtual = filaAtual.filter(f => f.id !== fid); pintarFila(); }

/* ================= Empreendimentos ================= */
function renderEmpreendimentos() {
  $("#menu9-pre").textContent = `Olá, {Nome}, tudo bem? Sou o ${state.config.consultor}, consultor MRV. Posso te fazer uma pergunta rápida? Para eu direcionar as informações certas, qual localização você prefere?\n\n${menu9Texto()}\n\nMe responda com o número da região que te interessa`;
  $("#emp-grid").innerHTML = EMPREENDIMENTOS.map(e => {
    const n = state.leads.filter(l => l.empreendimento === e.nome).length;
    return `<div class="emp-card">
      <span class="emp-num">${e.num <= 9 ? "Nº " + e.num + " do menu" : "Ficha-modelo"}</span> <span class="pill novo">${esc(e.cidade)}</span> ${n ? `<span class="pill amad">${n} lead(s)</span>` : ""}
      <h3>🟠 ${esc(e.nome)}</h3>
      <p class="muted">📍 ${esc(e.bairro)} · ${esc(e.status)} · Entrega: ${esc(e.entrega)}<br>🏢 ${esc(e.tipologia)}<br>💰 ${esc(e.preco)}</p>
      <details><summary><b>Ficha pronta p/ WhatsApp</b></summary><pre id="ficha-${e.num}">${esc(fichaEmpreendimento(e))}</pre></details>
      <div class="row gap" style="margin-top:8px">
        <button class="btn sm" data-copy="#ficha-${e.num}">📋 Copiar ficha</button>
        <button class="btn sm primary" onclick="filtrarEmp('${esc(e.nome)}')">Ver leads</button>
      </div></div>`;
  }).join("");
  bindCopy();
}
function filtrarEmp(nome) { irPara("leads"); $("#f-emp").value = nome; renderLeads(); }
function bindCopy() {
  $$("[data-copy]").forEach(b => b.onclick = async () => {
    const el = document.querySelector(b.dataset.copy);
    await navigator.clipboard.writeText(el ? el.textContent : "").catch(() => {});
    toast("Copiado 📋");
  });
}

/* ================= Manual & Pesquisa ================= */
function renderManual() {
  const matriz = ESTAGIOS.slice(0, 7).map(e => {
    const t = TEMPLATES.find(x => x.etapa === e.n);
    return `<tr><td><b>${e.n}. ${e.nome}</b></td><td>${esc(e.acao)}</td><td><small>${esc(t ? t.titulo : "—")}</small></td><td>${esc(e.gatilho)}</td></tr>`;
  }).join("");
  const scriptsPorEtapa = [1, 2, 3, 4, 5, 6, 7, 0].map(n => {
    const ts = TEMPLATES.filter(t => t.etapa === n);
    if (!ts.length) return "";
    const titulo = n === 0 ? "Follow-ups (cadência)" : `Etapa ${n} — ${ESTAGIOS.find(e => e.n === n).nome}`;
    return `<details class="acc" ${n === 1 ? "open" : ""}><summary>${titulo} (${ts.length} script(s))</summary><div class="acc-body">
      ${ts.map(t => `<h4>${esc(t.titulo)}</h4><p class="muted">Quando: ${esc(t.quando)}</p><div class="script-box" id="scr-${t.id}">${esc(personalizeSeguro(t.texto))}</div>
      <button class="btn sm" data-copy="#scr-${t.id}">📋 Copiar</button>
      <button class="btn sm primary" onclick="usarScript('${t.id}')">📱 Usar no Espelho</button>`).join("")}</div></details>`;
  }).join("");
  $("#manual-html").innerHTML = `
    <div class="card"><h2>1 · Posicionamento de marca & pilar de segurança</h2>
      <p><b>O que é a MRV?</b> A MRV é a <b>maior construtora e incorporadora da América Latina</b>, com mais de 40 anos de mercado e centenas de milhares de chaves entregues (+500 mil). Toda abertura do ${esc(state.config.consultor)} ancora essa frase — é o pilar de segurança que reduz objeção e bloqueio/spam.</p>
      <ul>${MANUAL_ACELERA.pilares.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <div class="card"><h2>2 · Regras de ouro (diretriz de abertura & validação)</h2>
      <ol>${MANUAL_ACELERA.regrasOuro.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
      <div class="warn-box">Neste CRM as regras viraram sistema: o botão <b>Promover ▶</b> bloqueia/alerta quando falta validação (renda, entrada, empreendimento, documentos, parcela, unidade).</div></div>
    <div class="card"><h2>3 · Fluxo visual</h2>
      <div class="pre-box">[1 Conexão] → [2 Triagem] → [3 Validação de Região] → [4 Docs/Caixa] → [5 Simulação] → [6 Visita] → [7 Fechamento]</div></div>
    <div class="card"><h2>4 · Matriz do processo completo</h2>
      <div class="table-wrap"><table class="matriz"><thead><tr><th>Etapa</th><th>Ação principal</th><th>Script-base</th><th>Critério p/ avançar (gatilho)</th></tr></thead><tbody>${matriz}</tbody></table></div></div>
    <div class="card"><h2>5 · Checklist de promoção do lead</h2><ol>${MANUAL_ACELERA.promocao.map(p => `<li>${esc(p)}</li>`).join("")}</ol></div>
    <div class="card"><h2>6 · Abertura padrão + Menu 9 (texto do consultor)</h2>
      <div class="script-box" id="manual-menu9">Olá, {Nome}, tudo bem? Sou o ${esc(state.config.consultor)}, consultor MRV. Posso te fazer uma pergunta rápida? Para eu direcionar as informações certas, qual localização você prefere?\n\n${esc(menu9Texto())}\n\nMe responda com o número da região que te interessa</div>
      <button class="btn sm" data-copy="#manual-menu9">📋 Copiar</button></div>
    <h2 style="margin-top:18px">7 · Biblioteca de scripts por etapa</h2>${scriptsPorEtapa}
    <div class="card"><h2>8 · Fichas-modelo de empreendimento</h2>
      <h3>Gran Safira (template original)</h3><div class="script-box" id="manual-safira">${esc(fichaEmpreendimento(EMPREENDIMENTOS.find(e => e.nome === "Gran Safira")))}</div><button class="btn sm" data-copy="#manual-safira">📋 Copiar</button>
      <h3>Gran Verona (adaptada — Papillon Park)</h3><div class="script-box" id="manual-verona">${esc(fichaEmpreendimento(EMPREENDIMENTOS.find(e => e.nome === "Gran Verona")))}</div><button class="btn sm" data-copy="#manual-verona">📋 Copiar</button></div>`;
  bindCopy();
}
function usarScript(id) {
  if (!state.leads.length) { toast("Cadastre um lead primeiro."); return; }
  if (!leadSelecionadoId) leadSelecionadoId = state.leads[0].id;
  irPara("espelho");
  $("#esp-template").value = id; atualizarEspelho(false);
}

function renderPesquisa() {
  $("#pesquisa-html").innerHTML = `
  <div class="card"><h2>🎯 Tese comercial (Goiânia + Aparecida de Goiânia)</h2>
    <p>Habitação econômica vende <b>parcela que cabe no bolso + localização p/ a rotina + segurança de entrega</b>. Por isso o Método Acelera é: <b>região primeiro (Menu 1–9), parcela depois (com dados validados)</b>. Quem manda tabela sem qualificar vira "só mais um corretor" e é ignorado/bloqueado.</p>
    <ul>
      <li><b>Aparecida (Papillon Park, Parque das Nações, Atheneu):</b> discurso de custo-benefício, Aparecida Shopping, eixos Veiga Cabral/Brasicon, acesso a Goiânia.</li>
      <li><b>Goiânia Noroeste (Terrazzo, Golden Ville, Priville, Aurora):</b> discurso de valorização + Unialfa/indústrias + sair do aluguel na mesma região onde já mora/trabalha.</li>
      <li><b>Parque Amazônia (Vert) e Novo Mundo (Gran Porto):</b> discurso de bairro consolidado, serviços e revenda/locação (perfil investidor pequeno).</li>
    </ul></div>
  <div class="card"><h2>💰 MCMV 2026 — triagem rápida (estimativa, confirmar Caixa)</h2>
    <div class="table-wrap"><table><thead><tr><th>Faixa</th><th>Renda familiar até</th><th>Leitura comercial</th></tr></thead>
    <tbody>${FAIXAS_MCMV.map(f => `<tr><td><b>${f.faixa}</b></td><td>${f.teto === Infinity ? "acima de R$ 9.600" : fmtR$(f.teto)}</td><td>${esc(f.obs)}</td></tr>`).join("")}</tbody></table></div>
    <p class="muted">O CRM estima a faixa pela renda (José Fernando, R$ 5.000 = Faixa 2/3 fronteira*, sozinho) mas <b>nunca promete subsídio/juros</b>: quem aprova é a Caixa. *Fronteiras mudam por norma vigente — validar com correspondente.</p>
    <div class="ok-box"><b>Perguntas que destravam a simulação (nesta ordem):</b> 1) região · 2) renda individual x composição · 3) FGTS +3 anos · 4) entrada em dinheiro/veículo · 5) documentos. Uma por mensagem, sempre terminando com pergunta.</div></div>
  <div class="card"><h2>📈 Funil & métricas p/ acompanhar toda semana</h2>
    <div class="table-wrap"><table><thead><tr><th>Métrica</th><th>Meta saudável</th><th>Se cair, o problema é…</th></tr></thead><tbody>
      <tr><td>Taxa de resposta ao 1º contato</td><td>≥ 25–40% (base com interesse)</td><td>Abertura genérica demais / horário ruim / base fria sem opt-in</td></tr>
      <tr><td>Resposta → triagem completa</td><td>≥ 50%</td><td>Perguntas demais de uma vez; não terminou com pergunta</td></tr>
      <tr><td>Triagem → documentos</td><td>≥ 30–40%</td><td>Faltou ancorar "análise Caixa sem custo" + urgência de tabela</td></tr>
      <tr><td>Docs → simulação apresentada</td><td>≥ 70%</td><td>Demora do correspondente; lead esfriando sem follow-up D+1</td></tr>
      <tr><td>Simulação → visita</td><td>≥ 40%</td><td>Parcela sem ancoragem (subsídio/entrada facilitada) ou sem dupla escolha</td></tr>
      <tr><td>Visita → fechamento</td><td>≥ 20–30%</td><td>Unidade/tabela; cônjuge decisor ausente (convidar sempre)</td></tr>
      <tr><td>Tempo até 1º contato</td><td>≤ 5 min (lead quente)</td><td>Sem fila priorizada por score — use a Fila Segura</td></tr>
      <tr><td>Opt-out / bloqueio</td><td>&lt; 2%</td><td>Disparo em massa, texto idêntico, insistência após D+7</td></tr>
    </tbody></table></div></div>
  <div class="card"><h2>🔁 Cadência de follow-up Acelera (sem virar spam)</h2>
    <ol>
      <li><b>D0</b> — 1º contato (Menu 9 ou abertura específica) em horário comercial.</li>
      <li><b>D+1</b> — lembrete curto (script Follow-up D+1). Se respondeu, avance 1 pergunta da triagem.</li>
      <li><b>D+3</b> — valor: ficha 🟠 do empreendimento + "posso calcular sua parcela?"</li>
      <li><b>D+7</b> — encerramento elegante (script D+7). Sem resposta = arquiva como frio. <b>Nunca</b> insistir em quem pediu p/ parar.</li>
    </ol>
    <p class="muted">Áudio de até 40s só depois da 1ª resposta (humaniza sem assustar). Foto/vídeo do decorado só após triagem — material antes da qualificação gera curioso, não comprador.</p></div>
  <div class="card"><h2>🧲 Canais de aquisição (sales marketing) — onde nasce a lista</h2>
    <ul>
      <li><b>Click-to-WhatsApp (Meta Ads)</b> segmentado por bairro/raio do empreendimento → cai direto na conversa (opt-in natural).</li>
      <li><b>Google/Busca local</b> "apartamento Papillon Park / Parque Atheneu / Noroeste Goiânia MCMV" + página com simulador simples.</li>
      <li><b>Parcerias de bairro:</b> comércios, escolas, igrejas e empresas das regiões dos 9 — QR Code "simule seu apê" (opt-in registrado na lista).</li>
      <li><b>Indicação pós-visita:</b> todo visitante indica 2 contatos (script de indicação na visita, Etapa 6).</li>
      <li><b>Conteúdo curto (Reels/Status):</b> 1 empreendimento por vez, gancho = parcela estimada* + bairro ("sair do aluguel no Papillon Park"). *Sempre com "condições simuladas, sujeitas à análise Caixa".</li>
    </ul></div>
  <div class="card"><h2>🛡️ Compliance que protege o número (resumo)</h2>
    <ul>
      <li>Só contatar quem <b>demonstrou interesse/opt-in</b>; registrar a origem na lista.</li>
      <li>Mensagem de negócio iniciada por você, em escala, só pela <b>API Oficial com template aprovado</b>. No app comum: envio humano 1 a 1 (este CRM).</li>
      <li>Personalizar (nome + empreendimento + bairro), variar o texto, respeitar 8h–20h e o opt-out na hora.</li>
      <li>LGPD: guardar só o necessário, backup local, não compartilhar listas. Documentos do lead apenas p/ análise de crédito, com consentimento.</li>
    </ul>
    <p class="muted">Detalhes operacionais em <code>docs/ANTI-BAN-WHATSAPP.md</code> e pesquisa completa em <code>docs/PESQUISA-SALES-MARKETING-REAL-ESTATE.md</code>.</p></div>`;
}

/* ================= Config / Backup ================= */
function renderConfig() {
  $("#cfg-consultor").value = state.config.consultor || "Januário Leal";
  $("#consultor-nome-side").textContent = state.config.consultor || "Januário Leal";
  $("#cfg-bsp").value = state.config.bsp || ""; $("#cfg-numero").value = state.config.numero || ""; $("#cfg-template").value = state.config.templateApi || "";
}
const CORRETOR_KEY = "acelera.corretorNome";
/* Aplica o nome do corretor globalmente ({corretor} nos scripts, sidebar, espelho). */
function aplicarNomeConsultor(nome) {
  state.config.consultor = (nome || "").trim() || "Januário Leal";
  try { localStorage.setItem(CORRETOR_KEY, state.config.consultor); } catch (e) { /* ignora */ }
  salvar(); renderConfig(); renderEmpreendimentos(); renderManual(); renderPesquisa();
  const esp = $("#view-espelho");
  if (esp && esp.classList.contains("active")) renderEspelho();
  document.dispatchEvent(new CustomEvent("acelera:corretor-alterado"));
}
function salvarConfig() {
  state.config.bsp = $("#cfg-bsp").value.trim(); state.config.numero = $("#cfg-numero").value.trim(); state.config.templateApi = $("#cfg-template").value.trim();
  aplicarNomeConsultor($("#cfg-consultor").value);
  toast("Configurações salvas ✅ Scripts já usam o novo nome.");
}
$("#btn-cfg-salvar")?.addEventListener("click", salvarConfig);
$("#btn-cfg-salvar2")?.addEventListener("click", salvarConfig);
$("#btn-backup-json")?.addEventListener("click", () => { baixar(`blogmaster-backup-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(state, null, 2), "application/json"); toast("Backup baixado 💾"); });
$("#restore-file")?.addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const s = JSON.parse(await f.text());
    if (!Array.isArray(s.leads)) throw new Error("Arquivo inválido");
    state = s; salvar(); location.reload();
  } catch (err) { alert("Não foi possível restaurar: " + err.message); }
});
$("#btn-reset")?.addEventListener("click", () => {
  if (!confirm("Apagar TODOS os dados e voltar aos leads-semente (José Fernando + Maryana)?")) return;
  localStorage.removeItem(LS); localStorage.removeItem(CORRETOR_KEY); location.reload();
});

/* API pública p/ onboarding.js (box de importação) e integrações futuras. */
window.adicionarLeads = function (parsed) {
  const data = new Date().toLocaleDateString("pt-BR");
  const listaId = criarLista(`Importação rápida — ${data}`, "Box de importação (onboarding)");
  const { add, dup } = adicionarLeadsAoCRM(parsed, listaId);
  toast(`✅ ${add} lead(s) importado(s)${dup ? ` · ${dup} duplicado(s) ignorado(s)` : ""} na lista "Importação rápida".`);
  irFilaLista(listaId);
  return { add, dup, listaId };
};
window.importarLeads = window.adicionarLeads;
window.BlogMaster = {
  aplicarNomeConsultor,
  getConsultor: () => state.config.consultor || "",
  adicionarLeads: window.adicionarLeads,
  irPara,
};

/* ================= Boot ================= */
function boot() {
  // Nome vindo do onboarding (acelera.corretorNome) tem prioridade sobre o seed.
  try {
    const salvo = (localStorage.getItem(CORRETOR_KEY) || "").trim();
    if (salvo && salvo !== state.config.consultor) { state.config.consultor = salvo; salvar(); }
  } catch (e) { /* ignora */ }
  renderConfig(); renderListaSelects(); renderDashboard(); renderListas(); renderLeads();
  renderEmpreendimentos(); renderManual(); renderPesquisa();
  leadSelecionadoId = state.leads[0]?.id || null;
}
document.addEventListener("DOMContentLoaded", boot);
