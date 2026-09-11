// ============================================================
//   GALERIA "POR DENTRO": setas do preview do Manual (mobile)
// ============================================================
(function manualPreviewArrows() {
  const frame = document.getElementById('manual-frame');
  if (!frame) return;

  const viewport = frame.closest('.inside__manual-viewport');
  if (!viewport) return;

  const btnLeft = viewport.querySelector('.inside__drag-hint--left');
  const btnRight = viewport.querySelector('.inside__drag-hint--right');
  const img = frame.querySelector('img');
  if (!btnLeft || !btnRight) return;

  function updateArrows() {
    const maxScroll = frame.scrollWidth - frame.clientWidth;
    const atStart = frame.scrollLeft <= 4;
    const atEnd = frame.scrollLeft >= maxScroll - 4;
    btnLeft.classList.toggle('is-visible', !atStart && maxScroll > 4);
    btnRight.classList.toggle('is-visible', !atEnd && maxScroll > 4);
  }

  btnRight.addEventListener('click', () => {
    frame.scrollBy({ left: frame.clientWidth * 0.9, behavior: 'smooth' });
  });
  btnLeft.addEventListener('click', () => {
    frame.scrollBy({ left: -frame.clientWidth * 0.9, behavior: 'smooth' });
  });

  frame.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  if (img && !img.complete) img.addEventListener('load', updateArrows);
  updateArrows();
})();

// ============================================================
//   CONTADOR DE VISITAS
// ============================================================
fetch('https://abacus.jasoncameron.dev/hit/condecount/visits')
  .then((res) => res.json())
  .then((data) => {
    const el = document.getElementById('visit-count');
    if (el) el.textContent = data.value.toLocaleString('pt-BR');
  })
  .catch(() => {});

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
  '.course__card, .testimonial__card, .faq__item, .inside__card, .how__step, .pricing__card'
).forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================================
//   ATUALIZAÇÕES: renderiza a lista a partir de data/updates.json
// ============================================================
const updatesList = document.getElementById('updates-list');
const UPDATE_ICONS = {
  'Git & GitHub': ['assets/logo-github.webp'],
  'Projetos Full Stack': ['assets/logo-html.webp', 'assets/logo-js.webp'],
  'Python': ['assets/logo-python.webp'],
  'Java': ['assets/logo-java.webp'],
  'C#': ['assets/logo-csharp.webp'],
  'Manual': ['assets/condeclub-manual-cover.webp'],
  'HTML & CSS': ['assets/logo-html.webp', 'assets/logo-css.webp'],
  'JavaScript': ['assets/logo-js.webp'],
};

if (updatesList) {
  fetch('data/updates.json')
    .then((res) => res.json())
    .then((updates) => {
      updatesList.innerHTML = updates.map((u) => {
        const icons = UPDATE_ICONS[u.category] || [];
        const iconsHtml = icons.map((src) => `<img src="${src}" alt="" class="update__icon" loading="lazy" />`).join('');
        return `
        <li class="update__item">
          <span class="update__icons">${iconsHtml}</span>
          <span class="update__title">${u.title} <span style="color:var(--text-dim)">— ${u.category}</span></span>
          ${u.tag ? `<span class="update__tag">${u.tag}</span>` : ''}
        </li>
      `;
      }).join('');
    })
    .catch(() => {
      updatesList.innerHTML = '<li class="update__item">Não foi possível carregar as atualizações agora.</li>';
    });
}

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

// view_pricing / view_faq: dispara quando a seção entra na tela
const viewOnceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      track(entry.target.dataset.viewEvent);
      viewOnceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const pricingSection = document.getElementById('planos');
if (pricingSection) {
  pricingSection.dataset.viewEvent = 'view_pricing';
  viewOnceObserver.observe(pricingSection);
}

const faqSection = document.getElementById('faq');
if (faqSection) {
  faqSection.dataset.viewEvent = 'view_faq';
  viewOnceObserver.observe(faqSection);
}
