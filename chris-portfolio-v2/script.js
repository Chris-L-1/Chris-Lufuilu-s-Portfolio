/* ============================================
   PORTFOLIO - SHARED JAVASCRIPT
   Handles: cursor, nav, transitions, reveal,
            skill bars, scroll-top, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme Toggle ────────────────────────── */
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme  = localStorage.getItem('cl-theme');
  if (savedTheme === 'light') document.body.classList.add('light-theme');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('cl-theme', isLight ? 'light' : 'dark');
    });
  }

  /* ── Custom Cursor ───────────────────────── */
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');

  if (cursor && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Expand on interactive elements
    document.querySelectorAll('a, button, .btn, input, textarea, .project-card')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); ring.classList.add('expand'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); ring.classList.remove('expand'); });
      });
  }

  /* ── Navigation Scroll State ─────────────── */
  const nav = document.querySelector('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active Nav Link ─────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile Menu ─────────────────────────── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ── Page Transitions ────────────────────── */
  const overlay = document.querySelector('.page-transition');

  if (overlay) {
    // Animate out on load
    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => {
      overlay.classList.remove('leaving');
      overlay.style.transform = 'translateY(100%)';
    }, { once: true });

    // Animate in on internal link click
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.style.transform = '';
        overlay.classList.add('entering');
        overlay.addEventListener('animationend', () => {
          window.location.href = href;
        }, { once: true });
      });
    });
  }

  /* ── Scroll Reveal ───────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Skill Bar Animation ─────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.width || '0%';
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => barObserver.observe(bar));
  }

  /* ── Scroll To Top ───────────────────────── */
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact Form ────────────────────────── */
  const form        = document.querySelector('.contact-form-el');
  const formSuccess = document.querySelector('.form-success');
  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1200);
    });
  }

  /* ── Animate numbers (stats) ─────────────── */
  const statNums = document.querySelectorAll('.stat-number[data-target]');
  if (statNums.length) {
    const numObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const dur    = 1500;
          const start  = performance.now();
          const from   = 0;

          const tick = (now) => {
            const progress = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = (from + (target - from) * ease).toFixed(el.dataset.dec || 0) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          numObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => numObserver.observe(el));
  }

  /* ── Add hover cursor pointer to buttons ─── */
  document.querySelectorAll('[role="button"]').forEach(el => {
    el.style.cursor = 'none';
  });

});
