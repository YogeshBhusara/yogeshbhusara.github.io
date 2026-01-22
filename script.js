// Circular name logo – build letter spans, place on circle, JS-driven rotation
(function initNameLogo() {
    const el = document.getElementById('name-logo');
    if (!el) return;
    const text = (el.getAttribute('data-text') || 'REPEAT*ITERATE*DESIGN*').trim();
    const letters = Array.from(text);
    const tau = Math.PI * 2;

    const DEG_PER_SEC_NORMAL = 360 / 20;
    const DEG_PER_SEC_HOVER = 360 / 5;
    const SPEED_EASE = 0.08;

    let rotation = 0;
    let currentSpeed = DEG_PER_SEC_NORMAL;
    let targetSpeed = DEG_PER_SEC_NORMAL;
    let lastTime = null;
    let rafId = null;

    function layout() {
        const size = el.offsetWidth || 130;
        const radius = size * 0.4;
        el.innerHTML = '';
        letters.forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter;
            const angle = (tau / letters.length) * i - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            span.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${(360 / letters.length) * i}deg)`;
            el.appendChild(span);
        });
    }

    function tick(now) {
        lastTime = lastTime != null ? lastTime : now;
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        currentSpeed += (targetSpeed - currentSpeed) * SPEED_EASE;
        rotation += currentSpeed * dt;
        el.style.transform = `rotate(${rotation}deg)`;

        rafId = requestAnimationFrame(tick);
    }

    function startSpin() {
        lastTime = null;
        rafId = requestAnimationFrame(tick);
    }

    el.addEventListener('mouseenter', function () {
        targetSpeed = DEG_PER_SEC_HOVER;
    });
    el.addEventListener('mouseleave', function () {
        targetSpeed = DEG_PER_SEC_NORMAL;
    });

    layout();
    startSpin();

    let resizeT;
    window.addEventListener('resize', function () {
        clearTimeout(resizeT);
        resizeT = setTimeout(layout, 150);
    });
})();

// Smooth scrolling for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});