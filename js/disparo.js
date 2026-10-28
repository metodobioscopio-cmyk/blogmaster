/* =========================================================
   disparo.js — Conexão WhatsApp do corretor + Disparo
   Sequencial da Fila Segura.

   Modo Web (recomendado): o corretor conecta o WhatsApp Web
   (QR). Para cada lead: botão 1 abre a conversa já com a
   mensagem personalizada (nome dele + nome do corretor),
   o corretor envia, volta e clica "Enviei — próximo".
   Intervalo anti-ban entre um e outro.

   Modo API: envia sozinho em sequência usando a API Oficial
   da Meta (template aprovado), via POST /api/whatsapp/send
   do server.js. Pausar/parar a qualquer momento.

   Depende dos globais de app.js (state, filaAtual, disparo,
   lead, registrar, salvar, telWA, fmtTel, esc, toast, agora,
   renderDashboard, renderConfig, pintarFila).
   ========================================================= */

function registrarEnvioFila(f, via) {
  const l = lead(f.leadId); if (!l) return;
  registrar(l, "envio", f.mensagem);
  registrar(l, "sistema", via === "api"
    ? "1º contato enviado pela API Oficial do WhatsApp (template aprovado)."
    : "1º contato enviado pelo Disparo Sequencial (WhatsApp do corretor conectado).");
  f.status = "enviado";
  state.filaHistorico.push({ quando: agora(), leadId: f.leadId, templateId: f.templateId, via: via || "web" });
  salvar(); renderDashboard();
}

function itemDisparo() {
  return filaAtual.find(f => f.id === disparo.atualId) || filaAtual.find(f => f.status === "pendente") || null;
}

function pintarDisparo() {
  const el = $("#disparo-panel"); if (!el) return;
  const pend = filaAtual.filter(f => f.status === "pendente");
  const feitosN = filaAtual.filter(f => f.status === "enviado").length;
  const modo = state.config.waModo || "web";
  const conectado = modo === "api"
    ? !!(state.config.waPhoneId && (state.config.waTemplate || state.config.templateApi))
    : !!state.config.waWebConectado;
  const atual = disparo.ativo ? itemDisparo() : pend[0];
  el.className = "disparo-box";
  el.innerHTML = `
    <div class="row between wrap"><h3>🚀 Disparo Sequencial da lista</h3>
      <span class="pill ${conectado ? "novo" : "quente"}">${modo === "api" ? "☁️ API Oficial" : "🟢 WhatsApp Web"} · ${conectado ? "conectado" : "não conectado"}</span></div>
    ${!filaAtual.length ? `<p class="muted">Monte a fila acima — ou clique em 🚀 <b>Disparo sequencial</b> no card de uma lista — para habilitar o botão.</p>` : `
    <p class="muted">${feitosN}/${filaAtual.length} enviados · <b>${pend.length}</b> na sequência ${!conectado ? `· <button class="btn sm" onclick="irPara('conexao')">🔗 Conectar WhatsApp</button>` : ""}</p>
    ${disparo.erro ? `<div class="warn-box">⚠️ ${esc(disparo.erro)}</div>` : ""}
    ${atual && disparo.ativo ? `<div class="ok-box">🎯 <b>Próximo da sequência:</b> ${esc(atual.nome || "Sem nome")} · ${fmtTel(atual.telefone)}
      <details><summary>Ver mensagem (nome dele + seu nome)</summary><pre style="white-space:pre-wrap">${esc(atual.mensagem)}</pre></details></div>` : ""}
    ${disparo.resta > 0 ? `<div class="warn-box">⏳ Intervalo anti-ban: próximo envio em <b id="disparo-count">${disparo.resta}s</b> · <button class="btn sm" onclick="pularEspera()">⏭ Pular espera</button></div>` : ""}
    <div class="row gap wrap">
      ${!disparo.ativo
        ? `<button class="btn big-disparo" ${!pend.length ? "disabled" : ""} onclick="iniciarDisparo()">▶ INICIAR DISPARO SEQUENCIAL (${pend.length} leads)</button>`
        : `
        ${(modo === "web" && !disparo.aguardando && disparo.resta <= 0) ? `<button class="btn whatsapp big-disparo" ${disparo.pausado ? "disabled" : ""} onclick="disparoEnviarAtual()">💬 1 · Abrir WhatsApp e enviar p/ ${esc((atual?.nome || "lead").split(" ")[0])}</button>` : ""}
        ${(modo === "web" && disparo.aguardando) ? `<button class="btn primary big-disparo" onclick="disparoConfirmar()">✅ 2 · Enviei — próximo lead</button> <button class="btn" onclick="disparoEnviarAtual()">Reabrir WhatsApp</button>` : ""}
        ${(modo === "api" && disparo.resta <= 0) ? `<button class="btn whatsapp big-disparo" ${disparo.pausado || disparo.enviando ? "disabled" : ""} onclick="disparoEnviarAtual()">${disparo.enviando ? "Enviando…" : "📨 Enviar via API e continuar a sequência"}</button>` : ""}
        <button class="btn" onclick="pausarDisparo()">${disparo.pausado ? "▶ Continuar" : "⏸ Pausar"}</button>
        <button class="btn danger" onclick="pararDisparo()">⏹ Parar</button>`}
    </div>
    <small class="muted">${modo === "web"
      ? "Fluxo fácil: <b>1</b> abre seu WhatsApp conectado já com o texto → você envia lá → <b>2</b> confirma e o próximo da lista já fica pronto. É o disparo coletivo sem robô — por isso não toma ban."
      : "Fluxo API: envia o template oficial aprovado, respeita o intervalo e segue sozinho pela lista. Pause/pare quando quiser."}</small>`}`;
}

function iniciarDisparo() {
  const prox = filaAtual.find(f => f.status === "pendente");
  if (!prox) { toast("Monte a fila primeiro — nenhum lead pendente na sequência."); pintarDisparo(); return; }
  disparo.ativo = true; disparo.pausado = false; disparo.aguardando = false; disparo.erro = "";
  disparo.atualId = prox.id;
  pintarFila();
  toast("🚀 Disparo sequencial armado! Siga os botões 1 → 2 para cada lead.");
}

function pararDisparo(silencioso) {
  if (disparo.timer) clearInterval(disparo.timer);
  disparo = { ativo: false, pausado: false, atualId: null, aguardando: false, timer: null, resta: 0, enviando: false, erro: "" };
  if (!silencioso) pintarFila();
}

function pausarDisparo() { disparo.pausado = !disparo.pausado; pintarDisparo(); }

function disparoEnviarAtual() {
  const f = itemDisparo(); if (!f) { pararDisparo(); return; }
  disparo.atualId = f.id; disparo.erro = "";
  if ((state.config.waModo || "web") === "api") return enviarViaAPI(f);
  window.open(`https://wa.me/${telWA(f.telefone)}?text=${encodeURIComponent(f.mensagem)}`, "blogmaster_wa");
  disparo.aguardando = true;
  pintarFila();
}

function disparoConfirmar() {
  const f = itemDisparo(); if (!f) return;
  registrarEnvioFila(f, "web");
  disparo.aguardando = false;
  toast(`✅ ${f.nome} enviado! Preparando o próximo…`);
  avancarDisparo();
}

function avancarDisparo() {
  const prox = filaAtual.find(x => x.status === "pendente");
  if (!prox) {
    pararDisparo(true);
    pintarFila();
    toast("🎉 Disparo sequencial concluído! Acompanhe as respostas no Espelho WhatsApp.");
    return;
  }
  disparo.atualId = prox.id;
  iniciarEspera(() => {
    if ((state.config.waModo || "web") === "api" && disparo.ativo && !disparo.pausado) disparoEnviarAtual();
    else pintarDisparo();
  });
  pintarFila();
}

function iniciarEspera(depois) {
  if (disparo.timer) clearInterval(disparo.timer);
  disparo.resta = Math.max(0, Math.round((Number($("#fila-intervalo")?.value) || 3) * 60));
  if (!disparo.resta) { depois(); return; }
  disparo.timer = setInterval(() => {
    disparo.resta--;
    const s = $("#disparo-count"); if (s) s.textContent = disparo.resta + "s";
    if (disparo.resta <= 0) { clearInterval(disparo.timer); disparo.timer = null; depois(); }
  }, 1000);
}

function pularEspera() {
  if (disparo.timer) clearInterval(disparo.timer);
  disparo.timer = null; disparo.resta = 0;
  if ((state.config.waModo || "web") === "api" && disparo.ativo && !disparo.pausado) disparoEnviarAtual();
  else pintarDisparo();
}

async function enviarViaAPI(f) {
  const tpl = state.config.waTemplate || state.config.templateApi || "";
  if (!state.config.waPhoneId || !tpl) {
    disparo.erro = "API não configurada: informe Phone Number ID + template aprovado em 🔗 Conectar WhatsApp.";
    disparo.pausado = true; pintarDisparo(); return;
  }
  disparo.enviando = true; pintarDisparo();
  try {
    const r = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-wa-token": state.config.waToken || "" },
      body: JSON.stringify({
        to: telWA(f.telefone), phoneNumberId: state.config.waPhoneId,
        templateName: tpl, language: state.config.waLang || "pt_BR",
        bodyParams: [(f.nome || "").split(" ")[0] || "tudo bem", state.config.consultor],
      }),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok || out.ok === false) throw new Error(out.erro || `HTTP ${r.status}`);
    disparo.enviando = false;
    registrarEnvioFila(f, "api");
    pintarFila(); avancarDisparo();
  } catch (e) {
    disparo.enviando = false; disparo.pausado = true;
    disparo.erro = "Falha no envio via API: " + e.message + " — confira token/template (na prévia de testes, a internet externa p/ a Meta é bloqueada).";
    pintarDisparo();
  }
}

/* ================= Conexão (tela 🔗 Conectar WhatsApp) ================= */
function renderConexao() {
  const c = state.config;
  const set = (id, v) => { const e = $(id); if (e) e.value = v || ""; };
  set("#wa-web-numero", c.numero); set("#wa-phone-id", c.waPhoneId); set("#wa-waba", c.waWaba);
  set("#wa-template-api", c.waTemplate || c.templateApi); set("#wa-lang", c.waLang || "pt_BR"); set("#wa-token", c.waToken);
  const modo = $("#wa-modo"); if (modo) modo.value = c.waModo || "web";
  const url = $("#wa-webhook-url"); if (url) url.textContent = location.origin + "/api/whatsapp/webhook";
  const st = $("#wa-web-status");
  if (st) st.innerHTML = c.waWebConectado
    ? `<div class="ok-box">🟢 WhatsApp Web <b>conectado</b> no número ${esc(fmtTel(c.numero))}. O Disparo Sequencial abre as conversas nessa sessão.</div>`
    : `<div class="warn-box">⚪ Ainda não conectado. Abra o WhatsApp Web, escaneie o QR e marque como conectado.</div>`;
  const b = $("#badge-wa"); if (b) b.textContent = (c.waModo === "api") ? "API" : (c.waWebConectado ? "Web ✓" : "off");
  fetch("/api/whatsapp/webhook-info").then(r => r.json()).then(j => {
    const v = $("#wa-verify-token"); if (v && j.verifyToken) v.textContent = j.verifyToken;
  }).catch(() => {});
}

function salvarConexao() {
  const c = state.config;
  const numEl = $("#wa-web-numero");
  if (numEl) c.numero = numEl.value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  c.waPhoneId = $("#wa-phone-id")?.value.trim() || "";
  c.waWaba = $("#wa-waba")?.value.trim() || "";
  c.waTemplate = $("#wa-template-api")?.value.trim() || ""; c.templateApi = c.waTemplate;
  c.waLang = $("#wa-lang")?.value.trim() || "pt_BR";
  c.waToken = $("#wa-token")?.value.trim() || "";
  c.waModo = $("#wa-modo")?.value || "web";
  salvar(); renderConexao(); renderConfig(); pintarDisparo();
  toast("🔗 Conexão salva! Disparo usando: " + (c.waModo === "api" ? "API Oficial" : "WhatsApp Web"));
}

function abrirWhatsWeb() {
  window.open("https://web.whatsapp.com", "_blank");
  toast("📷 No celular: WhatsApp → Aparelhos conectados → escanear o QR. Depois volte e marque conectado.");
}

function marcarWebConectado() {
  const num = ($("#wa-web-numero")?.value || "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (num.length < 10) { toast("Informe seu número com DDD para marcar como conectado."); return; }
  state.config.numero = num; state.config.waWebConectado = true; state.config.waModo = "web";
  salvar(); renderConexao(); renderConfig();
  toast("🟢 WhatsApp conectado! Vá em Fila Segura → ▶ Iniciar Disparo Sequencial.");
}

function testarWeb() {
  const num = telWA(state.config.numero || $("#wa-web-numero")?.value || "");
  if (!num) { toast("Informe seu número primeiro."); return; }
  window.open(`https://wa.me/${num}?text=${encodeURIComponent("✅ Teste BlogMaster CRM — WhatsApp do corretor conectado! — " + state.config.consultor + ", MRV (a maior construtora da América Latina)")}`, "_blank");
}

async function testarApi() {
  salvarConexao();
  const st = $("#wa-api-status");
  if (st) st.innerHTML = `<p class="muted">⏳ Testando a conexão com a Meta…</p>`;
  try {
    const r = await fetch("/api/whatsapp/status?phoneNumberId=" + encodeURIComponent(state.config.waPhoneId || ""), {
      headers: { "x-wa-token": state.config.waToken || "" },
    });
    const j = await r.json();
    if (j.conectado) {
      if (st) st.innerHTML = `<div class="ok-box">☁️ <b>Conectado!</b> ${esc(j.nomeVerificado || "")} · ${esc(j.numero || "")} · qualidade: ${esc(j.qualidade || "—")}. Modo API liberado p/ o Disparo Sequencial.</div>`;
    } else if (st) {
      st.innerHTML = `<div class="warn-box">⚠️ ${esc(j.erro || j.dica || "Sem conexão — confira Phone Number ID e token.")}<br><small>Na prévia de testes do Arena a internet externa p/ a Meta é bloqueada; no seu servidor funciona.</small></div>`;
    }
  } catch (e) {
    if (st) st.innerHTML = `<div class="warn-box">⚠️ Servidor de API indisponível: ${esc(e.message)}</div>`;
  }
}
