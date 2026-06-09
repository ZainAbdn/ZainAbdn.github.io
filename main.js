/* ═══════════════════════════════════════════════
   ZAIN ABEDEEN · Portfolio JS
   ═══════════════════════════════════════════════ */

/* ── YEAR ────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── GRID CANVAS BACKGROUND ──────────────────── */
(function () {
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  const COLS = 40;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initDots();
  }

  function initDots() {
    dots = [];
    const cellW = W / COLS;
    const cellH = cellW;
    const rows  = Math.ceil(H / cellH) + 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLS; c++) {
        dots.push({
          x: c * cellW,
          y: r * cellH,
          base: Math.random(),
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;
    const cellW = W / COLS;

    // draw subtle grid lines
    ctx.strokeStyle = 'rgba(0,212,255,0.04)';
    ctx.lineWidth = 1;
    for (let d of dots) {
      ctx.beginPath();
      ctx.moveTo(d.x, 0);
      ctx.lineTo(d.x, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, d.y);
      ctx.lineTo(W, d.y);
      ctx.stroke();
    }

    // draw pulsing dots at intersections
    for (let d of dots) {
      const pulse = Math.sin(t + d.phase) * 0.5 + 0.5;
      const alpha = d.base * pulse * 0.55;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── TYPING EFFECT ───────────────────────────── */
(function () {
  const el = document.getElementById('typed-title');
  if (!el) return;
  const phrases = [
    'DevSecOps Engineer',
    'Cloud Security MSc',
    'AWS Specialist',
    'Data Automation'
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 65, SPEED_DEL = 35, PAUSE = 1800;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 300); return;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 600);
})();

/* ── SCROLL REVEAL ───────────────────────────── */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── NAV SCROLL BEHAVIOUR ────────────────────── */
(function () {
  const nav      = document.getElementById('nav');
  const progress = document.getElementById('nav-progress');
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function update() {
    const scrollY = window.scrollY;
    const total   = document.body.scrollHeight - window.innerHeight;
    const pct     = total > 0 ? (scrollY / total) * 100 : 0;

    nav.classList.toggle('scrolled', scrollY > 40);
    progress.style.width = pct + '%';

    // active section
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── HAMBURGER ───────────────────────────────── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  menu.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) toggleMenu(false);
  });
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
