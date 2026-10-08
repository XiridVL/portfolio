/**
 * Mockup micro-states (spec §12.4): each `[data-play]` frame gets `.is-playing`
 * once, the first time it enters the viewport. The waiting state is CSS-only
 * and gated on `(scripting: enabled)` and motion preference, so without this
 * script (or with reduced motion) the mockups simply render complete.
 */
const playable = document.querySelectorAll<HTMLElement>('[data-play]');

if (!('IntersectionObserver' in window)) {
  playable.forEach((el) => el.classList.add('is-playing'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-playing');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.35 },
  );
  playable.forEach((el) => io.observe(el));
}

export {};
