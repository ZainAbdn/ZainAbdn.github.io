/* Zain Abedeen — portfolio */

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOUSE = { x: -500, y: -500 };

/* footer year */
document.getElementById('year').textContent = new Date().getFullYear();

/* staggered hero entrance */
(function () {
  const risers = [...document.querySelectorAll('[data-rise]')];
  if (REDUCE_MOTION) return;
  risers.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(26px)';
    el.style.transition = 'opacity .8s var(--ease), transform .8s var(--ease)';
  });
  requestAnimationFrame(() => setTimeout(() => {
    risers.forEach((el, i) => setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }, i * 120));
  }, 80));
})();

/* rotating headline word */
(function () {
  const rot = document.getElementById('rotator');
  if (!rot || REDUCE_MOTION) return;
  const words = ['evidence', 'controls', 'risk', 'identity'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    rot.style.opacity = 0;
    rot.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      rot.textContent = words[i];
      rot.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        rot.style.opacity = 1;
        rot.style.transform = 'none';
      });
    }, 320);
  }, 2600);
})();

/* count-up metrics on scroll into view */
(function () {
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (!reveals.length) return;

  const runCount = (el) => {
    const target = +el.dataset.count;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    if (REDUCE_MOTION) { el.textContent = pre + target + suf; return; }
    const dur = 1500, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (REDUCE_MOTION || !('IntersectionObserver' in window)) return;
  reveals.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.style.opacity = 1;
      el.style.transform = 'none';
      const c = el.querySelector('[data-count]');
      if (c && !c._done) { c._done = true; runCount(c); }
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  reveals.forEach(el => io.observe(el));
})();

/* nav scroll progress */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* cursor spotlight + magnetic buttons */
(function () {
  if (REDUCE_MOTION) return;
  const spot = document.getElementById('spotlight');
  window.addEventListener('pointermove', (e) => {
    MOUSE.x = e.clientX;
    MOUSE.y = e.clientY;
    if (spot) {
      spot.style.setProperty('--mx', e.clientX + 'px');
      spot.style.setProperty('--my', e.clientY + 'px');
      spot.style.opacity = 1;
    }
  }, { passive: true });

  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.style.transition = 'transform .25s var(--ease)';
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = 'none'; });
  });
})();

/* animated dot-grid canvas */
(function () {
  const canvas = document.getElementById('fx-grid');
  if (!canvas || REDUCE_MOTION) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const gap = 42;
  let w, h, dots = [];

  const build = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = gap; y < h; y += gap) {
      for (let x = gap; x < w; x += gap) {
        dots.push({ x, y, ph: Math.random() * Math.PI * 2 });
      }
    }
  };
  build();
  window.addEventListener('resize', build);

  const t0 = performance.now();
  const draw = (now) => {
    const tt = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      const dx = d.x - MOUSE.x, dy = d.y - MOUSE.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const near = Math.max(0, 1 - dist / 160);
      const twinkle = 0.18 + 0.12 * Math.sin(tt * 1.4 + d.ph);
      const a = Math.min(0.9, twinkle + near * 0.85);
      const r = 1.1 + near * 2.2;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = near > 0.05
        ? `rgba(125,240,215,${a})`
        : `rgba(156,175,170,${a * 0.5})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

/* mobile menu */
(function () {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  function close() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
})();

/* selected samples - rendered from portfolio.js (runs before the reveal
   observer below, so injected cards animate like static ones) */
(function () {
  const mount = document.getElementById('work-list');
  if (!mount || typeof CASE_STUDIES === 'undefined') return;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  CASE_STUDIES.forEach((cs, i) => {
    const art = el('article', 'case reveal' + (i % 2 ? ' case-flip' : ''));

    const body = el('div', 'case-body');
    body.append(el('p', 'case-meta', cs.sampleType));
    body.append(el('h3', 'case-title', cs.title));
    [['Scenario', cs.scenario], ['Approach', cs.approach], ['What it shows', cs.whatItShows]]
      .forEach(([label, text]) => {
        const block = el('div', 'case-block');
        block.append(el('h4', 'case-label', label), el('p', null, text));
        body.append(block);
      });
    const tags = el('p', 'case-tags');
    tags.textContent = cs.tags.join(' · ');
    body.append(tags);
    const action = el('a', 'sample-link', 'View HTML sample');
    action.href = cs.sampleUrl;
    body.append(action);

    const media = el('div', 'work-media sample-preview');
    media.append(el('p', 'sample-kicker', 'Sample project'));
    media.append(el('h4', 'sample-preview-title', cs.title));
    const table = el('div', 'control-table');
    (cs.statusRows || []).forEach(row => {
      const line = el('div', 'control-row');
      row.forEach((cell, idx) => line.append(el('span', idx === 2 ? 'status-chip' : null, cell)));
      table.append(line);
    });
    media.append(table);
    const previewLink = el('a', 'sample-preview-link', 'Open sample');
    previewLink.href = cs.sampleUrl;
    media.append(previewLink);

    art.append(body, media);
    mount.append(art);
  });
})();

/* reveal on scroll */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

/* active nav link */
(function () {
  const links = document.querySelectorAll('.nav-link');
  const sections = [...links].map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
