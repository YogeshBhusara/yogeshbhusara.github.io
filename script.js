/**
 * script.js — Smooth in-page scrolling + staggered scroll reveal.
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

// Gentle content fade on scroll — split into chunks, stagger ~100ms
(function initReveals() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    const targets = [];

    // Page titles: label / title / lede as separate chunks
    document.querySelectorAll('.page-title-block').forEach(function (block) {
        Array.prototype.forEach.call(block.children, function (child) {
            targets.push(child);
        });
    });

    // Doc sections: label + each body child (not the whole section as one blob)
    document.querySelectorAll('.doc-section').forEach(function (section) {
        const label = section.querySelector(':scope > .doc-section__label');
        const body = section.querySelector(':scope > .doc-section__body');
        if (label) targets.push(label);
        if (body) {
            Array.prototype.forEach.call(body.children, function (child) {
                targets.push(child);
            });
        } else {
            targets.push(section);
        }
    });

    if (!targets.length) return;

    const STAGGER_MS = 100;
    const groupDelay = new WeakMap();

    targets.forEach(function (el) {
        el.classList.add('reveal');
    });

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const parent = el.closest('.doc-section, .page-title-block') || el.parentElement;
            const nextIndex = groupDelay.get(parent) || 0;
            groupDelay.set(parent, nextIndex + 1);
            el.style.setProperty('--reveal-delay', nextIndex * STAGGER_MS + 'ms');
            el.classList.add('is-revealed');
            io.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    targets.forEach(function (el) {
        io.observe(el);
    });
})();
