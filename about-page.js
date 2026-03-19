/**
 * about-page.js — Parallax for About hero background + content.
 */
(function() {
    const hero = document.querySelector('.about-hero');
    if (!hero) return;

    const media = hero.querySelector('.about-hero-media');
    const content = hero.querySelector('.about-content--parallax');

    // Prefer GSAP+ScrollTrigger when available (already loaded on this site).
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && media && content) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(media, {
            y: 60,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.to(content, {
            y: -24,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        return;
    }

    // Fallback: lightweight rAF scroll parallax.
    if (!media || !content) return;

    let raf = 0;
    const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = 0;
            const rect = hero.getBoundingClientRect();
            const viewH = window.innerHeight || 1;
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));

            const mediaY = (clamped - 0.5) * 120; // -60..60
            const contentY = (0.5 - clamped) * 48; // 24..-24

            media.style.transform = `translate3d(0, ${mediaY.toFixed(2)}px, 0)`;
            content.style.transform = `translate3d(0, ${contentY.toFixed(2)}px, 0)`;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
})();

