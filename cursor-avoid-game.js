/**
 * cursor-avoid-game.js — Mini game in bento card: avoid the cursor for 5s; dot moves periodically.
 */
(function () {
    'use strict';

    const SURVIVE_SEC = 5;
    const CATCH_RADIUS = 24;
    const MOVE_INTERVAL_MS = 1200;
    const RESET_DELAY_MS = 2000;

    const card = document.getElementById('cursor-avoid-game');
    const arena = document.getElementById('cursor-avoid-arena');
    const dot = document.getElementById('cursor-avoid-dot');
    const statusEl = document.getElementById('cursor-avoid-status');

    if (!card || !arena || !dot || !statusEl) return;

    const state = {
        playing: false,
        caught: false,
        won: false,
        startTime: 0,
        timerId: null,
        moveId: null,
        resetTimeoutId: null,
        lastX: 0.5,
        lastY: 0.5
    };

    function setStatus(text) {
        statusEl.textContent = text;
    }

    function getArenaBounds() {
        return arena.getBoundingClientRect();
    }

    function randomInArena() {
        const r = getArenaBounds();
        const pad = 14;
        const x = (r.left + pad) + Math.random() * (r.width - 2 * pad);
        const y = (r.top + pad) + Math.random() * (r.height - 2 * pad);
        return { x: x, y: y };
    }

    function positionDotToPage(x, y) {
        const r = getArenaBounds();
        const px = ((x - r.left) / r.width) * 100;
        const py = ((y - r.top) / r.height) * 100;
        dot.style.left = px + '%';
        dot.style.top = py + '%';
        dot.style.transform = 'translate(-50%, -50%)';
        state.lastX = x;
        state.lastY = y;
    }

    function moveDot() {
        if (!state.playing || state.caught || state.won) return;
        const p = randomInArena();
        positionDotToPage(p.x, p.y);
    }

    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    function checkCollision(clientX, clientY) {
        if (!state.playing || state.caught || state.won) return;
        var d = distance(clientX, clientY, state.lastX, state.lastY);
        if (d <= CATCH_RADIUS) {
            state.caught = true;
            state.playing = false;
            clearInterval(state.timerId);
            clearInterval(state.moveId);
            card.classList.add('caught');
            card.classList.remove('won');
            setStatus('Caught!');
            state.resetTimeoutId = setTimeout(reset, RESET_DELAY_MS);
        }
    }

    function checkWin() {
        if (!state.playing || state.caught || state.won) return;
        var elapsed = (Date.now() - state.startTime) / 1000;
        if (elapsed >= SURVIVE_SEC) {
            state.won = true;
            state.playing = false;
            clearInterval(state.timerId);
            clearInterval(state.moveId);
            card.classList.add('won');
            card.classList.remove('caught');
            setStatus('You survived ' + SURVIVE_SEC + 's!');
            state.resetTimeoutId = setTimeout(reset, RESET_DELAY_MS);
        }
    }

    function stopAndReset() {
        if (state.resetTimeoutId) {
            clearTimeout(state.resetTimeoutId);
            state.resetTimeoutId = null;
        }
        if (state.timerId) {
            clearInterval(state.timerId);
            state.timerId = null;
        }
        if (state.moveId) {
            clearInterval(state.moveId);
            state.moveId = null;
        }
        state.playing = false;
        state.caught = false;
        state.won = false;
        card.classList.remove('caught', 'won');
        setStatus('Move cursor away from the dot!');
        dot.style.left = '50%';
        dot.style.top = '50%';
        dot.style.transform = 'translate(-50%, -50%)';
    }

    function reset() {
        card.classList.remove('caught', 'won');
        state.playing = true;
        state.caught = false;
        state.won = false;
        state.startTime = Date.now();
        setStatus('Avoid the dot! · 0s');
        var r = getArenaBounds();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        positionDotToPage(cx, cy);
        state.moveId = setInterval(moveDot, MOVE_INTERVAL_MS);
        state.timerId = setInterval(function () {
            if (state.caught || state.won) return;
            var elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            setStatus('Avoid the dot! · ' + elapsed + 's');
            checkWin();
        }, 200);
    }

    function onMouseMove(e) {
        checkCollision(e.clientX, e.clientY);
    }

    card.addEventListener('mouseenter', function () {
        if (!state.playing && !state.caught && !state.won) reset();
    });

    card.addEventListener('mouseleave', function () {
        stopAndReset();
    });

    document.addEventListener('mousemove', onMouseMove);
})();
