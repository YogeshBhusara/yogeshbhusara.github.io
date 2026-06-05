/**
 * nav-glass.js — Liquid glass nav pill (inspired by TechSupportz/native_glass_navbar).
 * CSS multi-layer glass + press squash. Falls back to backdrop-filter CSS alone.
 */
(function initNavGlass() {
  'use strict';

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsBackdrop =
    typeof CSS !== 'undefined' &&
    (CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));

  const pills = document.querySelectorAll('.bento-header__pill:not([data-nav-glass-ready])');
  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.dataset.navGlassReady = 'true';
    if (!supportsBackdrop) return;

    pill.classList.add('nav-glass');

    const stack = document.createElement('div');
    stack.className = 'nav-glass__stack';
    stack.setAttribute('aria-hidden', 'true');
    stack.innerHTML =
      '<div class="nav-glass__blur nav-glass__blur--base"></div>' +
      '<div class="nav-glass__blur nav-glass__blur--edge"></div>' +
      '<div class="nav-glass__surface nav-glass__surface--dome"></div>' +
      '<div class="nav-glass__tint"></div>' +
      '<div class="nav-glass__bezel"></div>' +
      '<div class="nav-glass__specular nav-glass__specular--rim"></div>';

    const content = document.createElement('div');
    content.className = 'nav-glass__content';
    while (pill.firstChild) {
      content.appendChild(pill.firstChild);
    }

    pill.appendChild(stack);
    pill.appendChild(content);

    pill.style.setProperty('--glass-squash-x', '0');
    pill.style.setProperty('--glass-squash-y', '0');

    if (reduced) return;

    let pressOriginX = 0;
    let pressOriginY = 0;

    function setDragSquash(clientX, clientY) {
      const rect = pill.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dx = (clientX - pressOriginX) / rect.width;
      const dy = (clientY - pressOriginY) / rect.height;
      const dragSquash =
        parseFloat(getComputedStyle(pill).getPropertyValue('--glass-drag-squash')) || 1;
      pill.style.setProperty('--glass-squash-x', (dx * 0.045 * dragSquash).toFixed(4));
      pill.style.setProperty('--glass-squash-y', (Math.abs(dy) * 0.06 * dragSquash).toFixed(4));
    }

    function resetSquash() {
      pill.style.setProperty('--glass-squash-x', '0');
      pill.style.setProperty('--glass-squash-y', '0');
    }

    pill.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        if (pill.classList.contains('nav-glass--pressed')) {
          setDragSquash(e.clientX, e.clientY);
        }
      },
      { passive: true }
    );

    pill.addEventListener(
      'pointerdown',
      (e) => {
        if (e.button !== 0) return;
        pressOriginX = e.clientX;
        pressOriginY = e.clientY;
        resetSquash();
        pill.classList.add('nav-glass--pressed');
      },
      { passive: true }
    );

    function releasePress() {
      const releaseSquash =
        parseFloat(getComputedStyle(pill).getPropertyValue('--glass-release-squash')) || 1;
      if (releaseSquash > 0) {
        pill.style.setProperty('--glass-squash-y', (0.018 * releaseSquash).toFixed(4));
        window.setTimeout(
          resetSquash,
          180 / (parseFloat(getComputedStyle(pill).getPropertyValue('--glass-speed')) || 1)
        );
      } else {
        resetSquash();
      }
      pill.classList.remove('nav-glass--pressed');
    }

    pill.addEventListener('pointerup', releasePress);
    pill.addEventListener('pointercancel', releasePress);
    pill.addEventListener('pointerleave', releasePress);
  });
})();
