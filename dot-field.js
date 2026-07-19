/**
 * dot-field.js — Side-gutter Dot Field (adapted from React Bits DotField).
 * Full-viewport canvas behind the framed content; paper panel covers the center.
 * https://reactbits.dev/backgrounds/dot-field
 */
(function initDotField() {
    'use strict';

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DOT_RADIUS = 1.6;
    const DOT_SPACING = 6;
    const CURSOR_RADIUS = 168;
    const BULGE_STRENGTH = 19;
    const GLOW_RADIUS = 80; // 50% of React Bits default (160)
    const TWO_PI = Math.PI * 2;

    const canvas = document.createElement('canvas');
    canvas.className = 'dot-field';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dprCap = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [];
    let w = 0;
    let h = 0;
    let offsetX = 0;
    let offsetY = 0;
    let rafId = 0;
    let resizeTimer = 0;
    let frameCount = 0;
    let engagement = 0;
    let glowOpacity = 0;
    let fillFrom = 'rgba(138, 132, 120, 0.4)';
    let fillTo = 'rgba(138, 132, 120, 0.28)';
    let glowRgb = '138, 132, 120';

    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };

    function readColors() {
        const styles = getComputedStyle(document.documentElement);
        const muted = styles.getPropertyValue('--ink-muted').trim() || '#8a8478';
        fillFrom = hexToRgba(muted, 0.55);
        fillTo = hexToRgba(muted, 0.38);
        glowRgb = hexToRgbChannels(muted);
    }

    function hexToRgbChannels(hex) {
        const raw = hex.replace('#', '').trim();
        if (raw.length !== 3 && raw.length !== 6) return '138, 132, 120';
        const full = raw.length === 3
            ? raw.split('').map(function (c) { return c + c; }).join('')
            : raw;
        return [
            parseInt(full.slice(0, 2), 16),
            parseInt(full.slice(2, 4), 16),
            parseInt(full.slice(4, 6), 16)
        ].join(', ');
    }

    function hexToRgba(hex, alpha) {
        const raw = hex.replace('#', '').trim();
        if (raw.length !== 3 && raw.length !== 6) {
            return 'rgba(138, 132, 120, ' + alpha + ')';
        }
        const full = raw.length === 3
            ? raw.split('').map(function (c) { return c + c; }).join('')
            : raw;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    function buildDots() {
        const step = DOT_RADIUS + DOT_SPACING;
        const cols = Math.max(1, Math.floor(w / step));
        const rows = Math.max(1, Math.floor(h / step));
        const padX = (w % step) / 2;
        const padY = (h % step) / 2;
        const next = new Array(rows * cols);
        let idx = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const ax = padX + col * step + step / 2;
                const ay = padY + row * step + step / 2;
                next[idx++] = { ax: ax, ay: ay, sx: ax, sy: ay };
            }
        }
        dots = next;
    }

    function doResize() {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        offsetX = rect.left + window.scrollX;
        offsetY = rect.top + window.scrollY;

        canvas.width = w * dprCap;
        canvas.height = h * dprCap;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
        buildDots();
        if (reduced) drawStatic();
    }

    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(doResize, 100);
    }

    function onMouseMove(e) {
        mouse.x = e.pageX - offsetX;
        mouse.y = e.pageY - offsetY;
    }

    function updateMouseSpeed() {
        const dx = mouse.prevX - mouse.x;
        const dy = mouse.prevY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouse.speed += (dist - mouse.speed) * 0.5;
        if (mouse.speed < 0.001) mouse.speed = 0;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
    }

    function drawStatic() {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, fillFrom);
        grad.addColorStop(1, fillTo);
        ctx.fillStyle = grad;
        ctx.beginPath();
        const rad = DOT_RADIUS / 2;
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            ctx.moveTo(d.ax + rad, d.ay);
            ctx.arc(d.ax, d.ay, rad, 0, TWO_PI);
        }
        ctx.fill();
    }

    function tick() {
        frameCount += 1;
        const targetEngagement = Math.min(mouse.speed / 5, 1);
        engagement += (targetEngagement - engagement) * 0.06;
        if (engagement < 0.001) engagement = 0;
        glowOpacity += (engagement - glowOpacity) * 0.08;

        ctx.clearRect(0, 0, w, h);

        if (glowOpacity > 0.01 && mouse.x > -9000) {
            const glow = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, GLOW_RADIUS
            );
            glow.addColorStop(0, 'rgba(' + glowRgb + ', ' + (0.22 * glowOpacity) + ')');
            glow.addColorStop(1, 'rgba(' + glowRgb + ', 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(mouse.x - GLOW_RADIUS, mouse.y - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2);
        }

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, fillFrom);
        grad.addColorStop(1, fillTo);
        ctx.fillStyle = grad;

        const cr = CURSOR_RADIUS;
        const crSq = cr * cr;
        const rad = DOT_RADIUS / 2;
        const eng = engagement;

        ctx.beginPath();
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const dx = mouse.x - d.ax;
            const dy = mouse.y - d.ay;
            const distSq = dx * dx + dy * dy;

            if (distSq < crSq && eng > 0.01) {
                const dist = Math.sqrt(distSq);
                const t = 1 - dist / cr;
                const push = t * t * BULGE_STRENGTH * eng;
                const angle = Math.atan2(dy, dx);
                d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
                d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
            } else {
                d.sx += (d.ax - d.sx) * 0.1;
                d.sy += (d.ay - d.sy) * 0.1;
            }

            ctx.moveTo(d.sx + rad, d.sy);
            ctx.arc(d.sx, d.sy, rad, 0, TWO_PI);
        }
        ctx.fill();

        rafId = requestAnimationFrame(tick);
    }

    readColors();
    doResize();

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('themechange', function () {
        readColors();
        if (reduced) drawStatic();
    });

    if (reduced) {
        drawStatic();
        return;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    setInterval(updateMouseSpeed, 20);
    rafId = requestAnimationFrame(tick);

    window.addEventListener('beforeunload', function () {
        cancelAnimationFrame(rafId);
    });
})();
