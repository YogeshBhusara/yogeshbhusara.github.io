/**
 * cursor-thumb.js — Home page only. Floating thumbnail follows the pointer
 * over any element with [data-thumb="image-url"]. Fine pointer only.
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

  var preview = document.createElement('div');
  preview.className = 'cursor-thumb';
  preview.setAttribute('aria-hidden', 'true');

  var img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  preview.appendChild(img);
  document.body.appendChild(preview);

  var active = false;
  var currentSrc = '';
  var pointerX = 0;
  var pointerY = 0;
  var drawX = 0;
  var drawY = 0;
  var rafId = 0;
  var OFFSET_X = 18;
  var OFFSET_Y = 18;

  function setPosition(x, y) {
    preview.style.transform =
      'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)';
  }

  function show(src) {
    if (!src) return;
    if (src !== currentSrc) {
      currentSrc = src;
      img.src = src;
    }
    if (!active) {
      active = true;
      preview.classList.add('is-visible');
      drawX = pointerX + OFFSET_X;
      drawY = pointerY + OFFSET_Y;
      setPosition(drawX, drawY);
    }
    if (!rafId) rafId = window.requestAnimationFrame(tick);
  }

  function hide() {
    if (!active) return;
    active = false;
    preview.classList.remove('is-visible');
  }

  function tick() {
    rafId = 0;
    var w = preview.offsetWidth || 280;
    var h = preview.offsetHeight || 175;
    var targetX = pointerX + OFFSET_X;
    var targetY = pointerY + OFFSET_Y;
    var maxX = window.innerWidth - w - 12;
    var maxY = window.innerHeight - h - 12;
    if (targetX > maxX) targetX = pointerX - w - OFFSET_X;
    if (targetY > maxY) targetY = pointerY - h - OFFSET_Y;
    targetX = Math.min(Math.max(12, targetX), Math.max(12, maxX));
    targetY = Math.min(Math.max(12, targetY), Math.max(12, maxY));

    var ease = reduceMotion ? 1 : 0.22;
    drawX += (targetX - drawX) * ease;
    drawY += (targetY - drawY) * ease;
    setPosition(drawX, drawY);

    if (
      active &&
      (Math.abs(targetX - drawX) > 0.4 || Math.abs(targetY - drawY) > 0.4)
    ) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function onPointerMove(e) {
    pointerX = e.clientX;
    pointerY = e.clientY;

    var el = e.target.closest && e.target.closest('[data-thumb]');
    if (el) {
      show(el.getAttribute('data-thumb'));
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    } else {
      hide();
    }
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
})();
