/*
  Guided tour: the page dims, a bright window glides from one part of the site to the next,
  and a card next to it says what that part is for.

  PPSTour.run({ steps, labels }) -> Promise
    steps:  [{ target: () => Element | Element[], title, text }]   (steps whose target is missing are skipped)
    labels: { next, back, skip, done, of(i, n), aria }
*/
window.PPSTour = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const PAD = 8;

  function rectOf(target) {
    const list = (Array.isArray(target) ? target : [target]).filter((n) => n && n.getClientRects().length);
    if (!list.length) return null;
    const rs = list.map((n) => n.getBoundingClientRect());
    const left = Math.min(...rs.map((r) => r.left));
    const top = Math.min(...rs.map((r) => r.top));
    const right = Math.max(...rs.map((r) => r.right));
    const bottom = Math.max(...rs.map((r) => r.bottom));
    return { left, top, width: right - left, height: bottom - top, right, bottom };
  }

  function run({ steps, labels }) {
    const M = window.Motion;
    return new Promise((resolve) => {
      const live = steps.filter((s) => {
        const tg = s.target();
        return Array.isArray(tg) ? tg.some(Boolean) : !!tg;
      });
      if (!live.length) { resolve(); return; }

      const root = document.createElement('div');
      root.className = 'tour';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', labels.aria);
      root.innerHTML = `
        <div class="tour-spot" aria-hidden="true"><span class="tour-ring"></span></div>
        <div class="tour-card">
          <div class="tour-top"><span class="tour-count"></span><button class="tour-skip" type="button">${esc(labels.skip)}</button></div>
          <div class="tour-content"><h3 class="tour-title" id="tourTitle"></h3><p class="tour-text"></p></div>
          <div class="tour-foot">
            <div class="tour-dots" aria-hidden="true">${live.map(() => '<i></i>').join('')}</div>
            <div class="tour-btns">
              <button class="btn tour-back" type="button">${esc(labels.back)}</button>
              <button class="btn primary tour-next" type="button"></button>
            </div>
          </div>
        </div>`;
      document.body.append(root);
      root.setAttribute('aria-labelledby', 'tourTitle');
      const spot = $('.tour-spot', root);
      const card = $('.tour-card', root);
      const back = $('.tour-back', root);
      const next = $('.tour-next', root);
      let idx = -1;
      let busy = false;

      function place(first) {
        const s = live[idx];
        const r = rectOf(s.target());
        if (!r) return;
        const x = Math.max(4, r.left - PAD);
        const y = Math.max(4, r.top - PAD);
        const w = Math.min(innerWidth - x - 4, r.width + PAD * 2);
        const h = Math.min(innerHeight - y - 4, r.height + PAD * 2);
        if (first) spot.style.transition = 'none';
        Object.assign(spot.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
        if (first) { spot.getBoundingClientRect(); spot.style.transition = ''; }

        // card: below, above, right or left of the spot, whichever has room
        const cw = card.offsetWidth;
        const ch = card.offsetHeight;
        const gap = 16;
        let cx;
        let cy;
        if (y + h + gap + ch < innerHeight - 8) { cy = y + h + gap; cx = x + w / 2 - cw / 2; }
        else if (y - gap - ch > 8) { cy = y - gap - ch; cx = x + w / 2 - cw / 2; }
        else if (x + w + gap + cw < innerWidth - 8) { cx = x + w + gap; cy = y + h / 2 - ch / 2; }
        else { cx = x - gap - cw; cy = y + h / 2 - ch / 2; }
        cx = Math.max(10, Math.min(innerWidth - cw - 10, cx));
        cy = Math.max(10, Math.min(innerHeight - ch - 10, cy));
        if (first) card.style.transition = 'none';
        card.style.left = `${cx}px`;
        card.style.top = `${cy}px`;
        if (first) { card.getBoundingClientRect(); card.style.transition = ''; }
      }

      async function go(i) {
        if (busy || i < 0) return;
        if (i >= live.length) { finish(); return; }
        busy = true;
        const first = idx === -1;
        const dir = i > idx ? 1 : -1;
        if (!first) await M.anim($('.tour-content', root), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 12}px)` }], { duration: 150, easing: M.IN, fill: 'forwards' });
        idx = i;
        const s = live[idx];
        const tg = s.target();
        const el0 = Array.isArray(tg) ? tg.find(Boolean) : tg;
        const r0 = el0 && el0.getBoundingClientRect();
        if (r0 && (r0.top < 0 || r0.bottom > innerHeight)) {
          el0.scrollIntoView({ block: 'center', behavior: M.reduced() ? 'auto' : 'smooth' });
          await M.wait(420);
        }
        $('.tour-title', root).textContent = s.title;
        $('.tour-text', root).textContent = s.text;
        $('.tour-count', root).textContent = labels.of(idx + 1, live.length);
        next.textContent = idx === live.length - 1 ? labels.done : labels.next;
        back.disabled = idx === 0;
        Array.from($('.tour-dots', root).children).forEach((d, k) => d.classList.toggle('on', k <= idx));
        $('.tour-content', root).getAnimations().forEach((a) => a.cancel());
        place(first);
        if (first) {
          M.anim(root, [{ opacity: 0 }, { opacity: 1 }], { duration: 450 });
          M.anim(spot, [{ transform: 'scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700 });
          M.anim(card, [{ opacity: 0, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'none' }], { delay: 200, duration: 560, easing: M.SPRING });
        } else {
          M.anim($('.tour-content', root), [{ opacity: 0, transform: `translateX(${dir * 14}px)` }, { opacity: 1, transform: 'none' }], { delay: 160, duration: 380 });
        }
        M.anim($('.tour-ring', spot), [{ opacity: .8, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.12)' }], { delay: 520, duration: 900, easing: 'ease-out', fill: 'none' });
        next.focus({ preventScroll: true });
        busy = false;
      }

      async function finish() {
        if (busy === 'done') return;
        busy = 'done';
        window.removeEventListener('resize', onResize);
        document.removeEventListener('keydown', onKey, true);
        await Promise.all([
          M.anim(spot, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.4)' }], { duration: 420, easing: M.IN, fill: 'forwards' }),
          M.anim(card, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.96)' }], { duration: 260, easing: M.IN, fill: 'forwards' }),
          M.anim(root, [{ opacity: 1 }, { opacity: 0 }], { delay: 120, duration: 360, fill: 'forwards' }),
        ]);
        root.remove();
        resolve();
      }

      const onResize = () => { if (idx >= 0) place(false); };
      const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
        else if (e.key === 'Tab') {
          const f = Array.from(card.querySelectorAll('button:not(:disabled)'));
          const k = f.indexOf(document.activeElement);
          e.preventDefault();
          f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
      };
      next.addEventListener('click', () => go(idx + 1));
      back.addEventListener('click', () => go(idx - 1));
      $('.tour-skip', root).addEventListener('click', finish);
      window.addEventListener('resize', onResize);
      document.addEventListener('keydown', onKey, true);
      go(0);
    });
  }

  return { run };
})();
