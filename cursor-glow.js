/**
 * Cursor-following spotlight effect (Antigravity-style).
 * Updates CSS variables --mouse-x and --mouse-y for a radial gradient overlay.
 */
(function () {
  var smooth = { x: 0.5, y: 0.5 };
  var target = { x: 0.5, y: 0.5 };
  var ease = 0.12;

  function setPosition(x, y) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    target.x = w ? x / w : 0.5;
    target.y = h ? y / h : 0.5;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    smooth.x = lerp(smooth.x, target.x, ease);
    smooth.y = lerp(smooth.y, target.y, ease);
    document.documentElement.style.setProperty('--mouse-x', (smooth.x * 100).toFixed(2) + '%');
    document.documentElement.style.setProperty('--mouse-y', (smooth.y * 100).toFixed(2) + '%');
    requestAnimationFrame(tick);
  }

  function init() {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      document.documentElement.classList.add('no-cursor-glow');
      return;
    }
    document.documentElement.classList.add('cursor-glow-ready');
    window.addEventListener('mousemove', function (e) {
      setPosition(e.clientX, e.clientY);
    }, { passive: true });
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
