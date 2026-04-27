(() => {
  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 44;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Reveal-on-scroll
  const targets = document.querySelectorAll(
    '.hero-copy, .hero-visual, .tile, .feature-inner, .tech-card, .pro-inner, .cta-band'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  // Subtle parallax on hero device
  const hero = document.querySelector('.hero-visual');
  if (hero && window.matchMedia('(min-width: 700px)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const y = Math.min(window.scrollY, 600);
        hero.style.transform = `translateY(${y * -0.08}px)`;
      },
      { passive: true }
    );
  }
})();
