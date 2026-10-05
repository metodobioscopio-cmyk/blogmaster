/* ============================================================================
   GROWTH DESIGN PRO — comportamento da interface
   Sem dependências. Progressive enhancement: sem JS, a página continua legível
   (todos os painéis fechados por padrão ficam com conteúdo acessível por CSS
   quando .no-js está no <html>).
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  doc.documentElement.classList.remove('no-js');

  /* -------------------------------------------------------------------------
     1. Navegação: estado "grudado" + gaveta mobile
     ------------------------------------------------------------------------ */
  var nav = doc.querySelector('[data-nav]');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var burger = doc.querySelector('[data-burger]');
  var drawer = doc.querySelector('[data-drawer]');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
      }
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        burger.focus();
      }
    });
  }

  /* -------------------------------------------------------------------------
     2. Barra de progresso de leitura
     ------------------------------------------------------------------------ */
  var bar = doc.querySelector('[data-progress]');
  if (bar) {
    var raf = null;
    var update = function () {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      raf = null;
    };
    var request = function () { if (raf === null) raf = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* -------------------------------------------------------------------------
     3. Acordeões genéricos (módulos do curso, FAQ)
     Contrato: botão com [data-acc-trigger] e aria-controls -> painel com id.
     Um item aberto por grupo quando [data-acc-single] no container.
     ------------------------------------------------------------------------ */
  var accTriggers = doc.querySelectorAll('[data-acc-trigger]');
  Array.prototype.forEach.call(accTriggers, function (trigger) {
    trigger.addEventListener('click', function () {
      var panelId = trigger.getAttribute('aria-controls');
      var panel = panelId ? doc.getElementById(panelId) : null;
      if (!panel) return;

      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      var group = trigger.closest('[data-acc-single]');

      if (group && !isOpen) {
        Array.prototype.forEach.call(group.querySelectorAll('[data-acc-trigger][aria-expanded="true"]'), function (other) {
          if (other === trigger) return;
          other.setAttribute('aria-expanded', 'false');
          var op = doc.getElementById(other.getAttribute('aria-controls'));
          if (op) op.classList.remove('is-open');
        });
      }
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
    // Acessibilidade por teclado: setas dentro do grupo
    trigger.addEventListener('keydown', function (e) {
      var group = trigger.closest('[data-acc-single]');
      if (!group) return;
      var all = Array.prototype.slice.call(group.querySelectorAll('[data-acc-trigger]'));
      var i = all.indexOf(trigger);
      if (e.key === 'ArrowDown' && i < all.length - 1) { e.preventDefault(); all[i + 1].focus(); }
      if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); all[i - 1].focus(); }
      if (e.key === 'Home') { e.preventDefault(); all[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); all[all.length - 1].focus(); }
    });
  });

  /* -------------------------------------------------------------------------
     4. Revelação ao rolar
     ------------------------------------------------------------------------ */
  var revealables = doc.querySelectorAll('.reveal');
  if (revealables.length) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = Number(el.getAttribute('data-reveal-delay') || 0);
          window.setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
    }
  }

  /* -------------------------------------------------------------------------
     5. Copiar prompts/código
     ------------------------------------------------------------------------ */
  var copies = doc.querySelectorAll('[data-copy]');
  Array.prototype.forEach.call(copies, function (btn) {
    btn.addEventListener('click', function () {
      var targetSel = btn.getAttribute('data-copy');
      var target = targetSel ? doc.querySelector(targetSel) : null;
      var text = target ? target.innerText : '';
      var done = function () {
        var label = btn.getAttribute('data-label') || btn.textContent;
        btn.setAttribute('data-label', label);
        btn.textContent = btn.getAttribute('data-copied-label') || 'Copiado';
        btn.classList.add('is-done');
        window.setTimeout(function () {
          btn.textContent = label;
          if (btn.getAttribute('data-copied-label')) btn.textContent = label;
          btn.classList.remove('is-done');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });

  function fallback(text, done) {
    var ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand('copy'); done(); } catch (err) { /* silencioso */ }
    doc.body.removeChild(ta);
  }

  /* -------------------------------------------------------------------------
     6. Ano corrente no rodapé + contador de link de afiliado
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* -------------------------------------------------------------------------
     7. Rolagem suave com compensação da barra fixa (fallback p/ Safari antigo)
     ------------------------------------------------------------------------ */
  if (!('scrollBehavior' in doc.documentElement.style)) {
    Array.prototype.forEach.call(doc.querySelectorAll('a[href^="#"]'), function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        var el = doc.getElementById(id.slice(1));
        if (!el) return;
        e.preventDefault();
        var top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo(0, top);
      });
    });
  }
})();
