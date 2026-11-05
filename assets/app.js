/* =========================================================================
   BlogMaster — Copiloto de Afiliados. Motor da app (vanilla JS).
   ========================================================================= */
(function () {
  "use strict";
  var D = window.BM_DATA;

  /* ------------------------------ utils ------------------------------ */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function money(n) { return "US$ " + (Math.round(n * 100) / 100).toFixed(2); }
  function pct(n, d) { return (Math.round(n * (d || 10)) / (d || 10)) + "%"; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  var LS = {
    get: function (k, fb) { try { var v = localStorage.getItem("bm_" + k); return v == null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set: function (k, v) { try { localStorage.setItem("bm_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function toast(msg) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#38e0a3;color:#04231c;padding:10px 18px;border-radius:99px;font-weight:700;font-size:13px;z-index:99;box-shadow:0 8px 30px #0008";
    document.body.appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .3s"; t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 320); }, 1600);
  }
  function copyText(txt, ok) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast(ok || "Copiado!"); }, function () { toast("Não deu para copiar — selecione manualmente."); });
    } else { toast("Copie manualmente (clipboard bloqueado)."); }
  }
  function download(name, txt, type) {
    var b = new Blob([txt], { type: type || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }

  /* ------------------------------ nav ------------------------------ */
  var PAGES = [
    { grupo: "CirurgiaAfiliada", itens: [
      ["home", "Home", "◆"],
      ["diagnostico", "Diagnóstico", "✧"],
      ["fluxo", "Executar plano", "⟶"],
      ["historico", "Histórico", "≣"],
      ["redes", "Redes 2026", "▥"],
      ["stack", "Stack & MCPs", "⌗"],
      ["metodo", "Método BOFU", "◐"],
      ["reddit", "Reddit & Clonagem", "✳"],
      ["dashboard", "Dashboard", "▣"],
      ["spec", "Spec verificada", "✓"]
    ]},
    { grupo: "Copiloto", itens: [
      ["inicio", "Cockpit", "◎"],
      ["radar", "Radar de produto", "◉"],
      ["campanhas", "Campanhas validadas", "▤"],
      ["copiloto", "Copiloto de decisão", "◈"],
      ["gerador", "Gerador de presell", "✎"],
      ["keyword", "Keyword & intenção", "⌕"],
      ["viab", "Viabilidade & links", "∑"],
      ["check", "Compliance", "☑"],
      ["plano", "Plano de 7 dias", "▷"],
      ["integracoes", "Integrações / MCP", "⚡"],
      ["github", "Arsenal GitHub", "◧"],
      ["hf", "Arsenal Hugging Face", "◨"],
      ["manual", "Manual prático", "❏"],
      ["caderno", "Caderno", "✐"]
    ]}
  ];

  function buildNav() {
    var nav = $("#nav");
    nav.innerHTML = PAGES.map(function (g) {
      return "<div class=\"nav-group\">" + esc(g.grupo) + "</div>" + g.itens.map(function (p) {
        return "<a class=\"nav-item\" data-page=\"" + p[0] + "\"><span class=\"ico\">" + p[2] + "</span>" + p[1] + "</a>";
      }).join("");
    }).join("");
    $$(".nav-item", nav).forEach(function (a) {
      a.addEventListener("click", function () { go(a.dataset.page); });
    });
  }
  function go(id) {
    $$(".page").forEach(function (p) { p.classList.remove("on"); });
    var el = $("#p-" + id);
    if (el) el.classList.add("on");
    $$(".nav-item").forEach(function (a) { a.classList.toggle("on", a.dataset.page === id); });
    if (id === "fluxo" && typeof renderFluxo === "function") renderFluxo();
    if (id === "historico" && typeof renderHistorico === "function") renderHistorico();
    if (id === "copiloto" && typeof renderCopilotPlan === "function") renderCopilotPlan();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------ score ------------------------------ */
  var nichoNome = {};
  D.nichos.forEach(function (n) { nichoNome[n.id] = n.nome; });

  function scoreOf(p) {
    var valor = clamp(p.epc, 0, 2) / 2 * 100;
    var prova = clamp(p.gravity, 0, 250) / 250 * 100;
    var ticket = clamp(p.apv, 0, 180) / 180 * 100;
    var riscoPts = (10 - p.risco) * 10;
    var presellPts = p.presell * 10;
    return Math.round(0.34 * valor + 0.16 * prova + 0.14 * ticket + 0.20 * riscoPts + 0.16 * presellPts);
  }
  function scoreClass(s) { return s >= 72 ? "g" : s >= 58 ? "b" : s >= 45 ? "y" : "r"; }
  function riscoLabel(r) { return r >= 8 ? "Alto" : r >= 6 ? "Médio-alto" : r >= 4 ? "Médio" : "Baixo"; }

  /* ------------------------------ cockpit ------------------------------ */
  function renderCockpit() {
    var melhor = D.produtos.slice().sort(function (a, b) { return scoreOf(b) - scoreOf(a); })[0];
    $("#cockpitStats").innerHTML = [
      stat("Ofertas no radar", D.produtos.length, "com score calculado"),
      stat("Blueprints validados", D.blueprints.length, "estruturas + KPIs"),
      stat("Repositórios úteis", D.arsenalGithub.length, "GitHub curado"),
      stat("Modelos HF", D.arsenalHF.length, "copy, intenção, vídeo")
    ].join("");

    $("#cockpitCards").innerHTML = [
      cardLink("radar", "1 · Escolher a oferta", "Filtre por EPC, APV e risco. Hoje o topo do score é <b>" + esc(melhor.nome) + "</b> (" + scoreOf(melhor) + "/100).", "Abrir radar"),
      cardLink("gerador", "2 · Montar a presell", "Gere a página completa no formato certo para o seu canal — com disclosure, prós e contras e CTA.", "Gerar presell"),
      cardLink("campanhas", "3 · Subir a campanha", "Escolha o blueprint do canal, siga a estrutura e os KPIs de referência.", "Ver blueprints"),
      cardLink("copiloto", "4 · Decidir com números", "Cole gasto, cliques e vendas. Receba escalar / ajustar / cortar com critério.", "Diagnosticar"),
      cardLink("keyword", "5 · Montar Custom Intent", "Gere a matriz de intenção e saia com o segmento pronto para colar.", "Gerar keywords"),
      cardLink("check", "0 · Antes de tudo: compliance", "15 pontos que evitam reprovação e bloqueio de conta.", "Abrir checklist"),
      cardLink("integracoes", "⚡ · Plugar Ads, mercado BR e sinais", "Adspirer (execução), Rally (Mercado Livre/Shopee) e ProdIntel (Reddit/Trends) via bridge local seguro.", "Ver integrações")
    ].join("");

    var fluxo = ["Nicho", "Oferta (EPC/APV)", "Presell própria", "Criativo + termos", "Campanha teste", "300 cliques", "Decisão", "Escala 20–30%"];
    $("#flowMap").innerHTML = "<div class=\"row\" style=\"gap:6px\">" + fluxo.map(function (f, i) {
      return "<div class=\"pill " + (i === 6 ? "g" : i === 7 ? "b" : "") + "\" style=\"padding:8px 12px\">" + esc(f) + "</div>" + (i < fluxo.length - 1 ? "<span class=\"dim\">→</span>" : "");
    }).join("") + "</div>";
  }
  function stat(label, val, sub) {
    return "<div class=\"card\"><div class=\"small-label\">" + esc(label) + "</div><div class=\"big\" style=\"margin:6px 0 2px\">" + val + "</div><div class=\"sub\">" + esc(sub) + "</div></div>";
  }
  function cardLink(page, t, d, cta) {
    return "<div class=\"card\" style=\"display:flex;flex-direction:column;gap:8px\"><h3>" + t + "</h3><p class=\"sub\" style=\"flex:1\">" + d + "</p><div><button class=\"btn sm\" data-go=\"" + page + "\">" + esc(cta) + " →</button></div></div>";
  }
  function bindGo(root) {
    $$("[data-go]", root || document).forEach(function (b) {
      b.onclick = function () { go(b.dataset.go); };
    });
  }

  /* ------------------------------ radar ------------------------------ */
  var radarSel = null;
  function renderRadar() {
    var nsel = $("#radarNicho"), rsel = $("#radarRede");
    nsel.innerHTML = "<option value=\"\">Todos os nichos</option>" + D.nichos.map(function (n) { return "<option value=\"" + n.id + "\">" + esc(n.nome) + "</option>"; }).join("");
    var redes = {};
    D.produtos.forEach(function (p) { redes[p.rede] = 1; });
    rsel.innerHTML = "<option value=\"\">Todas as redes</option>" + Object.keys(redes).map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("");
    ["#radarSearch", "#radarNicho", "#radarRede", "#radarOrd"].forEach(function (s) { $(s).oninput = drawRadar; $(s).onchange = drawRadar; });
    drawRadar();
  }
  function filtered() {
    var q = ($("#radarSearch").value || "").toLowerCase().trim();
    var ni = $("#radarNicho").value, re = $("#radarRede").value, ord = $("#radarOrd").value;
    var arr = D.produtos.filter(function (p) {
      if (ni && p.nicho !== ni) return false;
      if (re && p.rede !== re) return false;
      if (q && (p.nome + " " + p.rede + " " + nichoNome[p.nicho]).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    arr.sort(function (a, b) {
      if (ord === "epc") return b.epc - a.epc;
      if (ord === "comissao") return b.comissao - a.comissao;
      if (ord === "cvr") return b.cvr - a.cvr;
      if (ord === "gravity") return b.gravity - a.gravity;
      if (ord === "risco") return a.risco - b.risco;
      return scoreOf(b) - scoreOf(a);
    });
    return arr;
  }
  function drawRadar() {
    var arr = filtered();
    var html = "<thead><tr><th>Produto</th><th>Nicho</th><th class=\"num\">Score</th><th class=\"num\">EPC</th><th class=\"num\">Comissão</th><th class=\"num\">CVR</th><th class=\"num\">Gravity</th><th>Risco</th><th>Trafego</th></tr></thead><tbody>";
    html += arr.map(function (p) {
      var s = scoreOf(p);
      return "<tr data-name=\"" + esc(p.nome) + "\" class=\"" + (radarSel === p.nome ? "sel" : "") + "\">" +
        "<td><b>" + esc(p.nome) + "</b><div class=\"sub\">" + esc(p.rede) + " · " + esc(p.geo) + "</div></td>" +
        "<td><span class=\"pill\">" + esc(nichoNome[p.nicho].split(" / ")[0]) + "</span></td>" +
        "<td class=\"num\"><div class=\"scorebar\" style=\"justify-content:flex-end\"><div class=\"bar\"><i style=\"width:" + s + "%\"></i></div><b>" + s + "</b></div></td>" +
        "<td class=\"num\">" + money(p.epc) + "</td>" +
        "<td class=\"num\">" + money(p.comissao) + "</td>" +
        "<td class=\"num\">" + p.cvr.toFixed(2) + "%</td>" +
        "<td class=\"num\">" + p.gravity + "</td>" +
        "<td><span class=\"pill " + (p.risco >= 8 ? "r" : p.risco >= 6 ? "y" : "g") + "\">" + riscoLabel(p.risco) + "</span></td>" +
        "<td class=\"sub\">" + p.trafego.map(function (t) { return "<span class=\"chip\">" + esc(t) + "</span>"; }).join(" ") + "</td>" +
        "</tr>";
    }).join("");
    if (!arr.length) html += "<tr><td colspan=\"9\" class=\"sub\">Nada encontrado com esses filtros.</td></tr>";
    html += "</tbody>";
    $("#radarTable").innerHTML = html;
    $$("#radarTable tbody tr").forEach(function (tr) {
      tr.onclick = function () {
        radarSel = tr.dataset.name; drawRadar(); drawRadarDetail();
        if (FX) { FX.oferta = radarSel; saveFx(); }
      };
    });
  }
  function drawRadarDetail() {
    var box = $("#radarDetail");
    if (!radarSel) {
      box.innerHTML = "<div class=\"callout info\">Clique em um produto da tabela para abrir o plano de ataque: orçamento de teste, ângulos, campanhas recomendadas e risco de compliance.</div>";
      return;
    }
    var p = D.produtos.filter(function (x) { return x.nome === radarSel; })[0];
    if (!p) return;
    var s = scoreOf(p);
    var rpc = (p.epc > 0 ? p.epc : p.comissao * p.cvr / 100);
    var cpcMax = rpc * 0.7;
    var cliquesVenda = Math.round(100 / Math.max(p.cvr, 0.05));
    var teste = Math.round(cpcMax * 300);
    var bps = D.blueprints.filter(function (b) {
      return b.ofertasIdeais.indexOf(p.nicho) >= 0 || b.ofertasIdeais.indexOf("*") >= 0;
    });
    box.innerHTML =
      "<div class=\"card\">" +
        "<div class=\"row between\" style=\"align-items:flex-start\">" +
          "<div><h2 style=\"margin:0 0 4px\">" + esc(p.nome) + "</h2><div class=\"sub\">" + esc(p.rede) + " · " + esc(nichoNome[p.nicho]) + " · " + esc(p.geo) + (p.aprovacao ? " · exige aprovação" : " · sem aprovação") + "</div></div>" +
          "<div style=\"text-align:right\"><div class=\"small-label\">Score</div><div class=\"big " + (s >= 72 ? "g" : s >= 58 ? "" : "y") + "\">" + s + "<span class=\"dim\" style=\"font-size:14px\">/100</span></div></div>" +
        "</div>" +
        "<div class=\"grid g4\" style=\"margin-top:16px\">" +
          mini("EPC", money(p.epc), "ganho por clique enviado") +
          mini("APV", money(p.apv), "ticket médio") +
          mini("CVR hop", p.cvr.toFixed(2) + "%", "clique → venda") +
          mini("Gravity", p.gravity, "prova de mercado") +
        "</div>" +
        "<h3 style=\"margin-top:20px\">Conta da viabilidade (estimativa)</h3>" +
        "<div class=\"grid g3\">" +
          mini("RPC estimado", money(rpc), "receita por clique na sua página") +
          mini("CPC máximo (70% do RPC)", money(cpcMax), "acima disso, você paga para trabalhar") +
          mini("Orçamento de teste (300 cliques)", money(teste), "mínimo para decidir") +
        "</div>" +
        "<p class=\"sub\" style=\"margin-top:10px\">Aproximadamente <b>" + cliquesVenda + " hops</b> para 1 venda na média do funil. Se o seu CPC real passar de " + money(cpcMax) + ", o problema é canal ou criativo — não a oferta.</p>" +
        "<h3 style=\"margin-top:20px\">Ângulos recomendados</h3>" +
        "<div class=\"row\">" + angulosPara(p).map(function (a) { return "<span class=\"pill p\">" + esc(a) + "</span>"; }).join("") + "</div>" +
        "<h3 style=\"margin-top:20px\">Campanhas que fazem sentido para essa oferta</h3>" +
        "<div class=\"grid g2\" style=\"margin-top:8px\">" + bps.map(function (b) {
          return "<div class=\"card\" style=\"background:#ffffff05\"><b>" + esc(b.nome) + "</b><div class=\"sub\" style=\"margin:6px 0\">" + esc(b.quando) + "</div><button class=\"btn sm\" data-bp=\"" + b.id + "\">Ver blueprint</button></div>";
        }).join("") + "</div>" +
        "<div class=\"callout " + (p.risco >= 8 ? "bad" : p.risco >= 6 ? "" : "good") + "\" style=\"margin-top:18px\">" +
          "<b>Risco de compliance: " + riscoLabel(p.risco) + ".</b> " + esc(riscoTexto(p)) +
        "</div>" +
        "<div class=\"note\">Fonte dos números: " + esc(p.fonte) + ". Reconfirme no painel da rede antes de investir.</div>" +
        "<div class=\"row\" style=\"margin-top:16px\"><button class=\"btn pri fx-start\" data-plan2=\"" + esc(p.nome) + "\">Executar plano com esta oferta (presell + YAML + UTM)</button></div>" +
      "</div>";
    $$("[data-bp]", box).forEach(function (b) { b.onclick = function () { go("campanhas"); selectBlueprint(b.dataset.bp); }; });
    $$("[data-plan2]", box).forEach(function (b) { b.onclick = function () { startPlan(b.dataset.plan2); }; });
  }
  function mini(l, v, s) {
    return "<div style=\"background:#ffffff05;border:1px solid var(--line);border-radius:10px;padding:12px\"><div class=\"small-label\">" + esc(l) + "</div><div style=\"font-size:18px;font-weight:800;margin:4px 0\" class=\"mono\">" + v + "</div><div class=\"sub\" style=\"font-size:11.5px\">" + esc(s) + "</div></div>";
  }
  function angulosPara(p) {
    var base = ["mecanismo", "prova", "curiosidade"];
    if (p.nicho === "nutra") return ["medo", "mecanismo", "prova"];
    if (p.nicho === "espiritual") return ["curiosidade", "mecanismo", "prova"];
    if (p.nicho === "sobrevivencia") return ["medo", "comparacao", "prova"];
    if (p.nicho === "pets") return ["prova", "curiosidade", "comparacao"];
    return base;
  }
  function riscoTexto(p) {
    if (p.nicho === "nutra") return "Nunca use claim de cura, diagnóstico ou before/after corporal. Presell educativa, sem promessa de resultado. Peça ao vendor os claims aprovados.";
    if (p.nicho === "espiritual") return "Cuidado com 'garantido' e com sugestão de que resolve problema médico ou financeiro. Trate como entretenimento/desenvolvimento pessoal.";
    if (p.nicho === "sobrevivencia") return "Evite alarmismo ('o governo esconde') e promessas de resultado. Formato advertorial funciona bem e é mais seguro.";
    if (p.nicho === "financas") return "Transparência total de custos e riscos. Nenhuma promessa de renda. Prova real e disclaimer visível.";
    return "Risco relativamente baixo. Ainda assim: disclosure de afiliado visível e nenhuma promessa que o produtor não cumpra.";
  }

  /* ------------------------------ campanhas ------------------------------ */
  var bpSel = "display-custom-intent";
  function renderCampanhas() {
    $("#bpTabs").innerHTML = D.blueprints.map(function (b) {
      return "<div class=\"tab\" data-bp=\"" + b.id + "\">" + esc(b.canal.split(" (")[0]) + "</div>";
    }).join("");
    $$("#bpTabs .tab").forEach(function (t) { t.onclick = function () { selectBlueprint(t.dataset.bp); }; });

    var html = "<thead><tr><th>Canal</th><th>Papel no funil</th><th>Controle p/ afiliado</th><th>Formato que vence</th><th>Observação</th></tr></thead><tbody>";
    html += D.canais.map(function (c) {
      return "<tr><td><b>" + esc(c[0]) + "</b></td><td>" + esc(c[1]) + "</td><td>" + esc(c[2]) + "</td><td class=\"sub\">" + esc(c[3]) + "</td><td class=\"sub\">" + esc(c[4]) + "</td></tr>";
    }).join("") + "</tbody>";
    $("#canalTable").innerHTML = html;
    selectBlueprint(bpSel);
  }
  function selectBlueprint(id) {
    bpSel = id;
    $$("#bpTabs .tab").forEach(function (t) { t.classList.toggle("on", t.dataset.bp === id); });
    var b = D.blueprints.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    var box = $("#bpBody");
    box.innerHTML =
      "<div class=\"card\">" +
      "<div class=\"row between\" style=\"align-items:flex-start\"><div><h2 style=\"margin:0 0 6px\">" + esc(b.nome) + "</h2>" +
      "<div class=\"row\"><span class=\"pill b\">" + esc(b.canal) + "</span><span class=\"pill\">Dificuldade: " + esc(b.dificuldade) + "</span></div></div>" +
      "<div style=\"text-align:right\"><div class=\"small-label\">Orçamento</div><div class=\"mono\" style=\"font-size:12.5px\">teste " + esc(b.budget.teste) + "<br>validação " + esc(b.budget.validacao) + "<br>escala " + esc(b.budget.escala) + "</div></div></div>" +
      "<p style=\"margin-top:14px;color:var(--dim)\">" + esc(b.quando) + "</p>" +
      "<div class=\"grid g2\" style=\"margin-top:16px;align-items:start\">" +
        "<div><h3>Estrutura</h3><ul style=\"margin-left:18px;font-size:13.5px;color:var(--dim);display:flex;flex-direction:column;gap:6px\">" + b.estrutura.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        "<div><h3>KPIs de referência</h3>" + b.kpis.map(function (k) { return "<div class=\"kv\"><span class=\"dim\">" + esc(k[0]) + "</span><b>" + esc(k[1]) + "</b></div>"; }).join("") + "</div>" +
      "</div>" +
      "<h3 style=\"margin-top:20px\">Passo a passo</h3>" +
      b.passos.map(function (p, i) {
        return "<div class=\"step\"><div class=\"n\">" + (i + 1) + "</div><div><div style=\"font-size:13.8px;line-height:1.5\">" + esc(p) + "</div></div></div>";
      }).join("") +
      "<div class=\"grid g2\" style=\"margin-top:16px;align-items:start\">" +
        "<div><h3>Erros que matam esse formato</h3><ul style=\"margin-left:18px;font-size:13.5px;color:#ffb1b8;display:flex;flex-direction:column;gap:6px\">" + b.erros.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        "<div><h3>Critério de decisão</h3><div class=\"callout good\">" + esc(b.gate) + "</div></div>" +
      "</div>" +
      "<div class=\"row\" style=\"margin-top:18px\"><button class=\"btn pri\" data-go=\"copiloto\">Rodar o copiloto com meus números</button><button class=\"btn ghost\" data-go=\"gerador\">Gerar a presell desse canal</button></div>" +
      "</div>";
    bindGo(box);
  }

  /* ------------------------------ copiloto ------------------------------ */
  function runCopiloto() {
    var spend = +$("#cpSpend").value || 0, clicks = +$("#cpClicks").value || 0, impr = +$("#cpImpr").value || 0,
      out = +$("#cpOut").value || 0, sales = +$("#cpSales").value || 0, comm = +$("#cpComm").value || 0,
      days = +$("#cpDays").value || 1, chan = $("#cpChan").value;
    if (!clicks || !spend) { $("#cpOut2").innerHTML = "<div class=\"callout bad\">Preencha gasto e cliques.</div>"; return; }
    var cpc = spend / clicks;
    var ctr = impr ? clicks / impr * 100 : 0;
    var saida = clicks ? out / clicks * 100 : 0;
    var cvrHop = out ? sales / out * 100 : 0;
    var rpc = clicks ? sales * comm / clicks : 0;
    var ratio = cpc ? rpc / cpc : 0;
    var lucro = sales * comm - spend;
    var cpcMax = rpc * 0.7;
    var clicksDia = clicks / days;
    var dias300 = clicksDia ? Math.ceil(300 / clicksDia) : 0;
    var confiavel = clicks >= 300;

    var decisao, cls, resumo;
    if (!confiavel) { decisao = "Coletar mais dados"; cls = "y"; resumo = "Você tem " + clicks + " cliques. Abaixo de 300, qualquer decisão é ruído — a exceção é se o gasto já passou de 2× a comissão sem nenhuma venda, o que é sinal claro de estrutura errada."; }
    else if (ratio >= 1.3) { decisao = "Escalar"; cls = "g"; resumo = "A campanha paga a si mesma com folga. Suba orçamento 20–30% a cada 2–3 dias e crie uma cópia com público semelhante em vez de dobrar o lance."; }
    else if (ratio >= 0.8) { decisao = "Ajustar criativo/presell"; cls = ""; resumo = "Está no zero a zero. Não mexa no orçamento: troque hook/thumbnail e reescreva a presell (headline, prova, CTA). O gargalo está na taxa, não no volume."; }
    else if (ratio >= 0.4) { decisao = "Trocar ângulo"; cls = "y"; resumo = "A estrutura está perdendo dinheiro. Antes de cortar a oferta, teste outro ângulo (medo → mecanismo → prova) e um formato de presell diferente."; }
    else { decisao = "Cortar"; cls = "r"; resumo = "Receita por clique abaixo de 40% do custo. Corte a campanha, preserve a oferta e reavalie em outro canal (native, Bing) ou com outra oferta do mesmo nicho."; }

    var actions = [];
    if (ctr && ctr < 0.3 && /Display|Native|Demand/.test(chan)) actions.push("CTR de " + ctr.toFixed(2) + "% é baixo para " + chan + ": o problema é o criativo (hook/thumbnail), não o público.");
    if (saida && saida < 10) actions.push("Só " + saida.toFixed(1) + "% dos cliques saem para a oferta. Presell fraca: reescreva headline, primeira dobra, prova e CTA.");
    if (saida >= 10 && saida < 15) actions.push("Taxa de saída de " + saida.toFixed(1) + "% está no limite. Um teste A/B de headline deve resolver.");
    if (cvrHop && cvrHop < 0.4) actions.push("Conversão do hop em " + cvrHop.toFixed(2) + "%: ou o público não tem intenção, ou a página do produtor não entrega o que o anúncio prometeu.");
    if (cpc > cpcMax && cpcMax > 0) actions.push("CPC real " + money(cpc) + " acima do máximo calculado " + money(cpcMax) + ". Restrinja placements, use negativas ou migre para Bing/native.");
    if (!out) actions.push("Você não preencheu cliques na presell. Instale o evento de clique no botão de saída — sem isso não existe diagnóstico.");
    if (!actions.length) actions.push("Nenhum gargalo crítico identificado. Foque em volume de criativo novo (mínimo 4 por semana) para sustentar a escala.");
    if (dias300 > 21 && clicks < 300) actions.push("No ritmo atual você leva ~" + dias300 + " dias para 300 cliques. Aumente o orçamento de teste ou reduza o escopo (1 geo, 1 grupo).");

    try {
      var fxNow = loadFx();
      if (fxNow && fxNow.oferta) {
        fxNow.sp = spend; fxNow.cl = clicks; fxNow.out = out; fxNow.vd = sales;
        fxNow.canal = fxNow.canal || "display";
        saveFx();
        var hid = histUpsert(fxNow, "copiloto");
        var arrH = histLoad();
        var idxH = arrH.map(function (x) { return x.id; }).findIndex(function (v) { return v === hid; });
        if (idxH >= 0) { arrH[idxH].sp = spend; arrH[idxH].cl = clicks; arrH[idxH].out = out; arrH[idxH].vd = sales; arrH[idxH].comm = comm; histSave(arrH); }
      }
    } catch (e) {}

    $("#cpOut2").innerHTML =
      "<div class=\"card\" style=\"border-color:" + (cls === "g" ? "#38e0a355" : cls === "r" ? "#ff5d6c55" : cls === "y" ? "#ffb52055" : "var(--line)") + "\">" +
      "<div class=\"small-label\">Decisão</div><div class=\"big " + cls + "\" style=\"margin:4px 0 8px\">" + decisao + "</div>" +
      "<p style=\"color:var(--dim);font-size:13.5px\">" + esc(resumo) + "</p>" +
      "<div class=\"grid g3\" style=\"margin-top:16px\">" +
        mini("CPC", money(cpc), "custo por clique") +
        mini("CTR", ctr.toFixed(2) + "%", "clique / impressão") +
        mini("Saída p/ oferta", saida.toFixed(1) + "%", "cliques no botão / cliques") +
        mini("CVR hop", cvrHop.toFixed(2) + "%", "vendas / saídas") +
        mini("RPC", money(rpc), "receita por clique") +
        mini("RPC ÷ CPC", ratio.toFixed(2) + "×", ratio >= 1 ? "lucrativo" : "prejuízo") +
      "</div>" +
      "<div class=\"grid g2\" style=\"margin-top:12px\">" +
        mini("Lucro do período", (lucro >= 0 ? "+" : "−") + money(Math.abs(lucro)), "comissão − gasto") +
        mini("CPC máximo p/ 30% margem", money(cpcMax), "teto de lance") +
      "</div>" +
      "<h3 style=\"margin-top:20px\">O que fazer agora</h3>" +
      "<ul style=\"margin-left:18px;font-size:13.5px;color:var(--dim);display:flex;flex-direction:column;gap:7px\">" + actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
      (confiavel ? "" : "<div class=\"callout\" style=\"margin-top:16px\">Dados ainda não significativos: " + clicks + "/300 cliques. Use este diagnóstico como hipótese, não como veredito.</div>") +
      "<div class=\"row\" style=\"margin-top:12px\"><button class=\"btn sm\" id=\"cpToHist\">Ver isso no histórico</button><button class=\"btn sm ghost\" data-go=\"fluxo\">Voltar ao plano</button></div>" +
      "<div class=\"note\">Fórmulas: RPC = vendas × comissão ÷ cliques · RPC/CPC ≥ 1,3 = escalar · CPC máximo = RPC × (1 − margem).</div>" +
      "</div>";
    if ($("#cpToHist")) $("#cpToHist").onclick = function () { var f2 = loadFx(); if (f2 && f2.id) hsSel = f2.id; go("historico"); renderHistorico(); };
    bindGo($("#cpOut2"));
  }

  /* ------------------------------ gerador ------------------------------ */
  var genMode = "presell";
  function initGerador() {
    $("#gNicho").innerHTML = D.nichos.map(function (n) { return "<option value=\"" + n.id + "\">" + esc(n.nome) + "</option>"; }).join("");
    $("#gAng").innerHTML = ["medo", "prova", "mecanismo", "comparacao", "curiosidade"].map(function (a) { return "<option value=\"" + a + "\">" + esc(a) + "</option>"; }).join("");
    $("#gFmt").innerHTML = Object.keys(D.presellTemplates).map(function (k) { return "<option value=\"" + k + "\">" + esc(D.presellTemplates[k].nome) + "</option>"; }).join("");
    $$("#genTabs2 .tab").forEach(function (t) {
      t.onclick = function () {
        $$("#genTabs2 .tab").forEach(function (x) { x.classList.remove("on"); });
        t.classList.add("on"); genMode = t.dataset.gen; gerar();
      };
    });
    var tabCode = $("#gTabCode"), showingCode = false;
    tabCode.onclick = function () {
      showingCode = !showingCode;
      $("#gCode").style.display = showingCode ? "block" : "none";
      $("#gPreview").style.display = showingCode ? "none" : "block";
      tabCode.classList.toggle("on", showingCode);
      tabCode.previousElementSibling.classList.toggle("on", !showingCode);
    };
    $("#gRun").onclick = gerar;
    $("#gCopy").onclick = function () { copyText($("#gCode pre") ? $("#gCode pre").textContent : "", "HTML copiado"); };
    gerar();
  }
  function brief() {
    return {
      prod: $("#gProd").value.trim() || "Produto",
      nicho: $("#gNicho").value,
      pub: $("#gPub").value.trim() || "pessoas que já tentaram resolver o problema sem sucesso",
      mec: $("#gMec").value.trim() || "o mecanismo central do produto",
      ben: $("#gBen").value.trim() || "o resultado esperado",
      ang: $("#gAng").value,
      fmt: $("#gFmt").value,
      lang: $("#gLang").value,
      link: $("#gLink").value.trim() || "#SEU-LINK-DE-AFILIADO",
      dom: $("#gDom").value.trim() || "https://seu-dominio.com",
      marca: $("#gMarca").value.trim() || "Redação independente"
    };
  }
  function gerar() {
    var b = brief();
    if (genMode === "presell") { renderPresell(b); }
    else if (genMode === "heads") { renderHeads(b); }
    else if (genMode === "video") { renderVideo(b); }
    else { renderNative(b); }
  }

  function renderPresell(b) {
    var tpl = D.presellTemplates[b.fmt];
    var html, prev;
    if (b.fmt === "review") { var r = presellReview(b); html = r.html; prev = r.prev; }
    else if (b.fmt === "quiz") { var q = presellQuiz(b); html = q.html; prev = q.prev; }
    else if (b.fmt === "vsl") { var v = presellVsl(b); html = v.html; prev = v.prev; }
    else { var a = presellAdvertorial(b); html = a.html; prev = a.prev; }

    $("#gPreview").innerHTML = "<div class=\"preview\">" + prev + "</div>";
    $("#gCode").innerHTML = "<div class=\"rel\"><div class=\"card pad0\" style=\"padding:0\"><pre>" + esc(html) + "</pre></div></div>" +
      "<div class=\"card\" style=\"margin-top:12px\"><h3>Blocos deste formato</h3>" +
      tpl.blocos.map(function (bl) { return "<div class=\"kv\"><span><b>" + esc(bl.label) + "</b><br><span class=\"sub\">" + esc(bl.dica) + "</span></span></div>"; }).join("") +
      "</div>";
  }

  function disclosure(lang, marca, link) {
    if (lang === "en") {
      return "<p class=\"disc\"><b>Affiliate disclosure:</b> this page contains affiliate links. If you buy through them, we may earn a commission at no extra cost to you. " +
        "This is an independent review and is not the official website of the product. Results vary from person to person. " +
        "<a href=\"" + esc(link) + "\" rel=\"nofollow sponsored\">Go to the official website</a>. © " + new Date().getFullYear() + " " + esc(marca) + " — " +
        "<a href=\"/privacy\">Privacy</a> · <a href=\"/terms\">Terms</a> · <a href=\"/contact\">Contact</a></p>";
    }
    return "<p class=\"disc\"><b>Divulgação de afiliado:</b> esta página contém links de afiliado. Se você comprar por eles, podemos receber uma comissão sem custo adicional para você. " +
      "Esta é uma análise independente e não é o site oficial do produto. Resultados variam de pessoa para pessoa. " +
      "<a href=\"" + esc(link) + "\" rel=\"nofollow sponsored\">Ir para o site oficial</a>. © " + new Date().getFullYear() + " " + esc(marca) + " — " +
      "<a href=\"/privacidade\">Privacidade</a> · <a href=\"/termos\">Termos</a> · <a href=\"/contato\">Contato</a></p>";
  }

  function angleLine(b) {
    var en = b.lang === "en";
    var map = {
      medo: en ? "Most people trying to fix " + b.ben + " make the same mistake — and it is not about effort." : "Quem tenta resolver " + b.ben + " quase sempre comete o mesmo erro — e não é falta de esforço.",
      prova: en ? "We spent weeks testing the most talked-about options for " + b.ben + ". Here is what actually held up." : "Passamos semanas testando as opções mais faladas para " + b.ben + ". Veja o que realmente se sustentou.",
      mecanismo: en ? "The real cause behind " + b.ben + " is not what most people think — it is " + b.mec + "." : "A causa real por trás de " + b.ben + " não é o que a maioria pensa — é " + b.mec + ".",
      comparacao: en ? "We compared the leading options for " + b.ben + ". The cheapest one is rarely the best." : "Comparamos as principais opções para " + b.ben + ". A mais barata raramente é a melhor.",
      curiosidade: en ? "Almost nobody talks about this detail of " + b.mec + ". It changes how " + b.prod + " works." : "Quase ninguém fala deste detalhe de " + b.mec + ". Ele muda o jeito como " + b.prod + " funciona."
    };
    return map[b.ang] || map.mecanismo;
  }

  function presellAdvertorial(b) {
    var en = b.lang === "en";
    var T = en ? {
      kicker: "SPONSORED CONTENT",
      h1: b.ang === "medo" ? "The silent mistake that keeps " + b.ben + " out of reach" :
        b.ang === "prova" ? b.prod + ": what we found after testing it for 30 days" :
          b.ang === "comparacao" ? b.prod + " vs. the alternatives: an honest comparison" :
            "The " + b.mec + " detail most people miss about " + b.prod,
      sub: "By " + b.marca + " · Independent editorial team · 6 min read",
      p1: "If you are among " + b.pub + ", you already know the routine: you try something, it works for a while, then the results fade and you are back where you started. It is frustrating, and it is expensive.",
      p2: "For months we looked at the most recommended solutions for " + b.ben + ". Most of them attack the symptom. Few explain the mechanism. That is the difference that matters.",
      p3: "Then we found " + b.prod + ", which works through " + b.mec + ". Instead of promising a result, it explains why the result happens — and that is exactly what you should look for before spending money again.",
      h2mec: "Why the mechanism changes everything",
      mecp: "When the approach is " + b.mec + ", you are no longer guessing. You are working with the same process the body/mind already uses, just with a structured push. That is why people who had failed with generic solutions often report feeling a difference in the first weeks. Results vary — no program works the same for everyone.",
      h2prova: "What people are saying",
      proof: ["“I was skeptical. I noticed the difference in my routine after the second week — nothing dramatic, just easier to stay on task.” — verified customer",
        "“I had tried three other programs before. This is the first one that explained what it was doing and why.” — verified customer",
        "“It is not magic and it is not instant. But it is the first thing I kept using after the trial.” — verified customer"],
      h2pc: "Pros and cons (read before buying)",
      pros: ["Clear mechanism instead of vague promises", "Digital delivery — access right after purchase", "Money-back guarantee offered on the official website"],
      cons: ["It is not a quick fix; it requires consistency", "Only available online, on the official page", "Price and bonuses change without notice on the official site"],
      h2who: "Who it is for — and who it is not for",
      whoFor: "It makes sense if you have already tried the obvious solutions, if you want to understand the mechanism before spending, and if you can commit to a few weeks.",
      whoNot: "It is not for you if you are looking for an instant result, if you will not follow the instructions, or if you expect a guarantee of outcome — no honest program offers that.",
      cta: "Check availability and current price on the official website",
      ctaSmall: "You will be redirected to the official page of the product.",
      faq: "Frequently asked questions"
    } : {
      kicker: "CONTEÚDO PATROCINADO",
      h1: b.ang === "medo" ? "O erro silencioso que mantém " + b.ben + " fora de alcance" :
        b.ang === "prova" ? b.prod + ": o que descobrimos depois de 30 dias de teste" :
          b.ang === "comparacao" ? b.prod + " vs. as alternativas: uma comparação honesta" :
            "O detalhe de " + b.mec + " que quase todo mundo ignora em " + b.prod,
      sub: "Por " + b.marca + " · Equipe editorial independente · 6 min de leitura",
      p1: "Se você está entre " + b.pub + ", já conhece a rotina: tenta algo, funciona por um tempo, o resultado esfria e você volta ao ponto de partida. É frustrante e é caro.",
      p2: "Passamos meses analisando as soluções mais recomendadas para " + b.ben + ". A maioria ataca o sintoma. Poucas explicam o mecanismo. E é aí que está a diferença que importa.",
      p3: "Foi assim que chegamos ao " + b.prod + ", que trabalha com " + b.mec + ". Em vez de prometer um resultado, ele explica por que o resultado acontece — e é exatamente isso que você deveria exigir antes de gastar de novo.",
      h2mec: "Por que o mecanismo muda tudo",
      mecp: "Quando a abordagem é " + b.mec + ", você deixa de adivinhar. Você trabalha com o mesmo processo que o corpo/mente já usa, só que de forma estruturada. É por isso que quem já havia falhado com soluções genéricas costuma relatar diferença nas primeiras semanas. Resultados variam — nenhum programa funciona igual para todo mundo.",
      h2prova: "O que as pessoas dizem",
      proof: ["“Eu era cético. Senti diferença na rotina depois da segunda semana — nada dramático, só mais fácil de manter o foco.” — cliente verificado",
        "“Já tinha tentado três outros programas. Este foi o primeiro que explicou o que estava fazendo e por quê.” — cliente verificado",
        "“Não é mágica e não é instantâneo. Mas é a primeira coisa que eu continuei usando depois do teste.” — cliente verificado"],
      h2pc: "Prós e contras (leia antes de comprar)",
      pros: ["Mecanismo claro em vez de promessa vaga", "Entrega digital — acesso logo após a compra", "Garantia oferecida no site oficial"],
      cons: ["Não é solução instantânea; exige constância", "Disponível apenas online, na página oficial", "Preço e bônus mudam sem aviso no site oficial"],
      h2who: "Para quem é — e para quem não é",
      whoFor: "Faz sentido se você já tentou as soluções óbvias, se quer entender o mecanismo antes de gastar e se consegue manter por algumas semanas.",
      whoNot: "Não é para você se busca resultado imediato, se não vai seguir as instruções ou se espera garantia de resultado — nenhum programa honesto oferece isso.",
      cta: "Ver disponibilidade e preço atual no site oficial",
      ctaSmall: "Você será redirecionado para a página oficial do produto.",
      faq: "Perguntas frequentes"
    };

    var prev = "<span class=\"adlabel\">" + T.kicker + "</span><h1>" + esc(T.h1) + "</h1><p><i>" + esc(T.sub) + "</i></p>" +
      "<p>" + esc(T.p1) + "</p><p>" + esc(angleLine(b)) + "</p><p>" + esc(T.p2) + "</p><p>" + esc(T.p3) + "</p>" +
      "<h2>" + esc(T.h2mec) + "</h2><p>" + esc(T.mecp) + "</p>" +
      "<h2>" + esc(T.h2prova) + "</h2>" + T.proof.map(function (p) { return "<p><i>" + esc(p) + "</i></p>"; }).join("") +
      "<h2>" + esc(T.h2pc) + "</h2><ul>" + T.pros.map(function (p) { return "<li>+ " + esc(p) + "</li>"; }).join("") + T.cons.map(function (c) { return "<li>− " + esc(c) + "</li>"; }).join("") + "</ul>" +
      "<h2>" + esc(T.h2who) + "</h2><p>" + esc(T.whoFor) + "</p><p>" + esc(T.whoNot) + "</p>" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + esc(T.cta) + "</a><p style=\"font-size:12px;color:#666\">" + esc(T.ctaSmall) + "</p>" +
      "<h2>" + esc(T.faq) + "</h2><p><b>" + (en ? "Is it a subscription?" : "É assinatura?") + "</b> " + (en ? "Check the terms on the official page — some options are one-time access." : "Confira os termos na página oficial — algumas opções são de acesso único.") + "</p>" +
      "<p><b>" + (en ? "Is there a guarantee?" : "Existe garantia?") + "</b> " + (en ? "The refund policy is shown on the official website. Read it before buying." : "A política de reembolso está no site oficial. Leia antes de comprar.") + "</p>";

    var html = "<!DOCTYPE html>\n<html lang=\"" + (en ? "en" : "pt-BR") + "\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n" +
      "<title>" + esc(T.h1) + "</title>\n<meta name=\"description\" content=\"" + esc(T.h1) + "\">\n" +
      "<style>body{max-width:760px;margin:0 auto;padding:28px 20px;font:17px/1.65 Georgia,serif;color:#1a1a1a}h1{font-size:34px;line-height:1.15;margin:10px 0 6px}h2{font-size:22px;margin:30px 0 10px}img{max-width:100%}.adlabel{display:inline-block;background:#eee;color:#555;font:11px/1 sans-serif;padding:5px 9px;letter-spacing:1px;border-radius:3px}.cta{display:block;text-align:center;background:#0a7f4f;color:#fff;padding:17px;border-radius:8px;text-decoration:none;font:700 18px/1.2 sans-serif;margin:22px 0 8px}.disc{font:12px/1.5 sans-serif;color:#666;border-top:1px solid #ddd;margin-top:34px;padding-top:14px}a{color:#0a5fbf}</style>\n</head>\n<body>\n" +
      "<span class=\"adlabel\">" + esc(T.kicker) + "</span>\n<h1>" + esc(T.h1) + "</h1>\n<p><i>" + esc(T.sub) + "</i></p>\n" +
      "<p>" + esc(T.p1) + "</p>\n<p>" + esc(angleLine(b)) + "</p>\n<p>" + esc(T.p2) + "</p>\n<p>" + esc(T.p3) + "</p>\n" +
      "<h2>" + esc(T.h2mec) + "</h2>\n<p>" + esc(T.mecp) + "</p>\n" +
      "<h2>" + esc(T.h2prova) + "</h2>\n" + T.proof.map(function (p) { return "<p><i>" + esc(p) + "</i></p>"; }).join("\n") + "\n" +
      "<h2>" + esc(T.h2pc) + "</h2>\n<ul>\n" + T.pros.map(function (p) { return "<li><b>+</b> " + esc(p) + "</li>"; }).join("\n") + "\n" + T.cons.map(function (c) { return "<li><b>&minus;</b> " + esc(c) + "</li>"; }).join("\n") + "\n</ul>\n" +
      "<h2>" + esc(T.h2who) + "</h2>\n<p>" + esc(T.whoFor) + "</p>\n<p>" + esc(T.whoNot) + "</p>\n" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + esc(T.cta) + "</a>\n<p style=\"font-size:13px;color:#666\">" + esc(T.ctaSmall) + "</p>\n" +
      "<h2>" + esc(T.faq) + "</h2>\n" + (en
        ? "<p><b>Is it a subscription?</b> Check the terms on the official page — some options are one-time access.</p>\n<p><b>Is there a guarantee?</b> The refund policy is shown on the official website. Read it before buying.</p>"
        : "<p><b>É assinatura?</b> Confira os termos na página oficial — algumas opções são de acesso único.</p>\n<p><b>Existe garantia?</b> A política de reembolso está no site oficial. Leia antes de comprar.</p>") +
      "\n<!-- Substitua os depoimentos por reais antes de publicar -->\n" + disclosure(b.lang, b.marca, b.link) + "\n</body>\n</html>";
    return { html: html, prev: prev };
  }

  function presellReview(b) {
    var en = b.lang === "en";
    var h1 = en ? b.prod + ": honest review, pros, cons and who it is really for" : b.prod + ": análise honesta, prós, contras e para quem realmente serve";
    var veredito = en
      ? "Short verdict: if you already tried generic solutions for " + b.ben + " and want to understand the mechanism (" + b.mec + ") before spending, it is worth reading the official page. If you want an instant result, it is not for you."
      : "Veredito curto: se você já tentou soluções genéricas para " + b.ben + " e quer entender o mecanismo (" + b.mec + ") antes de gastar, vale ler a página oficial. Se busca resultado instantâneo, não é para você.";
    var tableHtml = "<table style=\"width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px\"><tr><th style=\"border:1px solid #ddd;padding:8px\"></th><th style=\"border:1px solid #ddd;padding:8px\">" + esc(b.prod) + "</th><th style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Generic option A" : "Opção genérica A") + "</th><th style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Do nothing" : "Não fazer nada") + "</th></tr>" +
      "<tr><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Explains mechanism" : "Explica o mecanismo") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Yes" : "Sim") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Rarely" : "Raramente") + "</td><td style=\"border:1px solid #ddd;padding:8px\">—</td></tr>" +
      "<tr><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Refund policy" : "Política de reembolso") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "On official site" : "No site oficial") + "</td><td style=\"border:1px solid #ddd;padding:8px\">?</td><td style=\"border:1px solid #ddd;padding:8px\">—</td></tr></table>";
    var prev = "<p style=\"font-family:sans-serif;font-size:12px;color:#666\">" + (en ? "Independent analysis — contains affiliate links" : "Análise independente — contém links de afiliado") + "</p>" +
      "<h1>" + esc(h1) + "</h1><p><b>" + (en ? "By " : "Por ") + esc(b.marca) + "</b> · " + (en ? "updated this week" : "atualizado esta semana") + "</p>" +
      "<p style=\"background:#f4f7f5;border-left:4px solid #0a7f4f;padding:12px\">" + esc(veredito) + "</p>" +
      "<h2>" + (en ? "How we evaluated" : "Como avaliamos") + "</h2><p>" + (en ? "We read the official materials, compared claims against the mechanism described, checked refund terms, and separated what is evidence from what is marketing." : "Lemos os materiais oficiais, comparamos as alegações com o mecanismo descrito, verificamos os termos de reembolso e separamos o que é evidência do que é marketing.") + "</p>" +
      "<h2>" + (en ? "Pros and cons" : "Prós e contras") + "</h2><ul>" +
      (en ? "<li><b>+</b> Explains the mechanism instead of only promising the outcome</li><li><b>+</b> Digital access, refund policy published on the official site</li><li><b>−</b> Requires consistency for weeks</li><li><b>−</b> Price and bonuses only on the official page</li>"
        : "<li><b>+</b> Explica o mecanismo em vez de só prometer o resultado</li><li><b>+</b> Acesso digital e política de reembolso publicada no site oficial</li><li><b>−</b> Exige constância por semanas</li><li><b>−</b> Preço e bônus somente na página oficial</li>") + "</ul>" +
      "<h2>" + (en ? "Comparison" : "Comparativo") + "</h2><table style=\"width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px\"><tr><th style=\"border:1px solid #ddd;padding:8px\"></th><th style=\"border:1px solid #ddd;padding:8px\">" + esc(b.prod) + "</th><th style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Generic option A" : "Opção genérica A") + "</th><th style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Do nothing" : "Não fazer nada") + "</th></tr>" +
      "<tr><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Explains mechanism" : "Explica o mecanismo") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Yes" : "Sim") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Rarely" : "Raramente") + "</td><td style=\"border:1px solid #ddd;padding:8px\">—</td></tr>" +
      "<tr><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "Refund policy" : "Política de reembolso") + "</td><td style=\"border:1px solid #ddd;padding:8px\">" + (en ? "On official site" : "No site oficial") + "</td><td style=\"border:1px solid #ddd;padding:8px\">?</td><td style=\"border:1px solid #ddd;padding:8px\">—</td></tr></table>" +
      "<h2>" + (en ? "FAQ" : "Perguntas frequentes") + "</h2><p><b>" + (en ? "Does it work for everyone?" : "Funciona para todo mundo?") + "</b> " + (en ? "No. Results vary and depend on consistency." : "Não. Resultados variam e dependem de constância.") + "</p>" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "See current price on the official website" : "Ver preço atual no site oficial") + "</a>";
    var html = "<!DOCTYPE html>\n<html lang=\"" + (en ? "en" : "pt-BR") + "\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + esc(h1) + "</title>" +
      "<style>body{max-width:760px;margin:0 auto;padding:28px 20px;font:17px/1.65 Georgia,serif;color:#1a1a1a}h1{font-size:32px;line-height:1.2}h2{font-size:22px;margin:28px 0 10px}.cta{display:block;text-align:center;background:#0a7f4f;color:#fff;padding:17px;border-radius:8px;text-decoration:none;font:700 18px/1.2 sans-serif;margin:24px 0}.disc{font:12px/1.5 sans-serif;color:#666;border-top:1px solid #ddd;margin-top:34px;padding-top:14px}a{color:#0a5fbf}table{width:100%;border-collapse:collapse;font:14px/1.4 sans-serif}th,td{border:1px solid #ddd;padding:8px;text-align:left}</style></head><body>\n" +
      "<p style=\"font:12px/1.5 sans-serif;color:#666\">" + (en ? "Independent analysis — contains affiliate links" : "Análise independente — contém links de afiliado") + "</p>\n" +
      "<h1>" + esc(h1) + "</h1>\n<p><b>" + (en ? "By " : "Por ") + esc(b.marca) + "</b></p>\n" +
      "<p style=\"background:#f4f7f5;border-left:4px solid #0a7f4f;padding:12px\">" + esc(veredito) + "</p>\n" +
      "<h2>" + (en ? "How we evaluated" : "Como avaliamos") + "</h2>\n<p>" + (en ? "We read the official materials, compared claims against the described mechanism, checked refund terms and separated evidence from marketing." : "Lemos os materiais oficiais, comparamos as alegações com o mecanismo descrito, verificamos os termos de reembolso e separamos evidência de marketing.") + "</p>\n" +
      "<h2>" + (en ? "Pros and cons" : "Prós e contras") + "</h2>\n<ul>" + (en
        ? "<li><b>+</b> Explains the mechanism instead of only promising the outcome</li><li><b>+</b> Digital access, refund policy published on the official site</li><li><b>&minus;</b> Requires consistency for weeks</li><li><b>&minus;</b> Price and bonuses only on the official page</li>"
        : "<li><b>+</b> Explica o mecanismo em vez de só prometer o resultado</li><li><b>+</b> Acesso digital e política de reembolso no site oficial</li><li><b>&minus;</b> Exige constância por semanas</li><li><b>&minus;</b> Preço e bônus somente na página oficial</li>") + "</ul>\n" +
      "<h2>" + (en ? "Comparison" : "Comparativo") + "</h2>\n" + tableHtml + "\n" +
      "<h2>" + (en ? "FAQ" : "Perguntas frequentes") + "</h2>\n<p><b>" + (en ? "Does it work for everyone?" : "Funciona para todo mundo?") + "</b> " + (en ? "No. Results vary and depend on consistency." : "Não. Resultados variam e dependem de constância.") + "</p>\n" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "See current price on the official website" : "Ver preço atual no site oficial") + "</a>\n" +
      disclosure(b.lang, b.marca, b.link) + "\n</body></html>";
    return { html: html, prev: prev };
  }

  function presellQuiz(b) {
    var en = b.lang === "en";
    var qs = en ? [
      ["How long have you been dealing with this?", ["Less than a month", "A few months", "More than a year"]],
      ["What have you already tried?", ["Nothing yet", "Generic solutions", "Several programs, none stuck"]],
      ["What matters most right now?", ["Understanding why it happens", "A structured plan", "Something simple to follow"]]
    ] : [
      ["Há quanto tempo você convive com isso?", ["Menos de um mês", "Alguns meses", "Mais de um ano"]],
      ["O que você já tentou?", ["Nada ainda", "Soluções genéricas", "Vários programas, nenhum durou"]],
      ["O que mais importa agora?", ["Entender por que acontece", "Um plano estruturado", "Algo simples de seguir"]]
    ];
    var prev = "<p style=\"font-family:sans-serif;font-size:12px;color:#666\">" + (en ? "60-second self-assessment" : "Autoavaliação de 60 segundos") + "</p>" +
      "<h1>" + (en ? "Which profile are you? Find out in 1 minute" : "Qual é o seu perfil? Descubra em 1 minuto") + "</h1>" +
      qs.map(function (q, i) {
        return "<h2>" + (i + 1) + ". " + esc(q[0]) + "</h2><ul>" + q[1].map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>";
      }).join("") +
      "<h2>" + (en ? "Your result" : "Seu resultado") + "</h2><p>" + (en
        ? "Your answers point to a pattern: you have already tried the obvious solutions and what is missing is the mechanism — " + b.mec + ". That is exactly the angle of " + b.prod + "."
        : "Suas respostas apontam um padrão: você já tentou as soluções óbvias e o que falta é o mecanismo — " + b.mec + ". É exatamente esse o ângulo do " + b.prod + ".") + "</p>" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "See the next step on the official page" : "Ver o próximo passo na página oficial") + "</a>";
    var html = "<!DOCTYPE html>\n<html lang=\"" + (en ? "en" : "pt-BR") + "\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + (en ? "1-minute assessment" : "Autoavaliação de 1 minuto") + "</title>" +
      "<style>body{max-width:680px;margin:0 auto;padding:26px 20px;font:17px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#14181f}h1{font-size:30px;line-height:1.2}h2{font-size:19px;margin:24px 0 8px}.opt{border:1px solid #d5dbe3;border-radius:10px;padding:13px 15px;margin-bottom:9px;cursor:pointer}.opt:hover{border-color:#0a7f4f}.cta{display:block;text-align:center;background:#0a7f4f;color:#fff;padding:16px;border-radius:10px;text-decoration:none;font-weight:700;margin:22px 0}.disc{font:12px/1.5 sans-serif;color:#666;border-top:1px solid #ddd;margin-top:30px;padding-top:14px}</style></head><body>\n" +
      "<p style=\"font:12px/1.5 sans-serif;color:#666\">" + (en ? "60-second self-assessment" : "Autoavaliação de 60 segundos") + "</p>\n" +
      "<h1>" + (en ? "Which profile are you? Find out in 1 minute" : "Qual é o seu perfil? Descubra em 1 minuto") + "</h1>\n" +
      qs.map(function (q, i) { return "<h2>" + (i + 1) + ". " + esc(q[0]) + "</h2>\n" + q[1].map(function (o) { return "<div class=\"opt\">" + esc(o) + "</div>"; }).join("\n"); }).join("\n") + "\n" +
      "<div id=\"result\" style=\"display:none\"><h2>" + (en ? "Your result" : "Seu resultado") + "</h2><p>" + esc(en ? "Your answers point to a pattern: the missing piece is the mechanism." : "Suas respostas apontam um padrão: a peça que falta é o mecanismo.") + "</p><a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "See the next step" : "Ver o próximo passo") + "</a></div>\n" +
      "<script>document.querySelectorAll('.opt').forEach(function(o){o.onclick=function(){document.getElementById('result').style.display='block';document.getElementById('result').scrollIntoView({behavior:'smooth'});}});</script>\n" +
      disclosure(b.lang, b.marca, b.link) + "\n</body></html>";
    return { html: html, prev: prev };
  }

  function presellVsl(b) {
    var en = b.lang === "en";
    var prev = "<p style=\"font-family:sans-serif;font-size:12px;color:#666\">" + (en ? "Watch before you buy" : "Assista antes de comprar") + "</p>" +
      "<h1>" + (en ? b.prod + ": the 3-minute explanation behind " + b.ben : b.prod + ": a explicação de 3 minutos por trás de " + b.ben) + "</h1>" +
      "<div style=\"background:#111;color:#fff;padding:60px 20px;text-align:center;border-radius:8px;margin:16px 0;font-family:sans-serif\">▶ " + (en ? "Your video here (self-hosted, no autoplay with sound)" : "Seu vídeo aqui (player próprio, sem autoplay com som)") + "</div>" +
      "<h2>" + (en ? "Summary in 4 points" : "Resumo em 4 pontos") + "</h2><ul>" +
      "<li>" + esc(en ? "What " + b.mec + " actually is" : "O que " + b.mec + " realmente é") + "</li>" +
      "<li>" + esc(en ? "Why generic solutions fail" : "Por que soluções genéricas falham") + "</li>" +
      "<li>" + esc(en ? "What you can realistically expect in the first weeks" : "O que esperar de realista nas primeiras semanas") + "</li>" +
      "<li>" + esc(en ? "Who should not buy it" : "Quem não deveria comprar") + "</li></ul>" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "Go to the official website" : "Ir para o site oficial") + "</a>";
    var html = "<!DOCTYPE html>\n<html lang=\"" + (en ? "en" : "pt-BR") + "\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + esc(b.prod) + "</title>" +
      "<style>body{max-width:780px;margin:0 auto;padding:26px 20px;font:17px/1.6 Georgia,serif;color:#14181f}h1{font-size:31px;line-height:1.2}h2{font-size:21px;margin:26px 0 10px}.cta{display:block;text-align:center;background:#0a7f4f;color:#fff;padding:16px;border-radius:8px;text-decoration:none;font:700 18px/1.2 sans-serif;margin:22px 0}.disc{font:12px/1.5 sans-serif;color:#666;border-top:1px solid #ddd;margin-top:30px;padding-top:14px}.player{background:#111;color:#fff;padding:90px 20px;text-align:center;border-radius:8px;margin:18px 0;font-family:sans-serif}</style></head><body>\n" +
      "<p style=\"font:12px/1.5 sans-serif;color:#666\">" + (en ? "Watch before you buy" : "Assista antes de comprar") + "</p>\n" +
      "<h1>" + esc(en ? b.prod + ": the 3-minute explanation behind " + b.ben : b.prod + ": a explicação de 3 minutos por trás de " + b.ben) + "</h1>\n" +
      "<div class=\"player\">▶ " + (en ? "Your self-hosted video here" : "Seu vídeo aqui") + "</div>\n" +
      "<h2>" + (en ? "Summary in 4 points" : "Resumo em 4 pontos") + "</h2>\n<ul><li>" + esc(en ? "What " + b.mec + " actually is" : "O que " + b.mec + " realmente é") + "</li><li>" + esc(en ? "Why generic solutions fail" : "Por que soluções genéricas falham") + "</li><li>" + esc(en ? "What you can realistically expect" : "O que esperar de realista") + "</li><li>" + esc(en ? "Who should not buy it" : "Quem não deveria comprar") + "</li></ul>\n" +
      "<a class=\"cta\" href=\"" + esc(b.link) + "\" rel=\"nofollow sponsored\">" + (en ? "Go to the official website" : "Ir para o site oficial") + "</a>\n" +
      disclosure(b.lang, b.marca, b.link) + "\n</body></html>";
    return { html: html, prev: prev };
  }

  function renderHeads(b) {
    var en = b.lang === "en";
    var hooks = D.hooksPorAngulo[b.ang] || D.hooksPorAngulo.mecanismo;
    var filled = hooks.map(function (h) {
      return h.replace(/\{beneficio\}/g, b.ben).replace(/\{produto\}/g, b.prod).replace(/\{solucao_comum\}/g, en ? "generic solutions" : "soluções genéricas")
        .replace(/\{problema\}/g, en ? "the problem" : "o problema").replace(/\{resultado\}/g, b.ben).replace(/\{publico\}/g, b.pub)
        .replace(/\{periodo\}/g, en ? "30 days" : "30 dias").replace(/\{concorrente\}/g, en ? "the alternatives" : "as alternativas")
        .replace(/\{numero\}/g, en ? "2,300" : "2.300").replace(/\{nicho\}/g, nichoNome[b.nicho]).replace(/\{culpa_comum\}/g, en ? "what you were told" : "o que te disseram").replace(/\{solucao_comum\}/g, en ? "the usual advice" : "o conselho de sempre");
    });
    var headlines = [];
    var base = en ? [b.prod + " — an honest look before you buy", "What nobody tells you about " + b.mec, "Why " + b.ben + " feels impossible (and what changes it)", b.prod + " review: pros, cons and who it is for", "The 3-minute explanation of " + b.prod, b.prod + ": does the mechanism hold up?", "Before you buy " + b.prod + ", read this", "How " + b.pub.split(" ").slice(0, 4).join(" ") + " can approach " + b.ben]
      : [b.prod + " — um olhar honesto antes de comprar", "O que ninguém conta sobre " + b.mec, "Por que " + b.ben + " parece impossível (e o que muda isso)", b.prod + ": análise com prós, contras e para quem serve", "A explicação de 3 minutos sobre " + b.prod, b.prod + ": o mecanismo se sustenta?", "Antes de comprar " + b.prod + ", leia isto", "Como " + b.pub + " pode encarar " + b.ben];
    headlines = base;
    var html = "<div class=\"grid g2\" style=\"align-items:start\"><div class=\"card\"><h3>Hooks de abertura (3 primeiros segundos)</h3>" +
      filled.map(function (h, i) { return "<div class=\"kv\"><span style=\"font-size:13.5px\">" + (i + 1) + ". " + esc(h) + "</span><button class=\"btn sm ghost\" data-cp=\"" + esc(h) + "\">copiar</button></div>"; }).join("") +
      "<div class=\"note\">Use cada hook no MESMO corpo de vídeo. O hook é 80% do resultado em Demand Gen e Meta.</div></div>" +
      "<div class=\"card\"><h3>Headlines de anúncio (≤ 30 caracteres para display)</h3>" +
      headlines.map(function (h) {
        var short = h.length > 40 ? h.slice(0, 37) + "…" : h;
        return "<div class=\"kv\"><span style=\"font-size:13.5px\">" + esc(short) + "</span><span class=\"chip\">" + h.length + " car.</span></div>";
      }).join("") + "</div></div>" +
      "<div class=\"card\" style=\"margin-top:14px\"><h3>Descrições (≤ 90 caracteres)</h3><div class=\"grid g2\">" +
      (en ? ["Understand the mechanism before spending. Check availability on the official site.", "Pros, cons and who it is really for. Independent review.", "No hype: what to expect in the first weeks and who should skip it."]
        : ["Entenda o mecanismo antes de gastar. Veja a disponibilidade no site oficial.", "Prós, contras e para quem realmente serve. Análise independente.", "Sem exagero: o que esperar nas primeiras semanas e quem deve evitar."]).map(function (d) {
          return "<div class=\"kv\"><span style=\"font-size:13.5px\">" + esc(d) + "</span><span class=\"chip\">" + d.length + " car.</span></div>";
        }).join("") + "</div></div>";
    $("#gPreview").innerHTML = html;
    $("#gCode").innerHTML = "<div class=\"card pad0\"><pre>" + esc(filled.concat(headlines).join("\n")) + "</pre></div>";
    $$("[data-cp]").forEach(function (b2) { b2.onclick = function () { copyText(b2.dataset.cp); }; });
  }

  function renderVideo(b) {
    var en = b.lang === "en";
    var script = en ? [
      ["0–3s", "HOOK (visual + fala)", "Look at this. If you have tried everything for " + b.ben + " and nothing stuck, the problem is not you — it is the approach."],
      ["3–15s", "PROBLEMA", "Most solutions treat the symptom. You feel better for a week and then it comes back. That pattern is the clue."],
      ["15–40s", "MECANISMO", b.prod + " works with " + b.mec + ". That is the piece that was missing: instead of guessing, you follow a structured process."],
      ["40–55s", "PROVA + EXPECTATIVA", "It is not magic and it is not instant. Most people who stick to it report a difference in the first weeks. Results vary."],
      ["55–70s", "CTA", "Tap the link, read the honest breakdown on my page, and only then decide. Price and availability are on the official website."]
    ] : [
      ["0–3s", "HOOK (visual + fala)", "Olha isso. Se você já tentou de tudo para " + b.ben + " e nada durou, o problema não é você — é a abordagem."],
      ["3–15s", "PROBLEMA", "A maioria das soluções trata o sintoma. Você sente melhora por uma semana e depois volta. Esse padrão é a pista."],
      ["15–40s", "MECANISMO", "O " + b.prod + " trabalha com " + b.mec + ". É a peça que faltava: em vez de adivinhar, você segue um processo estruturado."],
      ["40–55s", "PROVA + EXPECTATIVA", "Não é mágica e não é instantâneo. Quem mantém costuma relatar diferença nas primeiras semanas. Resultados variam."],
      ["55–70s", "CTA", "Toca no link, lê a análise honesta na minha página e só então decide. Preço e disponibilidade estão no site oficial."]
    ];
    var html = "<div class=\"card\"><h3>Roteiro de 60–70s</h3>" +
      script.map(function (s) {
        return "<div class=\"step\"><div class=\"n\" style=\"font-size:10px\">" + esc(s[0]) + "</div><div><div class=\"small-label\">" + esc(s[1]) + "</div><p style=\"font-size:13.5px;color:var(--dim);margin-top:5px\">" + esc(s[2]) + "</p></div></div>";
      }).join("") +
      "<div class=\"callout info\" style=\"margin-top:14px\">Regras do formato: legenda queimada (80% assiste sem som), 1 corte a cada 2–3 segundos, primeira cena sem logo, texto de CTA na tela nos últimos 5s. Nunca use o VSL do produtor — direito autoral e conteúdo duplicado.</div>" +
      "<h3 style=\"margin-top:18px\">Variações de thumbnail</h3><div class=\"row\">" +
      ["rosto + objeto estranho", "antes/depois de ambiente (não corporal)", "print de comentário", "números na tela", "close com expressão de dúvida"].map(function (t) { return "<span class=\"pill\">" + esc(t) + "</span>"; }).join("") + "</div></div>";
    $("#gPreview").innerHTML = html;
    $("#gCode").innerHTML = "<div class=\"card pad0\"><pre>" + esc(script.map(function (s) { return "[" + s[0] + "] " + s[1] + "\n" + s[2]; }).join("\n\n")) + "</pre></div>";
  }

  function renderNative(b) {
    var en = b.lang === "en";
    var heads = en ? [
      "She mixed 3 habits and the result surprised her doctor — but it was not what you think",
      "The " + b.mec + " detail that changes how " + b.prod + " works",
      "Man 52+ reveals what finally worked for " + b.ben + " (and what did not)",
      "Experts explain why " + b.ben + " stops working after a few weeks",
      "The $1 test that shows whether " + b.mec + " is right for you"
    ] : [
      "Ela juntou 3 hábitos e o resultado surpreendeu o médico — mas não era o que você pensa",
      "O detalhe de " + b.mec + " que muda o jeito como " + b.prod + " funciona",
      "Homem de 52+ revela o que finalmente funcionou para " + b.ben + " (e o que não funcionou)",
      "Especialistas explicam por que " + b.ben + " para de funcionar depois de semanas",
      "O teste de 1 real que mostra se " + b.mec + " é para você"
    ];
    var html = "<div class=\"card\"><h3>Headlines native (curiosidade + especificidade, sem claim médico)</h3>" +
      heads.map(function (h) { return "<div class=\"kv\"><span style=\"font-size:13.5px\">" + esc(h) + "</span><span class=\"chip\">" + h.length + " car.</span></div>"; }).join("") +
      "<h3 style=\"margin-top:18px\">Regras do native</h3><ul style=\"margin-left:18px;color:var(--dim);font-size:13.5px;display:flex;flex-direction:column;gap:6px\">" +
      "<li>Thumbnail = 90% do CTR. Rosto humano + objeto fora de contexto converte mais que produto na embalagem.</li>" +
      "<li>Nunca prometa cura, diagnóstico ou resultado garantido — é reprovação na revisão e banimento no acúmulo.</li>" +
      "<li>Destino precisa ser advertorial seu com selo \"conteúdo patrocinado\". Nunca link direto.</li>" +
      "<li>Semana 2: whitelist dos 20 melhores sites, senão o volume vem de placement ruim.</li>" +
      "</ul></div>";
    $("#gPreview").innerHTML = html;
    $("#gCode").innerHTML = "<div class=\"card pad0\"><pre>" + esc(heads.join("\n")) + "</pre></div>";
  }

  /* ------------------------------ keyword ------------------------------ */
  var kwData = [];
  function initKeyword() {
    $("#kwRun").onclick = gerarKeyword;
    gerarKeyword();
  }
  function gerarKeyword() {
    var seed = ($("#kwSeed").value || "produto").toLowerCase().trim();
    var cat = ($("#kwCat").value || seed).toLowerCase().trim();
    var prob = ($("#kwProb").value || "problema").toLowerCase().trim();
    var comps = ($("#kwComp").value || "").split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    var en = $("#kwLang").value === "en";
    var c = comps[0] || (en ? "alternative" : "concorrente");
    var rows = [];
    function add(cls, intent, terms) {
      terms.forEach(function (t) { if (t && rows.every(function (r) { return r.term !== t; })) rows.push({ term: t, cls: cls, intent: intent }); });
    }
    if (en) {
      add("Transacional", 95, ["buy " + seed, seed + " official website", seed + " price", "where to buy " + seed, seed + " order online", seed + " discount code", seed + " official site", "get " + seed]);
      add("Comparativo", 85, [seed + " review", seed + " reviews 2026", "is " + seed + " legit", seed + " results", seed + " complaints", seed + " vs " + c, "best " + cat + " program", c + " alternative", seed + " honest review", "does " + seed + " really work"]);
      add("Problema", 60, ["how to fix " + prob, "why " + prob, "best " + cat + " for " + prob, prob + " remedy", "natural " + cat + " for " + prob, prob + " treatment options"]);
      add("Informacional", 25, ["what is " + cat, "how does " + cat + " work", seed + " side effects", cat + " benefits", seed + " ingredients", "is " + cat + " safe", "how long does " + seed + " take to work"]);
      add("Negativo", 0, [seed + " free", seed + " pdf download", seed + " torrent", seed + " scam", seed + " job", seed + " lawsuit", seed + " fake"]);
    } else {
      add("Transacional", 95, ["comprar " + seed, seed + " site oficial", seed + " preço", "onde comprar " + seed, seed + " original", seed + " desconto", "valor do " + seed]);
      add("Comparativo", 85, [seed + " funciona", seed + " é bom", seed + " reclame aqui", seed + " avaliação", seed + " vs " + c, "melhor " + cat, "alternativa ao " + seed, seed + " análise honesta", "quem já usou " + seed]);
      add("Problema", 60, ["como resolver " + prob, "por que " + prob, "melhor " + cat + " para " + prob, prob + " o que fazer", "tratamento natural para " + prob]);
      add("Informacional", 25, ["o que é " + cat, "como funciona " + cat, seed + " efeitos colaterais", "benefícios do " + cat, seed + " ingredientes", "é seguro " + cat]);
      add("Negativo", 0, [seed + " grátis", seed + " pdf download", seed + " torrent", seed + " golpe", seed + " vagas", seed + " processo"]);
    }
    kwData = rows;
    var classes = ["Transacional", "Comparativo", "Problema", "Informacional", "Negativo"];
    var html = "<div class=\"card\"><div class=\"row between\" style=\"margin-bottom:12px\"><div><h3 style=\"margin:0\">Matriz de intenção — " + esc(seed) + "</h3><p class=\"sub\">" + rows.length + " termos gerados. Marque o que quer usar e exporte.</p></div>" +
      "<div class=\"row\"><button class=\"btn sm\" id=\"kwCsv\">Baixar CSV</button><button class=\"btn sm\" id=\"kwCopySel\">Copiar selecionados</button><button class=\"btn sm ghost\" id=\"kwCopyAll\">Copiar todos os acionáveis</button></div></div>";
    classes.forEach(function (cl) {
      var list = rows.filter(function (r) { return r.cls === cl; });
      var pillCls = cl === "Transacional" ? "g" : cl === "Comparativo" ? "b" : cl === "Problema" ? "y" : cl === "Negativo" ? "r" : "";
      html += "<h3 style=\"margin-top:16px\">" + cl + " <span class=\"pill " + pillCls + "\">intenção " + list[0].intent + "/100</span> " +
        (cl === "Negativo" ? "<span class=\"sub\">→ use como negativa</span>" : cl === "Informacional" ? "<span class=\"sub\">→ conteúdo/SEO, não anúncio</span>" : "<span class=\"sub\">→ Search + Custom Intent</span>") + "</h3>";
      html += "<div class=\"tag-cloud\" style=\"margin-top:8px\">" + list.map(function (r, i) {
        return "<label class=\"tag\" style=\"display:flex;gap:7px;align-items:center;cursor:pointer\"><input type=\"checkbox\" data-kw=\"" + esc(r.term) + "\" style=\"width:14px;height:14px;accent-color:#38e0a3\">" + esc(r.term) + "</label>";
      }).join("") + "</div>";
    });
    html += "<div class=\"callout info\" style=\"margin-top:16px\"><b>Como colar no Google Ads:</b> Públicos → Segmentos personalizados → Pessoas com qualquer um destes interesses. Cole um termo por linha, sem aspas, sem acento de regex. 15–30 termos é o ideal: menos que isso não encontra público, mais que isso dilui a intenção.</div></div>";
    $("#kwOut").innerHTML = html;

    $("#kwCsv").onclick = function () {
      var csv = "termo,classe,intencao\n" + rows.map(function (r) { return "\"" + r.term.replace(/"/g, '""') + "\"," + r.cls + "," + r.intent; }).join("\n");
      download("keywords-" + seed.replace(/\s+/g, "-") + ".csv", csv, "text/csv");
    };
    $("#kwCopySel").onclick = function () {
      var sel = $$("[data-kw]:checked").map(function (i) { return i.dataset.kw; });
      if (!sel.length) { toast("Marque ao menos um termo."); return; }
      copyText(sel.join("\n"), sel.length + " termos copiados");
    };
    $("#kwCopyAll").onclick = function () {
      var all = rows.filter(function (r) { return r.cls === "Transacional" || r.cls === "Comparativo" || r.cls === "Problema"; }).map(function (r) { return r.term; });
      copyText(all.join("\n"), all.length + " termos copiados (sem negativas e informacionais)");
    };
  }

  /* ------------------------------ viabilidade ------------------------------ */
  function initViab() {
    $("#viaRun").onclick = runViab;
    $("#lkRun").onclick = buildLinks;
    runViab(); buildLinks();
  }
  function runViab() {
    var comm = +$("#viaComm").value || 0, cvr = (+$("#viaCvr").value || 0) / 100, ctr = (+$("#viaCtr").value || 0) / 100,
      cpc = +$("#viaCpc").value || 0, marg = (+$("#viaMarg").value || 0) / 100, ref = (+$("#viaRef").value || 0) / 100;
    var rpc = comm * cvr * (1 - ref);
    var cpcMax = rpc * (1 - marg);
    var lucro = rpc - cpc;
    var clicksVenda = cvr > 0 ? Math.round(1 / cvr) : 0;
    var custoVenda = cpc * clicksVenda;
    var lucroVenda = comm * (1 - ref) - custoVenda;
    var teste = cpc * 300;
    var cpm = ctr > 0 ? cpc * ctr * 1000 : 0;
    var ok = cpc <= cpcMax;
    var veredito = ok
      ? (lucro >= cpc * 0.3 ? "<span class=\"pill g\">Viável — escalar</span>" : "<span class=\"pill y\">No limite — margem apertada</span>")
      : "<span class=\"pill r\">Inviável nesse CPC — mude canal, oferta ou criativo</span>";
    $("#viaOut").innerHTML = "<div class=\"card\"><div class=\"row between\"><div><div class=\"small-label\">Veredito</div><div style=\"margin-top:6px\">" + veredito + "</div></div><div style=\"text-align:right\"><div class=\"small-label\">RPC</div><div class=\"big " + (lucro > 0 ? "g" : "r") + "\">" + money(rpc) + "</div></div></div>" +
      "<div class=\"grid g2\" style=\"margin-top:16px\">" +
      mini("CPC máximo (margem " + Math.round(marg * 100) + "%)", money(cpcMax), "teto de lance") +
      mini("CPC informado", money(cpc), ok ? "dentro do teto" : "acima do teto") +
      mini("Lucro por clique", (lucro >= 0 ? "+" : "−") + money(Math.abs(lucro)), "RPC − CPC") +
      mini("Cliques por venda", clicksVenda, "1 ÷ CVR") +
      mini("Custo por venda", money(custoVenda), "CPC × cliques por venda") +
      mini("Lucro por venda", (lucroVenda >= 0 ? "+" : "−") + money(Math.abs(lucroVenda)), "comissão líquida − custo") +
      mini("CPM equivalente", money(cpm), "CPC × CTR × 1000") +
      mini("Orçamento mínimo de teste", money(teste), "300 cliques") +
      "</div>" +
      "<div class=\"callout " + (ok ? "good" : "bad") + "\" style=\"margin-top:16px\">" + (ok
        ? "Estrutura paga o clique. Rode 300 cliques no CPC máximo e só então escale 20–30%. Se o CPC real subir acima de " + money(cpcMax) + ", pause e corte placement/criativo."
        : "Com CPC de " + money(cpc) + " você paga para trabalhar. Opções: (a) oferta com comissão maior, (b) canal com CPC menor (Bing/native/e-mail), (c) CVR maior com presell melhor, (d) não fazer essa campanha.") + "</div>" +
      "<div class=\"note\">Fórmula: RPC = comissão × CVR × (1 − reembolso). CPC máximo = RPC × (1 − margem desejada).</div></div>";
  }
  function buildLinks() {
    var base = $("#lkBase").value.trim(), param = $("#lkParam").value.trim() || "tid",
      src = $("#lkSrc").value.trim(), camp = $("#lkCamp").value.trim(), ang = $("#lkAng").value.trim();
    if (!base) { $("#lkOut").innerHTML = "<div class=\"callout\">Cole o seu link base de afiliado para montar os links de rastreio.</div>"; return; }
    var aff = base + (base.indexOf("?") >= 0 ? "&" : "?") + encodeURIComponent(param) + "=" + encodeURIComponent(ang || "angulo1") + "_" + encodeURIComponent(camp || "campanha");
    var presell = "https://seu-dominio.com/" + (camp || "presell") + "?utm_source=" + encodeURIComponent(src || "google-display") + "&utm_medium=cpc&utm_campaign=" + encodeURIComponent(camp || "campanha") + "&utm_content=" + encodeURIComponent(ang || "angulo1");
    $("#lkOut").innerHTML =
      "<div class=\"card\" style=\"background:#0a0f16\"><div class=\"small-label\">1 · URL final do anúncio (deve ser a SUA presell)</div><pre>" + esc(presell) + "</pre>" +
      "<div class=\"small-label\" style=\"margin-top:12px\">2 · Botão dentro da presell (link de afiliado com sub-id)</div><pre>" + esc(aff) + "</pre>" +
      "<div class=\"small-label\" style=\"margin-top:12px\">3 · Parâmetros de acompanhamento do Google Ads</div><pre>{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign=" + esc(camp || "campanha") + "&utm_content=" + esc(ang || "angulo1") + "&gclid={gclid}</pre>" +
      "<div class=\"row\" style=\"margin-top:12px\"><button class=\"btn sm\" id=\"lkCp1\">Copiar URL final</button><button class=\"btn sm ghost\" id=\"lkCp2\">Copiar link de afiliado</button></div>" +
      "<div class=\"callout\" style=\"margin-top:14px\">Nunca coloque o link de afiliado como URL final do anúncio: o redirect muda o domínio e isso é a causa nº 1 de reprovação por destino incompatível. O link de afiliado vai <b>dentro</b> da sua presell.</div></div>";
    $("#lkCp1").onclick = function () { copyText(presell); };
    $("#lkCp2").onclick = function () { copyText(aff); };
  }

  /* ------------------------------ checklists ------------------------------ */
  var CK_TABS = [
    ["presell", "Presell / destino", D.checklistPresell],
    ["google", "Google Ads", D.checklistGoogle],
    ["meta", "Meta Ads", D.checklistMeta]
  ];
  function initCheck() {
    $("#ckTabs").innerHTML = CK_TABS.map(function (t, i) { return "<div class=\"tab" + (i === 0 ? " on" : "") + "\" data-ck=\"" + t[0] + "\">" + esc(t[1]) + "</div>"; }).join("");
    $$("#ckTabs .tab").forEach(function (t) {
      t.onclick = function () {
        $$("#ckTabs .tab").forEach(function (x) { x.classList.remove("on"); });
        t.classList.add("on"); drawCheck(t.dataset.ck);
      };
    });
    drawCheck("presell");
  }
  function drawCheck(key) {
    var t = CK_TABS.filter(function (x) { return x[0] === key; })[0];
    var state = LS.get("ck_" + key, {});
    var items = t[2];
    var done = items.filter(function (_, i) { return state[i]; }).length;
    var html = "<div class=\"card\"><div class=\"row between\" style=\"margin-bottom:14px\"><div><h3 style=\"margin:0\">" + esc(t[1]) + "</h3><p class=\"sub\">" + done + "/" + items.length + " concluídos</p></div><div class=\"bar\" style=\"width:120px\"><i style=\"width:" + Math.round(done / items.length * 100) + "%\"></i></div></div>";
    html += items.map(function (it, i) {
      return "<div style=\"margin-bottom:8px\"><label class=\"check " + (state[i] ? "done" : "") + "\"><input type=\"checkbox\" data-i=\"" + i + "\" " + (state[i] ? "checked" : "") + "><span>" + esc(it) + "</span></label></div>";
    }).join("");
    html += "<div class=\"callout " + (done === items.length ? "good" : "") + "\" style=\"margin-top:14px\">" + (done === items.length ? "Checklist completo. Só suba a campanha depois de testar o caminho completo do clique em janela anônima e no celular." : "Não suba campanha com item pendente de destino/compliance — é o motivo mais comum de reprovação em série.") + "</div></div>";
    $("#ckBody").innerHTML = html;
    $$("#ckBody input[type=checkbox]").forEach(function (cb) {
      cb.onchange = function () {
        var st = LS.get("ck_" + key, {});
        if (cb.checked) st[cb.dataset.i] = 1; else delete st[cb.dataset.i];
        LS.set("ck_" + key, st); drawCheck(key);
      };
    });
  }

  /* ------------------------------ plano ------------------------------ */
  function renderPlano() {
    var st = LS.get("plano", {});
    var total = 0, done = 0;
    var html = D.plano7dias.map(function (d) {
      var itensHtml = d.tarefas.map(function (t, i) {
        var k = "d" + d.dia + "-" + i; total++; if (st[k]) done++;
        return "<label class=\"check\" style=\"margin-bottom:7px\"><input type=\"checkbox\" data-k=\"" + k + "\" " + (st[k] ? "checked" : "") + "><span>" + esc(t) + "</span></label>";
      }).join("");
      var dDone = d.tarefas.filter(function (_, i) { return st["d" + d.dia + "-" + i]; }).length;
      return "<div class=\"step " + (dDone === d.tarefas.length ? "ok" : dDone > 0 ? "cur" : "") + "\">" +
        "<div class=\"n\">" + d.dia + "</div>" +
        "<div><div class=\"row between\"><h3 style=\"margin:0\">" + esc(d.titulo) + "</h3><span class=\"pill\">" + dDone + "/" + d.tarefas.length + "</span></div>" +
        "<div style=\"margin-top:10px\">" + itensHtml + "</div>" +
        "<div class=\"callout good\" style=\"margin-top:8px\"><b>Entrega do dia:</b> " + esc(d.entrega) + "</div></div></div>";
    }).join("");
    var p = total ? Math.round(done / total * 100) : 0;
    $("#planBody").innerHTML = html;
    $("#planPct").textContent = p + "%";
    $("#planBar").style.width = p + "%";
    $$("#planBody input[type=checkbox]").forEach(function (cb) {
      cb.onchange = function () {
        var s = LS.get("plano", {});
        if (cb.checked) s[cb.dataset.k] = 1; else delete s[cb.dataset.k];
        LS.set("plano", s); renderPlano();
      };
    });
  }

  /* ------------------------------ github / hf ------------------------------ */
  function renderGithub() {
    var cats = [];
    D.arsenalGithub.forEach(function (g) { if (cats.indexOf(g.categoria) < 0) cats.push(g.categoria); });
    $("#ghTabs").innerHTML = "<div class=\"tab on\" data-gc=\"\">Tudo</div>" + cats.map(function (c) { return "<div class=\"tab\" data-gc=\"" + esc(c) + "\">" + esc(c) + "</div>"; }).join("");
    function draw(cat) {
      var list = D.arsenalGithub.filter(function (g) { return !cat || g.categoria === cat; });
      $("#ghBody").innerHTML = list.map(function (g) {
        return "<div class=\"card ghcard\"><div class=\"name\">" + esc(g.repo) + " <span class=\"chip\">★ " + esc(g.stars) + "</span><span class=\"chip\">" + esc(g.categoria) + "</span></div>" +
          "<p>" + esc(g.o_que) + "</p><div class=\"how\"><b>Como usar hoje:</b> " + esc(g.como) + "</div>" +
          "<div><a class=\"btn sm ghost\" href=\"" + esc(g.url) + "\" target=\"_blank\" rel=\"noopener\">Abrir repositório ↗</a></div></div>";
      }).join("");
    }
    $$("#ghTabs .tab").forEach(function (t) {
      t.onclick = function () { $$("#ghTabs .tab").forEach(function (x) { x.classList.remove("on"); }); t.classList.add("on"); draw(t.dataset.gc); };
    });
    draw("");
  }
  function renderHF() {
    $("#hfBody").innerHTML = D.arsenalHF.map(function (m) {
      var isSearch = m.id.indexOf("busca:") === 0;
      return "<div class=\"card ghcard\"><div class=\"name\">" + esc(m.id) + (isSearch ? "" : " <span class=\"chip\">modelo</span>") + "</div>" +
        "<p>" + esc(m.o_que) + "</p><div class=\"how\"><b>Como usar:</b> " + esc(m.como) + "</div>" +
        "<div><a class=\"btn sm ghost\" href=\"" + esc(m.url) + "\" target=\"_blank\" rel=\"noopener\">Abrir no Hugging Face ↗</a></div></div>";
    }).join("");
    $("#hfStack").textContent =
      "# 1) LLM local para presell, e-mails e headlines (16 GB de RAM roda)\n" +
      "ollama pull llama3.1:8b-instruct-q4_K_M\n" +
      "ollama run llama3.1:8b-instruct-q4_K_M \"write 10 ad headlines for a brainwave audio product, no health claims\"\n\n" +
      "# 2) Agrupar search terms em clusters de intenção\n" +
      "pip install sentence-transformers scikit-learn pandas\n" +
      "python tools/cluster_intent.py search_terms.csv\n\n" +
      "# 3) Transcrição de VSL de concorrente (extrair mecanismo e claims)\n" +
      "pip install faster-whisper\n" +
      "python -m faster_whisper vsl.mp4 --model small --language en\n\n" +
      "# 4) Coletar sugestões reais do Google (autocomplete) para o Custom Segment\n" +
      "python tools/keyword_harvest.py --seed \"brain song\" --lang en --out terms.csv\n\n" +
      "# 5) Servir a presell local antes de publicar\n" +
      "python3 -m http.server 8080";
  }

  /* ------------------------------ manual ------------------------------ */
  var manSel = "fundamentos";
  function renderManual() {
    $("#manTabs").innerHTML = window.BM_MANUAL.map(function (s) {
      return "<div class=\"tab\" data-mn=\"" + s.id + "\">" + esc(s.titulo.split(".")[0] + ". " + s.titulo.split(". ").slice(1).join(". ")) + "</div>";
    }).join("");
    $$("#manTabs .tab").forEach(function (t) {
      t.onclick = function () { manSel = t.dataset.mn; drawManual(); };
    });
    drawManual();
  }
  function drawManual() {
    var s = window.BM_MANUAL.filter(function (x) { return x.id === manSel; })[0];
    $$("#manTabs .tab").forEach(function (t) { t.classList.toggle("on", t.dataset.mn === manSel); });
    $("#manBody").innerHTML = "<div class=\"card\"><h1 style=\"font-size:21px\">" + esc(s.titulo) + "</h1>" + s.html +
      "<div class=\"row\" style=\"margin-top:20px\"><button class=\"btn sm ghost\" id=\"mnPrev\">← Anterior</button><button class=\"btn sm\" id=\"mnNext\">Próxima seção →</button></div></div>";
    var idx = window.BM_MANUAL.findIndex(function (x) { return x.id === manSel; });
    $("#mnPrev").onclick = function () { manSel = window.BM_MANUAL[Math.max(0, idx - 1)].id; drawManual(); window.scrollTo({ top: 0, behavior: "smooth" }); };
    $("#mnNext").onclick = function () { manSel = window.BM_MANUAL[Math.min(window.BM_MANUAL.length - 1, idx + 1)].id; drawManual(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  }

  /* ------------------------------ caderno ------------------------------ */
  function initCaderno() {
    $("#ntAdd").onclick = function () {
      var t = $("#ntTitle").value.trim();
      if (!t) { toast("Dê um nome à campanha."); return; }
      var arr = LS.get("notas", []);
      arr.unshift({ t: t, h: $("#ntHyp").value.trim(), r: $("#ntRes").value.trim(), d: $("#ntDec").value, date: new Date().toISOString().slice(0, 10) });
      LS.set("notas", arr);
      $("#ntTitle").value = ""; $("#ntHyp").value = ""; $("#ntRes").value = "";
      drawNotas(); toast("Entrada salva");
    };
    $("#ntExport").onclick = function () { download("caderno-blogmaster.json", JSON.stringify(LS.get("notas", []), null, 2), "application/json"); };
    $("#ntImportBtn").onclick = function () { $("#ntImport").click(); };
    $("#ntImport").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var data = JSON.parse(r.result);
          if (Array.isArray(data)) { LS.set("notas", data.concat(LS.get("notas", []))); drawNotas(); toast("Importado"); }
        } catch (err) { toast("Arquivo inválido"); }
      };
      r.readAsText(f);
    };
    drawNotas();
  }
  function drawNotas() {
    var arr = LS.get("notas", []);
    if (!arr.length) { $("#ntList").innerHTML = "<p class=\"sub\">Nenhuma entrada ainda. A primeira decisão que você documenta vale mais que dez horas de vídeo.</p>"; return; }
    $("#ntList").innerHTML = arr.map(function (n, i) {
      return "<div class=\"card\" style=\"margin-bottom:9px;background:#ffffff05\"><div class=\"row between\"><b style=\"font-size:13.5px\">" + esc(n.t) + "</b><span class=\"pill " + (n.d === "Escalar" ? "g" : n.d === "Cortar" ? "r" : "y") + "\">" + esc(n.d) + "</span></div>" +
        "<div class=\"sub\" style=\"margin:4px 0 6px\">" + esc(n.date) + "</div>" +
        (n.h ? "<div style=\"font-size:13px;margin-bottom:5px\"><span class=\"dim\">Hipótese:</span> " + esc(n.h) + "</div>" : "") +
        (n.r ? "<div style=\"font-size:13px\"><span class=\"dim\">Resultado:</span> " + esc(n.r) + "</div>" : "") +
        "<div class=\"row\" style=\"margin-top:8px\"><button class=\"btn sm ghost danger\" data-del=\"" + i + "\">remover</button></div></div>";
    }).join("");
    $$("[data-del]").forEach(function (b) {
      b.onclick = function () {
        var a = LS.get("notas", []); a.splice(+b.dataset.del, 1); LS.set("notas", a); drawNotas();
      };
    });
  }


  /* ------------------------------ integrações ------------------------------ */
  var INT = D.integracoes;
  function brBase() {
    var v = ($("#brUrl") && $("#brUrl").value || INT.bridge.padrao).trim().replace(/\/+$/, "");
    LS.set("bridge", v);
    return v;
  }
  function brFetch(path, opts) {
    var o = opts || {};
    o.headers = Object.assign({ "Content-Type": "application/json" }, o.headers || {});
    return fetch(brBase() + path, o);
  }
  function showJson(sel, status, data, okLabel) {
    var box = $(sel);
    var pretty = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    var cls = status >= 200 && status < 300 ? "good" : status === 0 ? "" : "bad";
    box.innerHTML = "<div class=\"callout " + cls + "\">" + esc(okLabel || ("HTTP " + status)) + "</div>" +
      "<div class=\"card pad0\" style=\"margin-top:8px\"><pre style=\"max-height:340px\">" + esc(pretty.slice(0, 6000)) + "</pre></div>";
  }
  function initIntegracoes() {
    if (!$("#brTest")) return;
    if (typeof fetch !== "function") {
      $("#brStatus").className = "pill y"; $("#brStatus").textContent = "navegador sem fetch";
      $("#brOut").innerHTML = "<div class=\"callout\">Este navegador não expõe <span class=\"mono\">fetch</span> — as integrações ficam indisponíveis, o resto do app funciona normalmente.</div>";
      return;
    }
    var saved = LS.get("bridge", INT.bridge.padrao);
    if ($("#brUrl")) $("#brUrl").value = saved;

    // --- bridge ---
    $("#brTest").onclick = function () {
      var box = $("#brOut"), st = $("#brStatus");
      box.innerHTML = "<span class=\"sub\">testando…</span>";
      brFetch("/health").then(function (r) { return r.json(); }).then(function (j) {
        st.className = "pill g"; st.textContent = "bridge online";
        box.innerHTML = "<div class=\"callout good\">Bridge respondendo. Token Adspirer: <b>" + esc(j.ads_token) + "</b> · Rally: ML " + (j.rally_env.ML_AFFILIATE_ID ? "ok" : "—") + ", Shopee " + (j.rally_env.SHOPEE_APP_ID ? "ok" : "—") + "</div>";
      }).catch(function () {
        st.className = "pill r"; st.textContent = "bridge offline";
        box.innerHTML = "<div class=\"callout bad\">Não alcançou o bridge. Rode <span class=\"mono\">python3 tools/mcp_bridge.py --port 8791</span> na raiz do projeto. Sem ele os botões abaixo avisam, mas o resto do app continua funcionando.</div>";
      });
    };
    brFetch("/health").then(function (r) { return r.json(); }).then(function (j) {
      var st = $("#brStatus"); st.className = "pill g"; st.textContent = "bridge online";
      $("#brOut").innerHTML = "<div class=\"callout good\">Bridge já está rodando neste ambiente (token " + esc(j.ads_token) + ").</div>";
    }).catch(function () {
      var st = $("#brStatus"); st.className = "pill"; st.textContent = "bridge não detectado";
    });

    // --- ads ---
    $("#adsTool").innerHTML = INT.ads.toolsSugeridas.map(function (t) {
      return "<option value=\"" + esc(t[2]) + "\" data-name=\"" + esc(t[0]) + "\">" + esc(t[0]) + " — " + esc(t[1]) + "</option>";
    }).join("");
    function setAdsPayload() {
      var o = $("#adsTool").selectedOptions[0];
      $("#adsPayload").value = JSON.stringify(JSON.parse(o.dataset.name === "create_campaign" ? o.value.replace("{{oferta}}", (radarSel || "oferta")) : o.value), null, 2);
    }
    $("#adsTool").onchange = setAdsPayload;
    setAdsPayload();
    $("#adsRun").onclick = function () {
      var name = $("#adsTool").selectedOptions[0].dataset.name;
      var payload;
      try { payload = JSON.parse($("#adsPayload").value); } catch (e) { showJson("#adsOut", 0, "JSON inválido no payload.", "Corrija o JSON"); return; }
      $("#adsOut").innerHTML = "<span class=\"sub\">chamando o bridge…</span>";
      brFetch("/ads/" + encodeURIComponent(name), { method: "POST", body: JSON.stringify(payload) })
        .then(function (r) { return r.text().then(function (t) { return { s: r.status, t: t }; }); })
        .then(function (res) {
          var parsed; try { parsed = JSON.parse(res.t); } catch (e) { parsed = res.t; }
          showJson("#adsOut", res.s, parsed, res.s < 300 ? "Executado. Campanha criada PAUSADA — revise e ative na plataforma." : "Falhou (HTTP " + res.s + ")");
        })
        .catch(function () {
          $("#adsOut").innerHTML = "<div class=\"callout bad\">Bridge offline. Suba o bridge ou execute a mesma tool pelo MCP no seu agente. Token nunca vai no navegador.</div>";
        });
    };
    $("#adsFromRadar").onclick = function () {
      if (!radarSel) { toast("Selecione uma oferta no Radar primeiro."); return; }
      var o = $("#adsTool").selectedOptions[0];
      o.value = o.value.replace("{{oferta}}", radarSel);
      $("#adsPayload").value = JSON.stringify({ platform: "google_ads", name: "BM — " + radarSel + " — display", budget: { amount: 20, currency: "USD" }, status: "PAUSED" }, null, 2);
      toast("Payload montado com " + radarSel);
    };

    // --- rally ---
    $("#rallyTool").innerHTML = INT.rally.tools.map(function (t) {
      return "<option value=\"" + esc(t[2]) + "\" data-name=\"" + esc(t[0]) + "\">" + esc(t[0]) + " — " + esc(t[1]) + "</option>";
    }).join("");
    function setRallyArgs() { $("#rallyArgs").value = JSON.stringify(JSON.parse($("#rallyTool").selectedOptions[0].value), null, 2); }
    $("#rallyTool").onchange = setRallyArgs;
    setRallyArgs();
    $("#rallyRun").onclick = function () {
      var name = $("#rallyTool").selectedOptions[0].dataset.name;
      var args;
      try { args = JSON.parse($("#rallyArgs").value); } catch (e) { showJson("#rallyOut", 0, "JSON inválido.", "Corrija o JSON"); return; }
      $("#rallyOut").innerHTML = "<span class=\"sub\">chamando o Rally MCP via bridge…</span>";
      brFetch("/rally/" + encodeURIComponent(name), { method: "POST", body: JSON.stringify(args) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.error) {
            var motivo = (j.error.message || "").indexOf("fetch") >= 0
              ? "O Rally respondeu, mas não conseguiu alcançar o Mercado Livre/Shopee. Na prática: (a) faltam ML_AFFILIATE_ID / SHOPEE_APP_ID / SHOPEE_SECRET no ambiente do bridge, (b) o marketplace bloqueou a requisição, ou (c) sem saída de rede neste ambiente."
              : "O Rally devolveu um erro de protocolo. Confira o nome da tool e o formato dos argumentos.";
            $("#rallyOut").innerHTML = "<div class=\"callout bad\"><b>Erro do Rally MCP:</b> " + esc(j.error.message || "") + "<br>" + esc(motivo) + "</div>" +
              "<div class=\"card pad0\" style=\"margin-top:8px\"><pre>" + esc(JSON.stringify(j, null, 2)) + "</pre></div>";
            return;
          }
          showJson("#rallyOut", 200, j, "Resposta do Rally MCP");
        })
        .catch(function () {
          $("#rallyOut").innerHTML = "<div class=\"callout bad\">Bridge offline. O Rally só funciona via MCP (STDIO) — suba o bridge com as variáveis ML_AFFILIATE_ID / SHOPEE_APP_ID / SHOPEE_SECRET.</div>";
        });
    };

    // --- sinais ---
    $("#sigRun").onclick = function () {
      $("#sigOut").innerHTML = "<span class=\"sub\">puxando sinais…</span>";
      brFetch("/signals").then(function (r) { return r.json(); }).then(function (j) { renderSinais(j); })
        .catch(function () { renderSinais(null); });
    };
    $("#repRun").onclick = function () {
      var d = $("#repInput").value.trim();
      if (!d) { toast("Informe o domínio."); return; }
      $("#repOut").innerHTML = "<span class=\"sub\">consultando…</span>";
      brFetch("/reputation?domain=" + encodeURIComponent(d)).then(function (r) { return r.json(); })
        .then(function (j) { showJson("#repOut", 200, j, "Reputação do domínio"); })
        .catch(function () { $("#repOut").innerHTML = "<div class=\"callout bad\">Bridge offline — o endpoint é público, mas o navegador pode ser barrado por CORS. Use o bridge.</div>"; });
    };

    // --- tabela spec vs real ---
    var rows = [
      ["Ads REST", "POST api.adspirer.ai/api/v1/tools/&lt;tool&gt;/execute com Bearer sk_live_", "Confere", "g"],
      ["Ads: preço", "“pode ter limites”", "Free = 15 chamadas/mês. Plus US$49/150. Pro US$99/600. Max US$199/3.000.", "y"],
      ["Ads: segurança", "token guardado “no seu backend”", "App é estático: o token fica no ambiente do bridge (Python), nunca na página.", "b"],
      ["Rally: pacote", "@andrehocsis/rally-mcp-server", "Confere — existe no npm, v1.0.0, 6 tools, 3 variáveis de env.", "g"],
      ["Rally: transporte", "“expor como endpoints REST no seu backend”", "Não vem pronto: é MCP sobre STDIO. O bridge faz a ponte JSON-RPC.", "y"],
      ["ProdIntel: busca", "“/api/signals?q=nome-do-produto”", "Não existe. O endpoint é GET sem query: devolve trending global. O cruzamento é feito no cliente.", "r"],
      ["ProdIntel: rate limit", "“público com rate limit por IP”", "Confere e é melhor: 40 req/min + cache CDN de 900s.", "g"],
      ["Ordem sugerida", "Sinais → Rally → Ads", "Concordo, com uma ressalva: sinais primeiro porque é o único que não exige credencial.", "b"]
    ];
    $("#specTable").innerHTML = "<thead><tr><th>Pilar</th><th>O que a spec dizia</th><th>O que é real (verificado 05/11/2026)</th></tr></thead><tbody>" +
      rows.map(function (r) { return "<tr><td><b>" + esc(r[0]) + "</b></td><td class=\"sub\">" + r[1] + "</td><td><span class=\"pill " + r[3] + "\" style=\"margin-right:6px\">" + (r[3] === "g" ? "confirma" : r[3] === "y" ? "ajuste" : r[3] === "r" ? "corrige" : "nota") + "</span>" + r[2] + "</td></tr>"; }).join("") + "</tbody>";
  }

  function renderSinais(j) {
    if (!j) {
      $("#sigOut").innerHTML = "<div class=\"callout bad\">Bridge offline. Alternativa: o endpoint é público e keyless — <span class=\"mono\">curl https://prodintel-two.vercel.app/api/signals</span>. O app não chama direto porque CORS pode barrar e você não quer depender disso.</div>";
      return;
    }
    var titles = [];
    (function walk(o) {
      if (!o) return;
      if (Array.isArray(o)) return o.forEach(walk);
      if (typeof o === "object") {
        if (o.title || o.name) titles.push({ t: String(o.title || o.name), s: o.score || o.points || o.momentum || null, src: o.source || o.type || "" });
        Object.keys(o).forEach(function (k) { if (k !== "title" && k !== "name") walk(o[k]); });
      }
    })(j);
    if (!titles.length) { showJson("#sigOut", 200, j, "Resposta recebida (formato não reconhecido)"); return; }
    titles = titles.slice(0, 24);
    var hay = titles.map(function (x) { return x.t.toLowerCase(); });
    var html = "<div class=\"card\" style=\"background:#0a0f16\"><div class=\"row between\"><b>" + titles.length + " sinais ao vivo</b><span class=\"pill g\">ProdIntel</span></div>" +
      "<div style=\"margin-top:10px;display:flex;flex-direction:column;gap:6px\">" +
      titles.map(function (x) {
        var match = radarSel && hay.indexOf(x.t.toLowerCase()) >= 0;
        var tokens = radarSel ? radarSel.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 3; }) : [];
        var near = tokens.length && tokens.some(function (w) { return x.t.toLowerCase().indexOf(w) >= 0; });
        return "<div class=\"kv\"><span style=\"font-size:13px\">" + esc(x.t) + (near ? " <span class=\"pill g\">relacionado</span>" : "") + "</span><span class=\"sub\">" + esc(x.src || "") + (x.s != null ? " · " + esc(x.s) : "") + "</span></div>";
      }).join("") + "</div>" +
      "<div class=\"callout info\" style=\"margin-top:12px\">" + (radarSel
        ? "Cruzando com <b>" + esc(radarSel) + "</b>. Nenhum sinal = ausência de dado, não validação negativa. Não invente."
        : "Selecione uma oferta no Radar para cruzar os sinais com o produto.") + "</div></div>";
    $("#sigOut").innerHTML = html;
  }



  /* ------------------------------ fluxo único ------------------------------ */
  function startPlan(nome) {
    var p = D.produtos.filter(function (x) { return x.nome === nome; })[0];
    if (!p) { toast("Oferta não encontrada."); return; }
    FX = FX || {};
    FX.oferta = p.nome;
    FX.canal = (D.briefingPorNicho[p.nicho] || {}).canal || "display";
    FX.dom = FX.dom || ""; FX.link = FX.link || "";
    saveFx();
    radarSel = p.nome;
    go("fluxo");
    renderFluxo();
    if (!FX.dom) toast("Falta o seu domínio no passo 2 — ele é gate obrigatório.");
  }

  /* estado do plano: vive em localStorage (_fx) e alimenta Radar, Gerador, Dashboard */
  var FX = null;
  var GATE_LABELS = ["Dados da oferta", "Estrutura própria", "Campanha + disclosure", "Compliance de copy"];
  var CANAL_FMT = { display: "advertorial", search: "review", "demand-gen": "vsl", native: "advertorial", meta: "quiz", tiktok: "quiz", bing: "review", email: "advertorial" };
  var CANAL_YAML = { display: "google_ads", search: "google_ads", "demand-gen": "google_ads", native: "native", meta: "meta_ads", tiktok: "tiktok_ads", bing: "microsoft_ads", email: "email" };
  var CANAL_LABEL = { display: "Google Display", search: "Google Search", "demand-gen": "Demand Gen/YouTube", native: "Native", meta: "Meta Ads", tiktok: "TikTok", bing: "Microsoft Ads", email: "Email/SEO" };
  var AD_NET = { google_ads: "display", meta_ads: "meta", tiktok_ads: "tiktok", microsoft_ads: "search", native: "native", email: "email" };

  function loadFx() { if (!FX) FX = LS.get("_fx", null); return FX; }
  function saveFx() { LS.set("_fx", FX); }
  function fxChannel() {
    var p = fxProduto();
    if (!p) return "display";
    var b = D.blueprints.filter(function (x) { return x.id === bpSel; })[0] || {};
    var map = { "Display": "display", "Search": "search", "Demand Gen": "demand-gen", "Native": "native", "Meta": "meta", "Microsoft": "bing", "Email": "email" };
    var k = Object.keys(map).filter(function (x) { return (b.canal || "").indexOf(x) === 0; })[0];
    return k ? map[k] : (D.briefingPorNicho[p.nicho] || {}).canal || "display";
  }
  function fxProduto() {
    if (!FX || !FX.oferta) return null;
    return D.produtos.filter(function (p) { return p.nome === FX.oferta; })[0] || null;
  }
  function fxScore() { var p = fxProduto(); return p ? scoreOf(p) : 0; }

  function fxGates() {
    var p = fxProduto();
    var yaml = FX && FX.yaml ? FX.yaml : "";
    var copy = (FX && FX.presellHtml ? FX.presellHtml : "") + (FX && FX.presellText ? FX.presellText : "");
    var dom = fxDomOk();
    var y = validarYamlTexto(yaml);
    var ftc = ftcCheck(copy);
    return [
      { label: GATE_LABELS[0], ok: !!p, detail: p ? ("score " + scoreOf(p) + " · EPC " + money(p.epc) + " · risco " + riscoLabel(p.risco)) : "nenhuma oferta escolhida", acao: "radar" },
      { label: GATE_LABELS[1], ok: !!dom, detail: dom ? ("domínio próprio: " + FX.dom) : "informe seu domínio (não use subdomínio do produtor)", acao: "fluxo" },
      { label: GATE_LABELS[2], ok: !!yaml && y.ok, detail: yaml ? (y.fail ? y.fail + " bloqueio(s) no YAML" : (y.warn ? "válido com " + y.warn + " aviso(s)" : "YAML válido · campanha pausada")) : "gere o YAML do plano", acao: "fluxo" },
      { label: GATE_LABELS[3], ok: !!copy && ftc.ok, detail: copy ? (ftc.ok ? "disclosure + termos + contato ok" : "falta: " + ftc.fails.join(", ")) : "gere a presell", acao: "gerador" }
    ];
  }
  function fxDomOk() {
    if (!FX || !FX.dom) return false;
    var d = FX.dom.replace(/^https?:\/\//, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(d)) return false;
    var prod = fxProduto();
    if (prod) {
      var stop = ["the", "with", "from", "and", "for", "plus", "program", "system"];
      var token = prod.nome.toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3 && stop.indexOf(w) < 0; }).join("");
      var domCompact = d.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (token.length >= 5 && domCompact.indexOf(token) >= 0) return false;
    }
    return true;
  }

  function renderFluxo() {
    loadFx();
    var p = fxProduto();
    var ch = fxChannel();

    // passos
    var steps = ["Oferta", "Briefing", "Presell", "YAML validado", "UTM", "Execução"];
    $("#fxSteps").innerHTML = steps.map(function (x, i) {
      var done = (i === 0 && p) || (i >= 2 && FX && FX.yaml);
      return "<div class=\"pill " + (done ? "g" : "") + "\">" + (i + 1) + " · " + esc(x) + "</div>" + (i < steps.length - 1 ? "<span class=\"dim\">→</span>" : "");
    }).join("") + "<span class=\"pill b\" style=\"margin-left:auto\">" + esc(CANAL_LABEL[ch] || ch) + "</span>";
    $("#fxHeader").textContent = p ? (p.nome + " · " + (CANAL_LABEL[ch] || ch)) : "sem plano ativo";

    // select de ofertas
    if (!$("#fxOffer").options.length) {
      $("#fxOffer").innerHTML = D.produtos.slice().sort(function (a, b) { return scoreOf(b) - scoreOf(a); }).map(function (x) {
        return "<option value=\"" + esc(x.nome) + "\" " + (p && p.nome === x.nome ? "selected" : "") + ">" + esc(x.nome) + " — " + esc(x.rede) + " (score " + scoreOf(x) + ")</option>";
      }).join("");
    }
    $("#fxOfferPill").textContent = p ? ("score " + scoreOf(p)) : "nenhuma";
    $("#fxOfferPill").className = "pill " + (p ? (scoreOf(p) >= 70 ? "g" : "b") : "");
    $("#fxOfferInfo").innerHTML = p ? "<div class=\"card\" style=\"background:#0a0f16\">" +
      "<div class=\"grid g2\">" + mini("EPC", money(p.epc), "por clique") + mini("APV", money(p.apv), "ticket médio") +
      mini("CVR hop", p.cvr.toFixed(2) + "%", "clique → venda") + mini("Risco", riscoLabel(p.risco), p.rede) + "</div>" +
      "<div class=\"note\" style=\"margin-top:10px\">Formato de presell sugerido para " + esc(CANAL_LABEL[ch]) + ": <b>" + esc(CANAL_FMT[ch]) + "</b>.</div></div>" : "<div class=\"callout\">Escolha uma oferta (ou clique numa linha do Radar) para começar.</div>";

    // selects de formato/ângulo
    $("#fxFmt").innerHTML = Object.keys(D.presellTemplates).map(function (k) { return "<option value=\"" + k + "\">" + esc(D.presellTemplates[k].nome) + "</option>"; }).join("");
    $("#fxAng").innerHTML = Object.keys(D.hooksPorAngulo).map(function (k) { return "<option value=\"" + k + "\">" + esc(k) + "</option>"; }).join("");

    $("#fxPick").onclick = function () {
      FX = FX || {}; FX.oferta = $("#fxOffer").value; saveFx(); prefillFx(true); renderFluxo(); toast("Oferta do plano: " + FX.oferta);
    };
    $("#fxFill").onclick = function () { prefillFx(true); toast("Briefing preenchido pelo nicho"); };
    $("#fxBuild").onclick = buildPlan;

    if (document.activeElement !== $("#fxProd") && p) prefillFx(false);
    renderFxResult();
  }

  /* preenche o briefing: force=true sobrescreve o que o usuário editou */
  function prefillFx(force) {
    var p = fxProduto(); if (!p) return;
    var b = D.briefingPorNicho[p.nicho] || {};
    var ch = fxChannel();
    function set(id, val) { var el = $("#" + id); if (force || !el.value || el.dataset.auto === "1") { el.value = val == null ? "" : val; el.dataset.auto = "1"; } }
    set("fxProd", p.nome);
    set("fxPub", b.pub); set("fxMec", b.mec); set("fxBen", b.ben);
    var fmt = b.fmt || CANAL_FMT[ch] || "advertorial";
    set("fxFmt", CANAL_FMT[ch] || fmt);
    var angs = angulosPara(p);
    set("fxAng", angs[0]);
    if (FX && FX.dom) set("fxDom", FX.dom);
    if (FX && FX.link) set("fxLink", FX.link);
  }

  function buildPlan() {
    var p = fxProduto();
    if (!p) { toast("Escolha uma oferta primeiro."); return; }
    var dom = ($("#fxDom").value || "").trim();
    var link = ($("#fxLink").value || "").trim();
    FX = FX || {};
    FX.oferta = p.nome; FX.dom = dom; FX.link = link;
    FX.pub = $("#fxPub").value; FX.mec = $("#fxMec").value; FX.ben = $("#fxBen").value;
    FX.fmt = $("#fxFmt").value; FX.ang = $("#fxAng").value;
    FX.canal = fxChannel();
    FX.prod = $("#fxProd").value || p.nome;

    // 1) PRESELL — usa o mesmo gerador do app
    $$("#gLang option").forEach(function (o) { o.selected = o.value === "en"; });
    $("#gProd").value = FX.prod; $("#gNicho").value = p.nicho;
    $("#gPub").value = FX.pub; $("#gMec").value = FX.mec; $("#gBen").value = FX.ben;
    $("#gAng").value = FX.ang; $("#gFmt").value = FX.fmt;
    $("#gLink").value = link || "https://SEU-LINK-DE-AFILIADO";
    $("#gDom").value = dom || "https://seu-dominio.com";
    gerar();
    FX.presellHtml = $("#gCode").textContent || "";
    FX.presellPreview = $("#gPreview").innerHTML || "";

    // 2) UTM + sub-id
    var slug = FX.prod.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    var subid = "bofu_" + FX.ang + "_" + dateStr;
    var utm = (dom || "https://seu-dominio.com").replace(/\/$/, "") + "/" + slug +
      "?utm_source=" + (FX.canal === "meta" ? "meta" : FX.canal === "native" ? "native" : "google") +
      "&utm_medium=cpc&utm_campaign=bofu-" + slug + "&utm_content=" + encodeURIComponent(FX.ang) + "&utm_id=" + dateStr;
    FX.utm = utm; FX.subid = subid;
    FX.affLink = (link || "https://hop.clickbank.net/?affiliate=SEUID&vendor=SEUVENDOR") +
      (link && link.indexOf("?") >= 0 ? "&" : "?") + "tid=" + subid;

    // 3) YAML validado
    var rede = /clickbank/i.test(p.rede) ? "clickbank" : /buygoods/i.test(p.rede) ? "buygoods" : p.rede.toLowerCase();
    var cpcMax = +(Math.min(6, Math.max(2.5, p.epc * 0.7)).toFixed(2));
    var daily = FX.canal === "meta" ? 30 : FX.canal === "native" ? 50 : 35;
    var terms = [p.nome.toLowerCase(), p.nome.toLowerCase() + " review", "where to buy " + p.nome.toLowerCase(), p.nome.toLowerCase() + " official website"];
    FX.yaml = [
      "campaign:",
      "  name: bofu-" + slug + "-" + FX.canal,
      "  platform: " + (CANAL_YAML[FX.canal] || "google_ads"),
      "  status: PAUSED",
      "  budget:",
      "    daily: " + daily,
      "    currency: " + (FX.canal === "native" ? "USD" : "BRL"),
      "  bidding: maximize_clicks",
      "  max_cpc: " + cpcMax,
      "  network: " + FX.canal,
      "  targeting:",
      "    custom_intent: [" + terms.map(function (t) { return "\"" + t + "\""; }).join(", ") + "]",
      "  exclusions:",
      "    placements: [" + (FX.canal === "meta" ? "audience_network" : "apps") + ", kids_channels]",
      "  landing: " + (dom || "https://seu-dominio.com") + "/" + slug,
      "  affiliate:",
      "    network: " + rede,
      "    subid: " + subid,
      "  compliance:",
      "    disclosure_above_fold: true",
      "    owner_domain: " + (fxDomOk() ? "true" : "false")
    ].join("\n");

    FX.budget = daily;
    var sig = [FX.oferta, FX.ang, FX.fmt, FX.canal].join("|");
    if (!FX.id || (FX.sig && FX.sig !== sig)) { FX.id = null; FX.sp = FX.cl = FX.out = FX.vd = 0; }
    FX.sig = sig;
    saveFx();
    histUpsert(FX, "fluxo");
    syncDownstream();
    renderFluxo();
    toast("Plano montado — revise os gates abaixo");
  }

  /* espelha o plano nas outras telas (Radar, Gerador, Dashboard) */
  function syncDownstream() {
    if (!FX) return;
    radarSel = FX.oferta; drawRadar(); drawRadarDetail();
    $("#gCode").innerHTML = "<div class=\"rel\"><pre>" + esc(FX.presellHtml) + "</pre></div>";
    $("#gCode").style.display = "block";
    if ($("#dbYaml")) { $("#dbYaml").value = FX.yaml; $("#dbYamlOut").innerHTML = ""; }
    if ($("#dbCopy")) $("#dbCopy").value = FX.presellHtml;
    if ($("#dbuOffer")) { $("#dbuOffer").value = FX.oferta.toLowerCase().replace(/[^a-z0-9]+/g, "-"); $("#dbuAngle").value = FX.ang; }
  }

  function renderFxResult() {
    var box = $("#fxResult");
    if (!FX || !FX.yaml) {
      box.innerHTML = "<div class=\"callout info\">O fluxo ainda não foi executado. Escolha a oferta, confira o briefing e clique em <b>Montar plano completo</b> — ele gera presell, YAML validado e UTM de uma vez.</div>";
      return;
    }
    var gates = fxGates();
    var g = validarYamlTexto(FX.yaml);
    var ftc = ftcCheck(FX.presellHtml);
    var yamlRows = g.rows.map(function (c) {
      return "<div class=\"kv\"><span>" + esc(c.label) + "</span><span class=\"pill " + (c.ok ? "g" : c.sev === "bloqueia" ? "r" : "y") + "\">" + (c.ok ? "passou" : c.sev === "bloqueia" ? "bloqueia" : "atenção") + "</span></div>";
    }).join("");

    box.innerHTML =
      "<div class=\"card\" style=\"border-color:" + (gates.every(function (x) { return x.ok; }) ? "#38e0a355" : "#ffb52044") + "\">" +
        "<div class=\"row between\"><h2 style=\"margin:0\">Plano: " + esc(FX.oferta) + "</h2>" +
        "<span class=\"pill " + (gates.every(function (x) { return x.ok; }) ? "g" : g.ok ? "y" : "r") + "\">" +
        (gates.every(function (x) { return x.ok; }) ? "PRONTO PARA SUBIR" : g.ok ? "RESSALVAS" : "BLOQUEADO") + "</span></div>" +
        "<div class=\"grid g4\" style=\"margin-top:14px\">" + gates.map(function (x) {
          return "<div style=\"background:#" + (x.ok ? "38e0a30c" : "ff5d6c0c") + ";border:1px solid " + (x.ok ? "#38e0a344" : "#ff5d6c44") + ";border-radius:10px;padding:11px\">" +
            "<div class=\"small-label\">" + (x.ok ? "✓ " : "✕ ") + esc(x.label) + "</div>" +
            "<div class=\"sub\" style=\"margin-top:5px;font-size:11.5px\">" + esc(x.detail) + "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      "<div class=\"grid g2\" style=\"margin-top:14px;align-items:start\">" +
        "<div class=\"card\">" +
          "<div class=\"row between\"><h3 style=\"margin:0\">Presell gerada</h3><span class=\"pill b\">" + esc(D.presellTemplates[FX.fmt] ? D.presellTemplates[FX.fmt].nome : FX.fmt) + "</span></div>" +
          "<div class=\"sub\" style=\"margin:6px 0 10px\">" + (ftc.ok ? "Compliance de copy: ok nos 4 gates." : "Compliance de copy: falta " + esc(ftc.fails.join(", "))) + "</div>" +
          "<div class=\"preview\" style=\"max-height:320px;font-size:14px\">" + (FX.presellPreview || "<i>preview indisponível — use o HTML</i>") + "</div>" +
          "<div class=\"row\" style=\"margin-top:12px\"><button class=\"btn sm\" id=\"fxCpHtml\">Copiar HTML</button><button class=\"btn sm ghost\" data-go=\"gerador\">Abrir no Gerador</button></div>" +
        "</div>" +
        "<div>" +
          "<div class=\"card\">" +
            "<div class=\"row between\"><h3 style=\"margin:0\">YAML validado (dry-run)</h3><span class=\"pill " + (g.fail ? "r" : g.warn ? "y" : "g") + "\">" + (g.fail ? g.fail + " bloqueio(s)" : g.warn ? g.warn + " aviso(s)" : "validado") + "</span></div>" +
            "<div style=\"margin-top:10px\">" + yamlRows + "</div>" +
            "<div class=\"row\" style=\"margin-top:10px\"><button class=\"btn sm\" id=\"fxCpYaml\">Copiar YAML</button><button class=\"btn sm ghost\" data-go=\"dashboard\">Abrir no Dashboard</button></div>" +
          "</div>" +
          "<div class=\"card\" style=\"margin-top:14px\">" +
            "<h3>UTM e sub-id</h3>" +
            "<div class=\"small-label\" style=\"margin-top:8px\">URL do anúncio (sua presell)</div><pre>" + esc(FX.utm) + "</pre>" +
            "<div class=\"small-label\" style=\"margin-top:10px\">Link de afiliado com sub-id</div><pre>" + esc(FX.affLink) + "</pre>" +
            "<div class=\"row\" style=\"margin-top:10px\"><button class=\"btn sm\" id=\"fxCpUtm\">Copiar UTM</button><button class=\"btn sm ghost\" id=\"fxCpAff\">Copiar afiliado</button></div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      "<div class=\"card\" style=\"margin-top:14px\">" +
        "<h3>Execução</h3>" +
        "<p class=\"sub\">A campanha nasce <b>pausada</b>. O bridge fala com a Adspirer via REST; sem token ele avisa e nada é enviado.</p>" +
        "<div class=\"row\" style=\"margin-top:10px\">" +
          "<button class=\"btn pri\" id=\"fxExec\">Criar campanha pausada (via bridge)</button>" +
          "<button class=\"btn\" data-go=\"integracoes\">Ver integrações</button>" +
          "<button class=\"btn ghost\" id=\"fxExecMcp\">Copiar prompt para o MCP</button>" +
        "</div>" +
        "<div id=\"fxExecOut\" style=\"margin-top:12px\"></div>" +
      "</div>" +

      "<div class=\"card\" style=\"margin-top:14px;border-color:#22b8ff44\">" +
        "<div class=\"row between\"><h3 style=\"margin:0\">Registrar e diagnosticar</h3><span class=\"pill b\">" + esc(FX.id || "plano") + "</span></div>" +
        "<p class=\"sub\" style=\"margin-top:6px\">Rode o teste, volte com os números e compare ângulos por RPC no histórico. O plano já está salvo — nada recomeça do zero.</p>" +
        "<div class=\"row\" style=\"margin-top:10px\"><button class=\"btn pri\" id=\"fxHist\">Registrar números deste plano</button><button class=\"btn\" id=\"fxCop\">Diagnosticar no Copiloto</button><button class=\"btn ghost\" data-go=\"historico\">Histórico completo</button></div>" +
        "<div id=\"fxHistOut\" style=\"margin-top:10px\"></div>" +
      "</div>" +

      "<div class=\"card\" style=\"margin-top:14px;background:#0a0f16\">" +
        "<h3>Sequência manual (o que fazer agora)</h3>" +
        "<div class=\"step\"><div class=\"n\">1</div><div style=\"font-size:13.5px\">Publique a presell no seu domínio (<span class=\"mono\">" + esc(FX.utm.split("?")[0]) + "</span>) e troque os depoimentos placeholder por reais.</div></div>" +
        "<div class=\"step\"><div class=\"n\">2</div><div style=\"font-size:13.5px\">Teste o caminho completo do clique em janela anônima e no celular — o link de afiliado precisa cair na página do produtor com o sub-id <span class=\"mono\">" + esc(FX.subid) + "</span>.</div></div>" +
        "<div class=\"step\"><div class=\"n\">3</div><div style=\"font-size:13.5px\">Crie a campanha com o YAML acima (ou pelo botão da Adspirer) e confirme que ela está <b>pausada</b>.</div></div>" +
        "<div class=\"step\"><div class=\"n\">4</div><div style=\"font-size:13.5px\">Só então ative, com orçamento cirúrgico. Em 300 cliques, volte ao Copiloto para decidir escalar/ajustar/cortar.</div></div>" +
      "</div>";

    $("#fxCpHtml").onclick = function () { copyText(FX.presellHtml, "HTML copiado"); };
    $("#fxCpYaml").onclick = function () { copyText(FX.yaml, "YAML copiado"); };
    $("#fxCpUtm").onclick = function () { copyText(FX.utm, "UTM copiada"); };
    $("#fxCpAff").onclick = function () { copyText(FX.affLink, "Link de afiliado copiado"); };
    if ($("#fxHist")) $("#fxHist").onclick = function () {
      if (!FX.id) histUpsert(FX, "fluxo");
      hsSel = FX.id; go("historico"); renderHistorico();
    };
    if ($("#fxCop")) $("#fxCop").onclick = cpFromPlan;
    $("#fxExecMcp").onclick = function () {
      copyText("Use a tool create_campaign da Adspirer com esta configuração (crie PAUSADA):\n\n" + FX.yaml, "Prompt copiado");
    };
    $("#fxExec").onclick = function () {
      var out = $("#fxExecOut");
      if (!gates.every(function (x) { return x.ok; })) {
        out.innerHTML = "<div class=\"callout bad\">Gate bloqueado: " + esc(gates.filter(function (x) { return !x.ok; }).map(function (x) { return x.label; }).join(", ")) + ". Corrija antes de executar — subir campanha sem disclosure é o caminho mais curto para reprovação em série.</div>";
        return;
      }
      var payload = {
        platform: (CANAL_YAML[FX.canal] || "google_ads"),
        name: "BM — " + FX.oferta + " — " + FX.canal,
        budget: { amount: 20, currency: "USD" },
        status: "PAUSED",
        landing_url: FX.utm,
        tracking: { subid: FX.subid }
      };
      out.innerHTML = "<span class=\"sub\">enviando ao bridge…</span>";
      fetch(brBase() + "/ads/create_campaign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.text().then(function (t) { return { s: r.status, t: t }; }); })
        .then(function (res) {
          var parsed; try { parsed = JSON.parse(res.t); } catch (e) { parsed = res.t; }
          showJson("#fxExecOut", res.s, parsed, res.s < 300 ? "Campanha criada PAUSADA — ative só depois de revisar" : "Bridge respondeu HTTP " + res.s);
        })
        .catch(function () {
          out.innerHTML = "<div class=\"callout bad\">Bridge offline — nada foi enviado. Alternativa: use o botão <b>Copiar prompt para o MCP</b> e execute pelo seu agente. O plano (presell + YAML + UTM) já está pronto e salvo.</div>";
        });
    };
    bindGo(box);
  }


  /* ------------------------------ histórico de planos ------------------------------ */
  var hsSel = null;
  function histLoad() { return LS.get("planos", []); }
  function histSave(arr) { LS.set("planos", arr); }

  function histUpsert(fx, origem) {
    if (!fx || !fx.oferta) return null;
    var arr = histLoad();
    var id = fx.id || ("p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    fx.id = id;
    var p = D.produtos.filter(function (x) { return x.nome === fx.oferta; })[0] || {};
    var rec = {
      id: id,
      data: new Date().toISOString().slice(0, 10),
      oferta: fx.oferta, rede: p.rede || "", nicho: p.nicho || "",
      angulo: fx.ang || "", formato: fx.fmt || "", canal: fx.canal || "",
      canalLabel: CANAL_LABEL[fx.canal] || fx.canal || "",
      dom: fx.dom || "", subid: fx.subid || "", utm: fx.utm || "",
      yaml: fx.yaml || "",
      comm: p.comissao || 0,
      budget: fx.budget || 0,
      sp: fx.sp || 0, cl: fx.cl || 0, out: fx.out || 0, vd: fx.vd || 0,
      origem: origem || "fluxo"
    };
    var i = arr.map(function (x) { return x.id; }).indexOf(id);
    if (i >= 0) arr[i] = Object.assign(arr[i], rec); else arr.unshift(rec);
    histSave(arr);
    saveFx();
    return id;
  }

  function histRpc(r) {
    if (!r.cl) return null;
    return (r.vd * r.comm) / r.cl;
  }

  function renderHistorico() {
    var arr = histLoad();
    var ativos = arr.filter(function (r) { return r.cl > 0; });
    var totalGasto = arr.reduce(function (a, r) { return a + (+r.sp || 0); }, 0);
    var totalVendas = arr.reduce(function (a, r) { return a + (+r.vd || 0); }, 0);
    var totalComm = arr.reduce(function (a, r) { return a + (+r.vd || 0) * (+r.comm || 0); }, 0);
    var comVenda = ativos.filter(function (r) { return (+r.vd || 0) > 0; });
    var melhor = comVenda.slice().sort(function (a, b) { return (histRpc(b) || 0) - (histRpc(a) || 0); })[0];
    $("#hsStats").innerHTML =
      stat("Planos", arr.length, ativos.length + " com números") +
      stat("Gasto acumulado", money(totalGasto), "soma dos testes") +
      stat("Receita acumulada", money(totalComm), totalVendas + " venda(s)") +
      stat("Melhor RPC", melhor ? money(histRpc(melhor)) : "—", melhor ? (melhor.oferta + " · " + melhor.angulo) : (ativos.length ? "nenhum plano com venda ainda" : "registre números"));

    // por ângulo
    var byAng = {};
    arr.forEach(function (r) {
      if (!r.cl) return;
      var a = r.angulo || "(sem ângulo)";
      var o = byAng[a] || (byAng[a] = { ang: a, cl: 0, sp: 0, vd: 0, rec: 0, n: 0, ofertas: {} });
      o.cl += +r.cl; o.sp += +r.sp; o.vd += +r.vd; o.rec += (+r.vd) * (+r.comm); o.n++;
      o.ofertas[r.oferta] = 1;
    });
    var angs = Object.keys(byAng).map(function (k) { return byAng[k]; }).sort(function (a, b) { return (b.rec / b.cl) - (a.rec / a.cl); });
    if (!angs.length) {
      $("#hsAngulo").innerHTML = "<tbody><tr><td class=\"sub\" style=\"padding:14px\">Sem números registrados ainda. Monte um plano, clique em <b>Registrar no histórico</b> e volte com os dados do teste.</td></tr></tbody>";
    } else {
      var maxRpc = Math.max.apply(null, angs.map(function (a) { return a.rec / a.cl; }));
      $("#hsAngulo").innerHTML = "<thead><tr><th>Ângulo</th><th class=\"num\">Cliques</th><th class=\"num\">Gasto</th><th class=\"num\">Vendas</th><th class=\"num\">RPC</th><th class=\"num\">RPC ÷ CPC</th><th>Força</th><th class=\"num\">Planos</th></tr></thead><tbody>" +
        angs.map(function (a) {
          var rpc = a.rec / a.cl, cpc = a.sp / a.cl, ratio = cpc ? rpc / cpc : 0;
          var w = maxRpc ? Math.round(rpc / maxRpc * 100) : 0;
          return "<tr><td><b>" + esc(a.ang) + "</b><div class=\"sub\">" + Object.keys(a.ofertas).length + " oferta(s)</div></td>" +
            "<td class=\"num\">" + a.cl + "</td><td class=\"num\">" + money(a.sp) + "</td><td class=\"num\">" + a.vd + "</td>" +
            "<td class=\"num\">" + money(rpc) + "</td>" +
            "<td class=\"num\"><span class=\"pill " + (ratio >= 1.3 ? "g" : ratio >= 0.8 ? "" : ratio >= 0.4 ? "y" : "r") + "\">" + ratio.toFixed(2) + "×</span></td>" +
            "<td><div class=\"bar\" style=\"width:90px\"><i style=\"width:" + w + "%\"></i></div></td>" +
            "<td class=\"num\">" + a.n + "</td></tr>";
        }).join("") + "</tbody>";
    }

    // tabela de planos
    if (!arr.length) {
      $("#hsTable").innerHTML = "<tbody><tr><td class=\"sub\" style=\"padding:14px\">Nenhum plano salvo. Vá em <b>Executar plano</b> e monte o primeiro.</td></tr></tbody>";
    } else {
      $("#hsTable").innerHTML = "<thead><tr><th>Data</th><th>Oferta</th><th>Ângulo</th><th>Canal</th><th class=\"num\">Cliques</th><th class=\"num\">Vendas</th><th class=\"num\">RPC</th><th class=\"num\">Lucro</th><th></th></tr></thead><tbody>" +
        arr.map(function (r) {
          var rpc = histRpc(r);
          var lucro = (+r.vd * +r.comm) - (+r.sp);
          return "<tr class=\"" + (hsSel === r.id ? "sel" : "") + "\" data-hs=\"" + esc(r.id) + "\">" +
            "<td class=\"sub\">" + esc(r.data) + "</td>" +
            "<td><b>" + esc(r.oferta) + "</b><div class=\"sub\">" + esc(r.rede) + " · " + esc(r.canalLabel || r.canal) + "</div></td>" +
            "<td><span class=\"pill p\">" + esc(r.angulo || "—") + "</span></td>" +
            "<td class=\"sub\">" + esc(r.formato || "—") + "</td>" +
            "<td class=\"num\">" + (+r.cl || 0) + "</td>" +
            "<td class=\"num\">" + (+r.vd || 0) + "</td>" +
            "<td class=\"num\">" + (rpc == null ? "<span class=\"dim\">—</span>" : money(rpc)) + "</td>" +
            "<td class=\"num\">" + (r.sp || r.vd ? (lucro >= 0 ? "+" : "−") + money(Math.abs(lucro)) : "<span class=\"dim\">—</span>") + "</td>" +
            "<td><button class=\"btn sm ghost\" data-hsload=\"" + esc(r.id) + "\">abrir</button></td></tr>";
        }).join("") + "</tbody>";
      $$("[data-hs]").forEach(function (tr) {
        tr.onclick = function (e) { if (e.target.dataset.hsload) return; hsSel = tr.dataset.hs; renderHistorico(); };
      });
      $$("[data-hsload]").forEach(function (b) {
        b.onclick = function (e) { e.stopPropagation(); openPlan(b.dataset.hsload); };
      });
    }
    drawHsEdit();
    $("#hsExport").onclick = function () { download("historico-planos.json", JSON.stringify(histLoad(), null, 2), "application/json"); };
    $("#hsImportBtn").onclick = function () { $("#hsImport").click(); };
    $("#hsImport").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var data = JSON.parse(rd.result);
          if (!Array.isArray(data)) throw new Error("formato");
          var cur = histLoad();
          data.forEach(function (d) { if (d && d.id && !cur.some(function (x) { return x.id === d.id; })) cur.push(d); });
          histSave(cur); renderHistorico(); toast("Histórico importado");
        } catch (err) { toast("Arquivo inválido"); }
      };
      rd.readAsText(f);
    };
    $("#hsClear").onclick = function () {
      if (!confirm("Apagar todo o histórico de planos? Isso não pode ser desfeito.")) return;
      LS.set("planos", []); hsSel = null; renderHistorico();
    };
  }

  function drawHsEdit() {
    var box = $("#hsEdit");
    var r = histLoad().filter(function (x) { return x.id === hsSel; })[0];
    if (!r) { box.innerHTML = "<div class=\"callout info\">Clique numa linha do histórico para registrar os números do teste (cliques, vendas, gasto) ou reabrir o plano.</div>"; return; }
    box.innerHTML = "<div class=\"card\"><div class=\"row between\"><h3 style=\"margin:0\">Números do teste — " + esc(r.oferta) + " · " + esc(r.angulo) + "</h3><span class=\"pill b\">" + esc(r.data) + "</span></div>" +
      "<div class=\"grid g4\" style=\"margin-top:12px\">" +
        "<div class=\"field\"><label class=\"f\">Gasto (US$)</label><input id=\"hsSp\" type=\"number\" step=\"0.01\" value=\"" + (+r.sp || 0) + "\"></div>" +
        "<div class=\"field\"><label class=\"f\">Cliques</label><input id=\"hsCl\" type=\"number\" value=\"" + (+r.cl || 0) + "\"></div>" +
        "<div class=\"field\"><label class=\"f\">Saídas p/ oferta</label><input id=\"hsOut\" type=\"number\" value=\"" + (+r.out || 0) + "\"></div>" +
        "<div class=\"field\"><label class=\"f\">Vendas</label><input id=\"hsVd\" type=\"number\" value=\"" + (+r.vd || 0) + "\"></div>" +
      "</div>" +
      "<div class=\"row\"><button class=\"btn pri\" id=\"hsSave\">Salvar números</button>" +
        "<button class=\"btn\" id=\"hsReopen\">Reabrir plano no fluxo</button>" +
        "<button class=\"btn ghost\" id=\"hsDiag\">Diagnosticar no Copiloto</button>" +
        "<button class=\"btn ghost danger\" id=\"hsDel\">Remover</button></div>" +
      "<div id=\"hsCalc\" style=\"margin-top:12px\"></div>" +
      "<div class=\"note\">Comissão considerada: " + money(+r.comm || 0) + " (do Radar). Sub-id: <span class=\"mono\">" + esc(r.subid || "—") + "</span></div></div>";
    hsCalcUpdate(r);
    ["#hsSp", "#hsCl", "#hsOut", "#hsVd"].forEach(function (k) { $(k).oninput = function () { hsCalcUpdate(r, true); }; });
    $("#hsSave").onclick = function () {
      var arr = histLoad();
      var i = arr.map(function (x) { return x.id; }).indexOf(r.id);
      if (i < 0) return;
      arr[i].sp = +$("#hsSp").value || 0; arr[i].cl = +$("#hsCl").value || 0;
      arr[i].out = +$("#hsOut").value || 0; arr[i].vd = +$("#hsVd").value || 0;
      histSave(arr);
      if (FX && FX.id === r.id) { FX.sp = arr[i].sp; FX.cl = arr[i].cl; FX.out = arr[i].out; FX.vd = arr[i].vd; saveFx(); }
      renderHistorico(); toast("Números salvos");
    };
    $("#hsReopen").onclick = function () { openPlan(r.id); };
    $("#hsDiag").onclick = function () { cpFromHist(r); };
    $("#hsDel").onclick = function () {
      if (!confirm("Remover este plano do histórico?")) return;
      histSave(histLoad().filter(function (x) { return x.id !== r.id; }));
      hsSel = null; renderHistorico();
    };
  }

  function hsCalcUpdate(r, fromInputs) {
    var sp = fromInputs ? (+$("#hsSp").value || 0) : (+r.sp || 0);
    var cl = fromInputs ? (+$("#hsCl").value || 0) : (+r.cl || 0);
    var vd = fromInputs ? (+$("#hsVd").value || 0) : (+r.vd || 0);
    var comm = +r.comm || 0;
    var box = $("#hsCalc");
    if (!box) return;
    if (!cl) { box.innerHTML = "<div class=\"callout\">Informe cliques para calcular RPC.</div>"; return; }
    var rpc = (vd * comm) / cl, cpc = sp / cl, ratio = cpc ? rpc / cpc : 0;
    var lucro = vd * comm - sp;
    box.innerHTML = "<div class=\"grid g4\">" +
      mini("CPC", money(cpc), "gasto ÷ cliques") +
      mini("RPC", money(rpc), "receita por clique") +
      mini("RPC ÷ CPC", ratio.toFixed(2) + "×", ratio >= 1 ? "lucrativo" : "prejuízo") +
      mini("Lucro", (lucro >= 0 ? "+" : "−") + money(Math.abs(lucro)), "comissão − gasto") +
      "</div>";
  }

  /* reabre um plano salvo no fluxo */
  function openPlan(id) {
    var r = histLoad().filter(function (x) { return x.id === id; })[0];
    if (!r) { toast("Plano não encontrado."); return; }
    FX = {
      id: r.id, oferta: r.oferta, canal: r.canal, ang: r.angulo, fmt: r.formato,
      dom: r.dom, utm: r.utm, subid: r.subid, yaml: r.yaml,
      affLink: r.utm, sp: r.sp, cl: r.cl, out: r.out, vd: r.vd
    };
    saveFx();
    go("fluxo");
    renderFluxo();
    toast("Plano de " + r.oferta + " reaberto");
  }

  /* envia o plano (ou o histórico) para o Copiloto de decisão */
  function cpFromPlan() {
    var f = loadFx();
    if (!f || !f.oferta) { toast("Monte um plano primeiro."); return; }
    // sobrescreve: o plano manda no canal, na comissão e no orçamento
    $("#cpSpend").value = f.sp ? f.sp : "";
    $("#cpSpend").placeholder = f.budget ? "orçamento do plano: US$ " + f.budget : "gasto real";
    $("#cpClicks").value = f.cl || "";
    $("#cpOut").value = f.out || "";
    $("#cpSales").value = f.vd || "";
    var p = fxProduto();
    $("#cpComm").value = p ? p.comissao : "";
    if ($("#cpDays")) $("#cpDays").value = 3;
    var mapCh = { display: "Display", search: "Search", "demand-gen": "Demand Gen/YouTube", native: "Native", meta: "Meta", tiktok: "TikTok", bing: "Microsoft Ads" };
    if ($("#cpChan") && mapCh[f.canal]) $("#cpChan").value = mapCh[f.canal];
    go("copiloto");
    if (f.cl && f.sp) { runCopiloto(); toast("Copiloto preenchido e diagnosticado"); }
    else {
      $("#cpOut2").innerHTML = "<div class=\"callout info\">Plano carregado: <b>" + esc(f.oferta) + "</b> · " + esc(CANAL_LABEL[f.canal] || f.canal) + " · orçamento de teste US$ " + (f.budget || "—") + ". Rode a campanha e preencha gasto, cliques e vendas para o diagnóstico — ou registre os números no <b>Histórico</b>.</div>";
      toast("Plano carregado — falta o gasto e os cliques");
    }
  }
  function cpFromHist(r) {
    $("#cpSpend").value = r.sp || ""; $("#cpClicks").value = r.cl || "";
    $("#cpOut").value = r.out || ""; $("#cpSales").value = r.vd || "";
    $("#cpComm").value = r.comm || "";
    if ($("#cpImpr")) $("#cpImpr").value = "";
    if ($("#cpDays")) $("#cpDays").value = 3;
    var mapCh = { display: "Display", search: "Search", "demand-gen": "Demand Gen/YouTube", native: "Native", meta: "Meta", tiktok: "TikTok", bing: "Microsoft Ads" };
    if ($("#cpChan") && mapCh[r.canal]) $("#cpChan").value = mapCh[r.canal];
    go("copiloto");
    runCopiloto();
    toast("Copiloto preenchido com o histórico");
  }

  /* banner do plano ativo na página do Copiloto */
  function renderCopilotPlan() {
    var f = loadFx();
    var box = $("#cpPlan");
    if (!box) return;
    if (!f || !f.oferta) {
      box.innerHTML = "<div class=\"callout info\">Nenhum plano ativo. Monte um na aba <b>Executar plano</b> e o Copiloto já chega preenchido com canal, comissão e orçamento — sem digitar tudo de novo.</div>";
      return;
    }
    var p = fxProduto();
    box.innerHTML = "<div class=\"card\" style=\"background:#0a0f16;border-color:#22b8ff44;margin-bottom:16px\">" +
      "<div class=\"row between\"><div><div class=\"small-label\">Plano ativo</div><b>" + esc(f.oferta) + "</b> · " + esc(CANAL_LABEL[f.canal] || f.canal) + " · ângulo " + esc(f.ang || "—") + "</div>" +
      "<div class=\"row\"><button class=\"btn sm pri\" id=\"cpFill\">Preencher com o plano</button><button class=\"btn sm ghost\" data-go=\"fluxo\">Ver plano</button><button class=\"btn sm ghost\" data-go=\"historico\">Histórico</button></div></div>" +
      "<div class=\"sub\" style=\"margin-top:8px\">" + (f.subid ? "sub-id <span class=\"mono\">" + esc(f.subid) + "</span> · " : "") +
      (p ? "comissão " + money(p.comissao) + " · " : "") + (f.budget ? "orçamento do plano US$ " + f.budget : "") + "</div>" +
      "</div>";
    bindGo(box);
    $("#cpFill").onclick = cpFromPlan;
  }

  /* ------------------------------ cirurgia / MVP ------------------------------ */
  var C = window.BM_CIRURGIA;
  var dgSel = {};
  function stPill(st) {
    var m = { ok: ["g", "verificado"], ajuste: ["y", "ajuste"], nok: ["r", "não existe"], "n/d": ["", "n/d"] };
    var x = m[st] || ["", st];
    return "<span class=\"pill " + x[0] + "\">" + x[1] + "</span>";
  }
  function renderHome() {
    var P = C.posicionamento;
    $("#heroSub").textContent = P.promessa;
    $("#heroProva").innerHTML = "<b>Benchmark realista:</b> " + esc(P.provaSocial.texto) + "<br><span class=\"sub\">" + esc(P.provaSocial.honestidade) + "</span>";
    $("#heroKpis").innerHTML = P.kpis.map(function (k) { return mini(k[0], k[1], k[2]); }).join("");
    $("#heroOnboarding").innerHTML = C.onboarding3.map(function (o) {
      return "<div class=\"card\"><div class=\"row\" style=\"gap:10px;align-items:center\"><div class=\"step\" style=\"padding:0;border:0;background:none;margin:0\"><div class=\"n\">" + esc(o[0]) + "</div></div><h3 style=\"margin:0\">" + esc(o[1]) + "</h3></div><p class=\"sub\" style=\"margin-top:8px\">" + esc(o[2]) + "</p></div>";
    }).join("");
    $("#heroModulos").innerHTML = [
      ["diagnostico", "Diagnóstico determinístico", "5 perguntas → rede, nicho e 3 ofertas do Radar com o porquê de cada escolha."],
      ["redes", "Redes 2026 verificadas", "10 redes BR e intl com comissão, payout e status de verificação."],
      ["stack", "Stack & MCPs com status", "O que existe de verdade, o que mudou de nome e o que não existe."],
      ["dashboard", "Compliance gate", "FTC checker bloqueia copy sem disclosure e claim absoluto."],
      ["dashboard", "Validação pré-commit", "YAML da campanha validado antes de qualquer chamada de API."],
      ["spec", "Spec auditada", "14 itens do blueprint confrontados com a fonte, com link e data."]
    ].map(function (m) { return cardLink(m[0], m[1], m[2], "Abrir"); }).join("");
    bindGo($("#p-home"));
  }

  /* ---- diagnóstico ---- */
  function renderDiagnostico() {
    $("#dgForm").innerHTML = C.diagnostico.perguntas.map(function (q) {
      return "<div class=\"field\"><label class=\"f\">" + esc(q.label) + "</label><div class=\"row\">" +
        q.opts.map(function (o) {
          return "<div class=\"tag dg-opt\" data-q=\"" + q.id + "\" data-v=\"" + o[0] + "\">" + esc(o[1]) + "</div>";
        }).join("") + "</div></div>";
    }).join("");
    $$(".dg-opt").forEach(function (t) {
      t.onclick = function () {
        dgSel[t.dataset.q] = t.dataset.v;
        $$(".dg-opt[data-q=\"" + t.dataset.q + "\"]").forEach(function (x) { x.classList.remove("on"); });
        t.classList.add("on");
      };
    });
    $("#dgRun").onclick = runDiagnostico;
    $("#dgOut").innerHTML = "<div class=\"callout info\">Responda as 5 perguntas (ou clique direto em gerar para usar o perfil padrão de iniciante com R$ 50/dia) e receba a recomendação com o raciocínio exposto.</div>";
  }
  function runDiagnostico() {
    var a = Object.assign({ ads: "nao", tipo: "info", budget: "b50", trafego: "pago", dominio: "nao" }, dgSel);
    var redeR, nichoR, motivo = [], alertas = [];
    if (a.tipo === "saas") { redeR = ["Impact.com", "PartnerStack"]; nichoR = "software"; motivo.push("Você escolheu SaaS: comissão recorrente é o único modelo que compensa em ticket baixo."); }
    else if (a.tipo === "fisico") { redeR = ["Braip", "Awin (ex-ShareASale)"]; nichoR = "ecom"; motivo.push("Produto físico pede frete/logística nativa — Braip resolve no BR; Awin cobre marca grande."); }
    else { redeR = a.budget === "b30" ? ["Kiwify", "Hotmart"] : ["ClickBank", "BuyGoods"]; nichoR = "nutra"; motivo.push(a.budget === "b30" ? "Com R$ 30/dia, oferta BR de ticket médio converte com menos caixa." : "Acima de R$ 50/dia, ticket alto em dólar (ClickBank/BuyGoods) paga o CPC."); }
    if (a.ads === "nao") { alertas.push("Sem conta Google Ads: comece no Microsoft Ads (Bing) para validar com CPC menor e aprovação fácil, depois importe para o Google."); }
    if (a.ads === "bloqueada") { alertas.push("Conta bloqueada: NÃO abra outra para o mesmo domínio — isso é circumventing systems (suspensão sem aviso). Corrija o destino e apele."); }
    if (a.dominio === "nao" || a.dominio === "naosei") { alertas.push("Sem estrutura própria: presell no seu domínio é pré-requisito. Sem ele não há disclosure consistente, pixel nem remarketing."); }
    if (a.trafego === "org") { alertas.push("Só orgânico contradiz o método BOFU (tráfego pago puro). Se for o caso, use a trilha Email/SEO do Copiloto e trate Reddit como validador, não como tráfego."); }
    var budgetDia = a.budget === "b30" ? 30 : a.budget === "b50" ? 50 : 100;
    var cpc = nichoR === "nutra" ? 4.5 : nichoR === "ecom" ? 2.5 : 3.2;
    var cliquesDia = Math.round(budgetDia / cpc);
    var dias300 = Math.ceil(300 / Math.max(cliquesDia, 1));
    var picks = D.produtos.filter(function (p) { return p.nicho === nichoR; }).sort(function (x, y) { return scoreOf(y) - scoreOf(x); }).slice(0, 3);
    if (!picks.length) picks = D.produtos.slice().sort(function (x, y) { return scoreOf(y) - scoreOf(x); }).slice(0, 3);

    $("#dgOut").innerHTML = "<div class=\"card\">" +
      "<div class=\"small-label\">Recomendação</div>" +
      "<h2 style=\"margin:6px 0 10px\">" + esc(redeR.join(" + ")) + " · " + esc(nichoNome[nichoR]) + "</h2>" +
      "<div class=\"grid g3\">" + mini("Orçamento cirúrgico", "R$ " + budgetDia + "/dia", "faixa do método") + mini("CPC teto estimado", "R$ " + cpc.toFixed(2), "por nicho") + mini("Dias p/ 300 cliques", dias300 + " dias", cliquesDia + " cliques/dia") + "</div>" +
      "<h3 style=\"margin-top:18px\">Por que essa recomendação</h3><ul style=\"margin-left:18px;color:var(--dim);font-size:13.5px;display:flex;flex-direction:column;gap:6px\">" +
      motivo.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
      (alertas.length ? "<h3 style=\"margin-top:16px\">Alertas do seu perfil</h3>" + alertas.map(function (m) { return "<div class=\"callout\" style=\"margin-bottom:8px\">" + esc(m) + "</div>"; }).join("") : "") +
      "<h3 style=\"margin-top:18px\">3 ofertas do Radar compatíveis</h3>" +
      picks.map(function (p) {
        return "<div class=\"card\" style=\"background:#ffffff05;margin-bottom:8px\"><div class=\"row between\"><b>" + esc(p.nome) + "</b><span class=\"pill " + (scoreOf(p) >= 70 ? "g" : "b") + "\">score " + scoreOf(p) + "</span></div>" +
          "<div class=\"sub\" style=\"margin-top:4px\">" + esc(p.rede) + " · EPC " + money(p.epc) + " · gravity " + p.gravity + " · risco " + riscoLabel(p.risco) + "</div></div>";
      }).join("") +
      "<div class=\"row\" style=\"margin-top:14px\">" + picks.map(function (p, i) {
        return "<button class=\"btn " + (i === 0 ? "pri" : "") + " sm\" data-plan=\"" + esc(p.nome) + "\">Executar plano: " + esc(p.nome) + "</button>";
      }).join("") + "<button class=\"btn sm ghost\" data-go=\"radar\">Ver Radar</button></div>" +
      "<div class=\"note\">Regra do método aplicada: gravity > 50 e EPC > US$ 0,75. Oferta fora disso não entra na carteira.</div></div>";
    bindGo($("#dgOut"));
    $$("[data-plan]", $("#dgOut")).forEach(function (b) {
      b.onclick = function () { startPlan(b.dataset.plan); };
    });
  }

  /* ---- redes ---- */
  function renderRedes() {
    var tipos = [];
    C.redes.forEach(function (r) { if (tipos.indexOf(r.tipo) < 0) tipos.push(r.tipo); });
    $("#rdTipo").innerHTML = "<option value=\"\">Todos os tipos</option>" + tipos.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("");
    ["#rdSearch", "#rdTipo", "#rdOrd"].forEach(function (x) { $(x).oninput = drawRedes; $(x).onchange = drawRedes; });
    drawRedes();
  }
  function drawRedes() {
    var q = ($("#rdSearch").value || "").toLowerCase(), t = $("#rdTipo").value, ord = $("#rdOrd").value;
    var arr = C.redes.filter(function (r) {
      if (t && r.tipo !== t) return false;
      if (q && (r.nome + " " + r.tipo + " " + r.ideal).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    function maxCom(r) { var m = r.comissao.match(/(\d+)(?=[^\d]*$)/); return m ? +m[1] : 0; }
    arr.sort(function (a, b) {
      if (ord === "nome") return a.nome.localeCompare(b.nome);
      if (ord === "payout") return (a.payout.indexOf("Semanal") >= 0 ? -1 : 1);
      return maxCom(b) - maxCom(a);
    });
    $("#rdBody").innerHTML = arr.map(function (r) {
      return "<div class=\"card ghcard\"><div class=\"name\">" + esc(r.nome) + " " + stPill(r.st) + "</div>" +
        "<div class=\"row\" style=\"gap:6px\"><span class=\"pill b\">" + esc(r.tipo) + "</span><span class=\"pill g\">" + esc(r.comissao) + "</span><span class=\"pill\">" + esc(r.payout) + "</span></div>" +
        "<p><b>Ideal para:</b> " + esc(r.ideal) + "</p><p class=\"sub\">" + esc(r.nota) + "</p></div>";
    }).join("") || "<div class=\"callout\">Nenhuma rede com esse filtro.</div>";
  }

  /* ---- stack ---- */
  var stSel = "skills";
  function renderStack() {
    var groups = [["skills", "A · Skills open-source"], ["mcps", "B · MCPs conectáveis"], ["validacao", "C · Validação"]];
    $("#stTabs").innerHTML = groups.map(function (g) { return "<div class=\"tab\" data-st=\"" + g[0] + "\">" + esc(g[1]) + "</div>"; }).join("");
    $$("#stTabs .tab").forEach(function (x) { x.onclick = function () { stSel = x.dataset.st; drawStack(); }; });
    $("#stSnippets").textContent =
      "# npm (funcionam hoje)\nnpx -y affiliate-networks-mcp        # repo: bobberrisford/affiliatemcp (v0.20.0)\nnpx -y mcp-redtrack setup SUA_API_KEY  # mcp-redtrack v0.3.1\nnpx -y feedico-mcp\n\n" +
      "# Claude Code\nclaude mcp add redtrack -e REDTRACK_API_KEY=SUA_KEY -- npx mcp-redtrack\nclaude mcp add affiliate-networks -- npx -y affiliate-networks-mcp\n\n" +
      "# Skills de agente (Affitor)\ngit clone https://github.com/Affitor/affiliate-skills\n\n" +
      "# CLI openaffiliate (substitui a 'API sem chave' da spec)\nnpm i -g openaffiliate\n\n" +
      "# Bridge deste repositório (Ads REST + Rally MCP + ProdIntel)\npython3 tools/mcp_bridge.py --port 8791";
    drawStack();
  }
  function drawStack() {
    $$("#stTabs .tab").forEach(function (x) { x.classList.toggle("on", x.dataset.st === stSel); });
    var list = C.stack[stSel];
    $("#stBody").innerHTML = "<div class=\"grid g2\">" + list.map(function (m) {
      return "<div class=\"card ghcard\"><div class=\"name\">" + esc(m.nome) + " " + stPill(m.st) + "</div>" +
        "<p>" + esc(m.o_que) + "</p><div class=\"how\">" + esc(m.detalhe) + "</div>" +
        (m.url ? "<div><a class=\"btn sm ghost\" href=\"" + esc(m.url) + "\" target=\"_blank\" rel=\"noopener\">Abrir fonte ↗</a></div>" : "") + "</div>";
    }).join("") + "</div>";
  }

  /* ---- método ---- */
  function renderMetodo() {
    var M = C.metodo;
    $("#mtTitle").textContent = "Método " + M.nome;
    $("#mtLead").innerHTML = "Timeline operacional de <b>" + esc(M.autor) + "</b>, mantida integralmente. Cada passo tem os números exatos do método e o que fazer no app.";
    $("#mtMetodo").textContent = M.autor;
    $("#mtSteps").innerHTML = M.passos.map(function (p) {
      return "<div class=\"step\"><div class=\"n\">" + p.n + "</div><div>" +
        "<div class=\"row between\"><h3 style=\"margin:0\">" + esc(p.t) + "</h3><div class=\"row\" style=\"gap:5px\">" +
        p.tags.map(function (t) { return "<span class=\"chip\">" + esc(t) + "</span>"; }).join("") + "</div></div>" +
        "<p style=\"font-size:13.5px;color:var(--dim);margin-top:6px\">" + esc(p.d) + "</p></div></div>";
    }).join("");
    $("#mtAviso").innerHTML = "<b>Alerta de compliance (passo 4):</b> " + esc(M.avisoCompliance);
  }

  /* ---- reddit ---- */
  function renderReddit() {
    var R = C.reddit;
    $("#rddBridge").textContent = R.bridge;
    $("#rddKarma").innerHTML = "<b>Karma prático:</b> " + esc(R.karma);
    $("#rddTimeline").innerHTML = R.timeline.map(function (t) {
      return "<div class=\"kv\"><span><b>" + esc(t[0]) + "</b><br><span class=\"sub\">" + esc(t[1]) + "</span></span></div>";
    }).join("");
    $("#rddSubs").innerHTML = "<thead><tr><th>Subreddit</th><th>Nicho</th><th>Potência</th></tr></thead><tbody>" +
      R.subreddits.map(function (s) { return "<tr><td><b>" + esc(s[0]) + "</b></td><td class=\"sub\">" + esc(s[1]) + "</td><td><span class=\"pill " + (s[2] === "muito alta" ? "g" : "b") + "\">" + esc(s[2]) + "</span></td></tr>"; }).join("") + "</tbody>";
    $("#rddHot").innerHTML = R.ofertasQuentes.map(function (o) { return "<div class=\"card\"><div class=\"small-label\">" + esc(o[2]) + "</div><div style=\"font-weight:700;margin:5px 0\">" + esc(o[0]) + "</div><div class=\"sub\">" + esc(o[1]) + "</div></div>"; }).join("");
    var K = C.clonagem;
    $("#clTools").innerHTML = K.ferramentas.map(function (f) { return "<span class=\"pill p\">" + esc(f) + "</span>"; }).join("");
    $("#clRule").innerHTML = "<b>Regra de ouro:</b> " + esc(K.regraOuro);
    $("#clComp").innerHTML = K.compliance.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    $("#clFramework").innerHTML = K.framework.map(function (f) { return "<div class=\"kv\"><span><b>" + esc(f[0]) + "</b><br><span class=\"sub\">" + esc(f[1]) + "</span></span></div>"; }).join("");
  }

  /* ---- dashboard ---- */
  var YAML_EXEMPLO = [
    "campaign:",
    "  name: bofu-brain-song-display",
    "  platform: google_ads",
    "  status: PAUSED",
    "  budget:",
    "    daily: 35",
    "    currency: BRL",
    "  bidding: maximize_clicks",
    "  max_cpc: 5.50",
    "  network: display",
    "  targeting:",
    "    custom_intent: [\"brain song\", \"brain song review\", \"where to buy brain song\"]",
    "  exclusions:",
    "    placements: [apps, kids_channels]",
    "  landing: https://SEU-DOMINIO.com/brain-song",
    "  affiliate:",
    "    network: clickbank",
    "    subid: bofu_a1_medo",
    "  compliance:",
    "    disclosure_above_fold: true",
    "    owner_domain: true"
  ].join("\n");

  function renderDashboard() {
    // pipeline
    var st = LS.get("dbPipe", {});
    $("#dbPipeline").innerHTML = C.dashboard.pipeline.map(function (p, i) {
      var on = st[i];
      return "<div class=\"tag " + (on ? "on" : "") + "\" data-pipe=\"" + i + "\" title=\"" + esc(p[1]) + "\">" + (on ? "✓ " : "") + esc(p[0]) + "</div>" + (i < C.dashboard.pipeline.length - 1 ? "<span class=\"dim\">→</span>" : "");
    }).join("");
    $$("[data-pipe]").forEach(function (t) {
      t.onclick = function () {
        var s2 = LS.get("dbPipe", {});
        var k = t.dataset.pipe; if (s2[k]) delete s2[k]; else s2[k] = 1;
        LS.set("dbPipe", s2); renderDashboard();
      };
    });
    // checklist
    var ck = LS.get("dbCheck", {});
    var done = C.dashboard.checklistDiario.filter(function (_, i) { return ck[i]; }).length;
    $("#dbCkCount").textContent = done + "/" + C.dashboard.checklistDiario.length;
    $("#dbChecklist").innerHTML = C.dashboard.checklistDiario.map(function (c, i) {
      return "<div style=\"margin-bottom:8px\"><label class=\"check " + (ck[i] ? "done" : "") + "\"><input type=\"checkbox\" data-ck2=\"" + i + "\" " + (ck[i] ? "checked" : "") + "><span>" + esc(c) + "</span></label></div>";
    }).join("");
    $$("[data-ck2]").forEach(function (cb) {
      cb.onchange = function () {
        var s3 = LS.get("dbCheck", {});
        if (cb.checked) s3[cb.dataset.ck2] = 1; else delete s3[cb.dataset.ck2];
        LS.set("dbCheck", s3); renderDashboard();
      };
    });
    // yaml
    if (!$("#dbYaml").value) $("#dbYaml").value = YAML_EXEMPLO;
    $("#dbYamlReset").onclick = function () { $("#dbYaml").value = YAML_EXEMPLO; $("#dbYamlOut").innerHTML = ""; };
    $("#dbValidate").onclick = validarYaml;
    if ($("#dbYamlPlan")) $("#dbYamlPlan").onclick = function () {
      var f = loadFx();
      if (!f || !f.yaml) { toast("Nenhum plano montado ainda."); return; }
      $("#dbYaml").value = f.yaml; validarYaml();
    };
    $("#dbFtc").onclick = checarFtc;
    $("#dbFtcLoad").onclick = function () {
      var code = $("#gCode") && $("#gCode").textContent;
      if (!code) { toast("Gere uma presell na aba Gerador primeiro."); return; }
      $("#dbCopy").value = code; toast("Presell carregada — clique em verificar.");
    };
    $("#dbuDate").value = new Date().toISOString().slice(0, 10);
    $("#dbuRun").onclick = buildUtm;
    buildUtm();
    // roadmap
    $("#dbRoadmap").innerHTML = C.roadmap.map(function (r) {
      return "<div class=\"kv\"><span><b>" + esc(r[0]) + "</b><br><span class=\"sub\">" + esc(r[1]) + "</span></span><span class=\"pill g\">" + esc(r[2]) + "</span></div>";
    }).join("");
  }

  var YAML_REGRAS = [
    ["Estrutura mínima", ["campaign:", "name:", "platform:", "budget:", "landing:"], "bloqueia"],
    ["Orçamento declarado", ["budget:", "daily:"], "bloqueia"],
    ["Campanha nasce pausada", ["status: paused"], "bloqueia", /status:\s*paused/i],
    ["Teto de CPC (método BOFU)", ["max_cpc:"], "aviso"],
    ["Custom Intent preenchido", ["custom_intent:"], "bloqueia", /custom_intent:\s*\[[^\]]+\]/i],
    ["Exclusão de apps / audience network", ["exclusions:"], "bloqueia", /exclusions:[\s\S]{0,120}placements:\s*\[[^\]]*(apps|audience_network)/i],
    ["Landing no domínio próprio", ["landing: https://"], "bloqueia"],
    ["Sub-id de rastreio", ["subid:"], "aviso"],
    ["FTC: disclosure acima da dobra", ["disclosure_above_fold: true"], "bloqueia"],
    ["RBAC: plataforma de anúncio declarada", ["platform: google_ads"], "aviso"]
  ];
  function validarYamlTexto(txt) {
    var y = (txt || "").toLowerCase();
    var fail = 0, warn = 0;
    var rows = YAML_REGRAS.map(function (c) {
      var ok = c[3] ? c[3].test(txt || "") : c[1].every(function (k) { return y.indexOf(k) >= 0; });
      if (!ok) { if (c[2] === "bloqueia") fail++; else warn++; }
      return { label: c[0], ok: ok, sev: c[2] };
    });
    return { rows: rows, fail: fail, warn: warn, ok: fail === 0 };
  }
  function validarYaml() {
    var r = validarYamlTexto($("#dbYaml").value);
    var rows = r.rows.map(function (c) {
      return "<div class=\"kv\"><span>" + esc(c.label) + "</span><span class=\"pill " + (c.ok ? "g" : c.sev === "bloqueia" ? "r" : "y") + "\">" + (c.ok ? "passou" : c.sev === "bloqueia" ? "bloqueia" : "atenção") + "</span></div>";
    }).join("");
    var veredito = r.fail ? "<span class=\"pill r\">NÃO PODE SUBIR</span> " + r.fail + " bloqueio(s)" : r.warn ? "<span class=\"pill y\">PODE SUBIR COM RESSALVA</span> " + r.warn + " aviso(s)" : "<span class=\"pill g\">VALIDADO — pronto para criar pausada</span>";
    $("#dbYamlOut").innerHTML = "<div class=\"card\" style=\"background:#0a0f16\"><div class=\"row between\"><b>Dry-run</b>" + veredito + "</div>" + rows +
      "<div class=\"callout info\" style=\"margin-top:12px\">Isto valida <b>campos e regras</b> do YAML — não executa pipeline nem substitui o <span class=\"mono\">harness-schema</span>. É o gate que evita subir campanha sem disclosure, sem exclusão de apps ou sem sub-id.</div></div>";
  }

  function ftcCheck(txt) {
    var rows = C.dashboard.ftcRegras.map(function (r) {
      var neg = r[0].indexOf("Sem claim") >= 0;
      var hit = r[1].test(txt || "");
      return { label: r[0], detalhe: r[2], ok: neg ? !hit : hit, neg: neg };
    });
    return { rows: rows, ok: rows.every(function (x) { return x.ok; }), fails: rows.filter(function (x) { return !x.ok; }).map(function (x) { return x.label; }) };
  }
  function checarFtc() {
    var txt = $("#dbCopy").value || "";
    if (!txt.trim()) { $("#dbFtcOut").innerHTML = "<div class=\"callout\">Cole a copy ou use o botão para carregar a presell gerada.</div>"; return; }
    var r = ftcCheck(txt);
    var html = "<div class=\"card\" style=\"background:#0a0f16\"><div class=\"row between\"><b>FTC gate</b>" +
      (r.ok ? "<span class=\"pill g\">LIBERADO</span>" : "<span class=\"pill r\">PUBLICAÇÃO BLOQUEADA</span>") + "</div>" +
      r.rows.map(function (x) {
        return "<div class=\"kv\"><span>" + esc(x.label) + "<br><span class=\"sub\">" + esc(x.detalhe) + "</span></span><span class=\"pill " + (x.ok ? "g" : "r") + "\">" + (x.ok ? "ok" : x.neg ? "encontrado" : "ausente") + "</span></div>";
      }).join("");
    html += r.ok
      ? "<div class=\"callout good\" style=\"margin-top:12px\">Copy passou nos 4 gates. Lembre: o gate automatizado não substitui revisão humana de claims e de direitos autorais.</div>"
      : "<div class=\"callout bad\" style=\"margin-top:12px\"><b>Corrija antes de publicar:</b> " + esc(r.fails.join(", ")) + ". A FTC avalia por 'Net Impression' — disclosure no rodapé ou escondido não conta.</div>";
    html += "<div class=\"note\">Detecção por padrão de texto — falso negativo é possível (ex.: disclosure em imagem). Obrigatório revisar visualmente.</div></div>";
    $("#dbFtcOut").innerHTML = html;
  }

  function buildUtm() {
    var offer = ($("#dbuOffer").value || "oferta").trim().replace(/\s+/g, "-").toLowerCase();
    var ang = ($("#dbuAngle").value || "angulo").trim();
    var ch = $("#dbuChannel").value;
    var dt = $("#dbuDate").value || "";
    var base = "https://seu-dominio.com/" + offer;
    var utm = base + "?utm_source=" + encodeURIComponent(ch) + "&utm_medium=" + (ch === "email" ? "email" : "cpc") +
      "&utm_campaign=bofu-" + encodeURIComponent(offer) + "&utm_content=" + encodeURIComponent(ang) + (dt ? "&utm_id=" + dt.replace(/-/g, "") : "");
    var sub = offer + "_" + ang + (dt ? "_" + dt.replace(/-/g, "") : "");
    var aff = "https://hop.clickbank.net/?affiliate=SEUID&vendor=SEUVENDOR&tid=" + encodeURIComponent(sub);
    $("#dbuOut").innerHTML = "<div class=\"card\" style=\"background:#0a0f16\"><div class=\"small-label\">Presell (URL do anúncio)</div><pre>" + esc(utm) + "</pre>" +
      "<div class=\"small-label\" style=\"margin-top:10px\">Link de afiliado com sub-id</div><pre>" + esc(aff) + "</pre>" +
      "<div class=\"row\" style=\"margin-top:10px\"><button class=\"btn sm\" id=\"dbuC1\">Copiar presell</button><button class=\"btn sm ghost\" id=\"dbuC2\">Copiar afiliado</button></div>" +
      "<div class=\"note\">O sub-id é o que faz o vendor te devolver qual ângulo vendeu. Sem ele você escala o criativo errado.</div></div>";
    $("#dbuC1").onclick = function () { copyText(utm); };
    $("#dbuC2").onclick = function () { copyText(aff); };
  }

  /* ---- spec ---- */
  function renderSpec() {
    $("#spTable").innerHTML = "<thead><tr><th>Item da spec</th><th>Status</th><th>O que foi verificado</th></tr></thead><tbody>" +
      C.specCheck.map(function (r) {
        return "<tr><td><b>" + esc(r[0]) + "</b></td><td>" + stPill(r[1]) + "</td><td class=\"sub\">" + esc(r[2]) + "</td></tr>";
      }).join("") + "</tbody>";
    var ok = C.specCheck.filter(function (r) { return r[1] === "ok"; }).length;
    var aj = C.specCheck.filter(function (r) { return r[1] === "ajuste"; }).length;
    var nd = C.specCheck.filter(function (r) { return r[1] === "n/d"; }).length;
    var nk = C.specCheck.filter(function (r) { return r[1] === "nok"; }).length;
    $("#spStats").innerHTML = stat("Confirmados", ok, "de " + C.specCheck.length + " itens") + stat("Ajustados", aj, "nome/rota diferentes") + stat("Não verificáveis", nd + nk, nk + " inexistente(s), " + nd + " sem resposta");
  }

  /* ------------------------------ boot ------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
    renderHome(); renderDiagnostico(); renderFluxo(); renderHistorico(); renderRedes(); renderStack(); renderMetodo(); renderReddit(); renderDashboard(); renderSpec();
    renderCockpit(); bindGo();
    renderRadar(); drawRadarDetail();
    renderCampanhas();
    $("#cpRun").onclick = runCopiloto;
    $("#cpReset").onclick = function () {
      ["cpSpend", "cpClicks", "cpImpr", "cpOut", "cpSales", "cpComm", "cpDays"].forEach(function (k) { $("#" + k).value = ""; });
      $("#cpOut2").innerHTML = "";
    };
    initGerador();
    initKeyword();
    initViab();
    initCheck();
    renderPlano();
    renderGithub();
    renderHF();
    renderManual();
    initCaderno();
    initIntegracoes();
    if (loadFx() && FX.yaml) { try { syncDownstream(); } catch (e) {} }
    bindGo();
    go("home");
  });
})();
