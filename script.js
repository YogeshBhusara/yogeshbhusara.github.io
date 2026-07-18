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

// Sticky header: soft elevation once the page has scrolled
(function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;
    function update() {
        ticking = false;
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// Gentle content fade on scroll — split into chunks, stagger ~80ms
(function initReveals() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    const STAGGER_MS = 80;
    const LIST_SELECTOR = '.index-list, .row-list, .experience-rows, .contact-links';
    const groupDelay = new WeakMap();

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
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    function observe(el) {
        if (!el || el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        io.observe(el);
    }

    function observeListItems(list) {
        Array.prototype.forEach.call(list.children, function (child) {
            observe(child);
        });
    }

    // Watch lists filled after this script (work-page.js, blog.js)
    function watchList(list) {
        if (list.children.length) {
            observeListItems(list);
            return;
        }

        const mo = new MutationObserver(function () {
            if (!list.children.length) return;
            observeListItems(list);
            mo.disconnect();
        });
        mo.observe(list, { childList: true });
    }

    // Page titles: label / title / lede as separate chunks
    document.querySelectorAll('.page-title-block').forEach(function (block) {
        Array.prototype.forEach.call(block.children, function (child) {
            observe(child);
        });
    });

    // Doc sections: label + each body child; expand list items for stagger
    document.querySelectorAll('.doc-section').forEach(function (section) {
        const label = section.querySelector(':scope > .doc-section__label');
        const body = section.querySelector(':scope > .doc-section__body');
        if (label) observe(label);
        if (body) {
            Array.prototype.forEach.call(body.children, function (child) {
                if (child.matches(LIST_SELECTOR)) {
                    watchList(child);
                } else {
                    observe(child);
                }
            });
        } else {
            observe(section);
        }
    });
})();
