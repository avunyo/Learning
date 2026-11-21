(() => {
  'use strict';

  const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
  const LANGS = window.LANGS;
  const M = window.Motion;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: settings just aren't kept */ } },
  };

  /* ---------------- Language & state ---------------- */
  function pickLang() {
    /* a language link (/de, /ru, /en) arrives as ?lang=xx: take it, remember it, tidy the address */
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && window.UI[fromUrl]) {
      store.set('pps-lang', fromUrl);
      history.replaceState(null, '', location.pathname + location.hash);
      return fromUrl;
    }
    const saved = store.get('pps-lang', null);
    if (saved && window.UI[saved]) return saved;
    const nav = (navigator.languages || [navigator.language || '']).map((l) => String(l).slice(0, 2).toLowerCase());
    try { nav.push(Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2).toLowerCase()); } catch (e) { /* no Intl */ }
    for (const l of nav) {
      if (l === 'uk' || l === 'be') return 'ru';
      if (window.UI[l]) return l;
    }
    return 'en';
  }

  const state = {
    lang: pickLang(),
    view: 'start',
    lessonId: null,
    tab: 'learn',
    taskStep: 0,
    mode: store.get('pps-mode', null),
    done: new Set(store.get('pps-done', [])),
    hints: !!store.get('pps-hints', false),
    panelOpen: !!store.get('pps-panel', false),
    active: null,
    revealed: false,
  };

  const content = () => window.CONTENT[state.lang] || window.CONTENT.ru;
  const lessons = () => content().lessons;
  const lesson = () => lessons().find((l) => l.id === state.lessonId);
  const lessonIndex = () => lessons().findIndex((l) => l.id === state.lessonId);
  function t(key, ...args) {
    const v = (window.UI[state.lang] || window.UI.ru)[key];
    return typeof v === 'function' ? v(...args) : v;
  }

  /* ---------------- Task steps ---------------- */
  const solvedSteps = store.get('pps-steps', {});
  const taskSteps = (l) => {
    const base = ((window.TASKS || {})[state.lang] || {})[l.id] || [l.task];
    const ex = (((window.TASK_EXTRAS || {})[state.lang] || {}).lessons || {})[l.id] || [];
    return base.map((st, i) => Object.assign({}, st, ex[i] || {}));
  };
  const solvedOf = (l) => (state.done.has(l.id) ? taskSteps(l).length : Math.min(solvedSteps[l.id] || 0, taskSteps(l).length));
  const nextStepOf = (l) => Math.min(solvedOf(l), taskSteps(l).length - 1);
  const curTask = () => taskSteps(lesson())[state.taskStep] || taskSteps(lesson())[0];

  /* ---------------- Icons ---------------- */
  const ICONS = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    book: '<path d="M4 19V5a2 2 0 012-2h13v14H6a2 2 0 00-2 2zm0 0a2 2 0 002 2h13"/><path d="M8 7h7"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3"/><path d="M12.5 15H17"/>',
    bulb: '<path d="M9 17.5h6M10 21h4"/><path d="M8.5 14.5C7 13.3 6 11.5 6 9.5a6 6 0 0112 0c0 2-1 3.8-2.5 5-.7.6-1 1.3-1 2v1h-5v-1c0-.7-.3-1.4-1-2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    play: '<path d="M7 5l12 7-12 7z" fill="currentColor"/>',
    reset: '<path d="M4 4v6h6"/><path d="M5.5 15.5A7.5 7.5 0 106 8.5L4 10"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    steps: '<path d="M5 6h6M5 12h10M5 18h7"/><path d="M17 15l3 3-3 3" transform="translate(0 -3)"/>',
    word: '<rect x="3" y="3" width="18" height="12" rx="3"/><path d="M9 15l3 4 3-4"/><path d="M7.5 9h9"/>',
    bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 7v13M7 12H3M21 12h-4M7 17l-3 2M17 17l3 2M7 8L4 6M17 8l3-2M9 7a3 3 0 016 0"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M14.5 4v16"/><path d="M17 8.5h1.5M17 12h1.5"/>',
    task: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    speaker: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11"/>',
    flame: '<path d="M12 21c-4 0-7-2.7-7-6.5 0-3 2-5.2 3.5-6.6.4 1.6 1.3 2.6 2.3 3.1C10.5 7.5 12 4.6 14.5 3c-.4 2.8.8 4.6 2.2 6.1C18 10.6 19 12.3 19 14.5c0 3.8-3 6.5-7 6.5z"/><path d="M12 21c-1.7 0-3-1.2-3-2.9 0-1.6 1.2-2.7 2.2-3.5.3 1 .9 1.6 1.6 1.8.4-1 1-1.7 1.6-2.2.6 1 1.6 2 1.6 3.8 0 1.7-1.3 3-3 3z"/>',
    quest: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>',
    screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h6M7 12.5h9M9 21h6"/>',
    box: '<path d="M3 8l9-4.5L21 8l-9 4.5z"/><path d="M3 8v8.5L12 21l9-4.5V8"/><path d="M12 12.5V21"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    fork: '<circle cx="12" cy="4.5" r="2"/><path d="M12 6.5V10l-6 6.5M12 10l6 6.5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    loop: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 014-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 01-4 4H4"/>',
    list: '<path d="M8 4H5v16h3M16 4h3v16h-3"/><path d="M9.5 12h.01M14.5 12h.01"/>',
    func: '<path d="M14.5 4H13a3 3 0 00-3 3v13"/><path d="M6.5 11H13"/><path d="M15 13l5 5M20 13l-5 5"/>',
  };
  const icon = (name) => `<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[name] || ''}</svg></span>`;
  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((n) => { n.outerHTML = icon(n.dataset.icon); });
  }

  /* ---------------- Python syntax highlighting ---------------- */
  const KW = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
  const BI = new Set('print input len range int str float list dict set tuple type abs sum min max round sorted reversed enumerate zip open bool map filter any all'.split(' '));
  const L = 'A-Za-zА-Яа-яЁёÄÖÜäöüß';
  const TOKEN = new RegExp(`(#.*$)|((?:[rRbBuUfF]{1,2})?(?:"(?:\\\\.|[^"\\\\])*"?|'(?:\\\\.|[^'\\\\])*'?))|(\\b\\d+(?:\\.\\d+)?\\b)|([${L}_][${L}0-9_]*)|(\\s+)|([^\\s${L}0-9_#"']+)`, 'gm');
  const glossary = () => t('glossary') || {};

  function hl(text, st = { afterDef: false }) {
    let out = '';
    const g = glossary();
    text.replace(TOKEN, (m, com, str, num, word, ws, op) => {
      if (com) out += `<span class="t-com">${esc(com)}</span>`;
      else if (str) out += `<span class="t-str">${esc(str)}</span>`;
      else if (num) out += `<span class="t-num">${num}</span>`;
      else if (word) {
        const gw = Object.prototype.hasOwnProperty.call(g, word) ? ` data-g="${word}"` : '';
        if (st.afterDef) { out += `<span class="t-def">${esc(word)}</span>`; st.afterDef = false; }
        else if (KW.has(word)) { out += `<span class="t-kw"${gw}>${word}</span>`; st.afterDef = word === 'def' || word === 'class'; }
        else if (BI.has(word)) out += `<span class="t-bi"${gw}>${word}</span>`;
        else out += gw ? `<span${gw}>${esc(word)}</span>` : esc(word);
      } else if (ws) out += ws;
      else if (op) out += `<span class="t-op">${esc(op)}</span>`;
      return m;
    });
    return out;
  }
  const highlight = (src) => src.split('\n').map((l) => hl(l)).join('\n');

  const MARK = /\[\[(\w[\w-]*)\|(.*?)\]\](?!\])/g;
  function renderMarked(src) {
    return src.split('\n').map((line) => {
      const st = { afterDef: false };
      let html = '';
      let last = 0;
      line.replace(MARK, (m, id, text, at) => {
        html += hl(line.slice(last, at), st);
        html += `<span data-anno="${id}">${hl(text, st)}</span>`;
        last = at + m.length;
        return m;
      });
      return html + hl(line.slice(last), st);
    }).join('\n');
  }
  const stripMarks = (src) => src.replace(MARK, '$2');

  /* ---------------- Editor illustrations ---------------- */
  const PY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4 0-4 1.6-4 3v2h4v1H6c-2 0-3 1.5-3 4s1 4 3 4h2v-2.5c0-1.4 1-2.5 2.5-2.5h4c1.4 0 2.5-1 2.5-2.5V6c0-1.6-1.5-3-5-3z" fill="#84A4FF"/><path d="M12 21c4 0 4-1.6 4-3v-2h-4v-1h6c2 0 3-1.5 3-4s-1-4-3-4h-2v2.5c0 1.4-1 2.5-2.5 2.5h-4C8 12 7 13 7 14.5V18c0 1.6 1.5 3 5 3z" fill="#FFD866"/></svg>';

  /* hints mode: a short line under each line of code says what it does */
  function ghostFor(raw) {
    const line = stripMarks(raw).trim();
    if (!line) return '';
    if (line.startsWith('#')) return t('ghostComment');
    const g = glossary();
    const words = line.replace(/(["'])(?:\\.|(?!\1).)*\1/g, ' ').match(/[A-Za-z_]+/g) || [];
    const pri = ['def', 'for', 'while', 'if', 'elif', 'else', 'return', 'import'];
    const known = words.filter((w) => Object.prototype.hasOwnProperty.call(g, w));
    const word = known.find((w) => pri.includes(w)) || known[0];
    const assign = line.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
    if (assign) {
      const extra = word ? ` ${word}: ${g[word]}` : '';
      return t('ghostAssign', assign[1]) + extra;
    }
    return word ? `${word}: ${g[word]}` : '';
  }
  function codeRows(d) {
    const html = (d.rawHtml || renderMarked(d.code)).split('\n');
    const raw = d.code.split('\n');
    return html.map((h, i) => {
      const ghost = state.hints && !d.rawHtml ? ghostFor(raw[i] || '') : '';
      return { html: h || ' ', ghost: ghost ? `<span class="ghost">↳ ${esc(ghost)}</span>` : '' };
    });
  }

  function vscodeWin(d) {
    const rows = codeRows(d);
    const n = rows.length;
    return `
      <div class="win vscode">
        <div class="vs-top"><span class="vs-dots"><i></i><i></i><i></i></span><span class="vs-title">${esc(d.file)} — learning</span></div>
        <div class="vs-tabs">
          <span class="vs-tab" data-anno="tab">${PY_ICON}${esc(d.file)}</span>
          <span class="vs-run" data-anno="run" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg></span>
        </div>
        <div class="vs-code code">
          <span class="vs-gutter" data-anno="gutter" style="grid-row: 1 / span ${n}"></span>
          ${rows.map((r, i) => `<span class="ln-n" style="grid-row: ${i + 1}">${i + 1}</span><span class="ln-c" style="grid-row: ${i + 1}">${r.html}${r.ghost}</span>`).join('')}
        </div>
        <div class="vs-term" data-anno="term">
          <span class="vs-term-label">${esc(t('terminal'))}</span>
          <pre><span class="ps">PS C:\\learning&gt;</span> python ${esc(d.file)}
<span class="out${d.outClass ? ' ' + d.outClass : ''}" data-anno="out">${esc(d.output)}</span></pre>
        </div>
      </div>`;
  }

  function idleWin(d) {
    const lines = d.code.split('\n');
    return `
      <div class="win idle">
        <div class="idle-w idle-file">
          <div class="idle-title" data-anno="title">${esc(d.file)} — C:\\learning\\${esc(d.file)} (3.13)</div>
          <div class="idle-menu"><span>File</span><span>Edit</span><span>Format</span><span data-anno="menu-run">Run</span><span>Options</span><span>Window</span><span>Help</span></div>
          <div class="code">${codeRows(d).map((r) => `<div class="ln-c">${r.html}${r.ghost}</div>`).join('')}</div>
          <div class="idle-status">Ln: ${lines.length} Col: ${stripMarks(lines[lines.length - 1]).length}</div>
        </div>
        <div class="idle-w idle-shell" data-anno="shell">
          <div class="idle-title">IDLE Shell 3.13</div>
          <pre><span class="restart">= RESTART: C:\\learning\\${esc(d.file)}</span>
<span class="out${d.outClass ? ' ' + d.outClass : ''}" data-anno="out">${esc(d.output)}</span>
<span class="prompt" data-anno="prompt">&gt;&gt;&gt;</span> </pre>
        </div>
      </div>`;
  }

  /* ---------------- Elements ---------------- */
  const el = {
    stage: $('#stage'), kicker: $('#stageKicker'), title: $('#stageTitle'), heading: $('.stage-heading'),
    diagram: $('#diagram'), win: $('#win'), questView: $('#questView'), stageChoices: $('#stageChoices'), notePop: $('#notePop'),
    flyout: $('#flyout'), coach: $('#coach'), scrim: $('#panelScrim'), panelClose: $('#panelClose'), helperBtn: $('[data-nav="helper"]'),
    panelBody: $('#panelBody'), panelRunner: $('#panelRunner'), panelNav: $('#panelNav'), panel: $('#panel'),
    progress: $('#progress'), sandbox: $('#sandbox'),
    langBtn: $('[data-nav="lang"]'), langMenu: $('#langMenu'), langLabel: $('#langLabel'),
    hintsBtn: $('[data-nav="hints"]'), tip: $('#tip'),
    dock: $('#dock'), launchBtn: $('#launchBtn'), launcher: $('#launcher'), dockNow: $('#dockNow'), dockNav: $('#dockNav'),
    mode: $('.mode'), modeThumb: $('.mode-thumb'),
  };

  const currentData = () => (state.view === 'lesson' ? lesson() : content().start);
  const effectiveMode = () => state.mode || 'vscode';
  const windowHtml = (d) => (effectiveMode() === 'idle' ? idleWin(d) : vscodeWin(d));

  /* ---------------- Static texts ---------------- */
  function applyStaticTexts() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', t(n.dataset.i18nAria)); });
    $('meta[name="description"]').setAttribute('content', t('metaDescription'));
    const cur = LANGS.find((l) => l.code === state.lang);
    el.langLabel.textContent = cur.name;
    el.langBtn.setAttribute('aria-label', `${t('langAria')}: ${cur.name}`);
    el.langMenu.innerHTML = LANGS.map((l) => `
      <button type="button" role="menuitemradio" lang="${l.code}" data-lang="${l.code}" aria-checked="${l.code === state.lang}">
        <span class="lang-code">${l.short}</span><span>${l.name}</span>${l.code === state.lang ? icon('check') : ''}
      </button>`).join('');
    $('.quip-q').innerHTML = '<span class="q-w">What in the</span> <span class="q-str">“hee…llo world”</span><span class="q-op">?!</span>';
    window.PPS_INPUT_DEFAULT = t('inputDefault');
    if (typeof updateVoices === 'function') updateVoices();
    renderThemeBtn();
    renderHintsBtn();
    applyPanelState();
  }

  /* ---------------- Sliding thumbs (mode switch, tabs) ---------------- */
  function moveThumb(container, thumb, activeSel, instant) {
    const a = $(activeSel, container);
    if (!a || !thumb) return;
    const cr = container.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    if (instant) thumb.style.transition = 'none';
    thumb.style.width = `${ar.width}px`;
    thumb.style.transform = `translateX(${ar.left - cr.left}px)`;
    if (instant) { thumb.getBoundingClientRect(); thumb.style.transition = ''; }
  }

  /* ---------------- Stage ---------------- */
  /*
    The diagram shows only the editor. Every explanation sits behind a numbered pin on the code.
    When a lesson opens, the pins pop in one after another like notifications; an unread pin
    carries a small "!" until it has been opened. Hover, focus or tap shows the note.
  */
  const readNotes = new Set(store.get('pps-read', []));
  const noteKey = (id) => `${state.view === 'lesson' ? state.lessonId : 'start'}:${effectiveMode()}:${id}`;
  let currentAnnos = [];
  /* where the pin goes for parts of the editor window, so it never covers anything */
  const PIN_SLOT = { title: 'prepend', run: 'prepend', term: '.vs-term-label', shell: '.idle-title' };

  let stageToken = 0;
  async function renderStage(opts = {}) {
    const token = ++stageToken;
    const isQuests = state.view === 'quests';
    el.stage.classList.toggle('is-quests', isQuests);
    el.questView.hidden = !isQuests;
    if (isQuests) {
      hideNote(true);
      el.kicker.textContent = t('questsKicker');
      el.title.textContent = t('questsTitle');
      if (opts.animate && state.revealed) M.rise(el.heading, 0, 8, 420);
      renderQuests(opts.animate && state.revealed);
      return;
    }
    const d = currentData();
    const mode = effectiveMode();
    const animate = opts.animate && state.revealed && !M.reduced();
    hideNote(true);

    if (animate) {
      await Promise.all([
        M.anim(el.win, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px) scale(.99)' }], { duration: 160, easing: M.IN, fill: 'forwards' }),
        M.anim(el.heading, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 140, fill: 'forwards' }),
        M.anim(el.stageChoices, [{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' }),
      ]);
      if (token !== stageToken) return;
      [el.win, el.heading, el.stageChoices].forEach((n) => n.getAnimations().forEach((a) => a.cancel()));
    }

    el.kicker.textContent = state.view === 'lesson' ? t('lessonOf', lessonIndex() + 1, lessons().length) : d.kicker;
    el.title.textContent = d.title;
    $$('.mode button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    moveThumb(el.mode, el.modeThumb, '[aria-pressed="true"]', !state.revealed);

    el.win.innerHTML = windowHtml(d);
    currentAnnos = d.annos.filter((a) => (!a.mode || a.mode === mode) && el.win.querySelector(`[data-anno="${a.id}"]`));
    currentAnnos.forEach((a, i) => {
      const target = el.win.querySelector(`[data-anno="${a.id}"]`);
      target.classList.add('anno-t');
      target.dataset.kind = a.kind;
      target.dataset.id = a.id;
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'pin';
      pin.dataset.kind = a.kind;
      pin.dataset.id = a.id;
      pin.dataset.i = i;
      pin.setAttribute('aria-label', t('pinAria', i + 1, a.title));
      pin.setAttribute('aria-haspopup', 'dialog');
      pin.setAttribute('aria-expanded', 'false');
      if (!readNotes.has(noteKey(a.id))) pin.classList.add('is-new');
      pin.innerHTML = `<span class="pin-ring" aria-hidden="true"></span><span class="pin-n">${i + 1}</span>`;
      const slot = PIN_SLOT[a.id];
      if (slot === 'prepend') target.prepend(pin);
      else if (slot && target.querySelector(slot)) target.querySelector(slot).append(pin);
      else target.append(pin);
    });

    renderStageChoices();

    if (animate) {
      M.rise(el.heading, 0, 8, 420);
      if (state.view === 'start') M.rise(el.stageChoices, 500, 12, 520);
      else taskCardIn(500 + currentAnnos.length * 150);
      await diagramIn(0);
    }
  }

  function renderStageChoices() {
    el.stageChoices.classList.toggle('is-task', state.view === 'lesson');
    if (state.view === 'lesson') {
      /* the task of this lesson, visible right away under the editor */
      const l = lesson();
      const done = state.done.has(l.id);
      const steps = taskSteps(l);
      const k = done ? steps.length - 1 : nextStepOf(l);
      const solved = solvedOf(l);
      el.stageChoices.hidden = false;
      el.stageChoices.innerHTML = `
        <div class="task-card${done ? ' is-done' : ''}">
          <span class="tc-ic">${icon(done ? 'check' : 'task')}</span>
          <div class="tc-body">
            <span class="tc-label">${esc(t('tabTask'))} · ${done ? esc(t('taskDone')) : esc(t('taskStepOf', k + 1, steps.length))}</span>
            <p class="tc-text">${done ? steps[steps.length - 1].text : steps[k].text}</p>
            <span class="tc-steps" aria-hidden="true">${steps.map((_, i) => `<i class="${i < solved ? 'on' : ''}${i === k && !done ? ' cur' : ''}"></i>`).join('')}</span>
          </div>
          <button class="btn ${done ? '' : 'primary '}tc-go" type="button" data-dock="task">${esc(done ? t('taskAgain') : t('taskSolve'))}${icon('right')}</button>
        </div>`;
      return;
    }
    if (state.view !== 'start') { el.stageChoices.innerHTML = ''; el.stageChoices.hidden = true; return; }
    const s = content().start;
    el.stageChoices.hidden = false;
    el.stageChoices.innerHTML = `
      <a class="choice primary" href="#/lesson/install"><b>${esc(s.choiceZero.title)}</b><span>${esc(s.choiceZero.text)}</span></a>
      <a class="choice" href="#/lesson/print"><b>${esc(s.choiceKnow.title)}</b><span>${esc(s.choiceKnow.text)}</span></a>
      <button class="link-btn tour-again" type="button">${esc(t('tourAgain'))}</button>`;
  }

  /* Entrance of the diagram: the window, then the pins jump in one by one and blink */
  function diagramIn(delay = 0, skipWindow = false) {
    if (!skipWindow) M.anim(el.win, [{ opacity: 0, transform: 'translateY(12px) scale(.985)' }, { opacity: 1, transform: 'none' }], { delay, duration: 620 });
    const pins = $$('.pin', el.win);
    const start = delay + (skipWindow ? 100 : 420);
    pins.forEach((p, i) => {
      const d0 = start + i * 150;
      M.anim(p, [
        { opacity: 0, transform: 'translateY(6px) scale(0)' },
        { opacity: 1, transform: 'translateY(-12px) scale(1.25)', offset: .45 },
        { transform: 'translateY(2px) scale(.92)', offset: .72 },
        { opacity: 1, transform: 'none' },
      ], { delay: d0, duration: 760, easing: 'cubic-bezier(.3, .7, .4, 1)' });
      const ring = $('.pin-ring', p);
      if (p.classList.contains('is-new')) {
        M.anim(ring, [{ opacity: .7, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.6)' }], { delay: d0 + 420, duration: 900, iterations: 2, easing: 'ease-out', fill: 'none' });
      }
    });
    return M.wait(start + pins.length * 150 + 700);
  }

  function taskCardIn(delay) {
    const card = $('.task-card', el.stageChoices);
    if (!card) return;
    M.anim(card, [{ opacity: 0, transform: 'translateY(18px) scale(.97)' }, { opacity: 1, transform: 'none' }], { delay, duration: 620, easing: M.SPRING });
    M.anim($('.tc-ic', card), [{ transform: 'scale(.3) rotate(-25deg)' }, { transform: 'none' }], { delay: delay + 180, duration: 620, easing: M.SPRING });
    if (!card.classList.contains('is-done')) {
      M.anim($('.tc-go', card), [
        { boxShadow: '0 0 0 0 color-mix(in srgb, var(--accent) 50%, transparent)' },
        { boxShadow: '0 0 0 12px transparent' },
      ], { delay: delay + 700, duration: 1100, iterations: 2, easing: 'ease-out', fill: 'none' });
    }
  }

  /* ---------------- Notes (the explanation behind each pin) ---------------- */
  const note = { id: null, pin: null, sticky: false, hideTimer: null };

  function placeNote() {
    if (!note.pin) return;
    const pop = el.notePop;
    const r = note.pin.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    let x = r.left + r.width / 2 - pr.width / 2;
    x = Math.max(10, Math.min(innerWidth - pr.width - 10, x));
    let y = r.top - pr.height - 14;
    const below = y < 10;
    if (below) y = r.bottom + 14;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    pop.classList.toggle('below', below);
    pop.style.setProperty('--arrow-x', `${r.left + r.width / 2 - x}px`);
  }

  function showNote(pin, sticky) {
    clearTimeout(note.hideTimer);
    const id = pin.dataset.id;
    const i = Number(pin.dataset.i);
    const a = currentAnnos[i];
    if (!a) return;
    const same = note.id === id;
    note.sticky = sticky || (same && note.sticky);
    if (same && !el.notePop.hidden) return;
    if (note.pin) { note.pin.setAttribute('aria-expanded', 'false'); note.pin.closest('.anno-t').classList.remove('is-active'); }
    note.id = id;
    note.pin = pin;
    pin.setAttribute('aria-expanded', 'true');
    pin.closest('.anno-t').classList.add('is-active');
    const n = currentAnnos.length;
    el.notePop.dataset.kind = a.kind;
    el.notePop.setAttribute('aria-label', a.title);
    el.notePop.innerHTML = `
      <div class="np-head"><span class="badge">${i + 1}</span><b class="np-title">${esc(a.title)}</b></div>
      ${a.text ? `<p class="np-text">${a.text}</p>` : ''}
      <div class="np-foot">
        <button class="np-btn" type="button" data-note="prev" aria-label="${esc(t('notePrev'))}" ${i === 0 ? 'disabled' : ''}>${icon('left')}</button>
        <span>${esc(t('noteOf', i + 1, n))}</span>
        <button class="np-btn" type="button" data-note="next" aria-label="${esc(t('noteNext'))}" ${i === n - 1 ? 'disabled' : ''}>${icon('right')}</button>
      </div>`;
    el.notePop.hidden = false;
    placeNote();
    const below = el.notePop.classList.contains('below');
    M.anim(el.notePop, [{ opacity: 0, transform: `translateY(${below ? -8 : 8}px) scale(.94)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: M.SPRING });
    markRead(pin);
  }

  function markRead(pin) {
    const key = noteKey(pin.dataset.id);
    if (readNotes.has(key)) return;
    readNotes.add(key);
    store.set('pps-read', Array.from(readNotes));
    pin.classList.remove('is-new');
    M.anim(pin, [{ transform: 'scale(1.35)' }, { transform: 'none' }], { duration: 420, easing: M.SPRING });
  }

  function hideNote(now) {
    clearTimeout(note.hideTimer);
    const go = () => {
      if (note.pin) { note.pin.setAttribute('aria-expanded', 'false'); const tgt = note.pin.closest('.anno-t'); if (tgt) tgt.classList.remove('is-active'); }
      note.id = null; note.pin = null; note.sticky = false;
      if (el.notePop.hidden) return;
      if (now || M.reduced()) { el.notePop.hidden = true; return; }
      M.anim(el.notePop, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.97)' }], { duration: 140, fill: 'forwards' }).then(() => {
        if (!note.id) { el.notePop.hidden = true; el.notePop.getAnimations().forEach((x) => x.cancel()); }
      });
    };
    if (now) go(); else note.hideTimer = setTimeout(go, 180);
  }

  el.win.addEventListener('pointerover', (e) => {
    const pin = e.target.closest('.pin');
    if (pin && e.pointerType !== 'touch') showNote(pin, false);
  });
  el.win.addEventListener('pointerout', (e) => {
    const pin = e.target.closest('.pin');
    if (pin && !note.sticky && !pin.contains(e.relatedTarget)) hideNote(false);
  });
  el.win.addEventListener('click', (e) => {
    const pin = e.target.closest('.pin');
    if (!pin) return;
    if (note.id === pin.dataset.id && note.sticky) { hideNote(true); return; }
    showNote(pin, true);
  });
  el.win.addEventListener('focusin', (e) => { const pin = e.target.closest('.pin'); if (pin) showNote(pin, false); });
  el.win.addEventListener('focusout', (e) => { if (!note.sticky && !el.notePop.contains(e.relatedTarget)) hideNote(false); });
  el.notePop.addEventListener('pointerenter', () => clearTimeout(note.hideTimer));
  el.notePop.addEventListener('pointerleave', () => { if (!note.sticky) hideNote(false); });
  el.notePop.addEventListener('click', (e) => {
    const b = e.target.closest('[data-note]');
    if (!b || !note.pin) return;
    const i = Number(note.pin.dataset.i) + (b.dataset.note === 'next' ? 1 : -1);
    const pin = $(`.pin[data-i="${i}"]`, el.win);
    if (pin) { showNote(pin, true); const again = $(`[data-note="${b.dataset.note}"]`, el.notePop); if (again && !again.disabled) again.focus(); else pin.focus({ preventScroll: true }); }
  });
  document.addEventListener('pointerdown', (e) => {
    if (note.id && !e.target.closest('.pin') && !e.target.closest('.note-pop')) hideNote(true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && note.id) { const p = note.pin; hideNote(true); if (p) p.focus({ preventScroll: true }); }
  });

  new ResizeObserver(() => requestAnimationFrame(() => {
    placeNote();
    moveThumb(el.mode, el.modeThumb, '[aria-pressed="true"]', true);
  })).observe(el.diagram);
  el.stage.addEventListener('scroll', () => placeNote(), { passive: true });
  window.addEventListener('scroll', () => placeNote(), { passive: true });

  $$('.mode button').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.mode === effectiveMode()) return;
    state.mode = b.dataset.mode;
    store.set('pps-mode', state.mode);
    renderStage({ animate: true });
  }));

  /* ---------------- Glossary tooltip (hints mode) ---------------- */
  let tipFor = null;
  function showTip(target, word) {
    const text = glossary()[word];
    if (!text) return hideTip();
    el.tip.innerHTML = `<code>${esc(word)}</code><span>${esc(text)}</span>`;
    el.tip.hidden = false;
    const r = target.getBoundingClientRect();
    const tr = el.tip.getBoundingClientRect();
    let x = r.left + r.width / 2 - tr.width / 2;
    x = Math.max(8, Math.min(innerWidth - tr.width - 8, x));
    let y = r.top - tr.height - 10;
    const below = y < 8;
    if (below) y = r.bottom + 10;
    el.tip.style.left = `${x}px`;
    el.tip.style.top = `${y}px`;
    el.tip.classList.toggle('below', below);
    if (tipFor !== target) M.anim(el.tip, [{ opacity: 0, transform: `translateY(${below ? -6 : 6}px) scale(.96)` }, { opacity: 1, transform: 'none' }], { duration: 260 });
    tipFor = target;
  }
  function hideTip() { el.tip.hidden = true; tipFor = null; }
  document.addEventListener('pointerover', (e) => {
    if (!state.hints) return;
    const g = e.target.closest('.win [data-g], .tip-scope [data-g]');
    if (g) showTip(g, g.dataset.g); else if (tipFor && !e.target.closest('.tip')) hideTip();
  });
  window.addEventListener('scroll', hideTip, true);

  /* ---------------- Python in the browser (Pyodide) ---------------- */
  let pyPromise = null;
  let pyLoaded = false;
  const PY_SETUP = String.raw`
import builtins, js, sys, io, json, contextlib
_queue = []
_strict = [False]
def _input(msg=""):
    print(msg, end="")
    if _queue:
        v = _queue.pop(0)
    elif _strict[0]:
        raise EOFError("no more input")
    else:
        v = js.prompt(str(msg) or js.PPS_INPUT_DEFAULT)
        v = "" if v is None else str(v)
    print(v)
    return v
builtins.input = _input

def _short(v):
    r = repr(v)
    return r if len(r) <= 60 else r[:57] + "..."

def _trace_run(code):
    steps = []
    buf = io.StringIO()
    ns = {"__name__": "__main__"}
    limit = {"hit": False}
    class _Stop(Exception):
        pass
    def snapshot(frame):
        out = {}
        for k, v in list(frame.f_locals.items()):
            if k.startswith("_") or type(v).__name__ == "module":
                continue
            if callable(v):
                out[k] = {"fn": getattr(v, "__name__", k)}
            else:
                out[k] = _short(v)
        return out
    depth = {"d": 0}
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<user>":
            return None
        inner = frame.f_code.co_name != "<module>"
        if event == "call" and inner:
            depth["d"] += 1
        elif event == "line":
            steps.append({"line": frame.f_lineno, "fn": frame.f_code.co_name, "vars": snapshot(frame), "out": buf.getvalue(), "depth": depth["d"]})
            if len(steps) >= 400:
                limit["hit"] = True
                raise _Stop()
        elif event == "return" and inner:
            depth["d"] -= 1
            if steps:
                steps[-1]["ret"] = _short(arg)
        return tracer
    err = None
    err_line = None
    with contextlib.redirect_stdout(buf):
        sys.settrace(tracer)
        try:
            exec(compile(code, "<user>", "exec"), ns)
        except _Stop:
            pass
        except BaseException as e:
            err = type(e).__name__ + ": " + str(e)
            tb = e.__traceback__
            while tb is not None:
                if tb.tb_frame.f_code.co_filename == "<user>":
                    err_line = tb.tb_lineno
                tb = tb.tb_next
            if isinstance(e, SyntaxError):
                err_line = e.lineno
        finally:
            sys.settrace(None)
    final = {k: (_short(v) if not callable(v) else {"fn": getattr(v, "__name__", k)}) for k, v in ns.items() if not k.startswith("_") and type(v).__name__ != "module"}
    steps.append({"line": None, "fn": "<module>", "vars": final, "out": buf.getvalue(), "end": True})
    return json.dumps({"steps": steps, "error": err, "errLine": err_line, "limit": limit["hit"]})
`;
  function loadPy() {
    if (pyPromise) return pyPromise;
    pyPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = PYODIDE_URL;
      s.onload = async () => {
        try {
          const py = await window.loadPyodide();
          py.runPython(PY_SETUP);
          pyLoaded = true;
          resolve(py);
        } catch (err) { reject(err); }
      };
      s.onerror = () => reject(new Error('network'));
      document.head.append(s);
    });
    pyPromise.catch(() => { pyPromise = null; });
    return pyPromise;
  }

  function feedInputs(py, inputs, strict) {
    const q = py.globals.get('_queue');
    q.clear();
    (inputs || []).forEach((v) => q.append(v));
    q.destroy();
    py.runPython(`_strict[0] = ${strict ? 'True' : 'False'}`);
  }

  async function runPython(code, inputs, opts = {}) {
    const py = await loadPy();
    const lines = [];
    py.setStdout({ batched: (s) => lines.push(s) });
    py.setStderr({ batched: (s) => lines.push(s) });
    feedInputs(py, inputs, opts.strict);
    const ns = py.toPy({ __name__: '__main__' });
    try {
      await py.runPythonAsync(code, { globals: ns });
      if (opts.after) {
        const mark = lines.length;
        await py.runPythonAsync(opts.after, { globals: ns });
        return { out: lines.slice(0, mark).join('\n'), after: lines.slice(mark).join('\n') };
      }
      return { out: lines.join('\n') };
    } catch (err) {
      return { out: lines.join('\n'), error: String(err.message || err) };
    } finally {
      ns.destroy();
      py.runPython('_queue.clear()\n_strict[0] = False');
    }
  }

  async function traceRun(code, inputs) {
    const py = await loadPy();
    feedInputs(py, inputs, !!inputs);
    const fn = py.globals.get('_trace_run');
    try {
      return JSON.parse(fn(code));
    } finally {
      fn.destroy();
      py.runPython('_queue.clear()\n_strict[0] = False');
    }
  }

  function explainError(msg) {
    const lines = msg.trim().split('\n');
    let lineNo = null;
    lines.forEach((l) => { const m = l.match(/File "<exec>", line (\d+)/); if (m) lineNo = m[1]; });
    const last = lines.filter((l) => l.trim()).pop() || msg;
    const type = (last.match(/^(\w+Error)/) || [])[1];
    return { lineNo, last, hint: (t('hints') || {})[type] || '' };
  }

  /* ---------------- Runner widget ---------------- */
  function makeRunner(root, opts) {
    root.innerHTML = `
      <div class="rn">
        <div class="rn-head">
          <h3></h3>
          <div class="rn-tools">
            <button class="icon-btn" type="button" data-act="reset">${icon('reset')}</button>
            <button class="icon-btn" type="button" data-act="copy">${icon('copy')}</button>
            <button class="btn btn-steps hint-only" type="button" data-act="steps">${icon('steps')}<span></span></button>
            <button class="btn primary btn-run" type="button" data-act="run" title="Ctrl + Enter">${icon('play')}<span></span></button>
          </div>
        </div>
        <div class="rn-ed">
          <pre class="rn-gutter" aria-hidden="true">1</pre>
          <div class="rn-area">
            <span class="rn-band" aria-hidden="true" hidden></span>
            <pre class="rn-hl" aria-hidden="true"></pre>
            <textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea>
          </div>
        </div>
        <div class="rn-word hint-only tip-scope" aria-live="polite"></div>
        <div class="rn-steps" hidden></div>
        <div class="rn-out" role="status" aria-live="polite"></div>
      </div>`;
    const ta = $('textarea', root);
    const hlEl = $('.rn-hl', root);
    const gut = $('.rn-gutter', root);
    const out = $('.rn-out', root);
    const band = $('.rn-band', root);
    const wordEl = $('.rn-word', root);
    const stepsEl = $('.rn-steps', root);
    const runBtn = $('[data-act="run"]', root);
    const stepsBtn = $('[data-act="steps"]', root);
    const resetBtn = $('[data-act="reset"]', root);
    const copyBtn = $('[data-act="copy"]', root);
    let original = '';
    let runKey = 'run';
    let shown = false;
    let trace = null;
    let stepIdx = 0;

    function labels() {
      $('h3', root).textContent = opts.title();
      resetBtn.title = t('reset'); resetBtn.setAttribute('aria-label', t('reset'));
      copyBtn.title = t('copy'); copyBtn.setAttribute('aria-label', t('copy'));
      $('span:last-child', runBtn).textContent = t(runKey);
      $('span:last-child', stepsBtn).textContent = t('stepBtn');
      ta.setAttribute('aria-label', t('codeAria'));
      if (!shown) out.innerHTML = `<span class="muted">${esc(t('outEmpty'))}</span>`;
      if (trace) renderStep(false);
      updateWord();
    }

    function setBand(line, kind) {
      if (!line) { band.hidden = true; return; }
      const wasHidden = band.hidden;
      band.hidden = false;
      band.dataset.kind = kind;
      band.style.transform = `translateY(${(line - 1) * 1.7}em)`;
      if (wasHidden) M.anim(band, [{ opacity: 0, transform: `translateY(${(line - 1) * 1.7}em) scaleX(.6)` }, { opacity: 1, transform: `translateY(${(line - 1) * 1.7}em)` }], { duration: 380 });
    }

    function sync() {
      const v = ta.value;
      hlEl.innerHTML = highlight(v) + '\n';
      gut.textContent = Array.from({ length: v.split('\n').length }, (_, i) => i + 1).join('\n');
      if (opts.onChange) opts.onChange(v);
    }
    function onEdit() {
      sync();
      if (band.dataset.kind === 'err') setBand(null);
      if (trace) closeSteps();
      updateWord();
    }
    function insert(text) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      onEdit();
    }

    /* the word under the caret, explained (hints mode) */
    let lastWord = null;
    function updateWord() {
      if (!state.hints) { wordEl.innerHTML = ''; lastWord = null; return; }
      const v = ta.value;
      const p = ta.selectionStart;
      const left = v.slice(0, p).match(/[A-Za-z_]+$/);
      const right = v.slice(p).match(/^[A-Za-z_]+/);
      const w = (left ? left[0] : '') + (right ? right[0] : '');
      const text = glossary()[w];
      if (w === lastWord) return;
      lastWord = w;
      if (text) {
        wordEl.innerHTML = `${icon('bulb')}<code>${esc(w)}</code><span>${esc(text)}</span>`;
        M.anim(wordEl, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
      } else {
        wordEl.innerHTML = '';
      }
    }

    ta.addEventListener('input', onEdit);
    ta.addEventListener('keyup', updateWord);
    ta.addEventListener('click', updateWord);
    ta.addEventListener('scroll', () => { hlEl.scrollLeft = ta.scrollLeft; band.style.marginLeft = `${-ta.scrollLeft}px`; });
    ta.addEventListener('focus', () => { loadPy().catch(() => {}); }, { once: true });
    ta.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); insert('    '); return; }
      if (e.key === 'Enter') {
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf('\n') + 1);
        let indent = (line.match(/^\s*/) || [''])[0];
        if (/:\s*$/.test(line)) indent += '    ';
        e.preventDefault();
        insert('\n' + indent);
      }
    });

    /* output appears line by line */
    function show(res) {
      shown = true;
      const parts = [`<span class="rn-out-label">${esc(t('outLabel'))}</span>`];
      const lines = res.out ? res.out.split('\n') : [];
      lines.forEach((l) => parts.push(`<span class="ln">${esc(l) || ' '}</span>`));
      let errLine = null;
      if (res.error) {
        const e = explainError(res.error);
        errLine = e.lineNo ? Number(e.lineNo) : null;
        parts.push(`<span class="ln rn-err">${e.lineNo ? esc(t('errLine', e.lineNo)) : ''}${esc(e.last)}</span>`);
        if (e.hint) parts.push(`<span class="ln rn-hint">${esc(e.hint)}</span>`);
      } else if (!lines.length) {
        parts.push(`<span class="ln muted">${esc(t('noOutput'))}</span>`);
      }
      out.innerHTML = parts.join('');
      $$('.ln', out).slice(0, 30).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: 'translateX(-6px)' }, { opacity: 1, transform: 'none' }], { delay: i * 45, duration: 360 }));
      if (state.hints && errLine) setBand(errLine, 'err'); else if (band.dataset.kind === 'err') setBand(null);
      if (res.error) M.anim(ta.closest('.rn-ed'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 380, easing: 'ease-out' });
    }

    async function run() {
      if (runBtn.getAttribute('aria-busy') === 'true') return;
      if (trace) closeSteps();
      runBtn.setAttribute('aria-busy', 'true');
      if (!pyLoaded) { shown = true; out.innerHTML = `<span class="muted loading">${esc(t('loading'))}</span>`; }
      try {
        const code = ta.value;
        const res = await runPython(code, opts.getInputs ? opts.getInputs() : null);
        show(res);
        if (opts.onResult) opts.onResult(code, res);
      } catch (err) {
        shown = true;
        out.innerHTML = `<span class="rn-err">${esc(t('loadFail'))}</span><span class="rn-hint">${esc(t('loadFailHint'))}</span>`;
      } finally {
        runBtn.removeAttribute('aria-busy');
      }
    }

    /* ---- step-by-step mode ---- */
    async function startSteps() {
      if (stepsBtn.getAttribute('aria-busy') === 'true') return;
      stepsBtn.setAttribute('aria-busy', 'true');
      if (!pyLoaded) { shown = true; out.innerHTML = `<span class="muted loading">${esc(t('loading'))}</span>`; }
      try {
        trace = await traceRun(ta.value);
        stepIdx = 0;
        stepsEl.hidden = false;
        out.hidden = true;
        renderStep(true);
        M.anim(stepsEl, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      } catch (err) {
        shown = true;
        out.innerHTML = `<span class="rn-err">${esc(t('loadFail'))}</span><span class="rn-hint">${esc(t('loadFailHint'))}</span>`;
      } finally {
        stepsBtn.removeAttribute('aria-busy');
      }
    }
    function closeSteps() {
      trace = null;
      stepsEl.hidden = true;
      stepsEl.innerHTML = '';
      out.hidden = false;
      if (band.dataset.kind === 'step') setBand(null);
    }
    function renderStep(first) {
      const steps = trace.steps;
      const s = steps[stepIdx];
      const prevVars = stepIdx > 0 ? steps[stepIdx - 1].vars : {};
      const isEnd = !!s.end;
      const where = isEnd
        ? (trace.error ? `<span class="rn-err">${esc(trace.error)}</span>` : esc(t('stepEnd')))
        : `${esc(t('stepLine', s.line))}${s.fn && s.fn !== '<module>' ? ` · ${esc(t('stepIn', s.fn))}` : ''}`;
      const names = Object.keys(s.vars);
      const vars = names.length
        ? names.map((k) => {
          const v = s.vars[k];
          const changed = JSON.stringify(prevVars[k]) !== JSON.stringify(v);
          const val = typeof v === 'object' ? `<i>${esc(t('stepFn'))} ${esc(v.fn)}()</i>` : `<code>${esc(v)}</code>`;
          return `<div class="sv${changed && stepIdx > 0 ? ' changed' : ''}"><code class="sv-k">${esc(k)}</code><span class="sv-eq">=</span>${val}</div>`;
        }).join('')
        : `<p class="muted">${esc(t('stepNoVars'))}</p>`;
      stepsEl.innerHTML = `
        <div class="st-bar">
          <button class="icon-btn" type="button" data-step="prev" aria-label="${esc(t('stepPrev'))}" ${stepIdx === 0 ? 'disabled' : ''}>${icon('left')}</button>
          <div class="st-where"><b>${esc(t('stepOf', stepIdx + 1, steps.length))}</b><span>${where}</span></div>
          <button class="icon-btn" type="button" data-step="next" aria-label="${esc(t('stepNext'))}" ${stepIdx === steps.length - 1 ? 'disabled' : ''}>${icon('right')}</button>
          <button class="icon-btn" type="button" data-step="close" aria-label="${esc(t('stepClose'))}">${icon('close')}</button>
        </div>
        <input class="st-range" type="range" min="0" max="${steps.length - 1}" value="${stepIdx}" aria-label="${esc(t('stepOf', stepIdx + 1, steps.length))}">
        ${trace.limit ? `<p class="st-limit">${esc(t('stepLimit'))}</p>` : ''}
        <div class="st-grid">
          <div><p class="st-h">${esc(t('stepVars'))}</p><div class="st-vars">${vars}</div></div>
          <div><p class="st-h">${esc(t('stepOut'))}</p><pre class="st-out">${esc(s.out || '')}</pre></div>
        </div>`;
      if (isEnd) setBand(trace.errLine, trace.errLine ? 'err' : 'step'); else setBand(s.line, 'step');
      if (isEnd && !trace.errLine) setBand(null);
      $$('.sv.changed', stepsEl).forEach((n) => M.anim(n, [{ backgroundColor: 'color-mix(in srgb, var(--str) 30%, transparent)' }, { backgroundColor: 'transparent' }], { duration: 900, easing: 'ease-out' }));
      if (!first) $('.st-where', stepsEl) && M.anim($('.st-where', stepsEl), [{ opacity: .3 }, { opacity: 1 }], { duration: 220 });
    }
    stepsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b || !trace) return;
      if (b.dataset.step === 'close') { closeSteps(); return; }
      stepIdx = Math.max(0, Math.min(trace.steps.length - 1, stepIdx + (b.dataset.step === 'next' ? 1 : -1)));
      renderStep(false);
      const again = $(`[data-step="${b.dataset.step}"]`, stepsEl);
      if (again && !again.disabled) again.focus();
    });
    stepsEl.addEventListener('input', (e) => {
      if (!e.target.classList.contains('st-range') || !trace) return;
      stepIdx = Number(e.target.value);
      renderStep(false);
      const r = $('.st-range', stepsEl);
      r.focus();
    });
    stepsEl.addEventListener('keydown', (e) => {
      if (!trace) return;
      if (e.key === 'ArrowRight' && !e.target.classList.contains('st-range')) { e.preventDefault(); $('[data-step="next"]', stepsEl).click(); }
      if (e.key === 'ArrowLeft' && !e.target.classList.contains('st-range')) { e.preventDefault(); $('[data-step="prev"]', stepsEl).click(); }
    });

    runBtn.addEventListener('click', run);
    stepsBtn.addEventListener('click', startSteps);
    resetBtn.addEventListener('click', () => {
      ta.value = original; onEdit(); ta.focus();
      M.anim(resetBtn, [{ transform: 'rotate(0)' }, { transform: 'rotate(-360deg)' }], { duration: 600 });
    });
    copyBtn.addEventListener('click', () => {
      const done = () => {
        copyBtn.title = t('copied');
        copyBtn.innerHTML = icon('check');
        M.pop(copyBtn.firstElementChild, 0, 360);
        setTimeout(() => { copyBtn.innerHTML = icon('copy'); copyBtn.title = t('copy'); }, 1200);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, () => {});
    });

    labels();
    return {
      root,
      set(code) {
        original = code; ta.value = code; shown = false; closeSteps(); setBand(null); sync(); labels();
        /* put the cursor where the answer goes: an empty indented line, else inside empty brackets, else at the end */
        let at = code.length;
        const blank = /\n( +)\n?$/.test(code);
        const brackets = code.indexOf('()');
        if (blank) at = code.length - (code.endsWith('\n') ? 1 : 0);
        else if (brackets >= 0) at = brackets + 1;
        ta.setSelectionRange(at, at);
      },
      setRun(key) { runKey = key; labels(); },
      labels,
      refreshHints() { if (!state.hints) { if (trace) closeSteps(); if (band.dataset.kind === 'err') setBand(null); } lastWord = null; updateWord(); sync(); },
    };
  }

  /* ---------------- Tests (LeetCode style) ---------------- */
  const EXTRAS = () => (window.TASK_EXTRAS || {})[state.lang] || {};
  const outLines = (s) => norm(s || '').split('\n');

  function testDesc(tc) {
    if (tc.example) return t('testExample') + (tc.inputs && tc.inputs.length ? ` · ${t('testInput', tc.inputs.join(', '))}` : '');
    if (tc.call) return t('testCall', tc.call);
    if (tc.replace) return t('testWith', tc.replace[1]);
    if (tc.inputs) return t('testInput', tc.inputs.join(', '));
    return '';
  }

  async function runOneTest(tc, code, task) {
    let src = code;
    if (tc.replace) {
      const re = new RegExp(tc.replace[0], 'm');
      if (!re.test(src)) return { ok: false, got: t('testNoVar') };
      src = src.replace(re, tc.replace[1]);
    }
    const res = await runPython(src, tc.inputs || task.inputs || [], { after: tc.call ? `print(${tc.call})` : null, strict: true });
    if (res.error) {
      const e = explainError(res.error);
      return { ok: false, got: /EOFError/.test(e.last) ? t('testNeedsInput') : e.last };
    }
    const out = tc.call ? res.after : res.out;
    if (tc.last != null) {
      const ls = outLines(out);
      const last = (ls[ls.length - 1] || '').trim();
      return { ok: last === tc.last, got: last || t('testEmpty') };
    }
    const got = norm(out);
    return { ok: got === norm(tc.expect), got: got || t('testEmpty') };
  }

  const testRow = (i, tc, r) => `
    <li class="tc ${r ? (r.ok ? 'ok' : 'no') : 'run'}" data-i="${i}">
      <span class="tc-ic">${r ? icon(r.ok ? 'check' : 'close') : '<i class="tc-spin"></i>'}</span>
      <span class="tc-main"><b>${esc(t('testN', i + 1))}</b><span class="tc-desc">${esc(testDesc(tc))}</span>
      ${r && !r.ok && !tc.example ? `<span class="tc-diff"><span>${esc(t('testExpected'))}</span><code>${esc(tc.last != null ? tc.last : (norm(tc.expect) || t('testEmpty')))}</code><span>${esc(t('testGot'))}</span><code>${esc(r.got)}</code></span>` : ''}
      ${!r ? `<span class="tc-desc">${esc(t('testRunning'))}</span>` : ''}</span>
    </li>`;

  /* runs the extra tests of a task and keeps a live list inside `host` */
  async function runTests(task, code, exampleOk, host) {
    const cases = [{ example: true, inputs: task.inputs }].concat(task.tests || []);
    if (cases.length === 1) return { allOk: exampleOk, html: '' };
    const results = [{ ok: exampleOk }];
    const paint = () => {
      const passed = results.filter((r) => r && r.ok).length;
      return `<div class="tests">
        <div class="tests-head"><b>${esc(t('testsTitle'))}</b><span>${results.length === cases.length ? esc(t('testsPassed', passed, cases.length)) : esc(t('testRunning'))}</span></div>
        <ol class="tests-list">${cases.map((tc, i) => testRow(i, tc, results[i])).join('')}</ol></div>`;
    };
    host.innerHTML = paint();
    $$('.tc', host).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { delay: i * 50, duration: 320 }));
    for (let i = 1; i < cases.length; i++) {
      results[i] = await runOneTest(cases[i], code, task);
      const row = $(`.tc[data-i="${i}"]`, host);
      if (row) {
        row.outerHTML = testRow(i, cases[i], results[i]);
        const fresh = $(`.tc[data-i="${i}"]`, host);
        M.pop($('.tc-ic', fresh), 0, 420);
        if (!results[i].ok) M.anim(fresh, [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 300 });
      }
    }
    const head = $('.tests-head span', host);
    if (head) head.textContent = t('testsPassed', results.filter((r) => r.ok).length, cases.length);
    return { allOk: results.every((r) => r.ok), html: host.innerHTML };
  }

  /* ---------------- "Why??": a step-by-step explanation of the solution ---------------- */
  /* ---------------- "Why??": the solution, what it prints, and why ----------------
     Three plain parts, read top to bottom:
       1. Die Lösung        every line of the solution with one sentence about what it does
       2. Das kommt heraus  the output, like in a terminal
       3. Warum genau das?  for every piece of output: which line printed it, with which values */
  const valOf = (v) => (v && typeof v === 'object' ? null : v);
  function rangeVals(src, vars) {
    const m = src.match(/range\s*\(([^()]*)\)/);
    if (!m) return null;
    const args = m[1].split(',').map((a) => a.trim()).filter(Boolean);
    const num = (a) => (/^-?\d+$/.test(a) ? Number(a) : (vars && /^-?\d+$/.test(String(vars[a])) ? Number(vars[a]) : null));
    const n = args.map(num);
    if (!n.length || n.some((x) => x == null)) return null;
    const [a, b, s] = n.length === 1 ? [0, n[0], 1] : [n[0], n[1], n[2] || 1];
    const out = [];
    for (let v = a; s > 0 ? v < b : v > b; v += s) { out.push(v); if (out.length > 50) break; }
    return out;
  }
  const shortList = (vals) => (vals.length > 6 ? `${vals.slice(0, 3).join(', ')} … ${vals[vals.length - 1]}` : vals.join(', '));
  /* put the current values of variables into a piece of code */
  function withValues(src, vars) {
    return src.replace(/(["'])(?:\\.|(?!\1).)*\1|[A-Za-z_]\w*(?=\s*\()|[A-Za-z_]\w*/g, (w) => {
      if (/^["']/.test(w) || !vars || !(w in vars) || valOf(vars[w]) == null) return w;
      return String(vars[w]);
    });
  }

  /* one sentence per line of code */
  function explainLine(raw, firstVars) {
    const tl = raw.trim();
    if (!tl) return '';
    if (tl.startsWith('#')) return t('eComment');
    let m;
    if ((m = tl.match(/^def\s+(\w+)\s*\(([^)]*)\)/))) return m[2].trim() ? t('eDefP', m[1], m[2].trim()) : t('eDef', m[1]);
    if ((m = tl.match(/^for\s+(\w+)\s+in\s+(.+):$/))) {
      const vals = rangeVals(m[2], firstVars);
      return vals ? t('eForRange', m[1], shortList(vals)) : t('eForList', m[1], m[2].trim());
    }
    if ((m = tl.match(/^while\s+(.+):$/))) return t('eWhile', m[1]);
    if ((m = tl.match(/^if\s+(.+):$/))) return t('eIf', m[1]);
    if ((m = tl.match(/^elif\s+(.+):$/))) return t('eElif', m[1]);
    if (/^else\s*:$/.test(tl)) return t('eElse');
    if ((m = tl.match(/^return\s+(.+)$/))) return t('eReturn', m[1]);
    if ((m = tl.match(/^(\w+)\.append\((.+)\)$/))) return t('eAppend', m[2], m[1]);
    if ((m = tl.match(/^([A-Za-z_]\w*)\s*\+=\s*(.+)$/))) return t('eAddTo', m[1], m[2]);
    if ((m = tl.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/))) {
      const [, name, rhs] = m;
      if (/int\s*\(\s*input\s*\(/.test(rhs)) return t('eInputInt', name);
      if (/input\s*\(/.test(rhs)) return t('eInput', name);
      const upd = rhs.match(new RegExp(`^${name}\\s*([-+*/])\\s*(.+)$`));
      if (upd) return t({ '+': 'eUpdAdd', '-': 'eUpdSub', '*': 'eUpdMul', '/': 'eUpdDiv' }[upd[1]], name, upd[2]);
      if (/^(-?\d+(\.\d+)?|(["']).*\3|\[.*\]|True|False|None)$/.test(rhs)) return t('eStore', rhs, name);
      return t('eCalcStore', rhs, name);
    }
    if ((m = tl.match(/^print\s*\((.*)\)$/))) return m[1].trim() ? t('ePrint', m[1]) : t('ePrintEmpty');
    if ((m = tl.match(/^([A-Za-z_]\w*)\s*\(.*\)$/))) return t('eCall', m[1]);
    return t('eOther');
  }

  /* where every piece of output came from.
     Output between two traced lines belongs to the line that was running. One exception:
     when a function returns (depth goes down) and its last line was not a print, the output
     belongs to the line that called it, e.g. print(quadrat(7)). */
  function outputSources(code, trace) {
    const lines = code.split('\n');
    const steps = trace.steps;
    const depth = (s) => s.depth || 0;
    const events = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const s = steps[i];
      const next = steps[i + 1];
      const added = (next.out || '').slice((s.out || '').length);
      if (!added || s.end) continue;
      let owner = s;
      let ret = null;
      const leaving = next.end ? depth(s) > 0 : depth(next) < depth(s);
      if (leaving && !/^\s*print\b/.test(lines[s.line - 1] || '')) {
        for (let k = i - 1; k >= 0; k--) if (depth(steps[k]) === depth(s) - 1) { owner = steps[k]; break; }
        ret = s.ret != null ? s.ret : null;
      }
      events.push({ line: owner.line, text: added.replace(/\n$/, ''), vars: owner.vars, ret });
    }
    // the same line printing several times in a row (a loop) becomes one group
    const groups = [];
    events.forEach((e) => {
      const g = groups[groups.length - 1];
      if (g && g.line === e.line) g.items.push(e); else groups.push({ line: e.line, src: (lines[e.line - 1] || '').trim(), items: [e] });
    });
    return groups;
  }

  function whyForGroup(g, lines) {
    const src = g.src;
    const first = g.items[0];
    const printArgs = (src.match(/^print\s*\((.*)\)$/) || [])[1];
    const loopLine = lines.findIndex((l, i) => i < g.line - 1 && /^\s*for\s+\w+\s+in\b/.test(l) && (lines[g.line - 1].match(/^ */) || [''])[0].length > (l.match(/^ */) || [''])[0].length);
    const loopVar = loopLine >= 0 ? (lines[loopLine].match(/^\s*for\s+(\w+)/) || [])[1] : null;
    if (g.items.length > 1) {
      const vals = loopVar ? g.items.map((e) => valOf(e.vars[loopVar])).filter((v) => v != null) : [];
      return { chain: [src], text: vals.length ? t('wLoopPrint', g.items.length, loopVar, shortList(vals)) : t('wRepeated', g.items.length) };
    }
    if (/input\s*\(/.test(src)) {
      const answer = first.text.split('\n').pop();
      return { chain: [src], text: /input\s*\(\s*\)/.test(src) ? t('wInputNoQ', answer) : t('wInputEcho') };
    }
    // a print inside an if / elif / else: say why that branch ran
    const ind = (l) => (l.match(/^ */) || [''])[0].length;
    let branch = '';
    for (let i = g.line - 2; i >= 0; i--) {
      if (!lines[i].trim() || ind(lines[i]) >= ind(lines[g.line - 1])) continue;
      const head = lines[i].trim();
      const c = head.match(/^(?:if|elif)\s+(.+):$/);
      if (c) {
        const filled = withValues(c[1], first.vars);
        branch = ' ' + (filled !== c[1] ? t('wBecauseIfVals', c[1], filled) : t('wBecauseIf', c[1]));
      } else if (/^else\s*:$/.test(head)) branch = ' ' + t('wBecauseElse');
      break;
    }
    if (printArgs != null) {
      const chain = [src];
      const callM = printArgs.match(/([A-Za-z_]\w*)\s*\(([^()]*)\)/);
      if (first.ret != null && callM && !['len', 'sum', 'max', 'min', 'int', 'str', 'range', 'input', 'round', 'abs'].includes(callM[1])) {
        chain.push(`print(${printArgs.replace(callM[0], first.ret)})`);
        return { chain, text: t('wFromFunction', callM[0], first.ret) + branch };
      }
      const filled = withValues(printArgs, first.vars);
      if (filled !== printArgs) chain.push(`print(${filled})`);
      let text = t('wExpr');
      if (/^\s*(["']).*\1\s*$/.test(printArgs)) text = t('wText');
      else if (/^[\d\s+\-*/%().]+$/.test(printArgs)) text = t('wMath');
      else if (/^\s*[A-Za-z_]\w*\s*$/.test(printArgs)) text = t('wVar', printArgs.trim(), first.text);
      else if (printArgs.includes(',')) text = t('wComma');
      return { chain, text: text + branch };
    }
    return { chain: [src], text: t('wOther') + branch };
  }

  async function openWhy(task, root) {
    if (!task.solution) return;
    root.hidden = false;
    const code = task.solution;
    const lines = code.split('\n');
    root.innerHTML = `
      <div class="why-head"><b>${esc(t('whyTitle'))}</b><button class="icon-btn why-close" type="button" aria-label="${esc(t('close'))}">${icon('close')}</button></div>
      <p class="muted loading">${esc(t('whyLoading'))}</p>`;
    M.anim(root, [{ opacity: 0, transform: 'translateY(-6px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: M.SPRING });
    let trace;
    try { trace = await traceRun(code, task.inputs || []); } catch (e) { root.querySelector('.loading').outerHTML = `<p class="rn-err">${esc(t('loadFail'))}</p>`; return; }
    const final = trace.steps[trace.steps.length - 1];
    const out = (final.out || '').replace(/\n$/, '');
    const firstVars = {};
    trace.steps.forEach((s) => Object.keys(s.vars || {}).forEach((k) => { if (!(k in firstVars)) firstVars[k] = s.vars[k]; }));
    const groups = outputSources(code, trace);

    const sol = lines.map((l, i) => {
      if (!l.trim()) return '';
      return `<li><span class="w3-n">${i + 1}</span><code class="w3-code">${hl(l)}</code><span class="w3-say">${esc(explainLine(l, firstVars))}</span></li>`;
    }).join('');
    const outHtml = out ? out.split('\n').map((l) => `<span class="w3-ol">${esc(l) || ' '}</span>`).join('') : `<span class="muted">${esc(t('testEmpty'))}</span>`;
    const why = groups.map((g) => {
      const w = whyForGroup(g, lines);
      const shown = g.items.map((e) => e.text).join('\n');
      return `<li class="w3-card">
          <pre class="w3-out">${esc(shown)}</pre>
          <div class="w3-from"><span class="w3-tag">${esc(t('wLine', g.line))}</span>${w.chain.map((c, k) => `${k ? '<span class="w3-arr">→</span>' : ''}<code>${hl(c)}</code>`).join('')}</div>
          <p class="w3-say">${esc(w.text)}</p>
        </li>`;
    }).join('');

    root.innerHTML = `
      <div class="why-head"><b>${esc(t('whyTitle'))}</b><button class="icon-btn why-close" type="button" aria-label="${esc(t('close'))}">${icon('close')}</button></div>
      <section class="w3">
        <h4><span class="w3-num">1</span>${esc(t('w3Solution'))}</h4>
        <ol class="w3-lines">${sol}</ol>
      </section>
      <section class="w3">
        <h4><span class="w3-num">2</span>${esc(t('w3Output'))}</h4>
        <pre class="w3-term">${outHtml}</pre>
      </section>
      ${groups.length ? `<section class="w3">
        <h4><span class="w3-num">3</span>${esc(t('w3Why'))}</h4>
        <ol class="w3-cards">${why}</ol>
      </section>` : ''}`;

    // calm entrance: sections, then their rows one after another
    $$('.w3', root).forEach((s, i) => M.anim(s, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { delay: i * 260, duration: 460 }));
    $$('.w3-lines li', root).forEach((li, i) => M.anim(li, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { delay: 120 + i * 90, duration: 380 }));
    $$('.w3-ol', root).forEach((l, i) => M.anim(l, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { delay: 520 + i * 120, duration: 420 }));
    $$('.w3-card', root).forEach((c, i) => M.anim(c, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { delay: 760 + i * 140, duration: 440 }));
  }

  /* opening "Tipp" makes the orange "Why??" pop out */
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.open) return;
    const b = $('.why-btn', d);
    if (b) M.anim(b, [{ opacity: 0, transform: 'scale(.4) rotate(-8deg)' }, { opacity: 1, transform: 'scale(1.12) rotate(3deg)', offset: .6 }, { opacity: 1, transform: 'none' }], { delay: 120, duration: 560, easing: 'ease-out' });
  }, true);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.why-btn');
    if (b) {
      const root = b.parentElement.querySelector('.why');
      const task = b.closest('#questView') ? dailyTask(quest.level) : curTask();
      if (!root.hidden) { root.hidden = true; return; }
      openWhy(task, root);
      return;
    }
    const c = e.target.closest('.why-close');
    if (c) c.closest('.why').hidden = true;
  });
  const whyHtml = (task) => (task.solution ? `<button class="why-btn" type="button">${esc(t('why'))}</button><div class="why" hidden></div>` : '');

  /* ---------------- Panel ---------------- */
  const panelRunner = makeRunner(el.panelRunner, {
    title: () => t('tryIt'),
    getInputs: () => (state.view === 'lesson' && state.tab === 'task' ? curTask().inputs || null : null),
    onResult: (code, res) => { if (state.view === 'lesson' && state.tab === 'task') checkTask(code, res); },
  });

  /* ---------------- Narrator: the explanation appears word by word ---------------- */
  let pendingNarration = null;
  let narrationAnims = [];

  /* wrap every word of the text in .nw spans; inline code, links and buttons count as one word */
  function wrapWords(root) {
    if (root.dataset.wrapped) return $$('.nw', root);
    const units = [];
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          if (parts.every((p) => !p.trim())) return;
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (!p.trim()) { frag.append(p); return; }
            const s = document.createElement('span');
            s.className = 'nw';
            s.textContent = p;
            frag.append(s);
            units.push(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          if (/^(CODE|A|B|STRONG|BUTTON)$/.test(child.tagName)) { child.classList.add('nw'); units.push(child); }
          else if (child.tagName !== 'BR') walk(child);
        }
      });
    };
    walk(root);
    root.dataset.wrapped = '1';
    return units;
  }

  function stopNarration() {
    narrationAnims.forEach((a) => { try { a.finish(); } catch (e) { /* already gone */ } });
    narrationAnims = [];
    pendingNarration = null;
  }

  function narrate(root) {
    stopNarration();
    const blocks = $$(':scope > *', root).filter((b) => !b.classList.contains('narr-bar'));
    let delay = 120;
    const total = $$('.nw', root).length || 1;
    const step = Math.max(28, Math.min(70, 5200 / total));
    blocks.forEach((block) => {
      const isHead = /^H\d$/.test(block.tagName);
      const units = $$('.nw', block);
      units.forEach((u) => {
        const a = u.animate([
          { opacity: 0, filter: 'blur(5px)', transform: 'translateY(5px)' },
          { opacity: 1, filter: 'blur(0)', transform: 'none' },
        ], { duration: 420, delay, easing: M.EASE, fill: 'backwards' });
        narrationAnims.push(a);
        delay += isHead ? step * 0.6 : step;
      });
      // block-level things without words (lists markers, notes) fade with their first word
      delay += isHead ? 120 : 260;
    });
    root.classList.add('narrating');
    const last = narrationAnims[narrationAnims.length - 1];
    if (last) last.finished.catch(() => {}).finally(() => root.classList.remove('narrating'));
  }

  /* explanation text just rendered: narrate now if visible, else when the helper opens */
  function queueNarration(root) {
    wrapWords(root);
    if (M.reduced()) return;
    const run = () => { if (root.isConnected) narrate(root); };
    if (state.panelOpen && state.revealed) run();
    else pendingNarration = run;
  }
  /* the helper was opened: tell whatever explanation is in it again */
  function narrateVisible(delay) {
    pendingNarration = null;
    const root = $('.prose[data-wrapped]', el.panelBody);
    if (!root || M.reduced()) return;
    setTimeout(() => { if (state.panelOpen && root.isConnected) narrate(root); }, delay);
  }

  el.panelBody.addEventListener('click', (e) => {
    if (e.target.closest('.prose.narrating') && !e.target.closest('a, button')) stopNarration();
  });

  /* ---------------- Read aloud (speech synthesis), highlighting the spoken word ---------------- */
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let speaking = null;
  const SPEECH_LANG = { ru: 'ru-RU', en: 'en-US', de: 'de-DE' };

  function stopReading() {
    if (!speaking) return;
    const { btn, root } = speaking;
    speaking = null;
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    $$('.nw.speaking', root).forEach((n) => n.classList.remove('speaking'));
    if (btn && btn.isConnected) { btn.setAttribute('aria-pressed', 'false'); $('span:last-child', btn).textContent = t('readAloud'); }
  }

  function readAloud(root, btn) {
    if (speaking) { stopReading(); return; }
    stopNarration();
    const units = wrapWords(root).filter((u) => !u.closest('.narr-bar') && !u.closest('.to-task'));
    let text = '';
    const starts = [];
    units.forEach((u) => { starts.push(text.length); text += u.textContent + ' '; });
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = SPEECH_LANG[state.lang] || 'en-US';
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(state.lang));
    if (voice) utt.voice = voice;
    utt.rate = 0.98;
    let cur = null;
    utt.onboundary = (e) => {
      if (!speaking || (e.name && e.name !== 'word')) return;
      let i = starts.length - 1;
      while (i > 0 && starts[i] > e.charIndex) i--;
      if (cur) cur.classList.remove('speaking');
      cur = units[i];
      if (cur) cur.classList.add('speaking');
    };
    utt.onend = utt.onerror = () => { if (speaking && speaking.utt === utt) stopReading(); };
    speaking = { utt, btn, root };
    btn.setAttribute('aria-pressed', 'true');
    $('span:last-child', btn).textContent = t('stopReading');
    let started = false;
    utt.onstart = () => { started = true; };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
    setTimeout(() => { if (!started && speaking && speaking.utt === utt) stopReading(); }, 2500);
  }

  /* show the read-aloud button only where the system actually has a voice */
  function updateVoices() {
    if (!canSpeak) return;
    const voices = window.speechSynthesis.getVoices();
    document.body.classList.toggle('can-speak', voices.some((v) => v.lang && v.lang.toLowerCase().startsWith(state.lang)));
  }
  if (canSpeak) {
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
  }

  const narrBar = () => (canSpeak ? `<div class="narr-bar"><button class="btn small read-btn" type="button" aria-pressed="false">${icon('speaker')}<span>${esc(t('readAloud'))}</span></button></div>` : '');
  el.panelBody.addEventListener('click', (e) => {
    const b = e.target.closest('.read-btn');
    if (b) readAloud(b.closest('.prose'), b);
  });

  function panelIn(delay = 0) {
    const kids = $$(':scope > *, :scope > .prose:not([data-wrapped]) > *', el.panelBody).filter((n) => !n.classList.contains('prose'));
    kids.slice(0, 14).forEach((n, i) => M.rise(n, delay + i * 35, 10, 480));
  }

  function renderPanel(opts = {}) {
    const animate = opts.animate && state.revealed;
    if (state.view !== 'lesson') {
      const s = content().start;
      stopReading();
      el.panelBody.innerHTML = `
        <div class="prose">${narrBar()}${s.intro}</div>`;
      queueNarration($('.prose', el.panelBody), `start:${state.lang}`);
      panelRunner.set(s.try);
      panelRunner.setRun('run');
      el.panelNav.innerHTML = '';
      if (animate) panelIn();
      return;
    }

    const l = lesson();
    const i = lessonIndex();
    const done = state.done.has(l.id);
    const tabs = `
      <div class="tabs" role="tablist">
        <span class="tabs-thumb" aria-hidden="true"></span>
        <button class="tab" role="tab" type="button" data-tab="learn" aria-selected="${state.tab === 'learn'}">${esc(t('tabLearn'))}</button>
        <button class="tab" role="tab" type="button" data-tab="task" aria-selected="${state.tab === 'task'}">${esc(t('tabTask'))}${done ? `<span class="tab-done" aria-label="${esc(t('doneAria'))}">✓</span>` : ''}</button>
      </div>`;
    el.panelBody.innerHTML = tabs + `<div class="tab-body"></div>`;
    renderTabBody(false);
    moveThumb($('.tabs', el.panelBody), $('.tabs-thumb', el.panelBody), '[aria-selected="true"]', true);

    const prev = lessons()[i - 1];
    const next = lessons()[i + 1];
    el.panelNav.innerHTML = `
      ${prev ? `<a class="btn" href="#/lesson/${prev.id}">${icon('left')}${esc(prev.short)}</a>` : `<a class="btn" href="#/start">${icon('left')}${esc(t('navStart'))}</a>`}
      ${next ? `<a class="btn" href="#/lesson/${next.id}">${esc(next.short)}${icon('right')}</a>` : ''}`;
    if (animate) { panelIn(); M.rise(el.panelRunner, 120, 10, 520); }
  }

  function renderTabBody(animate) {
    const l = lesson();
    const done = state.done.has(l.id);
    const body = $('.tab-body', el.panelBody);
    if (state.tab === 'learn') {
      stopReading();
      body.innerHTML = `<div class="prose" role="tabpanel">${narrBar()}${l.learn.map((s) => `<h3>${esc(s.h)}</h3>${s.html}`).join('')}
        <p class="to-task"><button class="link-btn" type="button" data-tab="task">${esc(t('toTask'))}</button></p></div>`;
      queueNarration($('.prose', body), `${l.id}:${state.lang}`);
      panelRunner.set(l.example || stripMarks(l.code) + '\n');
      panelRunner.setRun('run');
    } else {
      stopReading();
      stopNarration();
      const steps = taskSteps(l);
      const solved = solvedOf(l);
      const k = state.taskStep;
      const st = steps[k];
      body.innerHTML = `<div class="prose task-box" role="tabpanel">
          <ol class="stepper" aria-label="${esc(t('taskStepOf', k + 1, steps.length))}">${steps.map((_, i) => `
            <li><button type="button" class="sp${i < solved ? ' on' : ''}${i === k ? ' cur' : ''}" data-step-go="${i}" ${i > solved ? 'disabled' : ''} aria-current="${i === k ? 'step' : 'false'}">
              <span class="sp-n">${i < solved ? icon('check') : i + 1}</span></button>${i < steps.length - 1 ? `<span class="sp-line${i < solved ? ' on' : ''}"></span>` : ''}</li>`).join('')}
          </ol>
          <p class="step-of">${esc(t('taskStepOf', k + 1, steps.length))}</p>
          <p class="lead">${st.text}</p>
          <p class="task-how">${esc(t('taskHow'))}</p>
          ${st.hint ? `<details ${state.hints ? 'open' : ''}><summary>${esc(t('hint'))}</summary><p>${st.hint}</p>${whyHtml(st)}</details>` : ''}
          <div class="verdict ${k < solved ? 'ok' : ''}" id="verdict">${k < solved ? esc(done && k === steps.length - 1 ? t('alreadyDone') : t('stepSolvedBefore')) : ''}</div>
        </div>`;
      panelRunner.set(st.starter || '');
      panelRunner.setRun('check');
    }
    if (animate) {
      const dir = state.tab === 'task' ? 1 : -1;
      $$('.prose:not([data-wrapped]) > *', body).slice(0, 12).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: `translateX(${dir * 14}px)` }, { opacity: 1, transform: 'none' }], { delay: i * 30, duration: 460 }));
      M.anim(panelRunner.root, [{ opacity: .4 }, { opacity: 1 }], { duration: 360 });
    }
  }

  function goStep(i) {
    const l = lesson();
    const steps = taskSteps(l);
    if (i < 0 || i >= steps.length || i > solvedOf(l)) return;
    const dir = i > state.taskStep ? 1 : -1;
    state.taskStep = i;
    renderTabBody(false);
    const box = $('.task-box', el.panelBody);
    $$(':scope > :not(.stepper)', box).forEach((n, j) => M.anim(n, [{ opacity: 0, transform: `translateX(${dir * 18}px)` }, { opacity: 1, transform: 'none' }], { delay: j * 40, duration: 460 }));
    M.pop($('.sp.cur .sp-n', box), 60, 480);
    M.anim(panelRunner.root, [{ opacity: .4 }, { opacity: 1 }], { duration: 360 });
    $('textarea', el.panelRunner).focus({ preventScroll: true });
  }
  el.panel.addEventListener('click', (e) => {
    const sg = e.target.closest('[data-step-go]');
    if (sg) { goStep(Number(sg.dataset.stepGo)); return; }
  });

  el.panel.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-tab]');
    if (!tb || state.view !== 'lesson' || tb.dataset.tab === state.tab) return;
    state.tab = tb.dataset.tab;
    $$('.tab', el.panelBody).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)));
    moveThumb($('.tabs', el.panelBody), $('.tabs-thumb', el.panelBody), '[aria-selected="true"]');
    renderTabBody(true);
    if (state.tab === 'task') $('textarea', el.panelRunner).focus({ preventScroll: true });
  });

  const norm = (s) => s.replace(/\r/g, '').split('\n').map((x) => x.replace(/\s+$/, '')).join('\n').trim();

  function burst(at) {
    if (M.reduced()) return;
    const r = at.getBoundingClientRect();
    const colors = ['var(--kw)', 'var(--str)', 'var(--bi)', 'var(--def)', 'var(--num)'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'spark';
      p.style.left = `${r.left + 18}px`;
      p.style.top = `${r.top + r.height / 2}px`;
      p.style.background = colors[i % colors.length];
      document.body.append(p);
      const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const d = 40 + Math.random() * 46;
      p.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.2)`, opacity: 0 },
      ], { duration: 700 + Math.random() * 300, easing: M.EASE }).finished.then(() => p.remove());
    }
  }

  async function checkTask(code, res) {
    const l = lesson();
    const steps = taskSteps(l);
    const k = state.taskStep;
    const task = steps[k];
    const v = $('#verdict');
    if (!v) return;
    let fail = evaluateTask(task, code, res);
    let testsHtml = '';
    if (task.tests && task.tests.length) {
      const host = document.createElement('div');
      v.className = 'verdict';
      v.innerHTML = '';
      v.append(host);
      const r = await runTests(task, code, !fail, host);
      if (!$('#verdict') || state.taskStep !== k || state.lessonId !== l.id) return;
      testsHtml = r.html;
      if (!fail && !r.allOk) fail = esc(t('testsFail'));
    }
    if (fail) {
      v.className = 'verdict no';
      v.innerHTML = fail + testsHtml;
      M.anim(v, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { delay: 0, duration: 360 });
      return;
    }
    /* step solved */
    const wasSolved = solvedOf(l);
    if (k + 1 > (solvedSteps[l.id] || 0)) { solvedSteps[l.id] = k + 1; store.set('pps-steps', solvedSteps); }
    const sp = $(`.sp[data-step-go="${k}"]`, el.panelBody);
    if (sp) {
      sp.classList.add('on');
      sp.querySelector('.sp-n').innerHTML = icon('check');
      M.pop(sp.querySelector('.sp-n'), 0, 520);
      const line = sp.parentElement.querySelector('.sp-line');
      if (line) { line.classList.add('on'); M.anim(line, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { delay: 150, duration: 600 }); }
      const nextSp = $(`.sp[data-step-go="${k + 1}"]`, el.panelBody);
      if (nextSp) nextSp.disabled = false;
    }
    if (k < steps.length - 1) {
      v.className = 'verdict ok';
      v.innerHTML = `<span class="v-check">${icon('check')}</span><span>${esc(t('stepSolved'))}<br><button class="btn primary small step-next" type="button" data-step-go="${k + 1}">${esc(t('nextStep', k + 2))}${icon('right')}</button></span>${testsHtml}`;
      M.anim(v, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: M.SPRING });
      M.pop($('.v-check', v), 120, 520);
      if (wasSolved <= k) burst($('.v-check', v));
      renderStageChoices();
      $('.step-next', v).focus({ preventScroll: true });
      return;
    }
    const first = !state.done.has(l.id);
    state.done.add(l.id);
    store.set('pps-done', Array.from(state.done));
    const next = lessons()[lessonIndex() + 1];
    v.className = 'verdict ok';
    v.innerHTML = `<span class="v-check">${icon('check')}</span><span>${esc(first ? t('okFirst') : t('okAgain'))}<br>${next ? `<a class="link-btn" href="#/lesson/${next.id}">${esc(t('next', next.short))}</a>` : esc(t('lastLesson'))}</span>${testsHtml}`;
    M.anim(v, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: M.SPRING });
    M.pop($('.v-check', v), 120, 520);
    burst($('.v-check', v));
    renderProgress(true);
    renderDock();
    renderStageChoices();
    M.pop($('.tc-ic', el.stageChoices), 0, 520);
    if (!el.launcher.hidden) renderLauncher();
    const tab = $('[data-tab="task"]', el.panelBody);
    if (tab && !$('.tab-done', tab)) {
      tab.insertAdjacentHTML('beforeend', `<span class="tab-done" aria-label="${esc(t('doneAria'))}">✓</span>`);
      M.pop($('.tab-done', tab), 200);
    }
  }

  /* ---------------- Progress ---------------- */
  function renderProgress(animate) {
    const all = lessons();
    const n = all.filter((l) => state.done.has(l.id)).length;
    const bar = $('.progress-bar span', el.progress);
    const pct = (n / all.length) * 100;
    if (bar && animate) {
      $('.progress-count', el.progress).textContent = t('nOfM', n, all.length);
      bar.style.width = `${pct}%`;
      M.anim($('.progress-count', el.progress), [{ transform: 'scale(1.25)' }, { transform: 'none' }], { duration: 500, easing: M.SPRING });
      return;
    }
    el.progress.innerHTML = `
      <span class="progress-label">${esc(t('basics'))}</span>
      <span class="progress-count">${esc(t('nOfM', n, all.length))}</span>
      <span class="progress-bar" role="progressbar" aria-label="${esc(t('progressAria'))}" aria-valuemin="0" aria-valuemax="${all.length}" aria-valuenow="${n}"><span style="width:${pct}%"></span></span>`;
  }

  /* ---------------- Dock + launcher (lessons pop out of the 4-square button) ---------------- */
  function renderDock() {
    if (state.view === 'lesson') {
      const l = lesson();
      const i = lessonIndex();
      el.dockNow.innerHTML = `<span class="dock-ic" data-kind="${l.tone}">${icon(l.icon)}</span><span class="dock-text"><small>${esc(t('lessonOf', i + 1, lessons().length))}</small><b>${esc(l.short)}</b></span>${state.done.has(l.id) ? `<span class="dock-done" aria-label="${esc(t('passedAria'))}">${icon('check')}</span>` : ''}`;
      const prev = lessons()[i - 1];
      const next = lessons()[i + 1];
      el.dockNav.innerHTML = `
        <button class="btn dock-task" type="button" data-dock="task">${icon('task')}<span>${esc(t('dockTask'))}</span></button>
        <a class="icon-btn" ${prev ? `href="#/lesson/${prev.id}"` : 'href="#/start"'} aria-label="${esc(prev ? t('prevLesson') : t('navStart'))}">${icon('left')}</a>
        ${next ? `<a class="icon-btn" href="#/lesson/${next.id}" aria-label="${esc(t('nextLesson'))}">${icon('right')}</a>` : '<span class="icon-btn" aria-hidden="true" style="opacity:.35">' + icon('right') + '</span>'}`;
    } else {
      el.dockNow.innerHTML = `<span class="dock-text"><b class="muted-b">${esc(t('dockStart'))}</b></span>`;
      el.dockNav.innerHTML = `<a class="icon-btn" href="#/lesson/install" aria-label="${esc(t('nextLesson'))}">${icon('right')}</a>`;
    }
  }

  function renderLauncher() {
    const all = lessons();
    const n = all.filter((l) => state.done.has(l.id)).length;
    el.launcher.innerHTML = `
      <div class="ln-head"><h2>${esc(t('dockLessons'))}</h2><span>${esc(t('launcherDone', n, all.length))}</span></div>
      <ol class="tiles">${all.map((l, i) => `
        <li><a class="tile" href="#/lesson/${l.id}" data-kind="${l.tone}" ${state.lessonId === l.id ? 'aria-current="page"' : ''}>
          <span class="tile-ic">${icon(l.icon)}${state.done.has(l.id) ? `<span class="tile-done" aria-label="${esc(t('passedAria'))}">${icon('check')}</span>` : ''}</span>
          <span class="tile-n">${i + 1}</span>
          <span class="tile-t">${esc(l.short)}</span>
        </a></li>`).join('')}
      </ol>
      <p class="ln-sub">${esc(t('soonGroup'))}</p>
      <ul class="tiles soon">${content().soon.map((s) => `
        <li><div class="tile is-soon" title="${esc(s.short)}">
          <span class="tile-ic">${icon('lock')}</span>
          <span class="tile-n">${esc(t('soonTag'))}</span>
          <span class="tile-t">${esc(s.title)}</span>
        </div></li>`).join('')}
      </ul>`;
  }

  let launcherOpen = false;
  async function openLauncher(open) {
    if (open === launcherOpen) return;
    launcherOpen = open;
    el.launchBtn.setAttribute('aria-expanded', String(open));
    el.launchBtn.classList.toggle('open', open);
    if (open) {
      renderLauncher();
      el.launcher.hidden = false;
      M.anim(el.launcher, [{ opacity: 0, transform: 'translateY(14px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      $$('.tile', el.launcher).forEach((tile, i) => M.anim(tile, [
        { opacity: 0, transform: 'translateY(22px) scale(.6)' },
        { opacity: 1, transform: 'none' },
      ], { delay: 60 + i * 32, duration: 560, easing: M.SPRING }));
      $$('.ln-head, .ln-sub', el.launcher).forEach((n, i) => M.rise(n, i * 120, 8, 400));
      const cur = $('.tile[aria-current="page"]', el.launcher) || $('.tile', el.launcher);
      if (cur) cur.focus({ preventScroll: true });
    } else {
      await M.anim(el.launcher, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.96)' }], { duration: 200, easing: M.IN, fill: 'forwards' });
      if (!launcherOpen) { el.launcher.hidden = true; el.launcher.getAnimations().forEach((a) => a.cancel()); }
    }
  }
  el.launchBtn.addEventListener('click', () => openLauncher(!launcherOpen));
  el.launcher.addEventListener('click', (e) => { if (e.target.closest('a')) openLauncher(false); });
  el.launcher.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { openLauncher(false); el.launchBtn.focus(); return; }
    const tiles = $$('a.tile', el.launcher);
    const i = tiles.indexOf(document.activeElement);
    if (i < 0) return;
    const cols = Math.max(1, Math.round(el.launcher.querySelector('.tiles').getBoundingClientRect().width / tiles[0].getBoundingClientRect().width));
    const move = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (move) { e.preventDefault(); const nxt = tiles[i + move]; if (nxt) nxt.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (launcherOpen && !e.target.closest('.dock-wrap') && !e.target.closest('[data-nav="lessons"]')) openLauncher(false);
  });

  /* ---------------- Sandbox ---------------- */
  const sandboxRunner = makeRunner($('#sandboxRunner'), {
    title: () => 'main.py',
    onChange: (v) => store.set('pps-sandbox', v),
  });
  async function closeSandbox() {
    await M.anim(el.sandbox, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.97)' }], { duration: 180, easing: M.IN, fill: 'forwards' });
    el.sandbox.close();
    el.sandbox.getAnimations().forEach((a) => a.cancel());
  }
  el.sandbox.addEventListener('click', (e) => {
    if (e.target === el.sandbox || e.target.closest('[data-close]')) closeSandbox();
  });
  el.sandbox.addEventListener('cancel', (e) => { e.preventDefault(); closeSandbox(); });
  function openSandbox() {
    sandboxRunner.set(store.get('pps-sandbox', t('sandboxDefault')));
    el.sandbox.showModal();
    M.anim(el.sandbox, [{ opacity: 0, transform: 'translateY(18px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 480 });
    $('textarea', el.sandbox).focus();
  }

  /* ---------------- Theme ---------------- */
  function themeIsDark() {
    const th = document.documentElement.dataset.theme;
    if (th) return th === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function renderThemeBtn() {
    const b = $('[data-nav="theme"]');
    const dark = themeIsDark();
    b.querySelector('.ic').outerHTML = icon(dark ? 'sun' : 'moon');
    b.querySelector('span:last-child').textContent = dark ? t('themeLight') : t('themeDark');
    b.setAttribute('aria-label', dark ? t('themeToLight') : t('themeToDark'));
  }
  function toggleTheme(btn) {
    const r = btn.getBoundingClientRect();
    const next = themeIsDark() ? 'light' : 'dark';
    M.viewTransition(() => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('pps-theme', next); } catch (e) { /* ignore */ }
      renderThemeBtn();
    }, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  /* ---------------- Hints mode ---------------- */
  function renderHintsBtn() {
    el.hintsBtn.setAttribute('aria-pressed', String(state.hints));
    el.hintsBtn.title = state.hints ? t('hintsOn') : t('hintsOff');
    document.body.classList.toggle('hints-on', state.hints);
  }
  let toastTimer = null;
  function toast(text) {
    let n = $('.toast');
    if (!n) { n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role', 'status'); document.body.append(n); }
    n.innerHTML = `${icon('bulb')}<span>${esc(text)}</span>`;
    n.hidden = false;
    M.anim(n, [{ opacity: 0, transform: 'translate(-50%, 16px) scale(.96)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 420, easing: M.SPRING });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      M.anim(n, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).then(() => { n.hidden = true; n.getAnimations().forEach((a) => a.cancel()); });
    }, on2ms(text));
  }
  const on2ms = (text) => Math.max(2600, text.length * 55);

  function setHints(on, opts = {}) {
    const changed = state.hints !== on;
    state.hints = on;
    store.set('pps-hints', on);
    renderHintsBtn();
    hideTip();
    panelRunner.refreshHints();
    sandboxRunner.refreshHints();
    const det = $('.task-box details', el.panelBody);
    if (det && on) det.open = true;
    M.pop(el.hintsBtn.querySelector('.ic'), 0, 520);
    if (changed && state.revealed) {
      renderStage({});
      $$('.ghost', el.win).forEach((g, i) => M.anim(g, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { delay: 80 + i * 90, duration: 420 }));
    }
    if (opts.toast) toast(on ? t('hintsToastOn') : t('hintsToastOff'));
    if (opts.splash && on) {
      const c = el.hintsBtn.querySelector('.ic').getBoundingClientRect();
      M.splash(c.left + c.width / 2, c.top + c.height / 2, 'var(--kw)', { rings: 2, drops: 8, size: 46 });
    }
    if (on) {
      $$('.hint-only').forEach((n) => { if (n.offsetParent) M.anim(n, [{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: M.SPRING }); });
      M.anim(el.hintsBtn, [{ boxShadow: '0 0 0 0 color-mix(in srgb, var(--kw) 55%, transparent)' }, { boxShadow: '0 0 0 14px transparent' }], { duration: 800, easing: 'ease-out' });
    }
  }

  /* ---------------- Language menu ---------------- */
  function openLangMenu(open) {
    el.langMenu.hidden = !open;
    el.langBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      M.anim(el.langMenu, [{ opacity: 0, transform: 'translateX(-8px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 300 });
      $$('[data-lang]', el.langMenu).forEach((b, i) => M.rise(b, 40 + i * 40, 6, 300));
      const cur = $('[aria-checked="true"]', el.langMenu);
      if (cur) cur.focus();
    }
  }
  el.langMenu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    openLangMenu(false);
    setLang(b.dataset.lang);
    el.langBtn.focus();
  });
  el.langMenu.addEventListener('keydown', (e) => {
    const items = $$('[data-lang]', el.langMenu);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === 'Escape') { openLangMenu(false); el.langBtn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!el.langMenu.hidden && !e.target.closest('.rail-lang')) openLangMenu(false);
  });

  function setLang(code) {
    if (!window.UI[code] || code === state.lang) return;
    M.viewTransition(() => {
      state.lang = code;
      store.set('pps-lang', code);
      applyStaticTexts();
      sandboxRunner.labels();
      renderAll(false);
    });
  }

  /* ---------------- Rail ---------------- */
  $$('.rail-btn').forEach((b) => b.addEventListener('click', () => {
    const nav = b.dataset.nav;
    if (nav === 'start') location.hash = '#/start';
    else if (nav === 'lessons') {
      openLauncher(true);
      if (matchMedia('(max-width: 1100px)').matches) el.dock.scrollIntoView({ behavior: M.reduced() ? 'auto' : 'smooth', block: 'center' });
    } else if (nav === 'quests') location.hash = `#/quests/${quest.tab}`;
    else if (nav === 'helper') setPanel(!state.panelOpen, { focus: true });
    else if (nav === 'sandbox') openSandbox();
    else if (nav === 'hints') setHints(!state.hints, { toast: true, splash: true });
    else if (nav === 'lang') openLangMenu(el.langMenu.hidden);
    else if (nav === 'theme') toggleTheme(b);
  }));

  /* ---------------- Quests: quest of the day, chapter quizzes, project ideas ---------------- */
  const QD = () => (window.QUESTS || {})[state.lang] || window.QUESTS.ru;
  const LEVELS = ['easy', 'medium', 'hard'];
  const Q_TABS = ['daily', 'chapters', 'projects'];
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dayNum = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const dailyLog = store.get('pps-daily', {});
  const quizBest = store.get('pps-quiz', {});
  const quest = { tab: 'daily', level: 'easy', quiz: null };
  let questRunner = null;
  const questRunnerHost = document.createElement('div');

  function dailyTask(lvl) {
    const pool = QD().daily[lvl];
    const shift = { easy: 0, medium: 2, hard: 4 }[lvl];
    const idx = (dayNum() + shift) % pool.length;
    const ex = ((((window.TASK_EXTRAS || {})[state.lang] || {}).daily || {})[lvl] || [])[idx] || {};
    return Object.assign({}, pool[idx], ex);
  }
  const doneToday = () => dailyLog[dayKey()] || [];
  function streak() {
    let n = 0;
    const d = new Date();
    if (!(dailyLog[dayKey(d)] || []).length) d.setDate(d.getDate() - 1);
    while ((dailyLog[dayKey(d)] || []).length) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function untilMidnight() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const mins = Math.max(0, Math.round((end - now) / 60000));
    return t('newIn', Math.floor(mins / 60), mins % 60);
  }

  /* shared by the quests: returns why the solution fails, or null when it is right */
  function evaluateTask(task, code, res) {
    if (res.error) return esc(t('failError'));
    for (const m of task.must || []) { if (!new RegExp(m.re).test(code)) return m.hint; }
    for (const m of task.forbid || []) { if (new RegExp(m.re).test(code)) return m.hint; }
    const out = norm(res.out || '');
    if (task.expect != null && out !== norm(task.expect)) return `${esc(t('failOutput'))}<pre>${esc(task.expect)}</pre>`;
    if (task.includes != null && !out.includes(task.includes)) return t('failIncludes', esc(task.includes));
    return null;
  }

  const LEVEL_DOTS = (lvl) => `<span class="lvl-dots" aria-hidden="true">${[0, 1, 2].map((i) => `<i class="${i <= LEVELS.indexOf(lvl) ? 'on' : ''}"></i>`).join('')}</span>`;
  const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

  function renderQuests(animate) {
    const tabs = [
      ['daily', 'flame', t('qTabDaily')],
      ['chapters', 'book', t('qTabChapters')],
      ['projects', 'bulb', t('qTabProjects')],
    ];
    el.questView.innerHTML = `
      <div class="q-tabs" role="tablist">
        <span class="q-tabs-thumb" aria-hidden="true"></span>
        ${tabs.map(([id, ic, label]) => `<a class="q-tab" role="tab" href="#/quests/${id}" aria-selected="${quest.tab === id}">${icon(ic)}<span>${esc(label)}</span></a>`).join('')}
      </div>
      <div class="q-body"></div>`;
    moveThumb($('.q-tabs', el.questView), $('.q-tabs-thumb', el.questView), '[aria-selected="true"]', true);
    renderQuestBody(animate);
  }

  function renderQuestBody(animate) {
    const body = $('.q-body', el.questView);
    if (quest.tab === 'daily') renderDaily(body);
    else if (quest.tab === 'chapters') { if (quest.quiz) renderQuiz(body); else renderChapters(body); }
    else renderProjects(body);
    if (animate) $$('.q-anim', body).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: 'translateY(14px) scale(.98)' }, { opacity: 1, transform: 'none' }], { delay: i * 55, duration: 520, easing: M.SPRING }));
  }

  /* ---- quest of the day ---- */
  function renderDaily(body) {
    const done = doneToday();
    const s = streak();
    const task = dailyTask(quest.level);
    body.innerHTML = `
      <div class="q-head q-anim">
        <p>${esc(t('dailyIntro'))}</p>
        <div class="q-meta">
          <span class="q-streak${s ? ' on' : ''}">${icon('flame')}${esc(t('streak', s))}</span>
          <span class="q-timer">${esc(untilMidnight())}</span>
        </div>
      </div>
      <div class="q-levels">${LEVELS.map((lvl) => `
        <button class="level-card q-anim${quest.level === lvl ? ' is-cur' : ''}${done.includes(lvl) ? ' is-done' : ''}" type="button" data-level="${lvl}" data-lvl="${lvl}" aria-pressed="${quest.level === lvl}">
          <span class="lc-top">${LEVEL_DOTS(lvl)}<b>${esc(t('lvl')[lvl])}</b>${done.includes(lvl) ? `<span class="lc-done">${icon('check')}</span>` : ''}</span>
          <span class="lc-text">${esc(plain(dailyTask(lvl).text))}</span>
        </button>`).join('')}
      </div>
      <div class="q-work q-anim" data-lvl="${quest.level}">
        <p class="q-work-lvl">${LEVEL_DOTS(quest.level)}${esc(t('lvl')[quest.level])}</p>
        <p class="lead">${task.text}</p>
        ${task.hint ? `<details ${state.hints ? 'open' : ''}><summary>${esc(t('hint'))}</summary><p>${task.hint}</p>${whyHtml(task)}</details>` : ''}
        <div class="verdict ${done.includes(quest.level) ? 'ok' : ''}" id="qVerdict">${done.includes(quest.level) ? esc(t('questSolved')) : ''}</div>
        <div class="q-runner"></div>
      </div>`;
    if (!questRunner) {
      questRunner = makeRunner(questRunnerHost, {
        title: () => t('questRunTitle'),
        getInputs: () => (state.view === 'quests' && quest.tab === 'daily' ? dailyTask(quest.level).inputs || null : null),
        onResult: checkDaily,
      });
    }
    $('.q-runner', body).append(questRunnerHost);
    questRunner.labels();
    questRunner.set(task.starter || '');
    questRunner.setRun('check');
  }

  async function checkDaily(code, res) {
    const v = $('#qVerdict');
    if (!v) return;
    const task = dailyTask(quest.level);
    const lvl = quest.level;
    let fail = evaluateTask(task, code, res);
    let testsHtml = '';
    if (task.tests && task.tests.length) {
      const host = document.createElement('div');
      v.className = 'verdict';
      v.innerHTML = '';
      v.append(host);
      const r = await runTests(task, code, !fail, host);
      if (!$('#qVerdict') || quest.level !== lvl) return;
      testsHtml = r.html;
      if (!fail && !r.allOk) fail = esc(t('testsFail'));
    }
    if (fail) {
      v.className = 'verdict no';
      v.innerHTML = fail + testsHtml;
      M.anim(v, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360 });
      return;
    }
    const key = dayKey();
    const list = dailyLog[key] || (dailyLog[key] = []);
    const first = !list.includes(quest.level);
    if (first) list.push(quest.level);
    store.set('pps-daily', dailyLog);
    const all = LEVELS.every((l) => list.includes(l));
    v.className = 'verdict ok';
    v.innerHTML = `<span class="v-check">${icon('check')}</span><span>${esc(t('questSolved'))}${all ? `<br>${esc(t('allDaily'))}` : ''}${!all ? `<br><button class="btn primary small q-next-level" type="button">${esc(t('quizNext'))}${icon('right')}</button>` : ''}</span>${testsHtml}`;
    M.anim(v, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: M.SPRING });
    M.pop($('.v-check', v), 120, 520);
    if (first) burst($('.v-check', v));
    const card = $(`.level-card[data-level="${quest.level}"]`, el.questView);
    if (card && first) {
      card.classList.add('is-done');
      $('.lc-top', card).insertAdjacentHTML('beforeend', `<span class="lc-done">${icon('check')}</span>`);
      M.pop($('.lc-done', card), 100, 520);
    }
    const st = $('.q-streak', el.questView);
    if (st) { st.classList.add('on'); st.lastChild.textContent = t('streak', streak()); M.anim(st, [{ transform: 'scale(1.15)' }, { transform: 'none' }], { duration: 500, easing: M.SPRING }); }
  }

  el.questView.addEventListener('click', (e) => {
    const lc = e.target.closest('.level-card');
    if (lc) {
      if (lc.dataset.level === quest.level) return;
      quest.level = lc.dataset.level;
      renderDaily($('.q-body', el.questView));
      M.anim($('.q-work', el.questView), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      return;
    }
    if (e.target.closest('.q-next-level')) {
      const next = LEVELS.find((l) => !doneToday().includes(l));
      if (next) { quest.level = next; renderDaily($('.q-body', el.questView)); M.anim($('.q-work', el.questView), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420 }); }
      return;
    }
    const cc = e.target.closest('[data-quiz]');
    if (cc) { startQuiz(cc.dataset.quiz); return; }
    const opt = e.target.closest('.q-opt');
    if (opt && quest.quiz && !quest.quiz.answered) { answerQuiz(Number(opt.dataset.i)); return; }
    if (e.target.closest('.quiz-next')) { quest.quiz.i++; quest.quiz.answered = false; renderQuiz($('.q-body', el.questView), true); return; }
    if (e.target.closest('.quiz-back')) { quest.quiz = null; renderChapters($('.q-body', el.questView)); animateIn(); return; }
    if (e.target.closest('.quiz-retry')) { startQuiz(quest.quiz.id); return; }
    const ps = e.target.closest('[data-project]');
    if (ps) {
      const [lvl, i] = ps.dataset.project.split(':');
      store.set('pps-sandbox', QD().projects[lvl][Number(i)].starter);
      openSandbox();
    }
  });
  function animateIn() {
    $$('.q-anim', el.questView).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { delay: i * 45, duration: 460 }));
  }

  /* ---- chapter quests ---- */
  function renderChapters(body) {
    body.innerHTML = `
      <p class="q-intro q-anim">${esc(t('chaptersIntro'))}</p>
      <div class="ch-grid">${lessons().map((l, i) => {
        const n = (QD().quiz[l.id] || []).length;
        const best = quizBest[l.id];
        const full = best != null && best >= n;
        return `<button class="ch-card q-anim${full ? ' is-done' : ''}" type="button" data-quiz="${l.id}" data-kind="${l.tone}">
          <span class="ch-ic">${icon(l.icon)}${full ? `<span class="tile-done">${icon('check')}</span>` : ''}</span>
          <span class="ch-n">${esc(t('chapterN', i + 1))}</span>
          <span class="ch-t">${esc(l.short)}</span>
          <span class="ch-score">${best == null ? esc(t('quizNew')) : esc(t('nOfM', best, n))}</span>
        </button>`;
      }).join('')}</div>`;
  }

  function shuffled(n, seed) {
    const a = Array.from({ length: n }, (_, i) => i);
    let x = seed * 9301 + 49297;
    for (let i = n - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor((x / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function startQuiz(id) {
    quest.quiz = { id, i: 0, score: 0, answered: false };
    renderQuiz($('.q-body', el.questView), true);
  }
  function renderQuiz(body, animate) {
    const qz = quest.quiz;
    const qs = QD().quiz[qz.id] || [];
    const l = lessons().find((x) => x.id === qz.id);
    if (qz.i >= qs.length) {
      const prev = quizBest[qz.id];
      if (prev == null || qz.score > prev) { quizBest[qz.id] = qz.score; store.set('pps-quiz', quizBest); }
      const all = qz.score === qs.length;
      body.innerHTML = `
        <div class="quiz q-anim">
          <button class="link-btn quiz-back" type="button">${icon('left')}${esc(t('quizBack'))}</button>
          <div class="quiz-result${all ? ' is-all' : ''}">
            <span class="qr-score">${qz.score}<small> / ${qs.length}</small></span>
            <p>${esc(all ? t('quizAll') : t('quizSome'))}</p>
            <div class="qr-actions">
              <button class="btn quiz-retry" type="button">${icon('reset')}${esc(t('quizRetry'))}</button>
              <a class="btn primary" href="#/lesson/${qz.id}">${esc(t('quizToLesson'))}${icon('right')}</a>
            </div>
          </div>
        </div>`;
      M.anim($('.qr-score', body), [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: M.SPRING });
      if (all) burst($('.qr-score', body));
      return;
    }
    const q = qs[qz.i];
    const order = shuffled(q.options.length, lessons().indexOf(l) * 10 + qz.i + 1);
    body.innerHTML = `
      <div class="quiz q-anim">
        <div class="quiz-top">
          <button class="link-btn quiz-back" type="button">${icon('left')}${esc(t('quizBack'))}</button>
          <span class="quiz-of">${esc(l.short)} · ${esc(t('quizQ', qz.i + 1, qs.length))}</span>
        </div>
        <div class="quiz-bar"><span style="width:${(qz.i / qs.length) * 100}%"></span></div>
        <h3 class="quiz-q">${q.q}</h3>
        ${q.code ? `<pre class="q-code">${highlight(q.code)}</pre>` : ''}
        <div class="q-opts">${order.map((oi, k) => `<button class="q-opt" type="button" data-i="${oi}"><span class="q-key">${'ABC'[k]}</span><code>${esc(q.options[oi])}</code></button>`).join('')}</div>
        <div class="q-feedback" aria-live="polite"></div>
      </div>`;
    if (animate) {
      M.anim($('.quiz-q', body), [{ opacity: 0, transform: 'translateX(16px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      $$('.q-code, .q-opt', body).forEach((n, i) => M.anim(n, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { delay: 80 + i * 60, duration: 420 }));
    }
  }
  function answerQuiz(i) {
    const qz = quest.quiz;
    const q = QD().quiz[qz.id][qz.i];
    qz.answered = true;
    const right = i === q.answer;
    if (right) qz.score++;
    $$('.q-opt', el.questView).forEach((b) => {
      const oi = Number(b.dataset.i);
      b.disabled = true;
      if (oi === q.answer) { b.classList.add('is-right'); M.anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'none' }], { duration: 420, easing: M.SPRING }); }
      else if (oi === i) { b.classList.add('is-wrong'); M.anim(b, [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 380 }); }
    });
    const last = qz.i === QD().quiz[qz.id].length - 1;
    const fb = $('.q-feedback', el.questView);
    fb.className = `q-feedback ${right ? 'ok' : 'no'}`;
    fb.innerHTML = `<b>${esc(right ? t('quizRight') : t('quizWrong'))}</b> <span>${q.why}</span><button class="btn primary small quiz-next" type="button">${esc(last ? t('quizResult') : t('quizNext'))}${icon('right')}</button>`;
    M.anim(fb, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
    $('.quiz-bar span', el.questView).style.width = `${((qz.i + 1) / QD().quiz[qz.id].length) * 100}%`;
    $('.quiz-next', el.questView).focus({ preventScroll: true });
  }

  /* ---- project ideas ---- */
  function renderProjects(body) {
    const P = QD().projects;
    const lname = (id) => (lessons().find((l) => l.id === id) || {}).short || id;
    body.innerHTML = `
      <p class="q-intro q-anim">${esc(t('projectsIntro'))}</p>
      <div class="pj-cols">${LEVELS.map((lvl) => `
        <section class="pj-col" data-lvl="${lvl}">
          <h3 class="pj-h q-anim">${LEVEL_DOTS(lvl)}${esc(t('lvl')[lvl])}</h3>
          ${P[lvl].map((p, i) => `
            <article class="pj-card q-anim">
              <h4>${esc(p.title)}</h4>
              <p>${esc(p.text)}</p>
              <p class="pj-needs"><span>${esc(t('projectNeeds'))}</span>${p.needs.map((n) => `<a class="chip" href="#/lesson/${n}">${esc(lname(n))}</a>`).join('')}</p>
              <button class="btn small pj-go" type="button" data-project="${lvl}:${i}">${icon('terminal')}${esc(t('projectStart'))}</button>
            </article>`).join('')}
        </section>`).join('')}
      </div>`;
  }

  /* ---------------- Whole-app entrance ---------------- */
  function revealApp(opts = {}) {
    const root = document.documentElement;
    const d0 = opts.delay || 0;
    const anims = [];
    anims.push(M.anim($('.rail'), [{ opacity: 0, transform: 'translateX(-100%)' }, { opacity: 1, transform: 'none' }], { delay: d0, duration: 700 }));
    $$('.rail .brand, .rail .rail-btn').forEach((n, i) => anims.push(M.rise(n, d0 + 120 + i * 50, 10, 500)));
    anims.push(M.anim($('.top h1'), [{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }], { delay: d0 + 120, duration: 900, easing: M.SWING }));
    anims.push(M.rise($('.top p'), d0 + 380, 8));
    anims.push(M.anim(el.progress, [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { delay: d0 + 300, duration: 600 }));
    anims.push(M.rise(el.heading, d0 + 260, 10));
    anims.push(M.anim(el.mode, [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { delay: d0 + 340, duration: 520, easing: M.SPRING }));
    if (state.panelOpen) {
      anims.push(M.anim(el.panel, [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'none' }], { delay: d0 + 200, duration: 760 }));
      anims.push(M.rise(el.panelRunner, d0 + 520, 14));
    }
    if (state.view === 'start') anims.push(M.rise(el.stageChoices, d0 + 700, 14, 600));
    else taskCardIn(d0 + 900 + currentAnnos.length * 150);
    anims.push(M.anim($('.dock-wrap'), [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { delay: d0 + 420, duration: 700, easing: M.SPRING }));
    anims.push(M.rise($('.diagram-hint'), d0 + 900, 6));
    const pb = $('.progress-bar span', el.progress);
    if (pb) anims.push(M.anim(pb, [{ width: '0%' }, { width: pb.style.width }], { delay: d0 + 700, duration: 900 }));
    if (opts.skipWindow) root.classList.add('pre-diagram'); // the intro brings the window in itself
    root.classList.remove('pre-reveal');
    state.revealed = true;
    if (state.panelOpen) panelIn(d0 + 360);
    if (state.panelOpen) narrateVisible(d0 + 500);
    if (!opts.skipWindow) anims.push(diagramIn(d0 + 240));
    return Promise.all(anims).then(() => maybeCoach());
  }

  /* ---------------- Helper panel (hidden until asked for) ---------------- */
  const narrow = () => matchMedia('(max-width: 1100px)').matches;
  function applyPanelState() {
    const open = state.panelOpen;
    document.documentElement.classList.toggle('panel-open', open);
    el.panel.inert = !open;
    el.panel.setAttribute('aria-hidden', String(!open));
    el.helperBtn.setAttribute('aria-expanded', String(open));
    el.helperBtn.setAttribute('aria-label', open ? t('helperClose') : t('helperOpen'));
    el.scrim.hidden = !(open && narrow());
  }
  function setPanel(open, opts = {}) {
    if (open === state.panelOpen && !opts.force) return;
    const wasOpen = state.panelOpen;
    state.panelOpen = open;
    store.set('pps-panel', open);
    hideFlyout();
    hideCoach(true);
    applyPanelState();
    if (open) {
      if (opts.tab && state.view === 'lesson') {
        const want = opts.tab === 'task' ? nextStepOf(lesson()) : state.taskStep;
        if (state.tab !== opts.tab || state.taskStep !== want) {
          state.tab = opts.tab;
          state.taskStep = want;
          renderPanel({});
        }
      }
      if (!wasOpen) {
        M.anim(el.panel, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'none' }], { duration: 640 });
        panelIn(140);
        M.rise(el.panelRunner, 260, 14, 560);
        narrateVisible(250);
        if (!el.scrim.hidden) M.anim(el.scrim, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      }
      if (opts.focus) setTimeout(() => { const f = opts.tab === 'task' ? $('textarea', el.panelRunner) : el.panelClose; if (f) f.focus({ preventScroll: true }); }, 60);
    } else {
      stopReading();
      if (opts.focus) el.helperBtn.focus();
    }
    M.pop(el.helperBtn.querySelector('.ic'), 0, 460);
  }
  el.panelClose.addEventListener('click', () => setPanel(false, { focus: true }));
  el.scrim.addEventListener('click', () => setPanel(false));
  el.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape' && narrow()) setPanel(false, { focus: true }); });
  matchMedia('(max-width: 1100px)').addEventListener('change', applyPanelState);
  el.stageChoices.addEventListener('click', (e) => {
    if (e.target.closest('.tour-again')) { runTour(); return; }
    if (e.target.closest('[data-dock="task"]')) setPanel(true, { tab: 'task', focus: true, force: true });
  });
  el.dockNav.addEventListener('click', (e) => {
    if (e.target.closest('[data-dock="task"]')) setPanel(true, { tab: 'task', focus: true, force: true });
  });

  /* rail flyout: says what the helper button opens before anyone clicks it */
  let flyTimer = null;
  function showFlyout() {
    if (narrow() || state.panelOpen) return;
    clearTimeout(flyTimer);
    flyTimer = setTimeout(() => {
      const r = el.helperBtn.getBoundingClientRect();
      el.flyout.innerHTML = `<b>${esc(t('helperTitle'))}</b><span>${esc(t('helperDesc'))}</span>`;
      el.flyout.hidden = false;
      el.flyout.style.left = `${r.right + 12}px`;
      el.flyout.style.top = `${r.top + r.height / 2 - el.flyout.offsetHeight / 2}px`;
      M.anim(el.flyout, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 300 });
    }, 220);
  }
  function hideFlyout() { clearTimeout(flyTimer); el.flyout.hidden = true; }
  el.helperBtn.addEventListener('pointerenter', showFlyout);
  el.helperBtn.addEventListener('pointerleave', hideFlyout);
  el.helperBtn.addEventListener('focus', showFlyout);
  el.helperBtn.addEventListener('blur', hideFlyout);

  /* one-time coach mark: on the first lesson, point at the helper */
  function maybeCoach() {
    if (touring || !store.get('pps-tour', false) || state.view !== 'lesson' || state.panelOpen || store.get('pps-coach', false) || !state.revealed || !el.coach.hidden) return;
    if ($('#offer').open) { setTimeout(maybeCoach, 1500); return; }
    showCoach();
  }
  function showCoach() {
    const r = el.helperBtn.getBoundingClientRect();
    el.coach.innerHTML = `${icon('panel')}<span>${esc(t('coachText'))}</span><button class="btn small" type="button">${esc(t('coachOk'))}</button>`;
    el.coach.hidden = false;
    const bottom = matchMedia('(max-width: 720px)').matches;
    el.coach.classList.toggle('up', bottom);
    if (bottom) {
      el.coach.style.left = `${Math.max(10, Math.min(innerWidth - el.coach.offsetWidth - 10, r.left + r.width / 2 - el.coach.offsetWidth / 2))}px`;
      el.coach.style.top = `${r.top - el.coach.offsetHeight - 14}px`;
    } else {
      el.coach.style.left = `${r.right + 14}px`;
      el.coach.style.top = `${r.top + r.height / 2 - el.coach.offsetHeight / 2}px`;
    }
    el.coach.style.setProperty('--ax', `${r.left + r.width / 2 - el.coach.getBoundingClientRect().left}px`);
    M.anim(el.coach, [{ opacity: 0, transform: bottom ? 'translateY(10px) scale(.9)' : 'translateX(-10px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: M.SPRING });
    el.helperBtn.classList.add('ping');
    $('button', el.coach).addEventListener('click', () => hideCoach());
  }
  function hideCoach(silent) {
    if (el.coach.hidden) return;
    store.set('pps-coach', true);
    el.helperBtn.classList.remove('ping');
    if (silent || M.reduced()) { el.coach.hidden = true; return; }
    M.anim(el.coach, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.95)' }], { duration: 180, fill: 'forwards' }).then(() => { el.coach.hidden = true; el.coach.getAnimations().forEach((x) => x.cancel()); });
  }


  /* ---------------- Routing ---------------- */
  function renderAll(animate) {
    const startBtn = $('[data-nav="start"]');
    if (state.view === 'start') startBtn.setAttribute('aria-current', 'page');
    else startBtn.removeAttribute('aria-current');
    const qb = $('[data-nav="quests"]');
    if (state.view === 'quests') qb.setAttribute('aria-current', 'page'); else qb.removeAttribute('aria-current');
    document.title = state.view === 'lesson' ? `${lesson().short} — ${t('siteName')}` : state.view === 'quests' ? `${t('questsTitle')} — ${t('siteName')}` : t('siteName');
    renderStage({ animate });
    renderPanel({ animate });
    renderProgress();
    renderDock();
    if (animate) M.anim(el.dockNow, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
    if (!el.launcher.hidden) renderLauncher();
  }

  function route() {
    stopReading();
    let raw = location.hash.replace(/^#\/?/, '');
    let intro = false;
    if (raw === 'intro') { history.replaceState(null, '', '#/start'); raw = 'start'; intro = true; }
    if (raw === 'tour') {
      history.replaceState(null, '', '#/start');
      raw = 'start';
      if (state.revealed) setTimeout(() => runTour(), state.view === 'start' ? 50 : 900);
    }
    const parts = raw.split('/');
    const prev = state.lessonId;
    const prevView = state.view;
    if (parts[0] === 'quests') {
      state.view = 'quests';
      state.lessonId = null;
      const tab = Q_TABS.includes(parts[1]) ? parts[1] : 'daily';
      if (tab !== quest.tab) quest.quiz = null;
      quest.tab = tab;
    } else if (parts[0] === 'lesson' && lessons().some((l) => l.id === parts[1])) {
      state.view = 'lesson';
      state.lessonId = parts[1];
      if (prev !== state.lessonId) { state.tab = 'learn'; state.taskStep = nextStepOf(lesson()); }
    } else {
      state.view = 'start';
      state.lessonId = null;
    }
    const changed = prev !== state.lessonId || prevView !== state.view || state.view === 'quests';
    if (intro && state.revealed) {
      // replay requested while the site is already shown: hide it again and start over
      state.revealed = false;
      document.documentElement.classList.add('pre-reveal');
      renderAll(false);
      playIntro(true);
      return intro;
    }
    renderAll(changed && state.revealed);
    if (changed) { el.stage.scrollTop = 0; el.panel.scrollTop = 0; }
    if (changed && state.revealed) setTimeout(maybeCoach, 1600);
    return intro;
  }

  /* ---------------- Guided tour ---------------- */
  function tourSteps() {
    const T = t('tourSteps');
    const step = (key, target) => ({ title: T[key][0], text: T[key][1], target });
    return [
      step('win', () => el.win.querySelector('.win')),
      step('pin', () => el.win.querySelector('.pin')),
      step('mode', () => el.mode),
      step(state.view === 'start' ? 'start' : 'task', () => (el.stageChoices.hidden ? null : el.stageChoices)),
      step('lessons', () => el.dock),
      step('helper', () => el.helperBtn),
      step('sandbox', () => $('[data-nav="sandbox"]')),
      step('hints', () => el.hintsBtn),
      step('progress', () => el.progress),
      step('prefs', () => [$('.rail-lang'), $('[data-nav="theme"]')]),
    ];
  }
  let touring = false;
  function runTour() {
    if (touring) return Promise.resolve();
    touring = true;
    hideNote(true);
    hideCoach(true);
    openLauncher(false);
    if (narrow() && state.panelOpen) setPanel(false);
    return window.PPSTour.run({
      steps: tourSteps(),
      labels: { next: t('tourNext'), back: t('tourBack'), skip: t('tourSkip'), done: t('tourDone'), of: (i, n) => t('tourOf', i, n), aria: t('tourAria') },
    }).then(() => {
      touring = false;
      store.set('pps-tour', true);
      store.set('pps-coach', true);
    });
  }
  /* first visit: tour, then the hints offer */
  function afterReveal() {
    const next = store.get('pps-tour', false) ? Promise.resolve() : runTour();
    return next.then(() => window.PPSIntro.bulbHint(introApi()));
  }

  /* ---------------- Intro + hints offer ---------------- */
  function introApi() {
    return {
      t,
      start: content().start,
      windowHtml,
      garbledHtml: (d) => windowHtml(Object.assign({}, d, {
        code: '# ??? ?? ????\nprnt("Hello wrld"',
        rawHtml: '<span class="t-com">#  ???  ?? ????</span>\n<span class="squiggle">prnt</span>(<span class="t-str">"Hello wrld"</span><span class="squiggle"> </span>',
        output: 'SyntaxError: ???',
        outClass: 'out-bad',
      })),
      targetWin: () => el.win.querySelector('.win'),
      revealApp,
      diagramIn() { document.documentElement.classList.remove('pre-diagram'); return diagramIn(0, true); },
      hideWindow(h) { el.win.style.visibility = h ? 'hidden' : ''; },
      hintsButton: () => el.hintsBtn,
      hintsAlreadyAsked: () => !!store.get('pps-hints-asked', false),
      markHintsAsked: () => store.set('pps-hints-asked', true),
      setHints(on) { store.set('pps-hints-asked', true); setHints(on, { toast: on }); },
      bottomBar: () => matchMedia('(max-width: 720px)').matches,
    };
  }

  function playIntro(force) {
    window.PPSIntro.play(introApi(), { force }).then(() => {
      store.set('pps-intro', true);
      return afterReveal();
    });
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && launcherOpen) { openLauncher(false); el.launchBtn.focus(); }
  });

  hydrateIcons();
  applyStaticTexts();
  const forced = route();
  if (forced || (!store.get('pps-intro', false) && !M.reduced())) {
    playIntro(forced);
  } else {
    revealApp().then(afterReveal);
  }
})();
