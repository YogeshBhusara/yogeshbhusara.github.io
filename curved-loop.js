/**
 * CurvedLoop – curved marquee text along SVG path (vanilla JS).
 * Replaces footer logo; uses "REPEAT*ITERATE*DESIGN*" text.
 */
(function () {
    const marqueeText = 'REPEAT*ITERATE*DESIGN*\u00A0';
    const speed = 2;
    const curveAmount = 200;
    const direction = 'left';
    const interactive = true;

    const pathId = 'curve-footer';
    const pathD = 'M-100,60 Q720,' + (60 + curveAmount) + ' 1540,60';

    const container = document.getElementById('curved-loop');
    if (!container) return;

    const svg = container.querySelector('.curved-loop-svg');
    const measureEl = container.querySelector('.curved-loop-measure');
    const pathEl = container.querySelector('.curved-loop-path');
    const textPathEl = container.querySelector('.curved-loop-textpath');

    if (!svg || !measureEl || !pathEl || !textPathEl) return;

    pathEl.id = pathId;
    pathEl.setAttribute('d', pathD);
    textPathEl.setAttribute('href', '#' + pathId);
    try { textPathEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathId); } catch (_) {}
    measureEl.textContent = marqueeText;

    let spacing = 0;
    let offset = -1;
    let ready = false;
    const dragRef = { current: false };
    const lastXRef = { current: 0 };
    const dirRef = { current: direction };
    const velRef = { current: 0 };

    function measure() {
        try {
            spacing = measureEl.getComputedTextLength();
        } catch (e) {
            spacing = 0;
        }
        if (spacing <= 0) return false;
        const initial = -spacing;
        offset = initial;
        textPathEl.setAttribute('startOffset', initial + 'px');
        const n = Math.ceil(1800 / spacing) + 2;
        const total = Array(n).fill(marqueeText).join('');
        textPathEl.textContent = total;
        ready = true;
        container.style.visibility = 'visible';
        return true;
    }

    function runMeasure() {
        if (measure()) return;
        requestAnimationFrame(runMeasure);
    }
    runMeasure();

    let rafId = null;
    function step() {
        if (!ready || !textPathEl) {
            rafId = requestAnimationFrame(step);
            return;
        }
        if (!dragRef.current) {
            const delta = dirRef.current === 'right' ? speed : -speed;
            let next = offset + delta;
            if (next <= -spacing) next += spacing;
            if (next > 0) next -= spacing;
            offset = next;
            textPathEl.setAttribute('startOffset', offset + 'px');
        }
        rafId = requestAnimationFrame(step);
    }
    step();

    function onPointerDown(e) {
        if (!interactive) return;
        dragRef.current = true;
        lastXRef.current = e.clientX;
        velRef.current = 0;
        container.classList.add('is-dragging');
        (e.currentTarget || container).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        if (!interactive || !dragRef.current || !textPathEl) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        velRef.current = dx;
        let next = offset + dx;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        offset = next;
        textPathEl.setAttribute('startOffset', offset + 'px');
    }

    function endDrag() {
        if (!interactive) return;
        dragRef.current = false;
        container.classList.remove('is-dragging');
        dirRef.current = velRef.current > 0 ? 'right' : 'left';
    }

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointerleave', endDrag);
})();
