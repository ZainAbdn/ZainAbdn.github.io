/* Zain Abedeen — portfolio interactions + subtle WebGL shaders */

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- WebGL helpers ---------- */
function makeProgram(canvas, fragSrc) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const pr = gl.createProgram();
  gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (let i = 0; i < gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS); i++) {
    const info = gl.getActiveUniform(pr, i);
    u[info.name] = gl.getUniformLocation(pr, info.name);
  }
  return { gl, u };
}

/* Runs a draw callback only while the element is on screen and the tab is visible.
   With reduced motion, draws a single still frame. */
function animate(target, draw) {
  if (REDUCE_MOTION) { draw(8000); return () => draw(8000); }
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(target);
  }
  const t0 = performance.now();
  const loop = (now) => { if (visible && !document.hidden) draw(now - t0); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  return () => {};
}

const NOISE = `
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
`;

/* ---------- navy "silk" field: hero + contact ---------- */
const FIELD_FRAG = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uSeed;
${NOISE}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float t=uTime*.018+uSeed;
  vec2 q=vec2(fbm(p*1.1+t),fbm(p*1.1+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.3+2.4*q+vec2(1.7,9.2)+t*1.2+(uMouse-.5)*.25),fbm(p*1.3+2.4*q+vec2(8.3,2.8)-t));
  float f=fbm(p*1.0+2.2*r);
  vec3 base=vec3(.039,.102,.184);
  vec3 deep=vec3(.024,.063,.122);
  vec3 steel=vec3(.10,.20,.33);
  vec3 col=mix(deep,base,smoothstep(.2,.7,uv.y*.6+f*.6));
  col=mix(col,steel,smoothstep(.55,.95,f)*.55);
  float sheen=pow(abs(sin((f+r.y)*6.+t*3.)),30.);
  col+=vec3(.79,.68,.50)*sheen*.035;
  col*=1.-.25*length(uv-vec2(.7,.6));
  gl_FragColor=vec4(col,1.);
}`;

function fieldShader(canvas, host, seed) {
  if (!canvas) return;
  const ctx = makeProgram(canvas, FIELD_FRAG);
  if (!ctx) { canvas.remove(); return; }
  const { gl, u } = ctx;
  gl.uniform1f(u.uSeed, seed);
  const target = { x: 0.5, y: 0.5 }, m = { x: 0.5, y: 0.5 };
  if (FINE_POINTER) {
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    });
  }
  const draw = (ms) => {
    m.x = lerp(m.x, target.x, 0.02); m.y = lerp(m.y, target.y, 0.02);
    gl.uniform1f(u.uTime, ms / 1000);
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2) * 0.5;
    canvas.width = Math.max(2, Math.floor(host.clientWidth * dpr));
    canvas.height = Math.max(2, Math.floor(host.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    redraw();
  };
  const redraw = animate(host, draw);
  resize();
  addEventListener('resize', resize);
}
fieldShader($('#hero-shader'), $('.hero'), 3.0);
fieldShader($('#contact-shader'), $('.contact'), 11.0);

/* ---------- portrait: gentle drift + soft grade ---------- */
(function portraitShader() {
  const fig = $('.portrait'), canvas = $('#portrait-gl'), img = $('#portrait-img');
  if (!fig || !canvas || !img) return;
  const noPhoto = () => fig.classList.add('no-photo');

  const ctx = makeProgram(canvas, `precision highp float;
uniform vec2 uRes;uniform vec2 uImg;uniform float uTime;uniform float uHover;uniform float uHas;uniform vec2 uMouse;
uniform sampler2D uTex;
${NOISE}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; uv.y=1.-uv.y;
  float t=uTime;
  vec3 col;
  if(uHas>.5){
    float ar=uRes.x/uRes.y, ir=uImg.x/uImg.y;
    vec2 sc=vec2(min(ar/ir,1.),min(ir/ar,1.));
    vec2 tuv=(uv-.5)*(1.-.02*uHover)+.5;
    tuv=tuv*sc+(1.-sc)*.5;
    vec2 d=(vec2(fbm(uv*2.5+t*.05),fbm(uv*2.5+4.-t*.04))-.5)*.006;
    float md=length(uv-uMouse);
    d+=(uv-uMouse)*exp(-md*md*18.)*.01*uHover;
    vec3 c=texture2D(uTex,tuv+d).rgb;
    float l=dot(c,vec3(.299,.587,.114));
    vec3 duo=mix(vec3(.04,.10,.18),vec3(.93,.92,.89),smoothstep(.04,.92,l));
    col=mix(duo,c,.55+.4*uHover);
  } else {
    vec2 p=uv-vec2(.5,.45); p.x*=uRes.x/uRes.y;
    float f=fbm(p*2.2+t*.04);
    col=mix(vec3(.04,.10,.18),vec3(.12,.23,.37),smoothstep(.8,.0,length(p)+f*.25));
    col+=vec3(.79,.68,.50)*exp(-length(uv-uMouse)*5.)*.06*uHover;
  }
  col*=1.-.35*pow(length(uv-.5)*1.2,2.5);
  gl_FragColor=vec4(col,1.);
}`);

  if (!ctx) {
    canvas.remove();
    img.addEventListener('error', noPhoto);
    if (img.complete && !img.naturalWidth) noPhoto();
    return;
  }
  const { gl, u } = ctx;
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(u.uTex, 0);
  gl.uniform1f(u.uHas, 0);
  fig.classList.add('gl-on');

  const st = { hover: 0, target: 0, mx: 0.5, my: 0.5, sx: 0.5, sy: 0.5 };
  if (FINE_POINTER) {
    fig.addEventListener('pointerenter', () => { st.target = 1; });
    fig.addEventListener('pointerleave', () => { st.target = 0; });
    fig.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      st.mx = (e.clientX - r.left) / r.width; st.my = (e.clientY - r.top) / r.height;
    });
  }
  const draw = (ms) => {
    st.hover = lerp(st.hover, st.target, 0.05);
    st.sx = lerp(st.sx, st.mx, 0.1); st.sy = lerp(st.sy, st.my, 0.1);
    gl.uniform1f(u.uTime, ms / 1000);
    gl.uniform1f(u.uHover, st.hover);
    gl.uniform2f(u.uMouse, st.sx, st.sy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const redraw = animate(fig, draw);

  const upload = () => {
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(u.uImg, img.naturalWidth, img.naturalHeight);
      gl.uniform1f(u.uHas, 1);
    } catch (err) { noPhoto(); }
    redraw();
  };
  if (img.complete && img.naturalWidth) upload();
  else if (img.complete) noPhoto();
  img.addEventListener('load', upload);
  img.addEventListener('error', () => { noPhoto(); redraw(); });

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.floor(r.width * dpr));
    canvas.height = Math.max(2, Math.floor(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    redraw();
  };
  resize();
  addEventListener('resize', resize);
})();

/* ---------- footer year ---------- */
$('#year').textContent = new Date().getFullYear();

/* ---------- hero entrance ---------- */
(function heroIn() {
  if (REDUCE_MOTION) return;
  const items = $$('[data-fade]');
  items.forEach(n => { n.style.opacity = 0; n.style.transform = 'translateY(14px)'; });
  requestAnimationFrame(() => setTimeout(() => {
    items.forEach((n, i) => {
      n.style.transition = `opacity 1s var(--ease) ${i * 0.1}s, transform 1s var(--ease) ${i * 0.1}s`;
      n.style.opacity = 1; n.style.transform = 'none';
    });
  }, 60));
})();

/* ---------- selected work (data in portfolio.js) ---------- */
(function cases() {
  const mount = $('#work-list');
  if (!mount || typeof CASE_STUDIES === 'undefined') return;
  const tone = (s) => {
    const v = s.toLowerCase();
    if (/ready|down|on track/.test(v)) return 'ok';
    if (/high|critical|fail/.test(v)) return 'bad';
    return 'warn';
  };
  CASE_STUDIES.forEach((cs, i) => {
    const art = el('article', 'case reveal' + (i % 2 ? ' case-flip' : ''));

    const body = el('div', 'case-body');
    body.append(el('p', 'case-meta', cs.sampleType.replace(/^Generic sample · /, '')));
    body.append(el('h3', 'case-title', cs.title));
    [['The field problem', cs.scenario], ['What I built', cs.approach], ['Why it matters', cs.whatItShows]].forEach(([label, text]) => {
      const b = el('div', 'case-block');
      b.append(el('h4', null, label), el('p', null, text));
      body.append(b);
    });
    const tags = el('ul', 'case-tags');
    cs.tags.forEach(t => tags.append(el('li', null, t)));
    body.append(tags);
    const link = el('a', 'case-link', cs.ctaLabel || 'Open sample');
    link.href = cs.sampleUrl;
    const arrow = el('span', null, '→'); arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    body.append(link);

    const media = el('div', 'case-media');
    const head = el('div', 'rep-head');
    head.append(el('span', null, 'Deployment output'), el('span', null, 'Fictional data'));
    media.append(head, el('p', 'rep-title', cs.title));
    const table = el('table', 'rep-table');
    const thead = el('thead'), hr = el('tr');
    ['Ref', 'Area', 'Status'].forEach(h => { const th = el('th', null, h); th.scope = 'col'; hr.append(th); });
    thead.append(hr);
    const tbody = el('tbody');
    (cs.statusRows || []).forEach(row => {
      const tr = el('tr');
      const s = el('td'); s.append(el('span', 'pill ' + tone(row[2]), row[2]));
      tr.append(el('td', null, row[0]), el('td', null, row[1]), s);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    media.append(table, el('p', 'rep-foot', 'Illustrative extract from the full sample.'));

    art.append(body, media);
    mount.append(art);
  });
})();

/* ---------- reveal + count-up ---------- */
(function reveal() {
  const items = $$('.reveal');
  const count = (n) => {
    const target = +n.dataset.count, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
    if (REDUCE_MOTION) return;
    const start = performance.now(), dur = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      n.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
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
      if (c && !c._done) { c._done = true; count(c); }
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
})();

/* ---------- nav: scrolled state, active link, mobile menu ---------- */
(function nav() {
  const navEl = $('#nav');
  const hero = $('.hero');
  const onScroll = () => {
    const limit = hero ? hero.offsetHeight - 80 : 40;
    navEl.classList.toggle('scrolled', scrollY > limit);
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
    navEl.classList.toggle('menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();
