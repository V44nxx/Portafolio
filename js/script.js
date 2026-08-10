/* ═══════════════════════════════════════════════════════════════
   PORTAFOLIO — EMERSON CORREDOR MURCIA
   script.js — JavaScript principal
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────────
// 1. UTILIDADES
// ──────────────────────────────────────────────────────────

/** Seleccionar un elemento del DOM */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
/** Seleccionar múltiples elementos del DOM */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Esperar a que el DOM esté listo */
const onReady = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

// ──────────────────────────────────────────────────────────
// 2. LOADER — Pantalla de carga
// ──────────────────────────────────────────────────────────
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Habilitar animaciones de hero después del loader
      document.body.style.overflow = '';
    }, 400);
  });

  // Fallback si load tarda demasiado
  setTimeout(() => loader.classList.add('hidden'), 3500);
  document.body.style.overflow = 'hidden';
}

// ──────────────────────────────────────────────────────────
// 3. CURSOR PERSONALIZADO
// ──────────────────────────────────────────────────────────
function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');

  if (!cursor || !follower) return;

  // Verificar si es dispositivo táctil
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower con lag suave
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover en elementos interactivos
  const interactives = $$('a, button, .tech__card, .project__card, .service__card, .education__card, [role="button"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });

  // Ocultar cursor cuando sale de la ventana
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
}

// ──────────────────────────────────────────────────────────
// 4. NAVBAR
// ──────────────────────────────────────────────────────────
function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!navbar) return;

  // Scroll effect
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 50;

  function onScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger — menú móvil
  if (hamburger && navLinks) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'navbar__overlay';
    overlay.id = 'navOverlay';
    document.body.appendChild(overlay);

    function openMenu() {
      navLinks.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Cerrar al hacer clic en un link
    $$('.navbar__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Active link al hacer scroll
  const sections = $$('section[id]');
  const navItems = $$('.navbar__link[data-section]');

  if (sections.length && navItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
  }
}

// ──────────────────────────────────────────────────────────
// 5. CANVAS — Partículas del Hero
// ──────────────────────────────────────────────────────────
function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = (Math.random() - 0.5) * 0.4;
      this.r   = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 142, 247, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 142, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  // Pausar cuando no es visible (performance)
  const heroSection = $('#inicio');
  if (heroSection && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!animId) animate();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    obs.observe(heroSection);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });

  // Reducir movimiento
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    init();
    animate();
  }
}

// ──────────────────────────────────────────────────────────
// 6. TERMINAL TYPING ANIMATION
// ──────────────────────────────────────────────────────────
function initTerminal() {
  const cmds = $$('.terminal__cmd[data-text]');
  if (!cmds.length) return;

  async function typeText(el, text, speed = 60) {
    el.textContent = '';
    for (const char of text) {
      el.textContent += char;
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async function runTerminal() {
    await new Promise(r => setTimeout(r, 1500));
    for (const cmd of cmds) {
      await typeText(cmd, cmd.dataset.text, 65);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    runTerminal();
  } else {
    cmds.forEach(cmd => { cmd.textContent = cmd.dataset.text; });
  }
}

// ──────────────────────────────────────────────────────────
// 7. HERO TYPING — Texto del rol
// ──────────────────────────────────────────────────────────
function initHeroTyping() {
  const el = $('#typingText');
  if (!el) return;

  const roles = [
    'Desarrollador de Software',
    'Desarrollador Web',
    'Backend Developer',
    'Estudiante de Ing. Sistemas',
    'Desarrollador Full-Stack',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function type() {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 90;

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex--);
    } else {
      el.textContent = current.slice(0, charIndex++);
    }

    if (!isDeleting && charIndex > current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }

    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      charIndex  = 0;
      setTimeout(type, 400);
      return;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}

// ──────────────────────────────────────────────────────────
// 8. SCROLL REVEAL ANIMATIONS
// ──────────────────────────────────────────────────────────
function initReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || i * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || (i % 4) * 100;
    observer.observe(el);
  });
}

// ──────────────────────────────────────────────────────────
// 9. SMOOTH SCROLL
// ──────────────────────────────────────────────────────────
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ──────────────────────────────────────────────────────────
// 10. BACK TO TOP
// ──────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ──────────────────────────────────────────────────────────
// 11. FORMULARIO DE CONTACTO — Validación frontend
// ──────────────────────────────────────────────────────────
function initContactForm() {
  const form     = $('#contactForm');
  const statusEl = $('#formStatus');
  if (!form) return;

  // Validaciones
  const validators = {
    name: {
      el: $('#contactName'),
      errEl: $('#nameError'),
      validate(v) {
        if (!v.trim()) return 'El nombre es requerido.';
        if (v.trim().length < 2) return 'Ingresa un nombre válido.';
        return '';
      }
    },
    email: {
      el: $('#contactEmail'),
      errEl: $('#emailError'),
      validate(v) {
        if (!v.trim()) return 'El correo es requerido.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresa un correo válido.';
        return '';
      }
    },
    subject: {
      el: $('#contactSubject'),
      errEl: $('#subjectError'),
      validate(v) {
        if (!v.trim()) return 'El asunto es requerido.';
        return '';
      }
    },
    message: {
      el: $('#contactMessage'),
      errEl: $('#messageError'),
      validate(v) {
        if (!v.trim()) return 'El mensaje es requerido.';
        if (v.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
        return '';
      }
    }
  };

  // Validar un campo individual
  function validateField(key) {
    const { el, errEl, validate } = validators[key];
    const error = validate(el.value);
    el.classList.toggle('error', !!error);
    if (errEl) errEl.textContent = error;
    return !error;
  }

  // Validación en tiempo real
  Object.keys(validators).forEach(key => {
    const { el } = validators[key];
    if (!el) return;
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(key);
    });
  });

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validar todos los campos
    const isValid = Object.keys(validators).map(k => validateField(k)).every(Boolean);
    if (!isValid) return;

    const submitBtn = $('#submitBtn');
    const btnText   = submitBtn.querySelector('span');
    const btnIcon   = submitBtn.querySelector('i');

    // Estado cargando
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnIcon.className   = 'bx bx-loader-alt bx-spin';
    statusEl.className  = 'form__status info';
    statusEl.textContent = '';

    /*
     * ════════════════════════════════════════════════════════════
     * NOTA: El formulario no envía mensajes realmente sin backend.
     * Para activar el envío real, puedes:
     *
     * OPCIÓN 1 — Formspree (más fácil):
     *   1. Crea cuenta en formspree.io
     *   2. Crea un formulario y obtén tu endpoint
     *   3. Cambia la acción del fetch a tu URL de Formspree
     *   4. Agrega en el HTML: <form action="https://formspree.io/f/TU_ID" method="POST">
     *
     * OPCIÓN 2 — EmailJS:
     *   1. Crea cuenta en emailjs.com
     *   2. Configura un servicio y template
     *   3. Llama a emailjs.send() aquí
     *
     * OPCIÓN 3 — Tu propio endpoint Flask:
     *   1. Crea una ruta POST /api/contact en Flask
     *   2. Cambia la URL del fetch a tu endpoint
     * ════════════════════════════════════════════════════════════
     */

    // Simulación de envío (reemplazar con integración real)
    await new Promise(r => setTimeout(r, 1500));

    // Mostrar mensaje informativo
    statusEl.className  = 'form__status info';
    statusEl.textContent = '⚠ Configura un backend o Formspree para enviar mensajes reales. El formulario está listo para integrarse.';

    // Restaurar botón
    submitBtn.disabled  = false;
    btnText.textContent = 'Enviar mensaje';
    btnIcon.className   = 'bx bx-send';

    /*
     * Cuando tengas el backend configurado, reemplaza la simulación
     * de arriba con algo como:
     *
     * try {
     *   const res = await fetch('TU_ENDPOINT', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *       name: validators.name.el.value,
     *       email: validators.email.el.value,
     *       subject: validators.subject.el.value,
     *       message: validators.message.el.value,
     *     })
     *   });
     *   if (res.ok) {
     *     statusEl.className = 'form__status success';
     *     statusEl.textContent = '✓ Mensaje enviado correctamente. ¡Te contactaré pronto!';
     *     form.reset();
     *   } else {
     *     throw new Error('Error al enviar');
     *   }
     * } catch (err) {
     *   statusEl.className = 'form__status error';
     *   statusEl.textContent = '✗ Error al enviar. Por favor intenta de nuevo.';
     * }
     */
  });
}

// ──────────────────────────────────────────────────────────
// 12. TECH CARDS — Efecto de iluminación con el mouse
// ──────────────────────────────────────────────────────────
function initTechCardGlow() {
  $$('.tech__card, .project__card, .service__card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

// ──────────────────────────────────────────────────────────
// 13. PARALLAX SUTIL en Hero
// ──────────────────────────────────────────────────────────
function initParallax() {
  const heroGradient = $('.hero__gradient');
  if (!heroGradient) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroGradient.style.transform = `translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

// ──────────────────────────────────────────────────────────
// 14. COUNTER ANIMATION — Stats del hero
// ──────────────────────────────────────────────────────────
function initCounters() {
  const counters = $$('.hero__stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const target  = parseFloat(el.textContent);
      const suffix  = el.textContent.replace(/[0-9.]/g, '');
      const isFloat = el.textContent.includes('.');

      if (isNaN(target)) return;

      let current = 0;
      const increment = target / 40;
      const step = () => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        requestAnimationFrame(step);
      };
      step();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ──────────────────────────────────────────────────────────
// 15. ACTIVE NAV en scroll (mejorado)
// ──────────────────────────────────────────────────────────
function initActiveNav() {
  // Ya implementado en initNavbar usando IntersectionObserver
}

// ──────────────────────────────────────────────────────────
// 16. FAVICON SVG DINÁMICO
// ──────────────────────────────────────────────────────────
function createFaviconSVG() {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4f8ef7"/>
        <stop offset="100%" style="stop-color:#00e5ff"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="#050a14"/>
    <text x="16" y="22" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="14" fill="url(#g)">EC</text>
  </svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);

  let link = $('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

// ──────────────────────────────────────────────────────────
// 17. TECH CARD STAGGER ANIMATION al hacer scroll
// ──────────────────────────────────────────────────────────
function initTechStagger() {
  const techCards = $$('.tech__card, .service__card');
  if (!techCards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = $$('.tech__card, .service__card', entry.target.closest('.tech__grid, .services__grid'));
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.tech__grid, .services__grid').forEach(grid => {
    const cards = $$('.tech__card, .service__card', grid);
    cards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    if (cards[0]) observer.observe(cards[0]);
  });
}

// ──────────────────────────────────────────────────────────
// 18. EASTER EGG — Consola de bienvenida
// ──────────────────────────────────────────────────────────
function initConsoleEasterEgg() {
  const style1 = 'color: #4f8ef7; font-size: 18px; font-weight: bold; font-family: monospace;';
  const style2 = 'color: #00e5ff; font-size: 13px; font-family: monospace;';
  const style3 = 'color: #8696b0; font-size: 12px; font-family: monospace;';

  console.log('%c╔═══════════════════════════════════╗', style1);
  console.log('%c  Emerson Corredor Murcia            ', style1);
  console.log('%c  Desarrollador de Software          ', style2);
  console.log('%c╚═══════════════════════════════════╝', style1);
  console.log('%c🚀 Portafolio construido con HTML, CSS & JS puro', style2);
  console.log('%c📧 ¿Interesado? → Visita la sección de contacto', style3);
  console.log('%c🔗 GitHub: github.com/TU_USUARIO_GITHUB', style3);
}

// ──────────────────────────────────────────────────────────
// 19. INICIALIZAR TODO
// ──────────────────────────────────────────────────────────
onReady(() => {
  initLoader();
  initCursor();
  initNavbar();
  initHeroCanvas();
  initTerminal();
  initHeroTyping();
  initReveal();
  initSmoothScroll();
  initBackToTop();
  initContactForm();
  initTechCardGlow();
  initParallax();
  initCounters();
  initTechStagger();
  createFaviconSVG();
  initConsoleEasterEgg();
});
