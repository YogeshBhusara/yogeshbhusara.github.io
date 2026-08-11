/**
 * visit-counter.js — total site visits via CounterAPI v2 (no backend).
 * Counts once per browser session; other pages in the session only read.
 * Uses the public counter endpoints (no Authorization header) so browser CORS works.
 */
(function initVisitCounter() {
  const el = document.querySelector('[data-visit-count]');
  if (!el) return;

  const workspace = 'yogesh-bhusaras-team-5013';
  const name = 'first-counter-5013';
  const sessionKey = 'yb-visit-counted';
  const base = `https://api.counterapi.dev/v2/${encodeURIComponent(workspace)}/${encodeURIComponent(name)}`;

  function render(count) {
    const n = Number(count);
    if (!Number.isFinite(n)) return;
    el.textContent = `Total visits ${n.toLocaleString()}`;
    el.hidden = false;
  }

  function pickCount(data) {
    if (!data || typeof data !== 'object') return NaN;
    const row = data.data && typeof data.data === 'object' ? data.data : data;
    if (Number.isFinite(Number(row.value))) return Number(row.value);
    if (Number.isFinite(Number(row.count))) return Number(row.count);
    const up = Number(row.up_count);
    const down = Number(row.down_count);
    if (Number.isFinite(up)) return up - (Number.isFinite(down) ? down : 0);
    return NaN;
  }

  const shouldCount = !sessionStorage.getItem(sessionKey);
  const url = shouldCount ? `${base}/up` : `${base}`;

  fetch(url, { credentials: 'omit' })
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((data) => {
      const count = pickCount(data);
      if (!Number.isFinite(count)) throw new Error('bad-count');
      if (shouldCount) sessionStorage.setItem(sessionKey, '1');
      render(count);
    })
    .catch(() => {
      el.hidden = true;
    });
})();
