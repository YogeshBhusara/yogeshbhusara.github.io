/**
 * cursor-thumb.js — Home page only. Floating thumbnail follows the pointer
 * over any element with [data-thumb="image-url"]. Fine pointer only.
 *
 * Motion: laggy chase + velocity lean + arc pop on show/hide, so the card
 * jumps and stays live instead of sticking to the cursor.
 */
(function () {
  'use strict';

  var canHover =
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CARD_W = 300;
  var CARD_H = 200;
  var TILTS = [-5, 3.5, -2.5, 5.5, -4, 2, -6, 4, -3, 6, -1.5];

  var preview = document.createElement('div');
  preview.className = 'cursor-thumb';
  preview.setAttribute('aria-hidden', 'true');
  preview.style.width = CARD_W + 'px';
  preview.style.height = CARD_H + 'px';

  var layer = document.createElement('div');
  layer.className = 'cursor-thumb__layer';

  var swing = document.createElement('div');
  swing.className = 'cursor-thumb__swing';

  var stack = document.createElement('div');
  stack.className = 'cursor-thumb__stack';
  stack.style.width = CARD_W + 'px';
  stack.style.height = CARD_H + 'px';

  swing.appendChild(stack);
  layer.appendChild(swing);
  preview.appendChild(layer);
  document.body.appendChild(preview);

  var itemsBySrc = Object.create(null);
  var itemOrder = [];
  var active = false;
  var armed = false;
  var currentSrc = '';
  var pointerX = 0;
  var pointerY = 0;
  var hasPointer = false;
  var enterSide = 1;
  var followRaf = 0;
  var popRaf = 0;
  var syncRaf = 0;
  var lastNow = 0;

  var follow = {
    toX: 0,
    toY: 0,
    fromX: 0,
    fromY: 0,
    x: 0,
    y: 0,
    pace: 0,
    angle: 0,
    spin: 0,
    hang: 1
  };

  var pop = {
    x: 0,
    y: 0,
    rot: 0,
    scale: 0.1,
    opacity: 0,
    vx: 0,
    vy: 0,
    vrot: 0,
    vscale: 0,
    vopacity: 0,
    fromX: 0,
    fromY: 0,
    fromRot: 0,
    toX: 0,
    toY: 0,
    toRot: 0,
    lift: 0,
    side: 1,
    progress: 0,
    vprogress: 0,
    running: false
  };

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function expEase(rate, dt) {
    return 1 - Math.exp(-rate * dt);
  }

  function springToward(value, velocity, target, stiffness, damping, dt) {
    var next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
    return {
      value: value + next * dt,
      velocity: next
    };
  }

  function ensureItem(src) {
    if (!src || itemsBySrc[src]) return itemsBySrc[src];

    var item = document.createElement('div');
    item.className = 'cursor-thumb__item';
    item.style.setProperty('--tilt', TILTS[itemOrder.length % TILTS.length] + 'deg');

    var img = document.createElement('img');
    img.className = 'cursor-thumb__picture';
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    img.src = src;
    item.appendChild(img);

    stack.appendChild(item);
    itemsBySrc[src] = item;
    itemOrder.push(src);
    return item;
  }

  function setActiveSrc(src) {
    if (src === currentSrc) return;
    currentSrc = src;
    Object.keys(itemsBySrc).forEach(function (key) {
      itemsBySrc[key].classList.toggle('is-active', key === src);
    });
  }

  function applyFollow() {
    preview.style.transform =
      'translate3d(' + follow.x + 'px,' + follow.y + 'px,0)';
    swing.style.rotate = follow.angle + 'deg';
  }

  function applyPop() {
    var hop = Math.sin(pop.progress * Math.PI);
    layer.style.transform =
      'translate3d(' +
      (pop.x + hop * -72 * pop.side) +
      'px,' +
      (pop.y - hop * pop.lift) +
      'px,0) rotate(' +
      pop.rot +
      'deg)';
    stack.style.opacity = String(clamp(pop.opacity, 0, 1));
    stack.style.transform = 'scale(' + pop.scale + ')';
  }

  function aimAt(row, clientX, clientY) {
    var above = row.top >= 238;
    var x = clamp(clientX - CARD_W / 2, 24, window.innerWidth - CARD_W - 24);
    var y = above
      ? clientY - row.height / 2 - CARD_H - 14
      : clientY + row.height / 2 + 14;
    y = clamp(y, 24, window.innerHeight - CARD_H - 24);

    preview.dataset.side = above ? 'above' : 'below';
    swing.style.transformOrigin =
      clientX - x + 'px ' + (clientY - y) + 'px';

    follow.toX = x;
    follow.toY = y;
    follow.hang = above ? -1 : 1;

    if (reduceMotion || !armed) {
      cancelAnimationFrame(followRaf);
      followRaf = 0;
      follow.x = x;
      follow.y = y;
      follow.fromX = x;
      follow.fromY = y;
      follow.pace = 0;
      follow.angle = 0;
      follow.spin = 0;
      applyFollow();
      return;
    }

    if (!followRaf) {
      lastNow = performance.now();
      followRaf = window.requestAnimationFrame(tickFollow);
    }
  }

  function tickFollow(now) {
    followRaf = 0;
    var dt = Math.min(1 / 30, (now - lastNow) / 1000);
    lastNow = now;

    var speed =
      dt > 0
        ? Math.hypot(follow.toX - follow.fromX, follow.toY - follow.fromY) / dt
        : 0;
    follow.fromX = follow.toX;
    follow.fromY = follow.toY;
    follow.pace += (speed - follow.pace) * expEase(12, dt);

    var catchup = expEase(50 - 42 * Math.min(1, follow.pace / 2000), dt);
    var dx = (follow.toX - follow.x) * catchup;
    follow.x += dx;
    follow.y += (follow.toY - follow.y) * catchup;

    var lean = clamp(follow.hang * (dt > 0 ? dx / dt : 0) * 0.012, -14, 14);
    follow.spin += (320 * (lean - follow.angle) - 16 * follow.spin) * dt;
    follow.angle += follow.spin * dt;

    var settled =
      Math.abs(follow.toX - follow.x) + Math.abs(follow.toY - follow.y) < 0.1 &&
      Math.abs(follow.angle) + Math.abs(follow.spin) < 0.01;

    if (settled) {
      follow.x = follow.toX;
      follow.y = follow.toY;
      follow.pace = 0;
      follow.angle = 0;
      follow.spin = 0;
    }

    applyFollow();
    if (!settled && (active || pop.running)) {
      followRaf = window.requestAnimationFrame(tickFollow);
    }
  }

  function startPop(opening) {
    var cursorX = pointerX - follow.x - CARD_W / 2;
    var cursorY = pointerY - follow.y - CARD_H / 2;

    pop.side = enterSide;
    pop.lift = Math.min(32, Math.max(0, follow.y - 12));
    pop.fromX = pop.x;
    pop.fromY = pop.y;
    pop.fromRot = pop.rot;
    pop.toX = opening ? 0 : cursorX;
    pop.toY = opening ? 0 : cursorY;
    pop.toRot = opening ? 0 : -8 * enterSide;

    if (!armed && opening) {
      pop.fromX = cursorX;
      pop.fromY = cursorY;
      pop.fromRot = -8 * enterSide;
      pop.x = cursorX;
      pop.y = cursorY;
      pop.rot = pop.fromRot;
    }

    pop.progress = 0;
    pop.vprogress = 0;
    pop.running = true;
    applyPop();

    if (reduceMotion) {
      pop.x = pop.toX;
      pop.y = pop.toY;
      pop.rot = pop.toRot;
      pop.scale = opening ? 1 : 0.1;
      pop.opacity = opening ? 1 : 0;
      pop.progress = 1;
      pop.running = false;
      applyPop();
      if (!opening) finishHide();
      return;
    }

    if (!popRaf) popRaf = window.requestAnimationFrame(tickPop);
  }

  function tickPop(now) {
    popRaf = 0;
    var dt = Math.min(1 / 30, 1 / 60);

    var nextP = springToward(pop.progress, pop.vprogress, 1, 92, 11.5, dt);
    pop.progress = clamp(nextP.value, 0, 1.15);
    pop.vprogress = nextP.velocity;

    var t = clamp(pop.progress, 0, 1);
    pop.x = pop.fromX + (pop.toX - pop.fromX) * t;
    pop.y = pop.fromY + (pop.toY - pop.fromY) * t;
    pop.rot = pop.fromRot + (pop.toRot - pop.fromRot) * t;

    var scaleTarget = active ? 1 : 0.1;
    var opacityTarget = active ? 1 : 0;
    var nextS = springToward(pop.scale, pop.vscale, scaleTarget, 92, 11.5, dt);
    var nextO = springToward(pop.opacity, pop.vopacity, opacityTarget, 92, 11.5, dt);
    pop.scale = nextS.value;
    pop.vscale = nextS.velocity;
    pop.opacity = nextO.value;
    pop.vopacity = nextO.velocity;

    applyPop();

    var settled =
      Math.abs(1 - pop.progress) < 0.01 &&
      Math.abs(pop.vprogress) < 0.05 &&
      Math.abs(scaleTarget - pop.scale) < 0.012 &&
      Math.abs(opacityTarget - pop.opacity) < 0.012;

    if (!settled) {
      popRaf = window.requestAnimationFrame(tickPop);
      return;
    }

    pop.progress = 1;
    pop.x = pop.toX;
    pop.y = pop.toY;
    pop.rot = pop.toRot;
    pop.scale = scaleTarget;
    pop.opacity = opacityTarget;
    pop.running = false;
    applyPop();
    if (!active) finishHide();
  }

  function finishHide() {
    armed = false;
    currentSrc = '';
    preview.classList.remove('is-visible', 'is-armed');
    Object.keys(itemsBySrc).forEach(function (key) {
      itemsBySrc[key].classList.remove('is-active');
    });
  }

  function show(src, row) {
    if (!src) return;
    ensureItem(src);
    setActiveSrc(src);
    aimAt(row, pointerX, pointerY);

    if (!active) {
      active = true;
      preview.classList.add('is-visible');
      startPop(true);
      armed = true;
      window.requestAnimationFrame(function () {
        preview.classList.add('is-armed');
      });
    }

    if (!followRaf && !reduceMotion) {
      lastNow = performance.now();
      followRaf = window.requestAnimationFrame(tickFollow);
    }
  }

  function hide() {
    if (!active) return;
    active = false;
    startPop(false);
  }

  function syncFromPoint() {
    syncRaf = 0;
    if (!hasPointer) {
      hide();
      return;
    }

    var under = document.elementFromPoint(pointerX, pointerY);
    var el = under && under.closest ? under.closest('[data-thumb]') : null;
    if (el) {
      var src = el.getAttribute('data-thumb');
      var row = el.getBoundingClientRect();
      if (!active) {
        enterSide = pointerX < row.left + row.width / 2 ? 1 : -1;
      }
      show(src, row);
    } else {
      hide();
    }
  }

  function scheduleSync() {
    if (syncRaf) return;
    syncRaf = window.requestAnimationFrame(syncFromPoint);
  }

  function onPointerMove(e) {
    if (e.pointerType === 'touch') return;
    hasPointer = true;
    pointerX = e.clientX;
    pointerY = e.clientY;
    syncFromPoint();
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', function () {
    hasPointer = false;
    hide();
  });
  window.addEventListener('blur', function () {
    hasPointer = false;
    hide();
  });
  window.addEventListener('scroll', scheduleSync, { passive: true, capture: true });
  window.addEventListener('wheel', scheduleSync, { passive: true, capture: true });
})();
