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
    ["inicio", "Cockpit", "◎"],
    ["radar", "Radar de produto", "◉"],
    ["campanhas", "Campanhas validadas", "▤"],
    ["copiloto", "Copiloto de decisão", "◈"],
    ["gerador", "Gerador de presell", "✎"],
    ["keyword", "Keyword & intenção", "⌕"],
    ["viab", "Viabilidade & links", "∑"],
    ["check", "Compliance", "☑"],
    ["plano", "Plano de 7 dias", "▷"],
    ["github", "Arsenal GitHub", "◧"],
    ["hf", "Arsenal Hugging Face", "◨"],
    ["manual", "Manual prático", "❏"],
    ["caderno", "Caderno", "✐"]
  ];

  function buildNav() {
    var nav = $("#nav");
    nav.innerHTML = PAGES.map(function (p) {
      return "<a class=\"nav-item\" data-page=\"" + p[0] + "\"><span class=\"ico\">" + p[2] + "</span>" + p[1] + "</a>";
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
      cardLink("check", "0 · Antes de tudo: compliance", "15 pontos que evitam reprovação e bloqueio de conta.", "Abrir checklist")
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
      tr.onclick = function () { radarSel = tr.dataset.name; drawRadar(); drawRadarDetail(); };
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
      "</div>";
    $$("[data-bp]", box).forEach(function (b) { b.onclick = function () { go("campanhas"); selectBlueprint(b.dataset.bp); }; });
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
      "<div class=\"note\">Fórmulas: RPC = vendas × comissão ÷ cliques · RPC/CPC ≥ 1,3 = escalar · CPC máximo = RPC × (1 − margem).</div>" +
      "</div>";
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

  /* ------------------------------ boot ------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
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
    bindGo();
    go("inicio");
  });
})();
