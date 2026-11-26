(() => {
  const time = document.querySelector('[data-pune-time]');
  if (time) {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true
    });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const label = document.createElement('span');
    label.className = 'pune-clock-label';
    const board = document.createElement('span');
    board.className = 'pune-clock';
    board.setAttribute('aria-hidden', 'true');
    time.replaceChildren(label, board, ' in Pune, India');

    function makeHalf(glyph, side) {
      const half = document.createElement('span');
      half.className = `pune-clock-half pune-clock-${side}`;
      half.textContent = glyph;
      return half;
    }

    let previous = '';
    let timer;
    function updateClock() {
      clearTimeout(timer);
      const now = new Date();
      const reading = formatter.format(now).replace(/\s+/g, ' ');
      if (reading !== previous) {
        label.textContent = reading;
        const next = reading.padStart(8, ' ');
        const before = previous.padStart(8, ' ');
        const animate = previous && !reducedMotion.matches && !document.hidden;
        for (let index = 0; index < next.length; index += 1) {
          if (previous && next[index] === before[index]) continue;
          const tile = document.createElement('span');
          tile.className = 'pune-clock-tile';
          if (/\d/.test(next[index])) tile.classList.add('pune-clock-digit');
          tile.append(makeHalf(next[index], 'top'), makeHalf(next[index], 'bottom'));
          const old = board.children[index];
          if (old) old.replaceWith(tile);
          else board.append(tile);
          if (!animate || !/\d/.test(next[index]) || !tile.animate) continue;

          const outgoing = makeHalf(before[index], 'top');
          const incoming = makeHalf(next[index], 'bottom');
          const oldBottom = makeHalf(before[index], 'bottom');
          tile.append(oldBottom, outgoing, incoming);
          const delay = index * 35;
          outgoing.animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(-90deg)' }],
            { duration: 130, delay, easing: 'ease-in', fill: 'both' });
          const flip = incoming.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0)' }],
            { duration: 170, delay: delay + 130, easing: 'ease-out', fill: 'both' });
          flip.onfinish = () => {
            oldBottom.remove();
            outgoing.remove();
            incoming.remove();
          };
        }
        previous = reading;
      }
      timer = setTimeout(updateClock, 60000 - Date.now() % 60000 + 25);
    }

    updateClock();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateClock();
    });
  }
  const copy = document.querySelector('.copy-email');
  const status = document.querySelector('.copy-status');
  let reset;
  if (copy && navigator.clipboard && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText('yogesh.bhusara@outlook.com');
        status.textContent = 'Copied';
      } catch {
        status.textContent = 'Select the address to copy';
      }
      reset = setTimeout(() => { status.textContent = ''; }, 3000);
    });
  }
})();
