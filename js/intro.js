/*
  First-visit intro and the full-screen hints offer.

  Timeline (about 9 s, skippable):
   0.0  "Hi!" pops in letter by letter, centred
   1.4  it slides up; the question rises word by word; a monitor with broken code rises below
   2.6  question marks float out of the monitor, it shakes a little
   5.6  the question blurs away, the answer rises in its place
   6.2  a scan line sweeps the monitor and the code comes out fixed
   7.6  the words leave, the backdrop dissolves, the monitor flies onto the editor window
        while the rest of the site assembles around it
*/
window.PPSIntro = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hold = (ms) => new Promise((r) => setTimeout(r, ms)); // reading time: real even with reduced motion

  async function play(api) {
    const M = window.Motion;
    const t = api.t;
    const root = $('#intro');
    const SKIP = {};
    let skipped = false;
    let finished = false;
    const guard = async (p) => { await p; if (skipped) throw SKIP; };

    const chars = Array.from(t('introHello')).map((c) => `<span class="ih-c">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
    const words = (s) => s.split(' ').map((w) => `<span class="iw">${esc(w)}</span>`).join(' ');

    root.innerHTML = `
      <div class="intro-bg" aria-hidden="true"></div>
      <div class="intro-scene">
        <h2 class="intro-hello" aria-label="${esc(t('introHello'))}"><span aria-hidden="true">${chars}</span></h2>
        <div class="intro-text">
          <p class="intro-q">${words(t('introQuestion'))}</p>
          <p class="intro-a">${words(t('introAnswer'))}</p>
        </div>
        <div class="intro-monitor" aria-hidden="true">
          <div class="im-a">${api.garbledHtml(api.start)}</div>
          <div class="im-b">${api.windowHtml(api.start)}</div>
          <span class="im-scan"></span>
          <div class="im-qs"></div>
        </div>
      </div>
      <button class="intro-skip" type="button">${esc(t('introSkip'))}</button>`;
    root.hidden = false;
    document.body.classList.add('intro-on');
    api.hideWindow(true);

    const hello = $('.intro-hello', root);
    const q = $('.intro-q', root);
    const a = $('.intro-a', root);
    const mon = $('.intro-monitor', root);
    const scene = $('.intro-scene', root);
    const target = api.targetWin();
    if (target) mon.style.width = `${Math.min(target.getBoundingClientRect().width, innerWidth - 32)}px`;

    const skipBtn = $('.intro-skip', root);
    skipBtn.addEventListener('click', () => skip());
    const onKey = (e) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    M.anim(skipBtn, [{ opacity: 0 }, { opacity: 1 }], { delay: 600, duration: 500 });

    let revealStarted = false;
    function startReveal(skipWindow) {
      if (revealStarted) return;
      revealStarted = true;
      api.revealApp({ skipWindow });
    }

    async function finish() {
      if (finished) return;
      finished = true;
      window.removeEventListener('keydown', onKey);
      api.hideWindow(false);
      document.body.classList.remove('intro-on');
      root.hidden = true;
      root.innerHTML = '';
    }

    function skip() {
      if (skipped || finished) return;
      skipped = true;
      root.getAnimations({ subtree: true }).forEach((x) => x.cancel());
      const flew = revealStarted;
      startReveal(false);
      if (flew) api.diagramIn();
      M.anim(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }).then(finish);
    }

    try {
      // 1. "Hi!" centred, letter by letter
      const sr = scene.getBoundingClientRect();
      const hr = hello.getBoundingClientRect();
      const off = sr.top + sr.height / 2 - (hr.top + hr.height / 2);
      hello.style.transform = `translateY(${off}px) scale(1.35)`;
      hello.style.opacity = 1;
      $$('.ih-c', hello).forEach((c, i) => M.anim(c, [
        { opacity: 0, transform: 'translateY(.5em) rotate(-8deg) scale(.6)' },
        { opacity: 1, transform: 'none' },
      ], { delay: 150 + i * 70, duration: 700, easing: M.SPRING }));
      await guard(hold(1400));

      // 2. hello moves up, question + broken monitor rise
      M.anim(hello, [{ transform: `translateY(${off}px) scale(1.35)` }, { transform: 'none' }], { duration: 900, easing: M.SWING, fill: 'forwards' });
      q.style.opacity = 1;
      $$('.iw', q).forEach((w, i) => M.anim(w, [{ opacity: 0, transform: 'translateY(10px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { delay: 300 + i * 55, duration: 600 }));
      M.anim(mon, [{ opacity: 0, transform: 'translateY(60px) scale(.94)' }, { opacity: 1, transform: 'none' }], { delay: 500, duration: 1000, fill: 'both' });
      await guard(hold(1200));

      // 3. confusion: question marks float out, the monitor shakes
      const qs = $('.im-qs', mon);
      for (let i = 0; i < 9; i++) {
        const s = document.createElement('span');
        s.textContent = '?';
        s.style.left = `${8 + Math.random() * 84}%`;
        s.style.fontSize = `${18 + Math.random() * 26}px`;
        qs.append(s);
        M.anim(s, [
          { opacity: 0, transform: 'translateY(0) rotate(0deg)' },
          { opacity: 1, transform: `translateY(-40px) rotate(${Math.random() * 30 - 15}deg)`, offset: .3 },
          { opacity: 0, transform: `translateY(-${110 + Math.random() * 60}px) rotate(${Math.random() * 60 - 30}deg)` },
        ], { delay: i * 260, duration: 1500, easing: 'ease-out', fill: 'both' });
      }
      M.anim(mon, [
        { transform: 'translateX(0)' }, { transform: 'translateX(-6px) rotate(-.4deg)' }, { transform: 'translateX(6px) rotate(.4deg)' },
        { transform: 'translateX(-4px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' },
      ], { delay: 900, duration: 600, easing: 'ease-in-out' });
      await guard(hold(3000));

      // 4. the answer
      M.anim(q, [{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-10px)' }], { duration: 500, easing: M.IN, fill: 'forwards' });
      await guard(hold(380));
      a.style.opacity = 1;
      $$('.iw', a).forEach((w, i) => M.anim(w, [{ opacity: 0, transform: 'translateY(18px) scale(.9)' }, { opacity: 1, transform: 'none' }], { delay: i * 90, duration: 700, easing: M.SPRING }));
      await guard(hold(500));

      // 5. the fix: a scan line sweeps and leaves clean code behind
      const scan = $('.im-scan', mon);
      const b = $('.im-b', mon);
      M.anim(scan, [{ left: '0%', opacity: 0 }, { opacity: 1, offset: .1 }, { left: '100%', opacity: 1, offset: .9 }, { left: '100%', opacity: 0 }], { duration: 1100, easing: M.SWING, fill: 'both' });
      M.anim(b, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 1100, easing: M.SWING, fill: 'both' });
      M.anim(mon, [{ boxShadow: '0 0 0 0 rgba(92,201,122,0)' }, { boxShadow: '0 0 0 10px rgba(92,201,122,.25)', offset: .85 }, { boxShadow: '0 0 0 18px rgba(92,201,122,0)' }], { delay: 900, duration: 900 });
      await guard(hold(1700));

      // 6. words leave, backdrop dissolves, monitor flies onto the real window while the site assembles
      M.anim(hello, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-24px)' }], { duration: 450, easing: M.IN, fill: 'forwards' });
      M.anim(a, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-16px)' }], { delay: 60, duration: 450, easing: M.IN, fill: 'forwards' });
      M.anim(skipBtn, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      await guard(hold(300));
      startReveal(true);
      M.anim($('.intro-bg', root), [{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' });
      const tgt = api.targetWin();
      if (tgt) {
        mon.getAnimations().forEach((x) => x.finish());
        mon.style.opacity = 1;
        await guard(M.flyTo(mon, tgt.getBoundingClientRect(), { duration: 1000 }));
      }
      api.hideWindow(false);
      await guard(M.anim(mon, [{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }));
      finish();
      await api.diagramIn();
    } catch (e) {
      if (e !== SKIP) { console.error(e); skip(); }
      await hold(340);
    }
  }

  /* Full-screen offer; closing it shrinks the card into the Hints button */
  async function offer(api) {
    const M = window.Motion;
    if (api.hintsAlreadyAsked()) return;
    const dlg = $('#offer');
    const card = $('.offer-card', dlg);
    $('#offerNote', dlg).textContent = api.bottomBar() ? api.t('offerNoteBottom') : api.t('offerNoteLeft');
    await M.wait(450);
    dlg.showModal();
    M.anim(dlg, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    M.anim($('.offer-icon', card), [{ opacity: 0, transform: 'scale(.3) rotate(-30deg)' }, { opacity: 1, transform: 'none' }], { delay: 100, duration: 800, easing: M.SPRING });
    M.anim($('.oi-ring', card), [{ strokeDashoffset: 190 }, { strokeDashoffset: 0 }], { delay: 200, duration: 1100 });
    M.anim($('.oi-rays', card), [{ opacity: 0 }, { opacity: 1 }], { delay: 900, duration: 400 });
    M.rise($('h2', card), 220, 16, 700);
    $$('.offer-list li', card).forEach((li, i) => M.rise(li, 380 + i * 110, 14, 600));
    M.rise($('.offer-actions', card), 760, 12, 600);
    M.rise($('.offer-note', card), 900, 8, 600);
    $('[data-offer="on"]', card).focus({ preventScroll: true });

    const choice = await new Promise((resolve) => {
      const onClick = (e) => {
        const b = e.target.closest('[data-offer]');
        if (!b) return;
        dlg.removeEventListener('click', onClick);
        dlg.removeEventListener('cancel', onCancel);
        resolve(b.dataset.offer === 'on');
      };
      const onCancel = (e) => {
        e.preventDefault();
        dlg.removeEventListener('click', onClick);
        dlg.removeEventListener('cancel', onCancel);
        resolve(false);
      };
      dlg.addEventListener('click', onClick);
      dlg.addEventListener('cancel', onCancel);
    });

    const btn = api.hintsButton();
    const br = btn.getBoundingClientRect();
    M.anim(dlg, [{ backgroundColor: getComputedStyle(dlg).backgroundColor }, { backgroundColor: 'transparent' }], { duration: 700, fill: 'forwards' });
    await M.flyTo(card, br, { duration: 750, endOpacity: 0, easing: 'cubic-bezier(.6, 0, .3, 1)' });
    dlg.close();
    dlg.getAnimations({ subtree: true }).forEach((x) => x.cancel());
    card.style.transform = '';
    api.setHints(choice);
    M.anim(btn, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 600, easing: M.SPRING });
    btn.classList.add('ping');
    setTimeout(() => btn.classList.remove('ping'), 2400);
  }

  return { play, offer };
})();
