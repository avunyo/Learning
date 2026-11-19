/*
  One motion language for the whole site.
  EASE   - things arriving (expo-out): fast start, soft landing
  SPRING - things popping (small overshoot): pins, tiles, checks
  IN     - things leaving
  Everything resolves instantly when the person prefers reduced motion.
*/
window.Motion = (() => {
  const EASE = 'cubic-bezier(.16, 1, .3, 1)';
  const SPRING = 'cubic-bezier(.34, 1.56, .64, 1)';
  const IN = 'cubic-bezier(.5, 0, .75, 0)';
  const SWING = 'cubic-bezier(.65, 0, .35, 1)';
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mq.matches;

  function anim(el, keyframes, opts = {}) {
    if (!el || !el.animate) return Promise.resolve();
    const o = Object.assign({ duration: 520, easing: EASE, fill: 'backwards' }, opts);
    if (reduced()) { o.duration = 1; o.delay = 0; }
    const a = el.animate(keyframes, o);
    return a.finished.catch(() => {});
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

  /* fade + rise; the most common entrance */
  function rise(el, delay = 0, dist = 14, dur = 560) {
    return anim(el, [{ opacity: 0, transform: `translateY(${dist}px)` }, { opacity: 1, transform: 'none' }], { delay, duration: dur });
  }
  function pop(el, delay = 0, dur = 480) {
    return anim(el, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { delay, duration: dur, easing: SPRING });
  }
  function staggerList(list, fn, step = 45, start = 0) {
    return Promise.all(Array.from(list).map((el, i) => fn(el, start + i * step)));
  }

  /* View Transitions: crossfade the whole page, or reveal it with a circle from a point */
  function viewTransition(update, origin) {
    if (!document.startViewTransition || reduced()) { update(); return Promise.resolve(); }
    const root = document.documentElement;
    if (origin) root.classList.add('vt-reveal');
    const vt = document.startViewTransition(update);
    if (origin) {
      vt.ready.then(() => {
        const { x, y } = origin;
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 700, easing: SWING, pseudoElement: '::view-transition-new(root)' });
      }).catch(() => {});
    }
    return vt.finished.finally(() => root.classList.remove('vt-reveal'));
  }

  /* Move an element visually from rect `from` onto rect `to` (FLIP). */
  function flyTo(el, to, opts = {}) {
    const from = el.getBoundingClientRect();
    const sx = to.width / from.width;
    const sy = to.height / from.height;
    const dx = to.left - from.left;
    const dy = to.top - from.top;
    el.style.transformOrigin = '0 0';
    return anim(el, [
      { transform: 'none', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: opts.endOpacity == null ? 1 : opts.endOpacity },
    ], { duration: opts.duration || 900, easing: opts.easing || SWING, fill: 'forwards' });
  }

  return { EASE, SPRING, IN, SWING, reduced, anim, wait, rise, pop, staggerList, viewTransition, flyTo };
})();
