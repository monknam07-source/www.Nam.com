/**
 * NAM PORTFOLIO – main.js
 * Author : Khairul Anuar bin Sulaiman
 * Version: 1.0.0
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   DOM helpers
───────────────────────────────────────────────────────── */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ─────────────────────────────────────────────────────────
   Theme Toggle
───────────────────────────────────────────────────────── */
(function initTheme() {
  const btn  = $('#theme-toggle');
  const icon = $('#theme-icon');
  const body = document.body;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  body.dataset.theme = saved;
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

/* ─────────────────────────────────────────────────────────
   Sticky header shadow
───────────────────────────────────────────────────────── */
(function initHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────────────────────
   Mobile Navigation
───────────────────────────────────────────────────────── */
(function initMobileNav() {
  const burger  = $('#nav-burger');
  const navList = $('#nav-list');

  burger.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // Close nav when a link is clicked
  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navList.classList.contains('open')) {
      navList.classList.remove('open');
      burger.classList.remove('open');
    }
  });
})();

/* ─────────────────────────────────────────────────────────
   Active nav link on scroll
───────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => link.classList.remove('active'));
          const active = links.find(link => link.getAttribute('href') === `#${entry.target.id}`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: `-${64}px 0px -50% 0px` }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ─────────────────────────────────────────────────────────
   Typewriter effect
───────────────────────────────────────────────────────── */
(function initTypewriter() {
  const el    = $('#typewriter');
  const roles = [
    'Software Developer',
    'Electronics Technician',
    'Full-Stack Developer',
    'IoT Enthusiast',
    'Mobile Developer',
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pause    = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    if (!pause) setTimeout(tick, deleting ? 50 : 100);
  }

  setTimeout(tick, 600);
})();

/* ─────────────────────────────────────────────────────────
   Particle background
───────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  $('#particles').appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;
  const ACCENT = () => getComputedStyle(document.body)
    .getPropertyValue('--accent-rgb').trim() || '88,166,255';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const rgb = ACCENT();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

/* ─────────────────────────────────────────────────────────
   Scroll Reveal
───────────────────────────────────────────────────────── */
(function initReveal() {
  const targets = [
    ...$$('.project-card'),
    ...$$('.stat-card'),
    ...$$('.skill-bar'),
    ...$$('.contact-card'),
    ...$$('.timeline__card'),
    ...$$('.about__text'),
    ...$$('.badge'),
  ];

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────
   Skill bar animation (triggered on reveal)
───────────────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = $$('.skill-bar__fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width  = target.dataset.width || 0;
          // Short delay so CSS transition fires properly
          requestAnimationFrame(() => {
            target.style.width = `${width}%`;
          });
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ─────────────────────────────────────────────────────────
   Counter animation
───────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = $$('[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const step   = Math.ceil(target / 50);
        let current  = 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (target >= 10 ? '+' : '');
          if (current >= target) clearInterval(timer);
        }, 30);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ─────────────────────────────────────────────────────────
   Project Filter
───────────────────────────────────────────────────────── */
(function initProjectFilter() {
  const buttons = $$('.filter-btn');
  const cards   = $$('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        // Re-trigger reveal on visible cards
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => card.classList.add('visible'));
        }
      });
    });
  });
})();

/* ─────────────────────────────────────────────────────────
   Contact Form Validation
───────────────────────────────────────────────────────── */
(function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');

  if (!form) return;

  function validate(field) {
    const errEl = $(`#${field.id}-error`);
    let msg = '';
    if (!field.value.trim()) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      msg = 'Please enter a valid email address.';
    }
    if (errEl) errEl.textContent = msg;
    field.classList.toggle('invalid', !!msg);
    return !msg;
  }

  // Live validation
  $$('input, textarea', form).forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validate(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = $$('input, textarea', form);
    const valid  = fields.map(validate).every(Boolean);

    if (!valid) {
      status.textContent  = 'Please fix the errors above.';
      status.className    = 'form-status error';
      return;
    }

    // Simulate send (replace with real backend / EmailJS / Formspree)
    const btn = $('button[type="submit"]', form);
    btn.disabled     = true;
    btn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    status.textContent = '';

    setTimeout(() => {
      status.textContent  = "✅ Message sent! I'll get back to you soon.";
      status.className    = 'form-status success';
      btn.disabled        = false;
      btn.innerHTML       = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      fields.forEach(f => f.classList.remove('invalid'));
    }, 1500);
  });
})();

/* ─────────────────────────────────────────────────────────
   Back to Top
───────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#back-to-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────────────────
   Footer year
───────────────────────────────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
