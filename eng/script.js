// ============================================================
//   CHECKOUT URL — single source of truth
//   TEMP: reuses the existing Brazilian Kiwify link for the Manual
//   per instructions (no international checkout exists yet).
//   Replace this one line when the international checkout is ready.
// ============================================================
const DEV_MANUAL_CHECKOUT_URL = 'https://pay.kiwify.com.br/g4nOA1U';

document.querySelectorAll('[data-checkout="manual"]').forEach((el) => {
  el.href = DEV_MANUAL_CHECKOUT_URL;
});

// ============================================================
//   VISIT COUNTER
// ============================================================
fetch('https://abacus.jasoncameron.dev/hit/condecount/visits')
  .then((res) => res.json())
  .then((data) => {
    const el = document.getElementById('visit-count');
    if (el) el.textContent = data.value.toLocaleString('en-US');
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
//   HEADER: shadow on scroll
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
//   ENTRY ANIMATION (Intersection Observer)
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
//   UTM PASSTHROUGH: preserves campaign params on checkout links
// ============================================================
(function preserveUTMs() {
  const params = new URLSearchParams(window.location.search);
  const utmEntries = [...params.entries()].filter(([key]) => key.startsWith('utm_'));
  if (!utmEntries.length) return;

  document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach((link) => {
    const url = new URL(link.href);
    utmEntries.forEach(([key, value]) => url.searchParams.set(key, value));
    link.href = url.toString();
  });
})();

// ============================================================
//   ANALYTICS: GA4 + TikTok Pixel (stubs) + custom events
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
    // Paste the official TikTok Pixel snippet from TikTok Ads Manager here
    // once a real ID exists.
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

// view_pricing_intl / view_faq_intl: fire when the section enters view
const viewOnceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      track(entry.target.dataset.viewEvent);
      viewOnceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const pricingSection = document.getElementById('pricing');
if (pricingSection) {
  pricingSection.dataset.viewEvent = 'view_pricing_intl';
  viewOnceObserver.observe(pricingSection);
}

const faqSection = document.getElementById('faq');
if (faqSection) {
  faqSection.dataset.viewEvent = 'view_faq_intl';
  viewOnceObserver.observe(faqSection);
}
