/**
 * script.js — Smooth scrolling + reveal motion.
 */

// Custom cursor: lagging ring + dot (fine pointer only; similar to educalvolopez.com-style motion)
(function initCustomCursor() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (reduced || coarse || !fine) return;

    const INTERACTIVE =
        'a, button, input, textarea, select, [role="button"], [data-cursor-hover], ' +
        '.theme-toggle, .bento-nav__link, .bento-logo, ' +
        '.home-project-card, .home-article-card, ' +
        '.blog-posts-link, .editorial-social-link, .about-connect, ' +
        '.hc-grid-cell, ' +
        '.work-detail-close, .work-detail-next, .work-detail-toc__link, ' +
        '.experience-cv-button, .contact-email, .sitemap-list a';

    const root = document.createElement('div');
    root.className = 'cursor-follow-root';
    root.setAttribute('aria-hidden', 'true');
    const ring = document.createElement('div');
    ring.className = 'cursor-follow-ring';
    const dot = document.createElement('div');
    dot.className = 'cursor-follow-dot';
    root.appendChild(ring);
    root.appendChild(dot);
    document.body.appendChild(root);
    document.documentElement.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dotX = mx;
    let dotY = my;
    let ringX = mx;
    let ringY = my;
    let rafId = 0;

    const DOT_LERP = 0.42;
    const RING_LERP = 0.14;

    function setHoverFromEvent(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el.closest(INTERACTIVE)) {
            root.classList.add('is-hover');
        } else {
            root.classList.remove('is-hover');
        }
    }

    function onMove(e) {
        mx = e.clientX;
        my = e.clientY;
        setHoverFromEvent(e);
    }

    function tick() {
        dotX += (mx - dotX) * DOT_LERP;
        dotY += (my - dotY) * DOT_LERP;
        ringX += (mx - ringX) * RING_LERP;
        ringY += (my - ringY) * RING_LERP;
        dot.style.transform = 'translate3d(' + dotX + 'px,' + dotY + 'px,0)';
        ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0)';
        rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', function () {
        root.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', function () {
        root.classList.remove('is-hidden');
    });

    rafId = requestAnimationFrame(tick);
})();

// Circular name logo – build letter spans, place on circle, JS-driven rotation
(function initNameLogo() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const el = document.getElementById('name-logo');
    if (!el) return;

    const text = (el.getAttribute('data-text') || 'DESIGN*VIBECODE*REPEAT').trim();
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
        const size = el.offsetWidth || 150;
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
        el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        rafId = requestAnimationFrame(tick);
    }

    function startSpin() {
        if (rafId != null) cancelAnimationFrame(rafId);
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
        resizeT = setTimeout(() => {
            layout();
            startSpin();
        }, 150);
    });
})();

// BorderGlow (vanilla): update CSS vars based on pointer proximity to edges
(function initBorderGlowCards() {
    const cards = Array.from(document.querySelectorAll('.border-glow-card'));
    if (!cards.length) return;

    function getCenterOfElement(el) {
        const rect = el.getBoundingClientRect();
        return [rect.width / 2, rect.height / 2];
    }

    function getEdgeProximity(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx;
        const dy = y - cy;
        let kx = Infinity;
        let ky = Infinity;
        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);
        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    }

    function getCursorAngle(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx;
        const dy = y - cy;
        if (dx === 0 && dy === 0) return 0;
        const radians = Math.atan2(dy, dx);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        return degrees;
    }

    function onMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const edge = getEdgeProximity(card, x, y);
        const angle = getCursorAngle(card, x, y);
        card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    }

    function onLeave(card) {
        card.style.setProperty('--edge-proximity', `0`);
    }

    cards.forEach((card) => {
        card.addEventListener('pointermove', (e) => onMove(card, e), { passive: true });
        card.addEventListener('pointerleave', () => onLeave(card), { passive: true });
    });
})();

// Home hero: variable font proximity effect for the name
(function initEditorialNameProximity() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heading = document.querySelector('.editorial-hero .editorial-name');
    const container = document.querySelector('.editorial-hero');
    if (reduced || !heading || !container) return;

    const label = (heading.textContent || '').trim();
    if (!label) return;

    const accentWord = (heading.getAttribute('data-accent-word') || '').trim();
    const radius = 120;
    const fromWeight = 500;
    const toWeight = 650;
    const mouse = { x: -9999, y: -9999, active: false };
    const last = { x: null, y: null, active: false };

    function lerp(from, to, amount) {
        return from + (to - from) * amount;
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function falloff(dist) {
        const norm = Math.min(Math.max(1 - dist / radius, 0), 1);
        return norm;
    }

    const fragment = document.createDocumentFragment();
    const letterRefs = [];
    let letterIndex = 0;

    label.split(' ').forEach(function (word, wordIndex, words) {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'editorial-name__word';
        if (accentWord && word === accentWord) {
            wordSpan.classList.add('editorial-name__accent');
        }

        Array.from(word).forEach(function (letter) {
            const span = document.createElement('span');
            span.className = 'editorial-name__letter';
            span.textContent = letter;
            span.style.fontWeight = String(fromWeight);
            wordSpan.appendChild(span);
            letterRefs[letterIndex++] = span;
        });

        fragment.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'editorial-name__space';
            space.innerHTML = '&nbsp;';
            fragment.appendChild(space);
        }
    });

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = label;

    heading.textContent = '';
    heading.classList.add('variable-proximity-ready');
    heading.setAttribute('aria-label', label);
    heading.appendChild(fragment);
    heading.appendChild(srOnly);

    function updatePointerPosition(clientX, clientY) {
        const rect = container.getBoundingClientRect();
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;
    }

    container.addEventListener('mousemove', function (e) {
        updatePointerPosition(e.clientX, e.clientY);
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        updatePointerPosition(touch.clientX, touch.clientY);
    }, { passive: true });

    container.addEventListener('mouseleave', function () {
        mouse.active = false;
    });

    container.addEventListener('touchend', function () {
        mouse.active = false;
    }, { passive: true });

    function tick() {
        if (
            last.x === mouse.x &&
            last.y === mouse.y &&
            last.active === mouse.active
        ) {
            requestAnimationFrame(tick);
            return;
        }

        last.x = mouse.x;
        last.y = mouse.y;
        last.active = mouse.active;

        const containerRect = container.getBoundingClientRect();

        letterRefs.forEach(function (letterRef) {
            if (!letterRef) return;

            if (!mouse.active) {
                letterRef.style.fontWeight = String(fromWeight);
                return;
            }

            const rect = letterRef.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2 - containerRect.left;
            const centerY = rect.top + rect.height / 2 - containerRect.top;
            const dist = distance(mouse.x, mouse.y, centerX, centerY);

            if (dist >= radius) {
                letterRef.style.fontWeight = String(fromWeight);
                return;
            }

            const amount = falloff(dist);
            const weight = Math.round(lerp(fromWeight, toWeight, amount));
            letterRef.style.fontWeight = String(weight);
        });

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();

// Home hero: TiltedCard-style 3D tilt for avatar (vanilla; reduced-motion + coarse-pointer safe)
(function initTiltedAvatar() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (reduced || coarse || !fine) return;

    const figure = document.querySelector('[data-tilt-avatar]');
    if (!figure) return;

    const inner = figure.querySelector('.tilted-avatar__inner');
    const caption = figure.querySelector('.tilted-avatar__caption');
    if (!inner) return;

    const amplitude = Number(figure.getAttribute('data-tilt-amplitude')) || 12;
    const hoverScale = Number(figure.getAttribute('data-tilt-scale')) || 1.05;
    const tooltip = figure.getAttribute('data-tilt-tooltip') || '';
    if (caption) caption.textContent = tooltip;

    let raf = 0;
    let lastY = 0;
    const state = {
        active: false,
        rx: 0,
        ry: 0,
        x: 0,
        y: 0,
        capRot: 0,
    };

    function setVars() {
        raf = 0;
        figure.style.setProperty('--tilt-rx', state.rx.toFixed(3) + 'deg');
        figure.style.setProperty('--tilt-ry', state.ry.toFixed(3) + 'deg');
        figure.style.setProperty('--tilt-scale', (state.active ? hoverScale : 1).toFixed(3));
        figure.style.setProperty('--tilt-x', (state.x * 100).toFixed(2) + '%');
        figure.style.setProperty('--tilt-y', (state.y * 100).toFixed(2) + '%');

        if (caption) {
            // Caption follows pointer within the figure.
            figure.style.setProperty('--tilt-cx', Math.round(state.cx) + 'px');
            figure.style.setProperty('--tilt-cy', Math.round(state.cy) + 'px');
            figure.style.setProperty('--tilt-cap-rot', state.capRot.toFixed(2) + 'deg');
            figure.style.setProperty('--tilt-cap-opacity', state.active ? '1' : '0');
        }
    }

    function schedule() {
        if (raf) return;
        raf = requestAnimationFrame(setVars);
    }

    function onMove(e) {
        const rect = figure.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        const nx = (px - rect.width / 2) / (rect.width / 2);
        const ny = (py - rect.height / 2) / (rect.height / 2);

        state.rx = ny * -amplitude;
        state.ry = nx * amplitude;
        state.x = Math.min(Math.max(px / rect.width, 0), 1);
        state.y = Math.min(Math.max(py / rect.height, 0), 1);

        // Tooltip position in figure space.
        state.cx = px + 10;
        state.cy = py + 12;

        const velocityY = (py - rect.height / 2) - lastY;
        state.capRot = -velocityY * 0.6;
        lastY = (py - rect.height / 2);

        schedule();
    }

    function onEnter() {
        state.active = true;
        figure.classList.add('is-active');
        schedule();
    }

    function onLeave() {
        state.active = false;
        state.rx = 0;
        state.ry = 0;
        state.capRot = 0;
        figure.classList.remove('is-active');
        schedule();
    }

    figure.addEventListener('mousemove', onMove, { passive: true });
    figure.addEventListener('mouseenter', onEnter, { passive: true });
    figure.addEventListener('mouseleave', onLeave, { passive: true });
})();

// Smooth scrolling for in-page anchors (including dynamically added links)
document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    // Work detail modal scrolls its own container via work-page.js
    if (anchor.closest('.work-detail-toc__link, .work-detail-toc')) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Desses-like motion: reveal text + blocks on scroll (prefers-reduced-motion safe)
(function initReveals() {
    const root = document.documentElement;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        root.classList.add('reveal-reduced');
        return;
    }

    // Targets (works across pages without manual markup)
    const selectors = [
        // Generic content blocks
        '.editorial-page > *:not(script):not(style)',
        '.editorial-page section',
        '.editorial-page .editorial-section',
        '.editorial-page .home-projects-wrap',
        '.editorial-page .home-articles-wrap',
        '.editorial-avatar',
        '.editorial-name',
        '.editorial-lede > p',
        '.playground-lede',
        '.editorial-section-title',
        '.home-project-card',
        '.home-article-card',
        '.blog-posts-item',
        '.blog-post-card',
        '.playground-honeycomb-track',
        '.work-page-headline',
        '.about .work-page-headline',
        '.experience-item',
        '.footer'
    ];

    const elements = Array.from(new Set(
        selectors.flatMap((s) => Array.from(document.querySelectorAll(s)))
    )).filter(function (el) {
        if (!el) return false;
        if (el.matches('footer.editorial-footer')) return false;
        return true;
    });

    if (!elements.length) return;

    // Prefer animating leaf nodes over wrapper containers (prevents double motion).
    const isWrapper = (el) =>
        !!el.querySelector(
            '.home-project-card, .home-article-card, .blog-posts-item, .blog-post-card, .editorial-lede > p'
        );
    const revealables = elements.filter((el) => !isWrapper(el) || el.matches('.home-projects-wrap, .home-articles-wrap, .editorial-section'));

    // Mark as revealable and set stagger indices per container.
    revealables.forEach((el) => el.classList.add('reveal'));

    const staggerContainers = [
        '.editorial-lede',
        '.home-projects-scroller',
        '.home-articles-scroller',
        '#work-list',
        '#blog-posts',
        '.experience-list',
        '.playground-honeycomb__stage'
    ];

    staggerContainers.forEach((sel) => {
        const container = document.querySelector(sel);
        if (!container) return;
        const kids = Array.from(container.querySelectorAll('.reveal'));
        kids.forEach((el, i) => el.style.setProperty('--reveal-i', String(i)));
    });

    const revealNow = (el) => {
        if (!el || el.classList.contains('is-revealed')) return;
        el.classList.add('is-revealed');

        // If GSAP exists, use it for a smoother, Desses-like ease.
        if (typeof window.gsap !== 'undefined') {
            const i = Number(getComputedStyle(el).getPropertyValue('--reveal-i')) || 0;
            window.gsap.fromTo(
                el,
                { opacity: 0, y: 18, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    delay: Math.min(i * 0.06, 0.42),
                    ease: 'power3.out',
                    overwrite: 'auto'
                }
            );
        }
    };

    if (typeof IntersectionObserver === 'undefined') {
        revealables.forEach(revealNow);
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealNow(entry.target);
            io.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    revealables.forEach((el) => io.observe(el));
})();

// Home: horizontal project + article rows — header arrows scroll each list
(function initHomeHorizontalArrowScroll() {
    const buttons = Array.from(document.querySelectorAll('.editorial-scroll-button[data-scroll-target]'));

    if (!buttons.length) return;

    const scrollerMap = new Map();

    function getScrollStep(el) {
        const firstCard = el.firstElementChild;
        if (!firstCard) return el.clientWidth * 0.85;
        const gap = parseFloat(window.getComputedStyle(el).columnGap || window.getComputedStyle(el).gap || '0');
        return firstCard.getBoundingClientRect().width + gap;
    }

    function updateButtons(el) {
        const meta = scrollerMap.get(el.id);
        if (!meta) return;

        const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
        const atStart = el.scrollLeft <= 4;
        const atEnd = el.scrollLeft >= maxScrollLeft - 4;

        meta.left.disabled = atStart;
        meta.right.disabled = atEnd;
    }

    buttons.forEach(function (button) {
        const targetId = button.getAttribute('data-scroll-target');
        const direction = button.getAttribute('data-scroll-direction');
        const scroller = targetId ? document.getElementById(targetId) : null;

        if (!scroller || (direction !== 'left' && direction !== 'right')) return;

        const existing = scrollerMap.get(targetId) || { el: scroller, left: null, right: null };
        existing[direction] = button;
        scrollerMap.set(targetId, existing);

        button.addEventListener('click', function () {
            const step = getScrollStep(scroller);
            const delta = direction === 'left' ? -step : step;
            scroller.scrollBy({ left: delta, behavior: 'smooth' });
        });
    });

    scrollerMap.forEach(function (meta) {
        if (!meta.left || !meta.right) return;
        const refresh = function () {
            updateButtons(meta.el);
        };

        meta.el.addEventListener('scroll', refresh, { passive: true });
        window.addEventListener('resize', refresh);
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(refresh);
            observer.observe(meta.el);
        }
        refresh();
    });
})();