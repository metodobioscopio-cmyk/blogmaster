/* Grok × Reddit — interações do dossiê */
(() => {
  "use strict";

  /* ------------------------------------------------ barra de progresso */
  const progress = document.getElementById("progress");
  if (progress) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : "0%";
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------------------------------------ sidebar mobile */
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 900 && sidebar.classList.contains("open") &&
          !sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove("open");
      }
    });
  }

  /* ------------------------------------------------ sumário ativo */
  const tocLinks = [...document.querySelectorAll(".toc-rail a[href^='#']")];
  if (tocLinks.length) {
    const targets = tocLinks
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter(Boolean);

    const onScroll = () => {
      let current = null;
      for (const t of targets) {
        if (t.getBoundingClientRect().top <= 110) current = t.id;
      }
      tocLinks.forEach((a) => {
        a.classList.toggle("active", decodeURIComponent(a.hash.slice(1)) === current);
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------ busca */
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const searchBtn = document.getElementById("searchBtn");
  let index = null;

  const openSearch = async () => {
    if (!modal) return;
    modal.hidden = false;
    input.value = "";
    results.innerHTML = '<div class="search-empty">Digite para buscar em todo o dossiê…</div>';
    input.focus();
    if (!index) {
      try {
        const res = await fetch("search-index.json");
        index = await res.json();
      } catch {
        index = [];
      }
    }
  };

  const closeSearch = () => { if (modal) modal.hidden = true; };

  searchBtn?.addEventListener("click", openSearch);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeSearch(); });

  addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape") closeSearch();
  });

  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const makeSnippet = (text, q) => {
    const i = text.toLowerCase().indexOf(q);
    if (i === -1) return escapeHtml(text.slice(0, 130)) + "…";
    const start = Math.max(0, i - 60);
    const end = Math.min(text.length, i + q.length + 90);
    return (start > 0 ? "…" : "") +
      escapeHtml(text.slice(start, i)) +
      "<mark>" + escapeHtml(text.slice(i, i + q.length)) + "</mark>" +
      escapeHtml(text.slice(i + q.length, end)) + "…";
  };

  input?.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!index) return;
    if (q.length < 2) {
      results.innerHTML = '<div class="search-empty">Digite ao menos 2 caracteres.</div>';
      return;
    }
    const hits = [];
    for (const page of index) {
      const inTitle = page.title.toLowerCase().includes(q);
      const inText = page.text.toLowerCase().includes(q);
      if (!inTitle && !inText) continue;
      const count = (page.text.toLowerCase().match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      hits.push({ ...page, score: (inTitle ? 100 : 0) + count, snippet: makeSnippet(page.text, q) });
    }
    hits.sort((a, b) => b.score - a.score);

    results.innerHTML = hits.length
      ? hits.slice(0, 12).map((h) =>
          `<a href="${h.file}"><strong>${escapeHtml(h.title)}</strong><span>${h.snippet}</span></a>`
        ).join("")
      : `<div class="search-empty">Nada encontrado para “${escapeHtml(input.value)}”.</div>`;
  });

  /* ------------------------------------------------ cópia de código */
  document.querySelectorAll(".doc pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.textContent = "copiar";
    btn.className = "copy-btn";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code")?.innerText || pre.innerText);
        btn.textContent = "copiado";
        setTimeout(() => (btn.textContent = "copiar"), 1400);
      } catch { btn.textContent = "erro"; }
    });
    Object.assign(btn.style, {
      position: "absolute", top: "8px", right: "8px",
      fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".08em",
      textTransform: "uppercase", background: "var(--surface-2)",
      color: "var(--text-3)", border: "1px solid var(--line)",
      borderRadius: "5px", padding: "3px 8px", cursor: "pointer",
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
})();
