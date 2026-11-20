/* Scroll position drives both the rail and its folded history, including touch. */
(() => {
  const track = document.querySelector('.project-track');
  const controls = document.querySelector('.project-navigation');
  if (!track || !controls) return;
  const cards = [...track.querySelectorAll('.project-cell')];
  const dots = controls.querySelector('.project-dots');
  const previous = controls.querySelector('[data-project-direction="-1"]');
  const next = controls.querySelector('[data-project-direction="1"]');
  const position = controls.querySelector('.project-position');
  position.setAttribute('role', 'status');
  position.setAttribute('aria-live', 'polite');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const heading = document.createElement('div');
  heading.className = 'featured-project-info';
  heading.innerHTML = '<h3></h3><p></p>';
  track.before(heading);
  let active = -1, offsets = [], widths = [], height = 0, renderFrame, travelFrame, destination = null, lastScroll = NaN;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const projects = cards.map((cell, i) => {
    let card = cell.querySelector('.card');
    if (card.tagName === 'A') {
      const original = card;
      card = document.createElement('div'); card.className = 'card';
      card.append(...original.childNodes); original.replaceWith(card);
      const preview = document.createElement('a');
      preview.className = 'project-preview'; preview.href = original.href;
      preview.setAttribute('aria-label', `Read ${cell.querySelector('h3').textContent} case study`);
      preview.append(card.querySelector('.plate'));
      const label = document.createElement('span'); label.className = 'project-preview-label'; label.textContent = 'View case study'; preview.append(label);
      card.prepend(preview);
      card.querySelector('.card-caption').setAttribute('href', original.href);
    }
    const caption = card.querySelector('.card-caption');
    const title = caption.querySelector('h3').textContent;
    const category = caption.querySelector('.micro').textContent.trim();
    const plane = document.createElement('div');
    plane.className = 'gallery-plane'; card.before(plane); plane.append(card);
    caption.remove();
    // Keep paint order stable while cards fold and unfold in either direction.
    cell.style.zIndex = i + 1;
    cell.setAttribute('aria-label', `${i + 1} of ${cards.length}: ${title}`);
    const select = document.createElement('button');
    select.type = 'button'; select.className = 'gallery-select'; select.tabIndex = -1;
    select.setAttribute('aria-label', `Show ${title}`);
    select.addEventListener('click', () => goTo(i)); plane.append(select);
    const dot = document.createElement('button'); dot.type = 'button';
    dot.setAttribute('aria-label', `Show ${title}`); dot.setAttribute('aria-controls', 'project-track');
    dot.addEventListener('click', e => goTo(i, e.detail === 0)); dots.append(dot);
    // Snap to fixed layout positions, never the moving/sticky card bounds.
    const snap = document.createElement('span');
    snap.className = 'gallery-snap'; snap.setAttribute('aria-hidden', 'true');
    track.append(snap);
    return { cell, card, plane, select, dot, snap, title, category };
  });
  const closest = (scroll = track.scrollLeft) => offsets.reduce((best, x, i) => Math.abs(x - scroll) < Math.abs(offsets[best] - scroll) ? i : best, 0);
  function render() {
    const scroll = track.scrollLeft;
    renderFrame = null;
    if (scroll === lastScroll) return;
    lastScroll = scroll;
    const selected = closest(scroll);
    let progress = cards.length - 1;
    for (let i = 0; i < offsets.length - 1; i++) {
      if (scroll <= offsets[i + 1]) { progress = i + (scroll - offsets[i]) / (offsets[i + 1] - offsets[i]); break; }
    }
    projects.forEach((p, i) => {
      const distance = progress - i;
      const fold = easeInOut(clamp(distance, 0, 1));
      const crop = Math.max(0, (widths[i] - height * 4 / 3) / 2);
      // Native sticky positioning owns the scroll compensation. Previously the
      // scroll thread moved left while JS pushed right, causing frame-to-frame
      // drift and a rightward reversal just before a card reached the shelf.
      // A continuous shelf path keeps travelling left through every stack slot.
      const shelfOffset = (height * .54 + 24 + crop - 80) * fold + 80 * Math.max(0, distance);
      const transform = reduced.matches ? 'none' :
        `perspective(1400px) translate3d(${-shelfOffset}px,0,${-120 * fold}px) rotateY(${70 * fold}deg) scale(${1 - .1 * easeInOut(clamp(-distance, 0, 1))})`;
      if (transform !== p.transform) { p.plane.style.transform = transform; p.transform = transform; }
    });
    if (selected === active) return;
    active = selected;
    heading.querySelector('h3').textContent = projects[active].title;
    heading.querySelector('p').textContent = projects[active].category;
    projects.forEach((p, i) => {
      p.cell.dataset.galleryState = i === active ? 'active' : 'neighbor';
      if (i !== active && p.card.contains(document.activeElement)) track.focus({ preventScroll:true });
      p.card.inert = i !== active;
      p.select.hidden = i === active;
      p.dot.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
    previous.disabled = active === 0; next.disabled = active === cards.length - 1;
    position.textContent = `${active + 1} of ${cards.length}: ${projects[active].title}`;
  }
  // Published ease-in-out (.77, 0, .175, 1), solved for time rather than frame count.
  function easeInOut(x) {
    if (x <= 0 || x >= 1) return x;
    let low = 0, high = 1, t = x;
    for (let i = 0; i < 12; i++) {
      t = (low + high) / 2;
      const sample = 3 * (1 - t) ** 2 * t * .77 + 3 * (1 - t) * t ** 2 * .175 + t ** 3;
      if (sample < x) low = t; else high = t;
    }
    return 3 * (1 - t) * t ** 2 + t ** 3;
  }
  function cancelTravel(restoreSnap = true) {
    cancelAnimationFrame(travelFrame); destination = null;
    if (restoreSnap) track.classList.remove('is-travelling');
  }
  function goTo(index, instant = false) {
    // Capture the visible position before changing snap mode: WebKit can
    // otherwise adjust fractional scroll offsets as snapping is suspended.
    const from = track.scrollLeft;
    cancelTravel(false);
    track.classList.add('is-travelling');
    cancelAnimationFrame(renderFrame); renderFrame = null;
    const target = clamp(index, 0, cards.length - 1);
    const to = offsets[target];
    track.scrollLeft = from;
    if (instant || reduced.matches || Math.abs(from - to) < 1) {
      track.scrollTo({ left:to, behavior:'instant' }); render(); cancelTravel(); return;
    }
    destination = target; track.classList.add('is-travelling');
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 440);
      track.scrollLeft = from + (to - from) * easeInOut(t);
      // The travel loop owns rendering; its scroll events must not schedule a second pass.
      render();
      if (t < 1) travelFrame = requestAnimationFrame(tick);
      else { track.scrollLeft = to; cancelTravel(); render(); }
    };
    travelFrame = requestAnimationFrame(tick);
  }
  function measure() {
    const keep = Math.max(0, active);
    cancelTravel(false);
    track.classList.add('is-travelling');
    lastScroll = NaN;
    const style = getComputedStyle(track);
    const inset = parseFloat(getComputedStyle(track, '::before').width), gap = parseFloat(style.columnGap);
    // Keep fractional layout precision and never measure a sticky offsetLeft.
    widths = cards.map(card => card.getBoundingClientRect().width);
    height = cards[0].getBoundingClientRect().height;
    let offset = 0;
    offsets = widths.map(width => { const x = offset; offset += width + gap; return x; });
    projects.forEach((p, i) => { p.snap.style.left = `${inset + offsets[i]}px`; });
    track.style.setProperty('--gallery-end', `${Math.max(24, track.clientWidth - inset - widths[widths.length - 1])}px`);
    track.scrollTo({ left:offsets[keep], behavior:'instant' }); render(); cancelTravel();
  }
  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-project-direction]');
    if (button && !button.disabled) goTo((destination ?? active) + Number(button.dataset.projectDirection), event.detail === 0);
  });
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    goTo(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  track.addEventListener('scroll', () => {
    if (destination === null && !renderFrame) renderFrame = requestAnimationFrame(render);
  }, { passive:true });
  // Mouse dragging supplements native touch/trackpad scrolling without hijacking vertical gestures.
  let drag = null, suppressClick = false;
  track.addEventListener('dragstart', e => e.preventDefault());
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { id:e.pointerId, x:e.clientX, scroll:track.scrollLeft, moved:false };
  });
  track.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const delta = e.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) < 6) return;
    if (!drag.moved) {
      cancelTravel(false); drag.moved = true;
      track.setPointerCapture(e.pointerId); track.classList.add('is-travelling', 'is-dragging');
    }
    e.preventDefault(); track.scrollLeft = drag.scroll - delta;
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved; drag = null;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    if (moved) { suppressClick = true; goTo(closest()); setTimeout(() => { suppressClick = false; }, 0); }
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', e => {
    if (suppressClick) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  track.addEventListener('wheel', () => cancelTravel(), { passive:true });
  track.addEventListener('touchstart', () => cancelTravel(), { passive:true });
  reduced.addEventListener('change', measure);
  new ResizeObserver(measure).observe(track);
  controls.hidden = false; measure();
})();
