/**
 * visit-counter.js — total site visits via CounterAPI (no backend).
 * Counts once per browser session; other pages in the session only read.
 */
(function initVisitCounter() {
  const el = document.querySelector('[data-visit-count]');
  if (!el) return;

  const namespace = 'yogeshbhusara.github.io';
  const name = 'visits';
  const sessionKey = 'yb-visit-counted';
  const base = `https://api.counterapi.dev/v1/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`;

  function render(count) {
    const n = Number(count);
    if (!Number.isFinite(n)) return;
    el.textContent = `Total visits ${n.toLocaleString()}`;
  }

  const shouldCount = !sessionStorage.getItem(sessionKey);
  const url = shouldCount ? `${base}/up` : `${base}/`;

  fetch(url, { credentials: 'omit' })
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((data) => {
      if (shouldCount) sessionStorage.setItem(sessionKey, '1');
      render(data && data.count);
    })
    .catch(() => {
      el.hidden = true;
    });
})();
