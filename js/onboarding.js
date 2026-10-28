/* =========================================================
   onboarding.js — popup do corretor (1º acesso) + box de
   importação encadeado. Integra com o app existente SEM
   reescrever nada:
   · Nome persiste em localStorage (acelera.corretorNome) e é
     aplicado ao CRM via window.BlogMaster.aplicarNomeConsultor
     → todos os scripts usam a convenção {corretor}.
   · O box usa window.parseLista (js/parser.js — parser
     completo) e window.adicionarLeads (js/app.js — núcleo
     único de importação com dedup por telefone).
   Os fallbacks abaixo só entram se esses módulos faltarem.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Nome do corretor ---------- */
  const Corretor = {
    KEY: "acelera.corretorNome",

    get() {
      try { return (localStorage.getItem(this.KEY) || "").trim(); } catch (e) { return ""; }
    },

    set(nome) {
      const v = String(nome || "").trim();
      try { localStorage.setItem(this.KEY, v); } catch (e) { /* ignora */ }
      // Aplica no CRM (state.config.consultor + re-renders) quando disponível.
      if (window.BlogMaster && typeof BlogMaster.aplicarNomeConsultor === "function") {
        BlogMaster.aplicarNomeConsultor(v);
      }
      this.aplicarEmTudo();
    },

    /* Substitui {corretor}/{consultor}, {{corretor}} e o nome-semente. */
    personalize(texto) {
      const nome = this.get() || (window.BlogMaster ? BlogMaster.getConsultor() : "") || "o corretor";
      return String(texto)
        .replace(/\{\{\s*(corretor|consultor)\s*\}\}/gi, nome)
        .replace(/\{\s*(corretor|consultor)\s*\}/gi, nome)
        .replace(/Januário Leal/gi, nome)
        .replace(/Januario Leal/g, nome);
    },

    aplicarEmTudo() {
      const nome = this.get();
      if (!nome || !document.body) return;
      document.querySelectorAll("[data-corretor]").forEach(el => { el.textContent = nome; });
      document.querySelectorAll("[data-script]").forEach(el => { el.textContent = this.personalize(el.dataset.script); });
      const filtro = {
        acceptNode(node) {
          const tag = node.parentNode && node.parentNode.nodeName;
          if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(tag)) return NodeFilter.FILTER_REJECT;
          return /\{\{\s*(corretor|consultor)\s*\}\}|\{\s*(corretor|consultor)\s*\}/i.test(node.nodeValue)
            ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, filtro);
      const alvos = [];
      while (walker.nextNode()) alvos.push(walker.currentNode);
      alvos.forEach(n => { n.nodeValue = this.personalize(n.nodeValue); });
    }
  };
  window.Corretor = Corretor;

  /* ---------- 2. Modais ---------- */
  const $ = id => document.getElementById(id);
  function abrirCorretor() {
    const m = $("modal-corretor"); if (!m) return;
    const atual = Corretor.get() || (window.BlogMaster ? BlogMaster.getConsultor() : "");
    const input = $("input-corretor-nome");
    if (input && !input.value) input.value = atual || "";
    const cancelar = $("btn-cancelar-corretor");
    if (cancelar) cancelar.hidden = !Corretor.get(); // no 1º acesso, salvar é obrigatório
    m.hidden = false;
    if (input) setTimeout(() => input.focus(), 50);
  }
  function fecharCorretor() { const m = $("modal-corretor"); if (m) m.hidden = true; }
  function abrirLista() { const m = $("modal-lista"); if (m) m.hidden = false; }
  function fecharLista() {
    const m = $("modal-lista"); if (m) m.hidden = true;
    const prev = $("preview-lista"); if (prev) prev.hidden = true;
  }
  window.abrirModalCorretor = abrirCorretor;
  window.abrirBoxLista = abrirLista;

  /* ---------- 3. Parser (parser.js tem prioridade) ---------- */
  function parseListaFallback(texto) {
    const EMPREENDIMENTOS = ["Gran Essence", "Gran Safira", "Gran Parma", "Gran Verona", "Gran Terrazzo", "Golden Ville", "Priville", "Gran Aurora", "Gran Porto", "Vert"];
    const linhas = String(texto).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const leads = [];
    for (const linha of linhas) {
      const telMatch = linha.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]?)?9?\d{4}[\s.-]?\d{4}/);
      if (!telMatch) continue;
      const telefone = telMatch[0].replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
      if (telefone.length < 10) continue;
      const [antes, depois = ""] = linha.split(telMatch[0]);
      const nome = antes.replace(/[-–—:;|]/g, " ").replace(/\d+/g, " ").replace(/\s+/g, " ").trim();
      if (!nome) continue;
      const renda = (depois.match(/renda[^\d]*R?\$?\s*([\d.]+(?:,\d{2})?)/i) || [])[1] || "";
      const entrada = (depois.match(/entrada[^\d]*R?\$?\s*([\d.]+(?:,\d{2})?)/i) || [])[1] || "";
      leads.push({
        nome, telefone, renda, entrada,
        fgts: /\bfgts\b/i.test(linha) ? "informado" : "",
        empreendimento: EMPREENDIMENTOS.find(e => linha.toLowerCase().includes(e.toLowerCase())) || "",
        bairro: "",
        cidade: (linha.match(/\b(Aparecida de Goiânia|Goiânia)\b/i) || [])[0] || "",
        obs: linha,
      });
    }
    return leads;
  }
  function parseLista(texto) {
    if (typeof window.parseLista === "function") {
      try { return window.parseLista(texto); } catch (_) { /* cai no fallback */ }
    }
    return parseListaFallback(texto);
  }

  /* ---------- 4. Preview ---------- */
  let previewLeads = [];
  function escHtml(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function fmtValor(v) {
    if (v === "" || v == null) return "—";
    const n = typeof v === "number" ? v : Number(String(v).replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : escHtml(v);
  }
  function renderPreview(leads) {
    previewLeads = leads;
    const tbody = $("preview-lista-body"), resumo = $("preview-resumo");
    tbody.innerHTML = leads.map(l => `<tr>
      <td>${escHtml(l.nome || "⚠️ sem nome")}</td><td>${escHtml(l.telefone || "⚠️ sem tel")}</td>
      <td>${fmtValor(l.renda)}</td><td>${fmtValor(l.entrada)}</td><td>${escHtml(l.fgts || "—")}</td>
      <td>${escHtml(l.empreendimento || "Menu 1–9")}</td><td>${escHtml([l.bairro, l.cidade].filter(Boolean).join(" · ") || "—")}</td></tr>`).join("");
    resumo.textContent = `${leads.length} lead(s) identificado(s) — nome, telefone e demais informações separados. A deduplicação por telefone roda ao confirmar.`;
    $("preview-lista").hidden = false;
  }

  /* ---------- 5. Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!$("modal-corretor")) return;

    // 1º acesso: sem nome salvo → popup. Com nome → só personaliza.
    if (!Corretor.get()) abrirCorretor(); else Corretor.aplicarEmTudo();

    const salvarCorretor = () => {
      const v = $("input-corretor-nome").value.trim();
      if (v.length < 2) { alert("Digite o nome do corretor."); return; }
      const primeiroAcesso = !Corretor.get();
      Corretor.set(v);
      fecharCorretor();
      if (primeiroAcesso) abrirLista(); // encadeamento automático nome → box de lista
    };
    $("btn-salvar-corretor").addEventListener("click", salvarCorretor);
    $("input-corretor-nome").addEventListener("keydown", e => { if (e.key === "Enter") salvarCorretor(); });
    const cancelarCorretor = $("btn-cancelar-corretor");
    if (cancelarCorretor) cancelarCorretor.addEventListener("click", fecharCorretor);

    $("btn-analisar-lista").addEventListener("click", async () => {
      const arquivo = $("input-lista-file").files[0];
      let texto = $("input-lista-texto").value;
      if (arquivo) {
        try { texto = await arquivo.text(); $("input-lista-texto").value = texto; }
        catch (e) { alert("Não consegui ler o arquivo. Cole o texto da lista."); return; }
      }
      if (!texto || !texto.trim()) { alert("Cole o texto da lista ou envie um arquivo .txt/.csv/.md."); return; }
      const leads = parseLista(texto);
      if (!leads.length) { alert('Nenhum lead reconhecido. Use "Nome - Telefone - Renda - ..." por linha, fichas por bloco ou CSV.'); return; }
      renderPreview(leads);
    });

    const cancelar = () => { previewLeads = []; fecharLista(); };
    $("btn-cancelar-lista").addEventListener("click", cancelar);
    const pular = $("btn-pular-lista");
    if (pular) pular.addEventListener("click", cancelar);

    $("btn-confirmar-lista").addEventListener("click", () => {
      const leads = previewLeads.slice();
      previewLeads = [];
      fecharLista();
      if (typeof window.adicionarLeads === "function") {
        window.adicionarLeads(leads); // app.js: cria lista, dedupa, toast e abre a Fila Segura
      } else if (typeof window.importarLeads === "function") {
        window.importarLeads(leads);
      } else {
        const KEY = "acelera.leads";
        const atuais = JSON.parse(localStorage.getItem(KEY) || "[]");
        const byTel = new Map(atuais.map(l => [l.telefone, l]));
        leads.forEach(l => { if (l.telefone && !byTel.has(l.telefone)) byTel.set(l.telefone, l); });
        localStorage.setItem(KEY, JSON.stringify([...byTel.values()]));
        alert(`${leads.length} lead(s) importado(s).`);
      }
    });
  });

  document.addEventListener("acelera:corretor-alterado", () => Corretor.aplicarEmTudo());
})();
