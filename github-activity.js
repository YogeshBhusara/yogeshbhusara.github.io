/**
 * github-activity.js — lightweight GitHub contributions embed.
 *
 * Uses ghchart.rshah.org to render a contributions SVG (no auth, no scraping).
 * We tint it to match the site's brand color.
 */
(function initGithubActivity() {
  const container = document.getElementById('github-activity-embed');
  const img = document.getElementById('github-activity-img');
  if (!container || !img) return;

  const username = 'YogeshBhusara';

  function getBrandHex() {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue('--color-brand').trim();
    // Expect hex like #9c4a21; fallback to brand if parsing fails.
    const match = value.match(/^#?([0-9a-fA-F]{6})$/);
    return match ? match[1] : '9c4a21';
  }

  function getUrl() {
    const brand = getBrandHex();
    return `https://ghchart.rshah.org/${brand}/${encodeURIComponent(username)}`;
  }

  img.addEventListener('error', function () {
    // Graceful fallback: keep layout stable, show link-only note.
    img.removeAttribute('src');
    img.style.display = 'none';
  });

  function showImgFallback() {
    container.querySelector('svg')?.remove();
    img.style.display = '';
    img.src = getUrl();
  }

  function parseCssRgba(value) {
    const raw = (value || '').trim();
    if (!raw) return null;

    // rgba(r,g,b,a)
    const rgba = raw.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
    if (rgba) {
      const r = Math.max(0, Math.min(255, Math.round(Number(rgba[1]))));
      const g = Math.max(0, Math.min(255, Math.round(Number(rgba[2]))));
      const b = Math.max(0, Math.min(255, Math.round(Number(rgba[3]))));
      const a = rgba[4] == null ? 1 : Math.max(0, Math.min(1, Number(rgba[4])));
      return { r, g, b, a };
    }

    // #rrggbb
    const hex = raw.match(/^#?([0-9a-f]{6})$/i);
    if (hex) {
      const h = hex[1];
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }

    return null;
  }

  function getRectFill(rect) {
    const attrFill = (rect.getAttribute('fill') || '').trim();
    if (attrFill) return attrFill;
    const style = (rect.getAttribute('style') || '').toLowerCase();
    const match = style.match(/fill\s*:\s*([^;]+)\s*;?/);
    return match ? match[1].trim() : '';
  }

  function makeSvgResponsive(svg) {
    const widthAttr = svg.getAttribute('width');
    const heightAttr = svg.getAttribute('height');
    const width = widthAttr ? parseFloat(widthAttr) : svg.viewBox?.baseVal?.width;
    const height = heightAttr ? parseFloat(heightAttr) : svg.viewBox?.baseVal?.height;

    if (width && height && !svg.getAttribute('viewBox')) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    svg.setAttribute('width', '100%');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }

  async function loadInlineSvg() {
    const url = getUrl();
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`GitHub activity fetch failed: ${res.status}`);
    const svgText = await res.text();

    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) throw new Error('No SVG in response');

    const cssEmpty = getComputedStyle(container).getPropertyValue('--gh-empty').trim();
    const parsedEmpty = parseCssRgba(cssEmpty) || { r: 244, g: 245, b: 247, a: 0.1 };

    // Round corners on the day squares.
    // ghchart uses <rect> nodes for each day cell; we set rx/ry on all rects.
    const rects = Array.from(svg.querySelectorAll('rect')).filter((rect) => {
      const w = Number(rect.getAttribute('width'));
      const h = Number(rect.getAttribute('height'));
      const x = Number(rect.getAttribute('x'));
      const y = Number(rect.getAttribute('y'));
      return Number.isFinite(w) && Number.isFinite(h) && Number.isFinite(x) && Number.isFinite(y) && w > 0 && h > 0;
    });

    // Make spacing between squares exactly 2px by shrinking squares within their pitch.
    // We infer pitch from the smallest delta between unique x/y positions.
    const targetGap = 2;
    const uniqSorted = (values) => Array.from(new Set(values.map((v) => Number(v).toFixed(3)))).map(Number).sort((a, b) => a - b);
    const xs = uniqSorted(rects.map((r) => Number(r.getAttribute('x'))));
    const ys = uniqSorted(rects.map((r) => Number(r.getAttribute('y'))));
    const minDelta = (arr) => {
      let d = Infinity;
      for (let i = 1; i < arr.length; i++) d = Math.min(d, arr[i] - arr[i - 1]);
      return Number.isFinite(d) ? d : null;
    };
    const pitchX = minDelta(xs);
    const pitchY = minDelta(ys);
    const sampleW = Number(rects[0]?.getAttribute('width')) || 0;
    const sampleH = Number(rects[0]?.getAttribute('height')) || 0;
    const newW = pitchX ? Math.max(1, pitchX - targetGap) : sampleW;
    const newH = pitchY ? Math.max(1, pitchY - targetGap) : sampleH;
    const dx = (sampleW - newW) / 2;
    const dy = (sampleH - newH) / 2;

    rects.forEach((rect) => {
      if (pitchX && sampleW) {
        const x = Number(rect.getAttribute('x'));
        rect.setAttribute('x', String(x + dx));
        rect.setAttribute('width', String(newW));
      }
      if (pitchY && sampleH) {
        const y = Number(rect.getAttribute('y'));
        rect.setAttribute('y', String(y + dy));
        rect.setAttribute('height', String(newH));
      }

      rect.setAttribute('rx', '3');
      rect.setAttribute('ry', '3');

      // Dark mode: the "0 contributions" squares are very bright by default.
      // Detect near-white fills and replace with a subtle neutral tint.
      const fill = getRectFill(rect).trim().toLowerCase();
      const isEmptyFill =
        fill === '#ebedf0' ||
        fill === '#eee' ||
        fill === '#eeeeee' ||
        fill === '#fff' ||
        fill === '#ffffff' ||
        fill === 'white' ||
        fill === 'rgb(235, 237, 240)' ||
        fill === 'rgb(238, 238, 238)' ||
        fill === 'rgb(255, 255, 255)';

      if (isEmptyFill) {
        // Use fill + fill-opacity (more reliable than rgba() in SVG across browsers).
        rect.setAttribute('fill', `rgb(${parsedEmpty.r}, ${parsedEmpty.g}, ${parsedEmpty.b})`);
        rect.setAttribute('fill-opacity', String(parsedEmpty.a));
      }
    });

    makeSvgResponsive(svg);

    // Replace existing SVG (if any) and hide the <img> fallback.
    container.querySelector('svg')?.remove();
    container.appendChild(svg);
    img.removeAttribute('src');
    img.style.display = 'none';
  }

  function refresh() {
    loadInlineSvg().catch(() => {
      showImgFallback();
    });
  }

  refresh();

  // Re-apply color if theme toggle updates CSS variables.
  document.addEventListener('themechange', refresh);
})();

