// ============================================================
//   CHECKOUT URL — fonte única de verdade
// ============================================================
const CONDECLUB_CHECKOUT_URL = 'https://pay.kiwify.com.br/zeHjPOA';

document.querySelectorAll('[data-checkout="condeclub"]').forEach((el) => {
  el.href = CONDECLUB_CHECKOUT_URL;
});

// ============================================================
//   FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq__question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq__item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq__item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ============================================================
//   HEADER: sombra ao rolar
// ============================================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });

// ============================================================
//   ANIMAÇÃO DE ENTRADA (Intersection Observer)
// ============================================================
const observerOpts = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.testimonial__card, .faq__item, .inside__card, .how__step, .pricing__card, .track__card, .screen-frame'
).forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================================
//   UTM PASSTHROUGH: preserva parâmetros de campanha no checkout
// ============================================================
(function preserveUTMs() {
  const params = new URLSearchParams(window.location.search);
  const utmEntries = [...params.entries()].filter(([key]) => key.startsWith('utm_'));
  if (!utmEntries.length) return;

  document.querySelectorAll('a[href*="pay.kiwify.com"]').forEach((link) => {
    const url = new URL(link.href);
    utmEntries.forEach(([key, value]) => url.searchParams.set(key, value));
    link.href = url.toString();
  });
})();

// ============================================================
//   ANALYTICS: GA4 + TikTok Pixel (stubs) + eventos custom
// ============================================================
(function loadAnalytics() {
  if (window.GA4_ID && !window.GA4_ID.includes('XXXX')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA4_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', window.GA4_ID);
  }

  if (window.TIKTOK_PIXEL_ID && !window.TIKTOK_PIXEL_ID.includes('XXXX')) {
    // Stub oficial do TikTok Pixel — cole o snippet completo fornecido
    // pelo TikTok Ads Manager aqui quando tiver o ID real.
  }
})();

// ============================================================
//   FUNIL DO CONDECLUB: viu_pagina / clicou_assinar → banco do produto
//   Id de visita aleatório, só nesta aba (sessionStorage). Sem cookie.
// ============================================================
const funil = (function () {
  const cfg = window.CONDECLUB_FUNIL;
  if (!cfg || !cfg.url || !cfg.anon) return { registrar() {} };
  let visita = null;
  function idDaVisita() {
    if (visita) return visita;
    try { visita = sessionStorage.getItem('condeclub.visita'); } catch (e) { /* bloqueado */ }
    if (!visita) {
      visita = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).replace(/-/g, '');
      try { sessionStorage.setItem('condeclub.visita', visita); } catch (e) { /* bloqueado */ }
    }
    return visita;
  }
  function registrar(nome, props) {
    try {
      fetch(cfg.url + '/rest/v1/rpc/track_event', {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json', apikey: cfg.anon, authorization: 'Bearer ' + cfg.anon },
        body: JSON.stringify({ p_name: nome, p_session_id: idDaVisita(), p_source: 'site', p_props: props || {} }),
      }).catch(function () {});
    } catch (e) { /* nunca atrapalha a página */ }
  }
  return { registrar };
})();

// Contador do rodapé: total público de visitas (lido do mesmo banco do funil).
(function mostrarVisitas() {
  const el = document.getElementById('visit-count');
  const cfg = window.CONDECLUB_FUNIL;
  if (!el || !cfg || !cfg.url) return;
  fetch(cfg.url + '/rest/v1/rpc/contar_visitas', {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: cfg.anon, authorization: 'Bearer ' + cfg.anon },
    body: '{}',
  })
    .then(function (r) { return r.json(); })
    .then(function (n) { if (typeof n === 'number') el.textContent = n.toLocaleString('pt-BR'); })
    .catch(function () {});
})();

funil.registrar('viu_pagina', { ref: document.referrer ? new URL(document.referrer).hostname : '' });
document.querySelectorAll('[data-checkout]').forEach(function (el) {
  el.addEventListener('click', function () {
    funil.registrar('clicou_assinar', { onde: el.getAttribute('data-analytics') || '' });
  });
});

function track(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {});
  }
  if (typeof window.ttq !== 'undefined' && window.ttq.track) {
    window.ttq.track(eventName, params || {});
  }
}

document.querySelectorAll('[data-analytics]').forEach((el) => {
  el.addEventListener('click', () => {
    el.getAttribute('data-analytics').split(' ').forEach((eventName) => track(eventName));
  });
});

// ============================================================
//   VÍDEO: video_play / video_complete
// ============================================================
const presentationVideo = document.querySelector('[data-analytics-video]');
if (presentationVideo) {
  let playFired = false;
  presentationVideo.addEventListener('play', () => {
    if (!playFired) { track('video_play'); playFired = true; }
    document.getElementById('video-player')?.classList.add('is-playing');
  });
  presentationVideo.addEventListener('ended', () => {
    track('video_complete');
    // O vídeo termina apontando para o botão logo abaixo: sai da tela cheia,
    // rola até ele e chama atenção por alguns segundos.
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (presentationVideo.webkitDisplayingFullscreen) presentationVideo.webkitExitFullscreen();
    } catch (_) { /* alguns navegadores não permitem; segue */ }
    const cta = document.getElementById('video-cta');
    if (!cta) return;
    setTimeout(() => {
      cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cta.classList.add('is-highlight');
      setTimeout(() => cta.classList.remove('is-highlight'), 6000);
    }, 300);
  });
}

// course_section_view / pricing_view: dispara quando a seção entra na tela
const viewOnceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      track(entry.target.dataset.viewEvent);
      viewOnceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const tracksSection = document.getElementById('trilhas');
if (tracksSection) {
  tracksSection.dataset.viewEvent = 'course_section_view';
  viewOnceObserver.observe(tracksSection);
}

const pricingSection = document.getElementById('planos');
if (pricingSection) {
  pricingSection.dataset.viewEvent = 'pricing_view';
  viewOnceObserver.observe(pricingSection);
}
