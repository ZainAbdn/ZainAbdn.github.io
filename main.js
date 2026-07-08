/* Zain Abedeen — portfolio */

/* footer year */
document.getElementById('year').textContent = new Date().getFullYear();

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

/* selected work — rendered from portfolio.js (runs before the reveal
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
    body.append(el('p', 'case-meta', `${cs.client} · ${cs.role} · ${cs.period}`));
    body.append(el('h3', 'case-title', cs.title));
    [['Challenge', cs.challenge], ['Approach', cs.approach], ['Outcome', cs.outcome]]
      .forEach(([label, text]) => {
        const block = el('div', 'case-block');
        block.append(el('h4', 'case-label', label), el('p', null, text));
        body.append(block);
      });
    const tags = el('p', 'case-tags');
    tags.textContent = cs.tags.join(' · ');
    body.append(tags);

    const media = el('div', 'work-media');
    if (cs.image) {
      const img = el('img');
      img.src = cs.image;
      img.alt = cs.imageAlt || cs.title;
      img.loading = 'lazy';
      media.append(img);
      if (cs.caption) media.append(el('p', 'work-caption', cs.caption));
    } else {
      media.classList.add('work-media-empty');
      const ph = el('div', 'work-placeholder');
      ph.innerHTML =
        '<svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true">' +
        '<rect x="1" y="20" width="8" height="13" rx="1.5" fill="currentColor" opacity=".45"/>' +
        '<rect x="13" y="12" width="8" height="21" rx="1.5" fill="currentColor" opacity=".65"/>' +
        '<rect x="25" y="5" width="8" height="28" rx="1.5" fill="currentColor" opacity=".85"/>' +
        '<rect x="37" y="15" width="6" height="18" rx="1.5" fill="currentColor" opacity=".55"/>' +
        '</svg>';
      ph.append(el('span', null, 'Work sample — coming soon'));
      media.append(ph);
    }

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
