/* Zain Abedeen — portfolio interactions + WebGL motion shaders */

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const MOUSE = { x: innerWidth * 0.5, y: innerHeight * 0.4, nx: 0.5, ny: 0.6 };

window.addEventListener('pointermove', (e) => {
  MOUSE.x = e.clientX; MOUSE.y = e.clientY;
  MOUSE.nx = e.clientX / innerWidth;
  MOUSE.ny = 1 - e.clientY / innerHeight;
}, { passive: true });

/* ---------- small helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- WebGL helper ---------- */
function createGL(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  return gl;
}
function program(gl, fragSrc) {
  const vert = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, vert), fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const pr = gl.createProgram();
  gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(pr, i); u[info.name] = gl.getUniformLocation(pr, info.name); }
  return u;
}

const NOISE_GLSL = `
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
`;

/* ---------- 1. background: domain-warped silk shader ---------- */
(function bgShader() {
  const canvas = $('#bg-shader');
  if (!canvas) return;
  const gl = createGL(canvas);
  if (!gl) { canvas.remove(); return; }
  const u = program(gl, `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;
${NOISE_GLSL}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float t=uTime*.055;
  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);
  p+=vec2(0.,uScroll*.35);
  vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.5+3.*q+vec2(1.7,9.2)+t*1.3+m*.35),fbm(p*1.5+3.*q+vec2(8.3,2.8)-t));
  float f=fbm(p*1.15+2.6*r);
  vec3 ink=vec3(.018,.022,.038);
  vec3 violet=vec3(.40,.27,1.);
  vec3 teal=vec3(.10,.86,.72);
  vec3 ember=vec3(1.,.43,.22);
  vec3 col=ink;
  col=mix(col,violet*.62,smoothstep(.38,.9,f));
  col=mix(col,teal*.48,smoothstep(.55,1.05,length(q))*.7);
  col=mix(col,ember*.78,smoothstep(.6,.98,r.x)*.6);
  float silk=pow(abs(sin((f+r.y)*8.+t*5.)),22.);
  col+=silk*vec3(.95,.85,1.)*.07*f;
  float md=length(p-m);
  col+=mix(ember,violet,.4)*.10*exp(-md*md*5.);
  col*=mix(1.,.5,clamp(uScroll,0.,1.));
  col*=smoothstep(1.35,.15,length((uv-.5)*vec2(1.25,1.)) * 1.5);
  gl_FragColor=vec4(col,1.);
}`);
  if (!u) { canvas.remove(); return; }

  const SCALE = 0.5;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.floor(innerWidth * dpr * SCALE));
    canvas.height = Math.max(2, Math.floor(innerHeight * dpr * SCALE));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  const m = { x: MOUSE.nx, y: MOUSE.ny };
  let scroll = 0;
  const t0 = performance.now();
  const draw = (now) => {
    m.x = lerp(m.x, MOUSE.nx, 0.04);
    m.y = lerp(m.y, MOUSE.ny, 0.04);
    scroll = lerp(scroll, Math.min(scrollY / innerHeight, 1.6), 0.08);
    gl.uniform1f(u.uTime, REDUCE_MOTION ? 24 : (now - t0) / 1000 + 12);
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.uniform1f(u.uScroll, Math.min(scroll, 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  if (REDUCE_MOTION) {
    draw(performance.now());
    addEventListener('resize', () => draw(performance.now()));
    return;
  }
  const loop = (now) => { if (!document.hidden) draw(now); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();

/* ---------- 2. portrait: liquid / chromatic shader ---------- */
(function portraitShader() {
  const fig = $('.portrait');
  const canvas = $('#portrait-gl');
  const img = $('#portrait-img');
  if (!fig || !canvas || !img) return;

  const markNoPhoto = () => fig.classList.add('no-photo');

  const gl = createGL(canvas);
  const u = gl && program(gl, `precision highp float;
uniform vec2 uRes;uniform vec2 uImg;uniform float uTime;uniform float uHover;uniform float uHas;uniform vec2 uMouse;
uniform sampler2D uTex;
${NOISE_GLSL}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; uv.y=1.-uv.y;
  float t=uTime;
  vec3 col;
  if(uHas>.5){
    float ar=uRes.x/uRes.y, ir=uImg.x/uImg.y;
    vec2 sc=vec2(min(ar/ir,1.),min(ir/ar,1.));
    vec2 tuv=uv*sc+(1.-sc)*.5;
    float n=fbm(uv*3.+vec2(t*.08,-t*.06));
    vec2 d=(vec2(n,fbm(uv*3.+4.+t*.07))-.5)*(.012+.02*uHover);
    vec2 dm=uv-uMouse; float md=length(dm);
    d+=normalize(dm+1e-4)*exp(-md*md*28.)*sin(md*46.-t*5.)*.012*uHover;
    vec2 ca=vec2(.0025+.006*uHover,0.)*(1.+n);
    float r=texture2D(uTex,tuv+d+ca).r;
    float g=texture2D(uTex,tuv+d).g;
    float b=texture2D(uTex,tuv+d-ca).b;
    vec3 c=vec3(r,g,b);
    float l=dot(c,vec3(.299,.587,.114));
    vec3 duo=mix(vec3(.05,.04,.14),vec3(.42,.32,1.),smoothstep(.05,.55,l));
    duo=mix(duo,vec3(1.,.62,.42),smoothstep(.55,.95,l));
    col=mix(duo,c,.28+.6*uHover);
  } else {
    vec2 p=uv-.5; p.x*=uRes.x/uRes.y;
    float q=fbm(p*3.+t*.12); float rr=fbm(p*2.5+q*2.-t*.1);
    float orb=smoothstep(.42,.0,length(p+vec2(q-.5,rr-.5)*.18));
    vec3 a=vec3(.40,.27,1.), b=vec3(.10,.86,.72), e=vec3(1.,.43,.22);
    col=mix(vec3(.02,.02,.04),mix(a,e,rr),orb);
    col+=b*pow(orb,4.)*.35;
    col+=exp(-length(uv-uMouse)*6.)*.12*uHover*e;
  }
  col+=sin(gl_FragCoord.y*1.6)*.018;
  col*=1.-.55*pow(length(uv-.5)*1.25,2.2);
  gl_FragColor=vec4(col,1.);
}`);

  if (!u) {
    canvas.remove();
    img.addEventListener('error', markNoPhoto);
    if (img.complete && !img.naturalWidth) markNoPhoto();
    return;
  }

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(u.uTex, 0);
  gl.uniform1f(u.uHas, 0);
  fig.classList.add('gl-on');

  const upload = () => {
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(u.uImg, img.naturalWidth, img.naturalHeight);
      gl.uniform1f(u.uHas, 1);
    } catch (err) { markNoPhoto(); }
    if (REDUCE_MOTION) draw(0);
  };
  queueMicrotask(() => {
    if (img.complete && img.naturalWidth) upload();
    else if (img.complete) { markNoPhoto(); if (REDUCE_MOTION) draw(0); }
  });
  img.addEventListener('load', upload);
  img.addEventListener('error', () => { markNoPhoto(); if (REDUCE_MOTION) draw(0); });

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.floor(r.width * dpr));
    canvas.height = Math.max(2, Math.floor(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  const state = { hover: 0, target: 0, mx: 0.5, my: 0.5 };
  fig.addEventListener('pointerenter', () => { state.target = 1; });
  fig.addEventListener('pointerleave', () => { state.target = 0; });
  fig.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    state.mx = (e.clientX - r.left) / r.width;
    state.my = (e.clientY - r.top) / r.height;
  });
  if (!FINE_POINTER) state.target = 0.35;

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(fig);
  }

  const t0 = performance.now();
  const sm = { x: 0.5, y: 0.5 };
  function draw(now) {
    state.hover = lerp(state.hover, state.target, 0.07);
    sm.x = lerp(sm.x, state.mx, 0.15); sm.y = lerp(sm.y, state.my, 0.15);
    gl.uniform1f(u.uTime, REDUCE_MOTION ? 3 : (now - t0) / 1000);
    gl.uniform1f(u.uHover, REDUCE_MOTION ? 0.4 : state.hover);
    gl.uniform2f(u.uMouse, sm.x, sm.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  if (REDUCE_MOTION) { draw(0); return; }
  const loop = (now) => { if (visible && !document.hidden) draw(now); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();

/* ---------- footer year + London clock ---------- */
$('#year').textContent = new Date().getFullYear();
(function clock() {
  const c = $('#clock');
  if (!c) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  const tick = () => { c.textContent = 'LDN ' + fmt.format(new Date()); };
  tick(); setInterval(tick, 15000);
})();

/* ---------- custom cursor ---------- */
(function cursor() {
  if (!FINE_POINTER || REDUCE_MOTION) return;
  const root = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if (!root) return;
  document.body.classList.add('has-cursor');
  const r = { x: MOUSE.x, y: MOUSE.y };
  const loop = () => {
    r.x = lerp(r.x, MOUSE.x, 0.18); r.y = lerp(r.y, MOUSE.y, 0.18);
    dot.style.transform = `translate3d(${MOUSE.x}px, ${MOUSE.y}px, 0)`;
    ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener('pointerover', (e) => {
    root.classList.toggle('is-hover', !!e.target.closest('a, button, [data-tilt]'));
  });
  document.addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = 0; });
  document.addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = 1; });
})();

/* ---------- hero entrance: split letters + rise ---------- */
(function heroIn() {
  const splits = $$('.split');
  splits.forEach(s => {
    const txt = s.textContent;
    s.textContent = '';
    s.setAttribute('aria-label', txt);
    [...txt].forEach(ch => { const c = el('span', 'ch', ch); c.setAttribute('aria-hidden', 'true'); s.append(c); });
  });
  if (REDUCE_MOTION) return;
  const chars = $$('.split .ch');
  const risers = $$('[data-rise]').filter(n => !n.classList.contains('hero-title'));
  chars.forEach(c => { c.style.transform = 'translateY(110%) rotate(6deg)'; });
  risers.forEach(n => { n.style.opacity = 0; n.style.transform = 'translateY(24px)'; });
  requestAnimationFrame(() => setTimeout(() => {
    chars.forEach((c, i) => {
      c.style.transition = `transform 1.1s var(--ease) ${0.05 + i * 0.04}s`;
      c.style.transform = 'none';
    });
    risers.forEach((n, i) => {
      n.style.transition = `opacity .9s var(--ease) ${0.35 + i * 0.1}s, transform .9s var(--ease) ${0.35 + i * 0.1}s`;
      n.style.opacity = 1; n.style.transform = 'none';
    });
  }, 60));
})();

/* ---------- rotating word ---------- */
(function rotator() {
  const rot = $('#rotator');
  if (!rot || REDUCE_MOTION) return;
  const words = ['security', 'automation', 'governance', 'intelligence'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    rot.style.opacity = 0; rot.style.transform = 'translateY(-10px)'; rot.style.filter = 'blur(6px)';
    setTimeout(() => {
      rot.textContent = words[i];
      rot.style.transition = 'none';
      rot.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        rot.style.transition = '';
        rot.style.opacity = 1; rot.style.transform = 'none'; rot.style.filter = 'none';
      });
    }, 320);
  }, 2600);
})();

/* ---------- portfolio cases (from portfolio.js) ---------- */
(function cases() {
  const mount = $('#work-list');
  if (!mount || typeof CASE_STUDIES === 'undefined') return;
  const statusClass = (s) => {
    const v = s.toLowerCase();
    if (/ready|down|on track/.test(v)) return 'ok';
    if (/high|critical|fail/.test(v)) return 'bad';
    return 'warn';
  };
  CASE_STUDIES.forEach((cs, i) => {
    const art = el('article', 'case reveal' + (i % 2 ? ' case-flip' : ''));

    const body = el('div', 'case-body');
    body.append(el('p', 'case-meta mono', `0${i + 1} — ${cs.sampleType.replace(/^Generic sample · /, '')}`));
    body.append(el('h3', 'case-title', cs.title));
    const blocks = el('div', 'case-blocks');
    [['Scenario', cs.scenario], ['Approach', cs.approach], ['What it shows', cs.whatItShows]].forEach(([label, text]) => {
      const b = el('div', 'case-block');
      b.append(el('h4', 'mono', label), el('p', null, text));
      blocks.append(b);
    });
    body.append(blocks);
    const tags = el('ul', 'case-tags mono');
    cs.tags.forEach(t => tags.append(el('li', null, t)));
    body.append(tags);
    const a = el('a', 'btn btn-ghost');
    a.href = cs.sampleUrl;
    a.setAttribute('data-magnetic', '');
    a.append(el('span', null, cs.ctaLabel || 'Open sample'));
    const arrow = el('i', null, '↗'); arrow.setAttribute('aria-hidden', 'true');
    a.append(arrow);
    body.append(a);

    const media = el('div', 'case-media');
    media.append(el('p', 'case-kicker mono', 'Sample project · fictional data'));
    const term = el('div', 'term');
    const bar = el('div', 'term-bar');
    bar.append(el('i'), el('i'), el('i'), el('span', null, cs.id + '.report'));
    term.append(bar);
    (cs.statusRows || []).forEach(row => {
      const line = el('div', 'term-row');
      line.append(el('span', null, row[0]), el('span', null, row[1]), el('span', 'status ' + statusClass(row[2]), row[2]));
      term.append(line);
    });
    media.append(term);

    art.append(body, media);
    mount.append(art);
  });
})();

/* ---------- magnetic buttons ---------- */
(function magnetic() {
  if (!FINE_POINTER || REDUCE_MOTION) return;
  $$('[data-magnetic]').forEach(btn => {
    btn.style.transition = 'transform .35s var(--ease), color .4s var(--ease), border-color .4s';
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = 'none'; });
  });
})();

/* ---------- card spotlight + portrait tilt ---------- */
(function spot() {
  $$('[data-spot]').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  if (!FINE_POINTER || REDUCE_MOTION) return;
  const fig = $('[data-tilt]');
  const frame = fig && $('.portrait-frame', fig);
  if (!frame) return;
  fig.addEventListener('pointermove', (e) => {
    const r = fig.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.01)`;
  });
  fig.addEventListener('pointerleave', () => { frame.style.transform = 'none'; });
})();

/* ---------- reveal + count-up ---------- */
(function reveal() {
  const items = $$('.reveal');
  const runCount = (n) => {
    const target = +n.dataset.count, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
    if (REDUCE_MOTION) { n.textContent = pre + target + suf; return; }
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      n.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 4))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      const c = en.target.querySelector('[data-count]');
      if (c && !c._done) { c._done = true; runCount(c); }
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  items.forEach(i => io.observe(i));
})();

/* ---------- nav: progress, active link, mobile menu ---------- */
(function nav() {
  const bar = $('#scroll-progress');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav-link');
  const sections = links.map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.dataset.section === en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  const toggle = $('#menu-toggle'), menu = $('#mobile-menu');
  if (!toggle || !menu) return;
  const set = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();
