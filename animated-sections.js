/**
 * Scroll-triggered section animations (AnimatedContent-style).
 * Uses GSAP + ScrollTrigger. Sections animate in as they enter the viewport.
 */
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll('main > section');
    if (!sections.length) return;

    const config = {
        distance: 40,
        direction: 'vertical',
        reverse: false,
        duration: 1.4,
        ease: 'power2.out',
        initialOpacity: 0,
        animateOpacity: true,
        scale: 1,
        threshold: 0.1,
        delay: 0
    };

    const axis = config.direction === 'horizontal' ? 'x' : 'y';
    const offset = config.reverse ? -config.distance : config.distance;
    const startPct = (1 - config.threshold) * 100;
    const triggerStart = 'top ' + startPct + '%';

    const triggers = [];

    sections.forEach(function (el) {
        gsap.set(el, {
            [axis]: offset,
            scale: config.scale,
            opacity: config.animateOpacity ? config.initialOpacity : 1,
            visibility: 'visible'
        });

        const tl = gsap.timeline({ paused: true, delay: config.delay });
        tl.to(el, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration: config.duration,
            ease: config.ease
        });

        const st = ScrollTrigger.create({
            trigger: el,
            start: triggerStart,
            once: true,
            onEnter: function () { tl.play(); }
        });
        triggers.push({ el, tl, st });
    });

    function playVisible() {
        const vh = window.innerHeight * (startPct / 100);
        triggers.forEach(function (item) {
            const top = item.el.getBoundingClientRect().top;
            if (top < vh && item.tl.progress() === 0) item.tl.play();
        });
    }

    playVisible();
    ScrollTrigger.addEventListener('refresh', playVisible);
    window.addEventListener('load', function () {
        ScrollTrigger.refresh();
        playVisible();
    });
})();
