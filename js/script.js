/* ═══════════════════════════════════════════════════════════════
   PORTAFOLIO — EMERSON CORREDOR MURCIA
   script.js — Adaptado a estructura anniebombanie
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const onReady = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

// ──────────────────────────────────────────────────────────
// 1. LOADER
// ──────────────────────────────────────────────────────────
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 400);
  });

  setTimeout(() => loader.classList.add('hidden'), 3500);
  document.body.style.overflow = 'hidden';
}

// ──────────────────────────────────────────────────────────
// 2. CURSOR PERSONALIZADO
// ──────────────────────────────────────────────────────────
function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    $$('button, a').forEach(el => el.style.cursor = 'auto');
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

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  const interactives = $$('a, button, .skill__tag, .project, .contact__social-link, [role="button"]');
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

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = follower.style.opacity = '1';
  });
}

// ──────────────────────────────────────────────────────────
// 3. NAVBAR
// ──────────────────────────────────────────────────────────
function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!navbar) return;

  // Mobile menu
  if (hamburger && navLinks) {
    const overlay = document.createElement('div');
    overlay.className = 'navbar__overlay';
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

    hamburger.addEventListener('click', () =>
      navLinks.classList.contains('open') ? closeMenu() : openMenu()
    );
    overlay.addEventListener('click', closeMenu);
    $$('.navbar__link').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
  }

  // Active link con IntersectionObserver
  const sections = $$('section[id]');
  const navItems = $$('.navbar__link[data-section]');

  if (sections.length && navItems.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(link =>
            link.classList.toggle('active', link.dataset.section === entry.target.id)
          );
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }
}

// ──────────────────────────────────────────────────────────
// 4. HERO — Texto rotante (estilo anniebombanie)
// ──────────────────────────────────────────────────────────
function initHeroRotating() {
  const el = $('#rotatingWord');
  if (!el) return;

  const words = [
    'apasionado del código',
    'desarrollador web',
    'entusiasta de Python',
    'solucionador de problemas',
    'estudiante de sistemas',
    'constructor de ideas'
  ];

  let idx     = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const word = words[idx];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, 2200); // pausa antes de borrar
        return;
      }
      setTimeout(type, 65);
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }

  setTimeout(type, 800);
}

// ──────────────────────────────────────────────────────────
// 5. REVEAL + ANIMACIONES DE ENTRADA DIRECCIONALES
// ──────────────────────────────────────────────────────────
function initReveal() {
  // Observamos tanto .reveal (legacy) como [data-anim] (nuevo sistema)
  const revealItems = $$('.reveal');
  const animItems   = $$('[data-anim]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(el => io.observe(el));
  animItems.forEach(el => io.observe(el));
}

// ──────────────────────────────────────────────────────────
// 6. SMOOTH SCROLL
// ──────────────────────────────────────────────────────────
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ──────────────────────────────────────────────────────────
// 7. BACK TO TOP
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
// 8. FORMULARIO DE CONTACTO
// ──────────────────────────────────────────────────────────
function initContactForm() {
  const form   = $('#contactForm');
  const status = $('#formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = ($('#contactName')?.value   || '').trim();
    const email   = ($('#contactEmail')?.value  || '').trim();
    const message = ($('#contactMessage')?.value|| '').trim();

    if (!name || !email || !message) {
      status.textContent = '⚠️ Por favor completa todos los campos.';
      status.className   = 'form__status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠️ El email no es válido.';
      status.className   = 'form__status error';
      return;
    }

    const btn = $('#submitBtn');
    if (btn) {
      btn.disabled    = true;
      btn.textContent = 'Enviando...';
    }

    // Simular envío (sin backend)
    setTimeout(() => {
      status.textContent = '✅ ¡Mensaje enviado! Te respondo pronto.';
      status.className   = 'form__status success';
      form.reset();
      if (btn) { btn.disabled = false; btn.innerHTML = 'Enviar mensaje <i class="bx bx-send"></i>'; }
      setTimeout(() => { status.textContent = ''; status.className = 'form__status'; }, 6000);
    }, 1200);
  });
}

// ──────────────────────────────────────────────────────────
// 9. ANIMACIONES 3D TILT en proyectos (mockup del navegador)
// ──────────────────────────────────────────────────────────
function initProjectTilt() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile) return;

  const projects = $$('.project');

  projects.forEach(function(project) {
    const browser = project.querySelector('.project__mockup-browser');
    if (!browser) return;

    var MAX_TILT  = 10;
    var MAX_TRANS = 5;

    var isHovering  = false;
    var rafId       = null;
    var targetRotX  = 0, targetRotY = 0;
    var currentRotX = 0, currentRotY = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateTilt() {
      if (!isHovering) return;
      currentRotX = lerp(currentRotX, targetRotX, 0.09);
      currentRotY = lerp(currentRotY, targetRotY, 0.09);
      browser.style.transform =
        'perspective(900px) rotateX(' + currentRotX + 'deg) rotateY(' + currentRotY + 'deg) scale3d(1.02,1.02,1.02) translateZ(8px)';
      rafId = requestAnimationFrame(animateTilt);
    }

    project.addEventListener('mouseenter', function() {
      isHovering = true;
      cancelAnimationFrame(rafId);
      animateTilt();
    });

    project.addEventListener('mousemove', function(e) {
      var rect = project.querySelector('.project__visual').getBoundingClientRect();
      var relX = (e.clientX - rect.left)  / rect.width  - 0.5;
      var relY = (e.clientY - rect.top)   / rect.height - 0.5;

      targetRotY =  relX * MAX_TILT * 2;
      targetRotX = -relY * MAX_TILT;

      // Parallax de la imagen
      var img = project.querySelector('.project__mockup-img');
      if (img) {
        img.style.transform = 'translate(' + (relX * MAX_TRANS) + 'px, ' + (relY * MAX_TRANS) + 'px) scale(1.06)';
      }

      // Spotlight glow
      browser.style.backgroundImage =
        'radial-gradient(circle at ' + (e.clientX - rect.left) + 'px ' + (e.clientY - rect.top) + 'px, rgba(124,106,255,0.05) 0%, transparent 60%)';
    });

    project.addEventListener('mouseleave', function() {
      isHovering = false;
      cancelAnimationFrame(rafId);

      function resetTilt() {
        currentRotX = lerp(currentRotX, 0, 0.15);
        currentRotY = lerp(currentRotY, 0, 0.15);
        var dist = Math.abs(currentRotX) + Math.abs(currentRotY);
        browser.style.transform =
          'perspective(900px) rotateX(' + currentRotX + 'deg) rotateY(' + currentRotY + 'deg) scale3d(1,1,1)';
        if (dist > 0.05) {
          requestAnimationFrame(resetTilt);
        } else {
          browser.style.transform = '';
          browser.style.backgroundImage = '';
        }
      }
      requestAnimationFrame(resetTilt);

      var img = project.querySelector('.project__mockup-img');
      if (img) {
        img.style.transform = '';
        img.style.transition = 'transform 0.5s ease';
        setTimeout(function() { img.style.transition = ''; }, 500);
      }
    });
  });
}

// ──────────────────────────────────────────────────────────
// 10. MAGNETIC BUTTONS — Botones de proyecto siguen el cursor
// ──────────────────────────────────────────────────────────
function initMagneticButtons() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile) return;

  $$('.project__btn').forEach(function(btn) {
    var STRENGTH = 0.3;

    btn.addEventListener('mousemove', function(e) {
      var rect    = btn.getBoundingClientRect();
      var dx = (e.clientX - (rect.left + rect.width  / 2)) * STRENGTH;
      var dy = (e.clientY - (rect.top  + rect.height / 2)) * STRENGTH;
      btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      btn.style.transform  = '';
      setTimeout(function() { btn.style.transition = ''; }, 500);
    });
  });
}

// ──────────────────────────────────────────────────────────
// 11. SKILL TAGS — Efecto stagger al entrar en viewport
// ──────────────────────────────────────────────────────────
function initSkillsStagger() {
  const grid = $('.skills__grid');
  if (!grid) return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();

    $$('.skill__tag', grid).forEach((tag, i) => {
      tag.style.opacity   = '0';
      tag.style.transform = 'translateY(12px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        tag.style.opacity   = '1';
        tag.style.transform = '';
      }, i * 60);
    });
  }, { threshold: 0.2 });

  io.observe(grid);
}

// ──────────────────────────────────────────────────────────
// 12. EASTER EGG CONSOLA
// ──────────────────────────────────────────────────────────
function initConsole() {
  const s1 = 'color:#7c6aff;font-size:18px;font-weight:bold;font-family:monospace';
  const s2 = 'color:#3dd9c5;font-size:13px;font-family:monospace';
  const s3 = 'color:#9898b8;font-size:12px;font-family:monospace';
  console.log('%c╔══════════════════════════════════╗', s1);
  console.log('%c  Emerson Corredor Murcia           ', s1);
  console.log('%c  Desarrollador de Software         ', s2);
  console.log('%c╚══════════════════════════════════╝', s1);
  console.log('%c🚀 github.com/V44nxx', s2);
  console.log('%c📧 murciacorredoremerson@gmail.com', s3);
}

// ──────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────
onReady(() => {
  initLoader();
  initCursor();
  initNavbar();
  initHeroRotating();
  initReveal();
  initSmoothScroll();
  initBackToTop();
  initContactForm();
  initProjectTilt();
  initMagneticButtons();
  initSkillsStagger();
  initConsole();
});
