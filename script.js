/**
 * script.js — Smooth in-page scrolling + subtle scroll reveal.
 */

// Smooth scrolling for in-page anchors (including dynamically added links)
document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    // Case study overlay scrolls its own container via work-page.js
    if (anchor.closest('.work-detail-toc__link, .work-detail-toc')) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Gentle content fade on scroll (CSS-driven; respects prefers-reduced-motion)
(function initReveals() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    // Masthead stays visible on load; reveal lower sections only
    const targets = Array.from(document.querySelectorAll('.doc-section, .page-title-block'));
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    targets.forEach((el) => io.observe(el));
})();
