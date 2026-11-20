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
    M.anim(skipBtn, [{ opacity: 0 }, { opacity: 1 }], { delay: 600, duration: 500, fill: 'both' });

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

  /*
    The bulb jumps out of the Tipps button, a "?" pops up over it, and it lands as the icon
    of the offer. The answer flies back into the button and lands with a splash.
  */
  async function bulbJump(api, dlg) {
    const M = window.Motion;
    const btn = api.hintsButton();
    const ic = btn.querySelector('.ic');
    const r = ic.getBoundingClientRect();
    const S = 84;
    const fly = document.createElement('div');
    fly.className = 'bulb-fly';
    fly.setAttribute('aria-hidden', 'true');
    fly.innerHTML = `<div class="bulb-in">${$('.offer-icon', dlg).innerHTML}<span class="bulb-q">?</span></div>`;
    document.body.append(fly);
    const inner = $('.bulb-in', fly);
    const q = $('.bulb-q', fly);
    const s0 = r.width / S;
    const x0 = r.left + r.width / 2 - S / 2;
    const y0 = r.top + r.height / 2 - S / 2;
    const xc = innerWidth / 2 - S / 2;
    const yc = innerHeight * 0.4 - S / 2;
    const xm = x0 + (xc - x0) * 0.42;
    const ym = Math.min(y0, yc) - Math.min(160, innerHeight * 0.18);

    // the button winds up, then the bulb leaves it
    M.anim(btn, [{ transform: 'none' }, { transform: 'scale(.86)', offset: .3 }, { transform: 'scale(1.12)', offset: .6 }, { transform: 'none' }], { duration: 520, easing: 'ease-out' });
    M.anim(ic, [{ opacity: 1, transform: 'none' }, { opacity: .15, transform: 'scale(.5)' }], { delay: 160, duration: 260, fill: 'forwards' });
    await M.anim(fly, [
      { transform: `translate(${x0}px, ${y0}px) scale(${s0})`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 26}px) scale(${s0 * 1.7})`, opacity: 1, offset: .14 },
      { transform: `translate(${xm}px, ${ym}px) scale(1.15) rotate(-16deg)`, offset: .56 },
      { transform: `translate(${xc}px, ${yc}px) scale(1.7) rotate(0deg)` },
    ], { delay: 180, duration: 1050, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });

    // landing: squash, rays light up, the question mark pops and wiggles
    M.anim(inner, [{ transform: 'scale(1.18, .8)' }, { transform: 'scale(.94, 1.08)', offset: .45 }, { transform: 'none' }], { duration: 560, easing: 'ease-out' });
    M.anim($('.oi-rays', inner), [{ opacity: 0 }, { opacity: 1 }, { opacity: .55 }, { opacity: 1 }], { duration: 900 });
    M.splash(innerWidth / 2, yc + S / 2, 'var(--kw)', { rings: 2, drops: 0, size: 70 });
    await M.anim(q, [
      { opacity: 0, transform: 'translateY(10px) scale(0) rotate(-30deg)' },
      { opacity: 1, transform: 'translateY(-4px) scale(1.3) rotate(8deg)', offset: .6 },
      { opacity: 1, transform: 'none' },
    ], { delay: 120, duration: 520, easing: 'ease-out', fill: 'forwards' });
    await M.anim(q, [{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0)' }], { duration: 700, iterations: 1, easing: 'ease-in-out' });
    await M.wait(250);
    return { fly, q, ic };
  }

  async function offer(api) {
    const M = window.Motion;
    if (api.hintsAlreadyAsked()) return;
    const dlg = $('#offer');
    const card = $('.offer-card', dlg);
    const icon = $('.offer-icon', card);
    $('#offerNote', dlg).textContent = api.bottomBar() ? api.t('offerNoteBottom') : api.t('offerNoteLeft');
    await M.wait(350);

    const jumped = M.reduced() ? null : await bulbJump(api, dlg);

    dlg.showModal();
    M.anim(dlg, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    if (jumped) {
      // the flying bulb settles exactly where the offer's icon sits
      icon.style.visibility = 'hidden';
      const tr = icon.getBoundingClientRect();
      M.anim(jumped.q, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px) scale(.6)' }], { duration: 300, fill: 'forwards' });
      const from = getComputedStyle(jumped.fly).transform;
      await M.anim(jumped.fly, [{ transform: from }, { transform: `translate(${tr.left}px, ${tr.top}px) scale(${tr.width / 84})` }], { duration: 650, easing: M.SWING, fill: 'forwards' });
      icon.style.visibility = '';
      jumped.fly.remove();
      M.anim(icon, [{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 420, easing: M.SPRING });
      M.anim($('.oi-ring', card), [{ strokeDashoffset: 190 }, { strokeDashoffset: 0 }], { duration: 900 });
    } else {
      M.anim(icon, [{ opacity: 0, transform: 'scale(.3) rotate(-30deg)' }, { opacity: 1, transform: 'none' }], { delay: 100, duration: 800, easing: M.SPRING });
      M.anim($('.oi-ring', card), [{ strokeDashoffset: 190 }, { strokeDashoffset: 0 }], { delay: 200, duration: 1100 });
      M.anim($('.oi-rays', card), [{ opacity: 0 }, { opacity: 1 }], { delay: 900, duration: 400 });
    }
    M.rise($('h2', card), 120, 16, 700);
    $$('.offer-list li', card).forEach((li, i) => M.rise(li, 260 + i * 110, 14, 600));
    M.rise($('.offer-actions', card), 620, 12, 600);
    M.rise($('.offer-note', card), 760, 8, 600);
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

    // back into the button
    const btn = api.hintsButton();
    const ic = btn.querySelector('.ic');
    const br = ic.getBoundingClientRect();
    M.anim(dlg, [{ backgroundColor: getComputedStyle(dlg).backgroundColor }, { backgroundColor: 'transparent' }], { duration: 700, fill: 'forwards' });
    await M.flyTo(card, br, { duration: 720, endOpacity: 0, easing: 'cubic-bezier(.6, 0, .3, 1)' });
    dlg.close();
    dlg.getAnimations({ subtree: true }).forEach((x) => x.cancel());
    card.style.transform = '';
    api.setHints(choice);

    // splash: rings spread over the rail like water, drops fly off, the bulb bounces back in
    const fresh = btn.querySelector('.ic');
    fresh.getAnimations().forEach((x) => x.cancel());
    const c = fresh.getBoundingClientRect();
    M.splash(c.left + c.width / 2, c.top + c.height / 2, 'var(--kw)', { rings: 3, drops: 14, size: 54 });
    M.anim(fresh, [
      { opacity: 0, transform: 'translateY(-14px) scale(.3)' },
      { opacity: 1, transform: 'translateY(3px) scale(1.35, .8)', offset: .5 },
      { transform: 'scale(.92, 1.1)', offset: .75 },
      { opacity: 1, transform: 'none' },
    ], { duration: 640, easing: 'ease-out' });
    M.anim(btn, [{ transform: 'scale(1)' }, { transform: 'scale(.9)', offset: .35 }, { transform: 'scale(1.08)', offset: .7 }, { transform: 'scale(1)' }], { duration: 560, easing: 'ease-out' });
    btn.classList.add('ping');
    setTimeout(() => btn.classList.remove('ping'), 2400);
  }

  /* First visit, after the tour: no dialog, just the bulb. It jumps out of the Tipps button,
     shows a "?", and jumps back in with a splash. Hints stay off until someone presses the button. */
  async function bulbHint(api) {
    const M = window.Motion;
    if (api.hintsAlreadyAsked()) return;
    api.markHintsAsked();
    if (M.reduced()) return;
    await M.wait(350);
    const dlg = $('#offer');
    const jumped = await bulbJump(api, dlg);
    await M.wait(500);
    const btn = api.hintsButton();
    const ic = btn.querySelector('.ic');
    const r = ic.getBoundingClientRect();
    const S = 84;
    const from = getComputedStyle(jumped.fly).transform;
    M.anim(jumped.q, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-12px) scale(.5)' }], { duration: 260, fill: 'forwards' });
    const x1 = r.left + r.width / 2 - S / 2;
    const y1 = r.top + r.height / 2 - S / 2;
    const xm = (x1 + innerWidth / 2 - S / 2) / 2;
    const ym = Math.min(y1, innerHeight * 0.4) - Math.min(140, innerHeight * 0.16);
    await M.anim(jumped.fly, [
      { transform: from },
      { transform: `translate(${xm}px, ${ym}px) scale(1.05) rotate(14deg)`, offset: .45 },
      { transform: `translate(${x1}px, ${y1}px) scale(${r.width / S})` },
    ], { duration: 900, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'forwards' });
    jumped.fly.remove();
    const fresh = btn.querySelector('.ic');
    fresh.getAnimations().forEach((x) => x.cancel());
    M.splash(r.left + r.width / 2, r.top + r.height / 2, 'var(--kw)', { rings: 3, drops: 14, size: 54 });
    M.anim(fresh, [
      { opacity: 0, transform: 'translateY(-14px) scale(.3)' },
      { opacity: 1, transform: 'translateY(3px) scale(1.35, .8)', offset: .5 },
      { transform: 'scale(.92, 1.1)', offset: .75 },
      { opacity: 1, transform: 'none' },
    ], { duration: 640, easing: 'ease-out' });
    M.anim(btn, [{ transform: 'scale(1)' }, { transform: 'scale(.9)', offset: .35 }, { transform: 'scale(1.08)', offset: .7 }, { transform: 'scale(1)' }], { duration: 560, easing: 'ease-out' });
    btn.classList.add('ping');
    setTimeout(() => btn.classList.remove('ping'), 2400);
  }

  return { play, offer, bulbHint };
})();
