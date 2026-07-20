/**
 * github-activity.js — contribution calendar (Mohit-style layout).
 * Data: github-contributions.json (snapshot from GitHub profile)
 * Colors: site accent scale via CSS variables on .gh-cal
 */
(function initGithubActivity() {
  const root = document.getElementById('github-activity-embed');
  if (!root) return;

  const username = 'YogeshBhusara';
  const dataUrl = 'github-contributions.json?v=20260720h';
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthsEl = root.querySelector('[data-gh-months]');
  const svgEl = root.querySelector('[data-gh-svg]');
  const countEl = root.querySelector('[data-gh-count]');
  const legendEl = root.querySelector('[data-gh-legend]');

  let cachedWeeks = null;
  let cachedTotal = 0;

  function levelColors() {
    const cs = getComputedStyle(root);
    return [
      cs.getPropertyValue('--gh-l0').trim() || '#e8e2d6',
      cs.getPropertyValue('--gh-l1').trim() || '#ffd0bf',
      cs.getPropertyValue('--gh-l2').trim() || '#ff9a75',
      cs.getPropertyValue('--gh-l3').trim() || '#ff6a33',
      cs.getPropertyValue('--gh-l4').trim() || '#ff4500',
    ];
  }

  function parseDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function buildWeeks(contributions) {
    if (!contributions.length) return [];

    const byDate = new Map(contributions.map((c) => [c.date, c]));
    const start = parseDate(contributions[0].date);
    const end = parseDate(contributions[contributions.length - 1].date);

    const cursor = new Date(start);
    cursor.setDate(cursor.getDate() - cursor.getDay());

    const weeks = [];
    while (weeks.length < 53) {
      const days = [];
      for (let dow = 0; dow < 7; dow++) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, '0');
        const d = String(cursor.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${d}`;
        const hit = byDate.get(key);
        days.push({
          date: key,
          count: hit ? hit.count : 0,
          level: hit ? hit.level : 0,
          inRange: Boolean(hit),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(days);
      if (cursor > end && weeks.length >= 52) break;
    }
    return weeks;
  }

  function monthLabels(weeks) {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const day = week.find((d) => d.inRange) || week[0];
      if (!day) return;
      const month = parseDate(day.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ month, weekIndex: wi, label: MONTHS[month] });
        lastMonth = month;
      }
    });
    return labels;
  }

  function renderMonths(weeks) {
    if (!monthsEl) return;
    const labels = monthLabels(weeks);
    const n = weeks.length || 53;
    monthsEl.replaceChildren();
    labels.forEach((item, i) => {
      const next = labels[i + 1];
      const spanWeeks = (next ? next.weekIndex : n) - item.weekIndex;
      const el = document.createElement('span');
      el.className = 'gh-cal__month';
      el.textContent = item.label;
      el.style.flex = `0 0 ${(spanWeeks / n) * 100}%`;
      el.style.textAlign = i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center';
      monthsEl.appendChild(el);
    });
  }

  function renderSvg(weeks) {
    if (!svgEl) return;
    const colors = levelColors();
    const NS = 'http://www.w3.org/2000/svg';
    const cell = 0.8;
    const cols = weeks.length;

    svgEl.setAttribute('viewBox', `0 0 ${cols} 7`);
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.replaceChildren();

    weeks.forEach((week, wi) => {
      const g = document.createElementNS(NS, 'g');
      week.forEach((day, di) => {
        if (!day.inRange) return;
        const rect = document.createElementNS(NS, 'rect');
        const level = Math.max(0, Math.min(4, day.level | 0));
        rect.setAttribute('x', String(wi + (1 - cell) / 2));
        rect.setAttribute('y', String(di + (1 - cell) / 2));
        rect.setAttribute('width', String(cell));
        rect.setAttribute('height', String(cell));
        rect.setAttribute('rx', '0.2');
        rect.setAttribute('ry', '0.2');
        rect.setAttribute('fill', colors[level]);
        rect.setAttribute('data-level', String(level));
        rect.setAttribute('class', 'gh-cal__cell');

        const title = document.createElementNS(NS, 'title');
        const when = parseDate(day.date).toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        title.textContent = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${when}`;
        rect.appendChild(title);
        g.appendChild(rect);
      });
      svgEl.appendChild(g);
    });
  }

  function renderLegend() {
    if (!legendEl) return;
    const colors = levelColors();
    legendEl.replaceChildren();

    const less = document.createElement('span');
    less.textContent = 'Less';
    legendEl.appendChild(less);

    const cells = document.createElement('span');
    cells.className = 'gh-cal__legend-cells';
    colors.forEach((fill) => {
      const swatch = document.createElement('span');
      swatch.className = 'gh-cal__legend-cell';
      swatch.style.background = fill;
      cells.appendChild(swatch);
    });
    legendEl.appendChild(cells);

    const more = document.createElement('span');
    more.textContent = 'More';
    legendEl.appendChild(more);
  }

  function renderCount(total) {
    if (!countEl) return;
    const n = Number(total) || 0;
    countEl.textContent = `${n.toLocaleString()} contributions in the last year.`;
  }

  function paint() {
    if (!cachedWeeks) return;
    renderMonths(cachedWeeks);
    renderSvg(cachedWeeks);
    renderCount(cachedTotal);
    renderLegend();
  }

  function showError() {
    root.classList.add('gh-cal--error');
    if (countEl) {
      countEl.innerHTML = `<a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">View GitHub profile →</a>`;
    }
  }

  async function load() {
    root.classList.remove('gh-cal--error');
    root.classList.add('gh-cal--loading');
    try {
      const res = await fetch(dataUrl, { credentials: 'omit', cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const contributions = Array.isArray(data.contributions) ? data.contributions : [];
      cachedWeeks = buildWeeks(contributions);
      cachedTotal =
        (data.total && (data.total.lastYear ?? data.total.last_year)) ??
        contributions.reduce((sum, d) => sum + (d.count || 0), 0);
      paint();
      root.classList.remove('gh-cal--loading');
    } catch {
      root.classList.remove('gh-cal--loading');
      showError();
    }
  }

  load();
  document.addEventListener('themechange', () => {
    if (cachedWeeks) paint();
    else load();
  });
})();
