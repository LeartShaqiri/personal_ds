// ============================================
// VITA DAIRY — Premium Interactions
// ============================================

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
// PIXEL MASCOT
// ============================================

// Pixel-art cow sprite (32×32, VITA blue + white)
const COW_SPRITE = [
  '................................', // 0
  '................................', // 1
  '.........2222.....2222.........', // 2
  '........222222...222222........', // 3
  '.......2222222...2222222.......', // 4
  '.......22222222222222222.......', // 5
  '.......2220011221100222.......', // 6  eyes
  '.......2220111221110222.......', // 7  eyes
  '........2200000000022.........', // 8  snout
  '........22001100110022.........', // 9  nostrils
  '........22000122100022.........', // 10 mouth
  '.......22222222222222222.......', // 11
  '......2222222222222222222......', // 12
  '.....22211112222221111222.....', // 13 ears
  '....222111112222211111222....', // 14 ears
  '...22221111111111111112222...', // 15 body top
  '..2222111111111111111112222..', // 16
  '..2222111111111111111112222..', // 17
  '..2222111111111111111112222..', // 18
  '..2222111111111111111112222..', // 19
  '...22221111111111111122222...', // 20
  '.....2222222222222222222.....', // 21
  '........2222...2222..........', // 22 legs
  '........2222...2222..........', // 23 legs
  '........2222...2222..........', // 24 legs
  '........2222...2222..........', // 25 legs
  '.......22222...22222.........', // 26 hooves
  '.......22222...22222.........', // 27 hooves
  '.......11111...11111.........', // 28 hooves dark
  '.......11111...11111.........', // 29 hooves dark
  '............11...............', // 30 tail
  '............11...............', // 31 tail
];

const COLORS = {
  '.': 'transparent',
  '0': '#123A6F',  // dark blue (eyes, snout details)
  '1': '#0057B8',  // VITA blue (body)
  '2': '#FFFFFF',  // white (face, body patches)
};

function drawCow(canvas) {
  const ctx = canvas.getContext('2d');
  const size = 32;
  ctx.clearRect(0, 0, size, size);

  for (let y = 0; y < COW_SPRITE.length; y++) {
    const row = COW_SPRITE[y];
    for (let x = 0; x < row.length; x++) {
      const color = COLORS[row[x]];
      if (color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Init mascot
const mascotCanvas = document.getElementById('mascotSprite');
const mascot = document.getElementById('mascot');
drawCow(mascotCanvas);

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
// PIXEL DISSOLVE TRANSITION
// ============================================

const dissolveCanvas = document.getElementById('dissolve-canvas');
const dCtx = dissolveCanvas.getContext('2d');
let dissolving = false;

function resizeDissolveCanvas() {
  dissolveCanvas.width = window.innerWidth;
  dissolveCanvas.height = window.innerHeight;
}
resizeDissolveCanvas();
window.addEventListener('resize', resizeDissolveCanvas);

function capturePage() {
  // Create an offscreen canvas to snapshot the page
  const offscreen = document.createElement('canvas');
  offscreen.width = window.innerWidth;
  offscreen.height = window.innerHeight;
  const octx = offscreen.getContext('2d');

  // Draw a solid background matching the site
  octx.fillStyle = '#FFFFFF';
  octx.fillRect(0, 0, offscreen.width, offscreen.height);

  // Draw blue-dark strip for hero/footer areas to give the capture depth
  // We'll use html2canvas approach via manual DOM reading isn't ideal.
  // Instead, we'll generate a stylized capture by painting bands of color
  // that represent the page sections — this creates the pixel dissolve effect
  // on a page-colored canvas.

  // Get current scroll position
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight;
  const winH = window.innerHeight;

  // Paint sections based on scroll position (simplified page representation)
  const sections = [
    { top: 0, h: winH, color: '#123A6F' },                    // hero (blue-dark)
    { top: winH, h: winH * 0.6, color: '#F7F9FC' },          // about (gray-light)
    { top: winH * 1.6, h: winH * 0.9, color: '#FFFFFF' },    // timeline (white)
    { top: winH * 2.5, h: winH * 2.8, color: '#F7F9FC' },   // process (gray-light)
    { top: winH * 5.3, h: winH * 2.5, color: '#FFFFFF' },   // products (white)
    { top: winH * 7.8, h: winH * 1.3, color: '#FFFFFF' },   // editorial (white)
    { top: winH * 9.1, h: winH * 1.5, color: '#F7F9FC' },  // news (gray-light)
    { top: winH * 10.6, h: winH * 1, color: '#FFFFFF' },    // contact (white)
    { top: winH * 11.6, h: winH * 0.8, color: '#123A6F' },  // footer (blue-dark)
  ];

  // Map sections to viewport positions
  sections.forEach(s => {
    const y = s.top - scrollY;
    const h = s.h;
    if (y + h > 0 && y < winH) {
      octx.fillStyle = s.color;
      octx.fillRect(0, y, offscreen.width, h);
    }
  });

  return offscreen;
}

function pixelDissolve(clickX, clickY) {
  if (dissolving || prefersReduced) return;
  dissolving = true;

  // Hide mascot
  mascot.classList.remove('mascot--visible');
  mascot.classList.add('mascot--hiding');

  const w = dissolveCanvas.width;
  const h = dissolveCanvas.height;
  const blockSize = 12;
  const cols = Math.ceil(w / blockSize);
  const rows = Math.ceil(h / blockSize);

  // Capture page
  const pageCapture = capturePage();
  dCtx.clearRect(0, 0, w, h);

  // Build pixel block array
  const blocks = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = col * blockSize;
      const by = row * blockSize;
      const cx = bx + blockSize / 2;
      const cy = by + blockSize / 2;
      const dist = Math.hypot(cx - clickX, cy - clickY);
      blocks.push({ bx, by, cx, cy, dist, row, col });
    }
  }

  // Sort by distance from click (closest dissolve first)
  blocks.sort((a, b) => a.dist - b.dist);

  const maxDist = Math.hypot(w, h);
  const duration = 1200; // ms
  const start = performance.now();

  // Hide page content
  document.body.style.overflow = 'hidden';

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease: cubic-bezier
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    dCtx.clearRect(0, 0, w, h);

    // Draw remaining blocks
    const dissolveRadius = eased * maxDist * 1.3;

    blocks.forEach(block => {
      const localProgress = Math.max(0, Math.min(1, (dissolveRadius - block.dist) / (maxDist * 0.4)));
      if (localProgress <= 0) {
        // Draw the block from page capture
        dCtx.drawImage(
          pageCapture,
          block.bx, block.by, blockSize, blockSize,
          block.bx, block.by, blockSize, blockSize
        );
      } else {
        // Dissolved: shrink, scatter, fade
        const alpha = 1 - localProgress;
        if (alpha <= 0) return;
        const scale = 1 - localProgress;
        const scatterX = (block.col % 2 === 0 ? 1 : -1) * localProgress * 40;
        const scatterY = -localProgress * 60;

        dCtx.save();
        dCtx.globalAlpha = alpha;
        dCtx.translate(block.cx + scatterX, block.cy + scatterY);
        dCtx.scale(scale, scale);
        dCtx.drawImage(
          pageCapture,
          block.bx, block.by, blockSize, blockSize,
          -blockSize / 2, -blockSize / 2, blockSize, blockSize
        );
        dCtx.restore();
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Transition complete — show blank page
      dCtx.clearRect(0, 0, w, h);
      document.body.style.overflow = '';
      dissolving = false;
      setTimeout(() => {
        dCtx.clearRect(0, 0, w, h);
        // Reset mascot for replay
        mascot.classList.remove('mascot--hiding');
        if (mascotVisible) {
          mascot.classList.add('mascot--visible');
        }
      }, 100);
    }
  }

  requestAnimationFrame(animate);
}

mascot.addEventListener('click', (e) => {
  if (dissolving) return;
  const rect = mascot.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  pixelDissolve(cx, cy);
});
