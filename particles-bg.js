/**
 * Floating particles background (Antigravity-style).
 * Renders behind cursor glow and all interactive content; theme-aware.
 */
(function () {
  var canvas = null;
  var ctx = null;
  var particles = [];
  var raf = 0;
  var particleCount = 100;

  function getParticleRGB() {
    var theme = document.body.getAttribute('data-theme');
    return theme === 'light' ? [0, 0, 0] : [255, 255, 255];
  }

  function createParticles(w, h) {
    var out = [];
    for (var i = 0; i < particleCount; i++) {
      out.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.2 + Math.random() * 1.8,
        opacity: 0.4 + Math.random() * 0.5
      });
    }
    return out;
  }

  function resize() {
    if (!canvas) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    particles = createParticles(w, h);
  }

  function draw() {
    if (!canvas || !ctx) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    var rgb = getParticleRGB();
    var baseOpacity = (document.body.getAttribute('data-theme') === 'light') ? 0.12 : 0.15;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (baseOpacity * p.opacity) + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  function init() {
    canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    var observer = new MutationObserver(function () {
      draw();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
