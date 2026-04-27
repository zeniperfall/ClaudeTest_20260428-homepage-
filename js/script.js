(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 44;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      // Move keyboard focus to the target for screen readers
      if (target.matches('section, main, [tabindex], h1, h2, h3')) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // Reveal-on-scroll
  const targets = document.querySelectorAll(
    '.hero-copy, .hero-visual, .tile, .feature-inner, .tech-card, .pro-inner, .cta-band'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if (!reduceMotion && 'IntersectionObserver' in window) {
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

  // Subtle parallax on hero device (skip if reduced motion)
  const hero = document.querySelector('.hero-visual');
  if (!reduceMotion && hero && window.matchMedia('(min-width: 700px)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const y = Math.min(window.scrollY, 600);
        hero.style.transform = `translateY(${y * -0.08}px)`;
      },
      { passive: true }
    );
  }

  // Compare row: keyboard navigation (← / →)
  const compareScroll = document.querySelector('.compare-scroll');
  if (compareScroll) {
    compareScroll.setAttribute('tabindex', '0');
    compareScroll.setAttribute('role', 'region');
    compareScroll.setAttribute('aria-label', '제품 비교 카드 가로 스크롤');
    compareScroll.addEventListener('keydown', (e) => {
      const card = compareScroll.querySelector('.compare-card');
      if (!card) return;
      const w = card.getBoundingClientRect().width + 14;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        compareScroll.scrollBy({ left: w, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        compareScroll.scrollBy({ left: -w, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        compareScroll.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        compareScroll.scrollTo({ left: compareScroll.scrollWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // Mark announcement bar with a region role
  const announce = document.querySelector('.announce');
  if (announce && !announce.getAttribute('role')) {
    announce.setAttribute('role', 'region');
    announce.setAttribute('aria-label', '공지');
  }
})();
