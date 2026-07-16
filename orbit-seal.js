/**
 * orbit-seal.js — decorative circular “DESIGN ∗ VIBECODE ∗ REPEAT ∗” badge.
 * Aesthetic only — not interactive.
 */
(function initOrbitSeals() {
  const TEXT = 'DESIGN ∗ VIBECODE ∗ REPEAT ∗ ';

  document.querySelectorAll('[data-orbit-seal]').forEach((el) => {
    if (el.querySelector('.orbit-seal__spin')) return;

    const spin = document.createElement('span');
    spin.className = 'orbit-seal__spin';
    spin.setAttribute('aria-hidden', 'true');

    const chars = Array.from(TEXT);
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'orbit-seal__char';
      span.textContent = ch;
      span.style.setProperty('--i', String(i));
      span.style.setProperty('--n', String(chars.length));
      spin.appendChild(span);
    });

    el.insertBefore(spin, el.firstChild);

    if (!el.querySelector('.orbit-seal__dot')) {
      const dot = document.createElement('span');
      dot.className = 'orbit-seal__dot';
      dot.setAttribute('aria-hidden', 'true');
      el.appendChild(dot);
    }
  });
})();
