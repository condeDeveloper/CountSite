// ============================================================
//   FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq__question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq__item');
    const isOpen = item.classList.contains('open');

    // Fecha todos os outros
    document.querySelectorAll('.faq__item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle o clicado
    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ============================================================
//   HEADER: adiciona sombra ao rolar
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
  '.pain__card, .course__card, .testimonial__card, .compare__col, .ctaprod__item, .faq__item'
).forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});
