/**
 * site.js — Baby Tomar shower site
 * Handles: nav scroll, hamburger menu, reveals, parallax, countdown, form
 */

/* ══ NAV SCROLL STATE ══ */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ══ HERO PARALLAX ══ */
const heroPhoto = document.querySelector('.hero-photo');
window.addEventListener('scroll', () => {
  if (!heroPhoto) return;
  const y = window.scrollY;
  if (y < window.innerHeight * 1.2) {
    heroPhoto.style.transform = `scale(1.08) translateY(${y * 0.2}px)`;
  }
}, { passive: true });

/* ══ SCROLL REVEAL ══ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══ SMOOTH SCROLL for anchor links ══ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══ HAMBURGER MENU ══ */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent scroll behind
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close when overlay tapped
mobileOverlay?.addEventListener('click', closeMenu);

// Close when any mobile link tapped
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ══ iOS BACKGROUND-ATTACHMENT FIX ══
   iOS Safari ignores background-attachment:fixed on non-body elements.
   Detect iOS and switch to a JS-driven transform on the .section-bg divs.
*/
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isIOS) {
  // Already handled by CSS @media (hover:none) — just double-ensure
  document.querySelectorAll('.section-bg, .parallax-bg, .rsvp-bg').forEach(el => {
    el.style.backgroundAttachment = 'scroll';
  });
}

/* ══ COUNTDOWN ══ */
function tick() {
  const target = new Date('2026-05-30T13:00:00');
  const diff   = target - new Date();
  if (diff < 0) { document.getElementById('countdown')?.remove(); return; }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);

  const pad = n => String(n).padStart(2, '0');
  const el = sel => document.querySelector(sel);
  if (el('[data-d]')) el('[data-d]').textContent = pad(d);
  if (el('[data-h]')) el('[data-h]').textContent = pad(h);
  if (el('[data-m]')) el('[data-m]').textContent = pad(m);
  if (el('[data-s]')) el('[data-s]').textContent = pad(s);
}
setInterval(tick, 1000);
tick();

/* ══ RSVP FORM ══
   Uses Formspree. Steps:
   1. Go to formspree.io → sign up free → New Form
   2. Copy your form ID (e.g. xpznqkab)
   3. In index.html replace YOUR_FORMSPREE_ID with your real ID
   Every RSVP will be emailed to you automatically.
*/
document.getElementById('rsvp-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn  = this.querySelector('button[type=submit]');
  const name = document.getElementById('f-name')?.value || 'friend';

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  const action     = this.getAttribute('action') || '';
  const configured = action && !action.includes('YOUR_FORMSPREE_ID');

  if (configured) {
    try {
      await fetch(action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
    } catch(err) {
      console.warn('Formspree error:', err);
    }
  }

  // Show success screen (with small delay if real submission)
  setTimeout(() => {
    this.style.display = 'none';
    const suc = document.getElementById('rsvp-success');
    if (suc) {
      suc.style.display = 'flex';
      const nameEl = suc.querySelector('.suc-name');
      if (nameEl) nameEl.textContent = name;
    }
  }, configured ? 600 : 0);
});

/* ══ LOADER ══ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 700);
    }
    new SnowEngine('snow-canvas');
  }, 2000);
});