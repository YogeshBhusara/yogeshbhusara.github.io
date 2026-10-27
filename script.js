/**
 * script.js — Smooth in-page scrolling, staggered scroll reveal,
 * and masthead constellation tuck-on-hover.
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

/* Mobile pill dropdown navigation */
(function initMobileNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    const labelEl = document.querySelector('.nav-toggle__label');
    if (!header || !toggle || !nav) return;

    const mq = window.matchMedia('(max-width: 640px)');

    function syncLabel() {
        if (!labelEl) return;
        const current = nav.querySelector('[aria-current="page"]');
        labelEl.textContent = current ? current.textContent.trim() : 'Menu';
    }

    function setOpen(open) {
        header.classList.toggle('is-nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    function close() {
        setOpen(false);
    }

    syncLabel();

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!header.classList.contains('is-nav-open'));
    });

    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (e) {
        if (!header.classList.contains('is-nav-open')) return;
        if (header.querySelector('.site-nav-wrap')?.contains(e.target)) return;
        close();
    });

    function onViewportChange() {
        if (!mq.matches) close();
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onViewportChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onViewportChange);
    }
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

/* Portrait hover: surrounding tiles spring into a stack behind the photo,
   same bounce / scale / tilt as the home work thumbnail. */
(function initConstellationTuck() {
    const root = document.querySelector('.constellation');
    const portrait = root && root.querySelector('.constellation__portrait');
    if (!root || !portrait) return;

    const canHover =
        window.matchMedia &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const TILTS = [-5, 3.5, -2.5, 5.5, -4, 2, -6];
    const STIFFNESS = 92;
    const DAMPING = 11.5;
    const STAGGER = 0.04;
    const HIDE_SCALE = 0.5;

    const tiles = Array.prototype.map.call(
        root.querySelectorAll('.constellation__tile'),
        function (el, i) {
            return {
                el: el,
                x: 0,
                y: 0,
                scale: 1,
                rot: 0,
                vx: 0,
                vy: 0,
                vs: 0,
                vr: 0,
                toX: 0,
                toY: 0,
                toScale: 1,
                toRot: 0,
                wait: i * STAGGER,
                tilt: TILTS[i % TILTS.length]
            };
        }
    );

    if (!tiles.length) return;

    let tucked = false;
    let rafId = 0;
    let lastNow = 0;

    function springToward(value, velocity, target, dt) {
        const next = velocity + ((target - value) * STIFFNESS - velocity * DAMPING) * dt;
        return { value: value + next * dt, velocity: next };
    }

    function applyTile(tile) {
        tile.el.style.translate = tile.x.toFixed(2) + 'px ' + tile.y.toFixed(2) + 'px';
        tile.el.style.scale = String(tile.scale);
        tile.el.style.rotate = tile.rot.toFixed(2) + 'deg';
    }

    function measureTargets() {
        const portraitBox = portrait.getBoundingClientRect();
        const px = portraitBox.left + portraitBox.width / 2;
        const py = portraitBox.top + portraitBox.height / 2;

        tiles.forEach(function (tile) {
            const box = tile.el.getBoundingClientRect();
            const cx = box.left + box.width / 2;
            const cy = box.top + box.height / 2;
            tile.toX = tucked ? tile.x + (px - cx) : 0;
            tile.toY = tucked ? tile.y + (py - cy) : 0;
            tile.toScale = tucked ? HIDE_SCALE : 1;
            tile.toRot = tucked ? tile.tilt : 0;
        });
    }

    function snap() {
        tiles.forEach(function (tile) {
            tile.x = tile.toX;
            tile.y = tile.toY;
            tile.scale = tile.toScale;
            tile.rot = tile.toRot;
            tile.vx = tile.vy = tile.vs = tile.vr = 0;
            applyTile(tile);
        });
    }

    function settled(tile) {
        return (
            Math.abs(tile.toX - tile.x) < 0.4 &&
            Math.abs(tile.toY - tile.y) < 0.4 &&
            Math.abs(tile.toScale - tile.scale) < 0.008 &&
            Math.abs(tile.toRot - tile.rot) < 0.15 &&
            Math.abs(tile.vx) + Math.abs(tile.vy) + Math.abs(tile.vs) + Math.abs(tile.vr) < 0.08
        );
    }

    function tick(now) {
        rafId = 0;
        const dt = Math.min(1 / 30, (now - lastNow) / 1000 || 1 / 60);
        lastNow = now;
        let busy = false;

        tiles.forEach(function (tile) {
            if (tile.wait > 0) {
                tile.wait -= dt;
                busy = true;
                return;
            }

            const nx = springToward(tile.x, tile.vx, tile.toX, dt);
            const ny = springToward(tile.y, tile.vy, tile.toY, dt);
            const ns = springToward(tile.scale, tile.vs, tile.toScale, dt);
            const nr = springToward(tile.rot, tile.vr, tile.toRot, dt);
            tile.x = nx.value;
            tile.vx = nx.velocity;
            tile.y = ny.value;
            tile.vy = ny.velocity;
            tile.scale = ns.value;
            tile.vs = ns.velocity;
            tile.rot = nr.value;
            tile.vr = nr.velocity;
            applyTile(tile);
            if (!settled(tile)) busy = true;
        });

        if (busy) {
            rafId = window.requestAnimationFrame(tick);
            return;
        }

        if (!tucked) {
            root.classList.remove('is-tucking');
            tiles.forEach(function (tile) {
                tile.el.style.animationPlayState = '';
            });
        }
    }

    function beginMotion() {
        tiles.forEach(function (tile, i) {
            tile.wait = i * STAGGER;
            tile.el.style.animationPlayState = 'paused';
        });
        measureTargets();

        if (reduceMotion) {
            snap();
            if (!tucked) {
                root.classList.remove('is-tucking');
                tiles.forEach(function (tile) {
                    tile.el.style.animationPlayState = '';
                });
            }
            return;
        }

        if (!rafId) {
            lastNow = performance.now();
            rafId = window.requestAnimationFrame(tick);
        }
    }

    function start(hide) {
        tucked = hide;
        if (hide) {
            root.classList.add('is-tucking');
            window.requestAnimationFrame(beginMotion);
            return;
        }
        beginMotion();
    }

    portrait.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        start(true);
    });
    portrait.addEventListener('pointerleave', function () {
        start(false);
    });
})();
