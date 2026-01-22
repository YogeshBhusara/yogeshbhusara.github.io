// Circular name logo – build letter spans and place on circle
(function initNameLogo() {
    const el = document.getElementById('name-logo');
    if (!el) return;
    const text = (el.getAttribute('data-text') || 'REPEAT*ITERATE*DESIGN*').trim();
    const letters = Array.from(text);
    const tau = Math.PI * 2;
    const INLINE_BREAKPOINT = 1100;

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

    layout();
    let resizeT;
    window.addEventListener('resize', function () {
        clearTimeout(resizeT);
        resizeT = setTimeout(layout, 150);
    });

    // Scroll past About OR viewport < 1100px: logo moves next to name (inline)
    const about = document.querySelector('.about');
    if (!about) return;

    function updateInlineState() {
        const wide = window.innerWidth >= INLINE_BREAKPOINT;
        const had = el.classList.contains('name-logo--inline');
        if (!wide) {
            el.classList.add('name-logo--inline');
        } else {
            const rect = about.getBoundingClientRect();
            el.classList.toggle('name-logo--inline', rect.bottom < 0);
        }
        if (had !== el.classList.contains('name-logo--inline')) layout();
    }

    window.addEventListener('scroll', updateInlineState, { passive: true });
    window.addEventListener('resize', updateInlineState);
    updateInlineState();
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