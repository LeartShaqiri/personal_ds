// ============================================
// VITA DAIRY — Premium Interactions
// ============================================

// Always start at top on load / refresh
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileNav.classList.toggle('open', menuOpen);
  hamburger.setAttribute('aria-expanded', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Hero parallax
const heroBg = document.querySelector('.hero__bg-img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrollY <= heroHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.05)`;
    }
  }, { passive: true });
}

// Editorial image parallax
const edImages = document.querySelectorAll('.ed-story__image-wrap img');
const edObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.closest('.ed-story__image-wrap').classList.add('ed-parallax--active');
    }
  });
}, { threshold: 0 });

edImages.forEach(img => edObserver.observe(img));

window.addEventListener('scroll', () => {
  document.querySelectorAll('.ed-parallax--active').forEach(wrap => {
    const rect = wrap.getBoundingClientRect();
    const offset = (rect.top / window.innerHeight) * 60 - 30;
    wrap.querySelector('img').style.transform = `scale(1.04) translateY(${offset}px)`;
  });
}, { passive: true });

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.contact__submit');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#123A6F';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// Reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
  });
}

// ============================================
// FLOATING ICON
// ============================================

// Init mascot
const mascot = document.getElementById('mascot');

// Show mascot after scrolling past hero
let mascotVisible = false;
const hero = document.querySelector('.hero');

function checkMascotVisibility() {
  if (!hero || prefersReduced) return;
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom < 0 && !mascotVisible) {
    mascotVisible = true;
    mascot.classList.add('mascot--visible');
  }
}

window.addEventListener('scroll', checkMascotVisibility, { passive: true });
checkMascotVisibility();

// ============================================
// PIXEL DISSOLVE TRANSITION (Cinematic — Real DOM Capture + GSAP)
// ============================================

const dissolveCanvas = document.getElementById('dissolve-canvas');
const dCtx = dissolveCanvas.getContext('2d', { alpha: false });
let dissolving = false;

function resizeDissolveCanvas() {
  dissolveCanvas.width = window.innerWidth;
  dissolveCanvas.height = window.innerHeight;
}
resizeDissolveCanvas();
window.addEventListener('resize', resizeDissolveCanvas);

// ── Real page capture via html2canvas (fallback: section bands) ───────────
async function capturePage() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const sx = window.scrollX, sy = window.scrollY;
  try {
    const raw = await html2canvas(document.documentElement, {
      allowTaint: true,       // draw cross-origin images even if tainted
      // NO useCORS — would block images from servers without CORS headers
      scale: 1,
      logging: false,
      width: vw,
      height: vh,
      windowWidth: vw,
      windowHeight: vh,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.scrollTop = sy;
        clonedDoc.documentElement.scrollLeft = sx;
      },
    });
    const vp = document.createElement('canvas');
    vp.width = vw; vp.height = vh;
    const vctx = vp.getContext('2d');
    vctx.drawImage(raw, 0, 0, vw, vh, 0, 0, vw, vh);
    return vp;
  } catch (_) {
    // Fallback: stylized section bands
    const w = window.innerWidth, h = window.innerHeight;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const ctx = off.getContext('2d');
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    const sy = window.scrollY, vh = h;
    const secs = [
      { top: 0, h: vh, color: '#123A6F' },
      { top: vh, h: vh * 0.6, color: '#F7F9FC' },
      { top: vh * 1.6, h: vh * 0.9, color: '#FFFFFF' },
      { top: vh * 2.5, h: vh * 2.8, color: '#F7F9FC' },
      { top: vh * 5.3, h: vh * 2.5, color: '#FFFFFF' },
      { top: vh * 7.8, h: vh * 1.3, color: '#FFFFFF' },
      { top: vh * 9.1, h: vh * 1.5, color: '#F7F9FC' },
      { top: vh * 10.6, h: vh * 1, color: '#FFFFFF' },
      { top: vh * 11.6, h: vh * 0.8, color: '#123A6F' },
    ];
    secs.forEach(s => {
      const y = s.top - sy;
      if (y + s.h > 0 && y < vh) ctx.fillRect(0, Math.max(0, y), w, s.h);
    });
    return off;
  }
}

// ── Block builder with organic dissolve thresholds ────────────────────────
function buildBlocks(w, h, originX, originY) {
  const blocks = [];
  const maxB = 12, minB = 3;
  const maxDist = Math.hypot(w, h);
  const ox2 = originX + (Math.random() - 0.5) * w * 0.6;
  const oy2 = originY + (Math.random() - 0.5) * h * 0.4;

  for (let y = 0; y < h; y += maxB) {
    for (let x = 0; x < w; x += maxB) {
      const bw = minB + Math.floor(Math.random() * (maxB - minB + 1));
      const bh = minB + Math.floor(Math.random() * (maxB - minB + 1));
      const cx = x + bw / 2, cy = y + bh / 2;
      const d1 = Math.hypot(cx - originX, cy - originY);
      const d2 = Math.hypot(cx - ox2, cy - oy2);
      const distMix = d1 * 0.7 + d2 * 0.3;
      const threshold =
        (distMix / maxDist) * 0.50 + Math.random() * 0.30 + (cx / w) * 0.20;

      blocks.push({
        sx: x, sy: y, sw: bw, sh: bh, cx, cy,
        threshold: Math.min(threshold, 0.93),
        driftX: (Math.random() - 0.5) * 80,
        driftY: -15 - Math.random() * 55,
        rotation: (Math.random() - 0.5) * 0.8,
        scaleEnd: 0.15 + Math.random() * 0.5,
        glow: Math.random() < 0.12,
      });
    }
  }
  return blocks;
}

// ── Cinematic dissolve ────────────────────────────────────────────────────
async function pixelDissolve(clickX, clickY) {
  if (dissolving) return;
  if (prefersReduced) { window.location.href = 'game.html'; return; }
  dissolving = true;

  const w = dissolveCanvas.width, h = dissolveCanvas.height;

  // ── 1. Capture viewport FIRST — user sees zero visual change ──
  const capture = await capturePage();
  const blocks = buildBlocks(w, h, clickX, clickY);

  // ── 2. Pre-draw capture, then freeze page (compensate scrollbar) ──
  dCtx.clearRect(0, 0, w, h);
  dCtx.drawImage(capture, 0, 0);

  const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

  mascot.classList.remove('mascot--visible');
  mascot.classList.add('mascot--hiding');

  // ── 3. Reveal dissolve canvas (already shows the captured viewport) ──
  dissolveCanvas.style.opacity = '1';

  // ── 4. Dissolve the captured viewport pixel-by-pixel ──
  const transitionW = 0.30;
  const master = { progress: 0 };

  gsap.to(master, {
    progress: 1,
    duration: 2.8,
    ease: 'power4.inOut',
    onUpdate: () => {
      const p = master.progress;
      dCtx.clearRect(0, 0, w, h);
      dCtx.drawImage(capture, 0, 0);

      if (p > 0.3) {
        const va = (p - 0.3) / 0.7 * 0.25;
        const grd = dCtx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, `rgba(0,0,0,${va})`);
        dCtx.fillStyle = grd;
        dCtx.fillRect(0, 0, w, h);
      }

      for (const b of blocks) {
        const localT = (p - b.threshold) / transitionW;
        if (localT <= 0) continue;
        dCtx.clearRect(b.sx, b.sy, b.sw, b.sh);
        if (localT >= 1) continue;

        const alpha = 1 - localT;
        const scale = 1 - localT * (1 - b.scaleEnd);
        const dx = b.driftX * localT;
        const dy = b.driftY * localT;

        dCtx.save();
        dCtx.globalAlpha = alpha;
        if (b.glow && localT < 0.3)
          dCtx.globalAlpha = Math.min(1, alpha + (0.3 - localT) * 2);

        dCtx.translate(b.cx + dx, b.cy + dy);
        dCtx.rotate(b.rotation * localT);
        dCtx.scale(scale, scale);
        dCtx.drawImage(capture, b.sx, b.sy, b.sw, b.sh, -b.sw / 2, -b.sh / 2, b.sw, b.sh);
        dCtx.restore();
      }
    },
    onComplete: () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      dissolveCanvas.style.opacity = '0';
      window.location.href = 'game.html';
    }
  });
}

mascot.addEventListener('click', (e) => {
  if (dissolving) return;
  const rect = mascot.getBoundingClientRect();
  pixelDissolve(rect.left + rect.width / 2, rect.top + rect.height / 2);
});
