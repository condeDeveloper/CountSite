// Planos: a barra fixa e os botões que descem até o cartão do plano anual.
// Usado pela página de vendas e pelas páginas de projeto.
// ============================================================
//   BARRA FIXA: some enquanto os planos estão na tela
// ============================================================
(function () {
  var barra = document.querySelector('.sticky-cta');
  var planos = document.getElementById('planos');
  if (!barra || !planos || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (itens) {
    barra.classList.toggle('is-oculta', itens[0].isIntersecting);
  // só conta quando os planos passam do meio da tela: antes disso a barra continua aparecendo
  }, { threshold: 0, rootMargin: '0px 0px -50% 0px' }).observe(planos);
})();

// ============================================================
//   BOTÕES QUE DESCEM ATÉ OS PLANOS
//   No Safari do iPhone o link de âncora parava no lugar errado: a página
//   muda de altura durante a descida (imagens que carregam só ao chegar perto).
//   Aqui a descida é feita por script e conferida até parar no cartão.
// ============================================================
(function () {
  var ALVO = '#plano-anual';
  var rodada = 0;
  // folga no topo: o padrão cobre o topo fixo e o mascote da página de vendas; data-folga muda isso.
  function folga() {
    var el = document.querySelector(ALVO);
    var f = el && el.getAttribute('data-folga');
    if (f) return parseInt(f, 10);
    return window.innerWidth >= 640 ? 300 : 190;
  }
  function destino(el) { return Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - folga()); }
  function vai(y, suave) {
    try { window.scrollTo({ top: y, behavior: suave ? 'smooth' : 'instant' }); }
    catch (e) { window.scrollTo(0, y); }
  }
  function descer() {
    var el = document.querySelector(ALVO);
    if (!el) return;
    var minha = ++rodada;
    var ultimo = -1;
    var tentativas = 0;
    function parar() { rodada++; }
    ['touchstart', 'wheel', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, parar, { once: true, passive: true });
    });
    vai(destino(el), true);
    (function confere() {
      if (minha !== rodada || ++tentativas > 16) return;
      var y = window.pageYOffset;
      var falta = el.getBoundingClientRect().top - folga();
      var noFim = window.innerHeight + y >= document.documentElement.scrollHeight - 2;
      if (y === ultimo && Math.abs(falta) > 6 && !noFim) vai(destino(el), false);
      ultimo = y;
      setTimeout(confere, 250);
    })();
  }
  // Chegou de outra página já apontando pros planos (ex.: vitrine de projetos): desce depois de carregar.
  if (location.hash === ALVO) window.addEventListener('load', function () { setTimeout(descer, 150); });
  function link(e) { return e.target.closest ? e.target.closest('a[href="' + ALVO + '"]') : null; }
  document.addEventListener('click', function (e) {
    if (!link(e)) return;
    e.preventDefault();
    descer();
  });
  // No iPhone o primeiro toque às vezes vira só "hover" e o clique não chega.
  // Então o toque curto (sem arrastar) já dispara a descida, sem esperar o clique.
  var inicio = null;
  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    inicio = link(e) && e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!inicio || !link(e)) { inicio = null; return; }
    var t = e.changedTouches[0];
    var andou = Math.abs(t.clientX - inicio.x) + Math.abs(t.clientY - inicio.y);
    inicio = null;
    if (andou > 12) return;
    e.preventDefault();
    descer();
  }, { passive: false });
})();
