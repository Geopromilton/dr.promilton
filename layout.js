// Direction C — sidebar layout
(function () {
  const PROFILE = window.PROFILE; if (!PROFILE) return;
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "warm",
    "font": "source",
    "density": "comfy",
    "theme": "light"
  }/*EDITMODE-END*/;
  const STORE = 'profile-tweaks-c';
  function load() { try { return Object.assign({}, TWEAK_DEFAULTS, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch { return { ...TWEAK_DEFAULTS }; } }
  function save(t) { localStorage.setItem(STORE, JSON.stringify(t)); try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: t }, '*'); } catch {} }

  const ACCENTS = {
    warm:   { a: '#c2410c', soft: '#fef0e6' },
    forest: { a: '#2e7d4f', soft: '#e8f5ec' },
    indigo: { a: '#3d4f8a', soft: '#e8ebf3' },
    plum:   { a: '#7c3a5e', soft: '#f5e8ee' },
  };
  const FONTS = {
    source:    "'Source Serif 4', Georgia, serif",
    fraunces:  "'Fraunces', Georgia, serif",
    playfair:  "'Playfair Display', Georgia, serif",
    lora:      "'Lora', Georgia, serif",
  };
  function apply(t) {
    const r = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS.warm;
    r.style.setProperty('--accent', a.a);
    r.style.setProperty('--accent-soft', a.soft);
    r.style.setProperty('--serif', FONTS[t.font] || FONTS.source);
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-theme', t.theme);
  }
  let tweaks = load(); apply(tweaks);

  function sidebar(cur) {
    const links = [
      { href: 'index.html', label: 'Home', m: ['', 'index.html'], i: '◉' },
      { href: 'about.html', label: 'About', m: ['about.html'], i: '◐' },
      { href: 'work.html', label: 'Work & Research', m: ['work.html'], i: '◇' },
      { href: 'contact.html', label: 'Contact', m: ['contact.html'], i: '◎' },
    ];
    const c = cur || 'index.html';
    return `
    <aside class="sidebar">
      <div class="sb-brand"><span class="pic"></span>
        <div>Dr. Promilton<small>Hydrogeologist · Geophysicist</small></div>
      </div>
      <div class="sb-photo">
        <img src="assets/photo-portrait.jpg" alt="">
        <span class="status">Available for consulting</span>
      </div>
      <div class="sb-name">A. Antony Alosanai Promilton</div>
      <div class="sb-title">Ph.D. Hydrogeologist · Consultant Geophysicist · Geospatial Researcher</div>
      <div class="sb-loc">Thoothukudi, Tamil Nadu · India</div>
      <nav class="sb-nav">
        ${links.map(l => `<a href="${l.href}"${l.m.includes(c) ? ' aria-current="page"' : ''}><span class="ico">${l.i}</span>${l.label}</a>`).join('')}
      </nav>
      <div class="sb-foot">
        <a class="sb-cta" href="assets/Promilton_CV_2026.pdf" target="_blank">↓ Download CV (PDF)</a>
        <div class="sb-meta">
          <a href="${PROFILE.links.email}">✉ ${PROFILE.email}</a>
          <a href="${PROFILE.links.scholar}" target="_blank">⌬ Google Scholar</a>
          <a href="${PROFILE.links.linkedin}" target="_blank">in LinkedIn</a>
        </div>
        <div class="sb-theme" id="sbTheme">
          <button data-key="light" aria-pressed="${tweaks.theme==='light'}">☀ Light</button>
          <button data-key="dark" aria-pressed="${tweaks.theme==='dark'}">☾ Dark</button>
        </div>
      </div>
    </aside>`;
  }

  function tweaksPanel() {
    return `
    <button class="tw-fab" id="twFab" aria-label="Tweaks">⚙</button>
    <div class="tw-panel" id="twPanel">
      <h5>Tweaks</h5>
      <div class="tw-row"><label>Accent</label><div class="tw-swatches" id="twAcc">
        ${Object.entries(ACCENTS).map(([k,v]) => `<button class="tw-swatch" data-key="${k}" style="background:${v.a}" aria-pressed="${tweaks.accent===k}"></button>`).join('')}
      </div></div>
      <div class="tw-row"><label>Serif</label><div class="tw-segments" id="twFnt">
        ${Object.keys(FONTS).map(k => `<button data-key="${k}" aria-pressed="${tweaks.font===k}">${k}</button>`).join('')}
      </div></div>
      <div class="tw-row"><label>Density</label><div class="tw-segments" id="twDen">
        ${['dense','cozy','comfy'].map(k => `<button data-key="${k}" aria-pressed="${tweaks.density===k}">${k}</button>`).join('')}
      </div></div>
    </div>`;
  }
  function bindTweaks() {
    const fab = document.getElementById('twFab');
    const pnl = document.getElementById('twPanel');
    if (fab) fab.addEventListener('click', () => pnl.classList.toggle('open'));
    function bind(id, key) {
      const el = document.getElementById(id); if (!el) return;
      el.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        tweaks[key] = b.dataset.key;
        el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.key === tweaks[key]));
        apply(tweaks); save(tweaks);
      }));
    }
    bind('twAcc','accent'); bind('twFnt','font'); bind('twDen','density'); bind('sbTheme','theme');
  }
  function bindReveals() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }}), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
  window.addEventListener('message', e => {
    const m = e.data || {};
    if (m.type === '__activate_edit_mode') document.getElementById('twPanel')?.classList.add('open');
    if (m.type === '__deactivate_edit_mode') document.getElementById('twPanel')?.classList.remove('open');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
  window.C_LAYOUT = { sidebar, tweaksPanel, bindTweaks, bindReveals };
})();
