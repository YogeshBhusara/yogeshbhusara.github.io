/**
 * nav-glass.js — Liquid glass nav pill (inspired by jeantimex/glass-effect-webgpu).
 * CSS multi-layer glass + cursor specular + press squash. Falls back to backdrop-filter CSS alone.
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
      '<div class="nav-glass__tint"></div>' +
      '<div class="nav-glass__bezel"></div>' +
      '<div class="nav-glass__specular nav-glass__specular--rim"></div>' +
      '<div class="nav-glass__specular nav-glass__specular--layer"></div>' +
      '<div class="nav-glass__chromatic"></div>';

    const content = document.createElement('div');
    content.className = 'nav-glass__content';
    while (pill.firstChild) {
      content.appendChild(pill.firstChild);
    }

    pill.appendChild(stack);
    pill.appendChild(content);

    pill.style.setProperty('--glass-light-x', '28%');
    pill.style.setProperty('--glass-light-y', '18%');

    if (reduced) return;

    function setLight(clientX, clientY) {
      const rect = pill.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      pill.style.setProperty('--glass-light-x', x.toFixed(1) + '%');
      pill.style.setProperty('--glass-light-y', y.toFixed(1) + '%');
    }

    pill.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        setLight(e.clientX, e.clientY);
      },
      { passive: true }
    );

    pill.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      setLight(e.clientX, e.clientY);
    });

    pill.addEventListener(
      'pointerdown',
      (e) => {
        if (e.button !== 0) return;
        pill.classList.add('nav-glass--pressed');
      },
      { passive: true }
    );

    function releasePress() {
      pill.classList.remove('nav-glass--pressed');
    }

    pill.addEventListener('pointerup', releasePress);
    pill.addEventListener('pointercancel', releasePress);
    pill.addEventListener('pointerleave', releasePress);
  });
})();
