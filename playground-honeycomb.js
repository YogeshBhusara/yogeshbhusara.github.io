/**
 * Playground honeycomb — adapted from https://github.com/YogeshBhusara/honeycomb-grid (MIT).
 * Standalone script; expects DOM ids hcScrollport, hcCanvas, hcPan, hcGrid, hcModal, etc.
 */
const projects = [
  { id: "work-01", title: "Work item 01", image: "assets/work/work-01.png" },
  { id: "work-02", title: "Work item 02", image: "assets/work/work-02.png" },
  { id: "work-03", title: "Work item 03", image: "assets/work/work-03.png" },
  { id: "work-04", title: "Work item 04", image: "assets/work/work-04.png" },
  { id: "work-05", title: "Work item 05", image: "assets/work/work-05.png" },
  { id: "work-06", title: "Work item 06", image: "assets/work/work-06.png" },
  { id: "work-07", title: "Work item 07", image: "assets/work/work-07.png" },
  { id: "work-08", title: "Work item 08", image: "assets/work/work-08.png" },
  { id: "work-09", title: "Work item 09", image: "assets/work/work-09.png" },
  { id: "work-10", title: "Work item 10", image: "assets/work/work-10.png" },
  { id: "work-11", title: "Work item 11", image: "assets/work/work-11.png" },
  { id: "work-12", title: "Work item 12", image: "assets/work/work-12.png" },
  { id: "work-13", title: "Work item 13", image: "assets/work/work-13.png" },
  { id: "work-14", title: "Work item 14", image: "assets/work/work-14.png" },
  { id: "work-15", title: "Work item 15", image: "assets/work/work-15.png" },
  { id: "work-16", title: "Work item 16", image: "assets/work/work-16.png" },
  { id: "work-17", title: "Work item 17", image: "assets/work/work-17.png" },
  { id: "work-18", title: "Work item 18", image: "assets/work/work-18.png" },
  { id: "work-19", title: "Work item 19", image: "assets/work/work-19.png" },
  {
    id: "repo-bookshelf",
    title: "Bookshelf",
    image: "assets/playground/bookshelf.svg",
    repo: "https://github.com/YogeshBhusara/bookshelf",
  },
  {
    id: "repo-kaleidosense",
    title: "KaleidoSense",
    image: "assets/playground/kaleidosense.svg",
    repo: "https://github.com/YogeshBhusara/KaleidoSense",
  },
  {
    id: "repo-glass-effect",
    title: "Glass Effect Playground",
    image: "assets/playground/glass-effect-playground.svg",
    repo: "https://github.com/YogeshBhusara/glass-effect-playground",
  },
  {
    id: "repo-periodic-table",
    title: "Periodic Table SwiftUI",
    image: "assets/playground/periodic-table.svg",
    repo: "https://github.com/YogeshBhusara/Periodic-Table-SwiftUI",
  },
  {
    id: "repo-spendsense",
    title: "SpendSense",
    image: "assets/playground/spendsense.svg",
    repo: "https://github.com/YogeshBhusara/SpendSense",
  },
  {
    id: "repo-swiftui-effects",
    title: "SwiftUI Effects",
    image: "assets/playground/swiftui-effects.svg",
    repo: "https://github.com/YogeshBhusara/SwiftUI-Effects",
  },
];

const scrollport = document.getElementById("hcScrollport");
const canvasSquare = document.getElementById("hcCanvas");
const panLayer = document.getElementById("hcPan");
const grid = document.getElementById("hcGrid");
const modal = document.getElementById("hcModal");
const modalBackdrop = document.getElementById("hcModalBackdrop");
const modalClose = document.getElementById("hcModalClose");
const modalRepo = document.getElementById("hcModalRepo");
const modalImage = document.getElementById("hcModalImage");

let modalReturnFocus = null;
let items = [];

let suppressCellClickUntil = 0;
let pointerStartCell = null;
let lastOpenedCell = null;
let morphAnimating = false;
let activeFlyer = null;
let morphFallbackTimer = 0;

const TAP_MAX_MOVE = 12;
/** Cell ↔ modal morph duration (ms); slightly snappier than 560ms for a smoother feel. */
const MORPH_MS = 400;
const MORPH_EASING_OPEN = "cubic-bezier(0.22, 1, 0.36, 1)";
const MORPH_EASING_CLOSE = "cubic-bezier(0.55, 0, 0.12, 1)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const pan = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  dragging: false,
  pointerId: null,
  lastX: 0,
  lastY: 0,
  lastT: 0,
  totalMoved: 0,
};

/** Higher = scales track focal point faster (Watch-like snap). */
const SCALE_LERP = 0.58;
const MOMENTUM_SPEED_THRESHOLD = 0.00085;
const WHEEL_LINE_HEIGHT = 16;
const WHEEL_PAGE_RATIO = 0.9;

/**
 * Hex center distance / cell diameter for flat-top neighbors (from `axialToPixel`):
 * D = cell * (√3/2) * HEX_CENTER_SPACING. Must exceed max fisheye scale so radii do not meet.
 */
const HEX_CENTER_SPACING = 1.3;
/** Scale at corners / rim of the square (pinprick “more apps” dots, Watch-style). */
const FISHEYE_MIN = 0.032;
/** Outer-ring repo cells stay larger than default rim pinpricks so they remain discoverable. */
const REPO_RIM_MIN_SCALE = 0.16;
/** Desired scale at dead center (clamped per-frame by geometry so neighbors never overlap). */
const FISHEYE_CENTER = 1.1;
/** 0 = pure radial; higher blends square-ish distance so corners shrink like Apple Watch. */
const FISHEYE_SQUARE_MIX = 0.44;
/** Nominal upper bound; actual scale is min(this, `maxHoneycombVisualScale`). */
const FISHEYE_ABS_MAX = 1.14;

/** Neighbor center distance ÷ `cell` (flat-top hex, six nearest neighbors). */
const HEX_NEIGHBOR_DIST_OVER_CELL = (Math.sqrt(3) / 2) * HEX_CENTER_SPACING;

let honeycombCellPx = 100;

function maxHoneycombVisualScale(cellPx) {
  if (!Number.isFinite(cellPx) || cellPx < 40) return 1;
  /** Extra slack for subpixel layout, inset shadows, and tiny CSS/DOM vs math drift. */
  const gutterPx = Math.max(3.5, cellPx * 0.042);
  const ratio = HEX_NEIGHBOR_DIST_OVER_CELL - gutterPx / cellPx - 0.012;
  return clamp(ratio, 0.62, 1.08);
}

let lastWheelT = 0;
let lastFrameT = 0;
let momentumRaf = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isModalOpen() {
  return !modal.hasAttribute("hidden");
}

/**
 * Keep pan inside scrollport so the honeycomb cannot drift into empty space.
 * Uses the grid’s layout box (unscaled); good enough to stop “infinite” panning.
 */
function enforcePanBounds() {
  const W = scrollport.clientWidth;
  const H = scrollport.clientHeight;
  const Gw = grid.offsetWidth;
  const Gh = grid.offsetHeight;
  if (W < 1 || H < 1 || Gw < 1 || Gh < 1) return;

  const minX = Math.min(0, W - Gw);
  const maxX = Math.max(0, W - Gw);
  const minY = Math.min(0, H - Gh);
  const maxY = Math.max(0, H - Gh);

  const nx = clamp(pan.x, minX, maxX);
  const ny = clamp(pan.y, minY, maxY);
  if (nx !== pan.x) pan.vx = 0;
  if (ny !== pan.y) pan.vy = 0;
  pan.x = nx;
  pan.y = ny;
}

function applyPan() {
  enforcePanBounds();
  panLayer.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0)`;
}

function stopMomentumLoop() {
  if (momentumRaf) {
    cancelAnimationFrame(momentumRaf);
    momentumRaf = 0;
  }
}

function normalizeWheelDelta(event) {
  let dx = event.deltaX;
  let dy = event.deltaY;
  if (event.deltaMode === 1) {
    dx *= WHEEL_LINE_HEIGHT;
    dy *= WHEEL_LINE_HEIGHT;
  } else if (event.deltaMode === 2) {
    const sr = scrollport.getBoundingClientRect();
    dx *= sr.width * WHEEL_PAGE_RATIO;
    dy *= sr.height * WHEEL_PAGE_RATIO;
  }
  return { dx, dy };
}

function integrateMomentum(dt) {
  const ms = clamp(dt, 5, 38);
  pan.x += pan.vx * ms;
  pan.y += pan.vy * ms;

  const damping = Math.exp(-ms / 228);
  pan.vx *= damping;
  pan.vy *= damping;

  if (Math.hypot(pan.vx, pan.vy) < 0.00038) {
    pan.vx = 0;
    pan.vy = 0;
  }
}

/**
 * Focal scales without per-tile getBoundingClientRect (major main-thread win).
 * Cell centers in grid CSS pixels are stored on each item as data-grid-cx / data-grid-cy.
 */
function updateHoneycombScales() {
  if (!items.length) return 0;

  const sr = scrollport.getBoundingClientRect();
  const w = sr.width;
  const h = sr.height;
  const vcx = sr.left + w / 2;
  const vcy = sr.top + h / 2;

  const gr = grid.getBoundingClientRect();

  let maxErr = 0;

  for (let i = 0; i < items.length; i += 1) {
    const el = items[i];
    const gcx = el.__gridCx;
    const gcy = el.__gridCy;
    if (typeof gcx !== "number" || typeof gcy !== "number") continue;

    const sx = gr.left + gcx;
    const sy = gr.top + gcy;

    const ndx = (sx - vcx) / (w * 0.5);
    const ndy = (sy - vcy) / (h * 0.5);
    /** Circular distance in [0,1] (1 at corners along diagonals). */
    const uCircle = clamp(Math.hypot(ndx, ndy) / Math.SQRT2, 0, 1);
    /** Chebyshev / “square” distance: 1 along entire rim — shrinks edge midpoints more like Watch. */
    const uSquare = clamp(Math.max(Math.abs(ndx), Math.abs(ndy)), 0, 1);
    const u = clamp(
      uCircle * (1 - FISHEYE_SQUARE_MIX) + uSquare * FISHEYE_SQUARE_MIX,
      0,
      1
    );
    /** Hemisphere: bulging sphere; `u` already corner-heavy for a square viewport. */
    const z = Math.sqrt(Math.max(0, 1 - u * u));
    let target = FISHEYE_MIN + z * (FISHEYE_CENTER - FISHEYE_MIN);
    target *= 1 + 0.055 * z * z * z;
    const scaleCap = maxHoneycombVisualScale(honeycombCellPx);
    const isRepo = el.classList.contains("hc-grid-cell--repo");
    const rimMin = isRepo ? REPO_RIM_MIN_SCALE : FISHEYE_MIN * 0.85;
    target = clamp(target, rimMin, Math.min(FISHEYE_ABS_MAX, scaleCap));
    const prev = el.__honeyScale ?? target;
    const next = clamp(prev + (target - prev) * SCALE_LERP, rimMin, scaleCap);
    el.__honeyScale = next;
    el.style.transform = `scale(${next})`;
    maxErr = Math.max(maxErr, Math.abs(next - target));
  }

  return maxErr;
}

function frame(now) {
  momentumRaf = 0;

  if (isModalOpen()) {
    return;
  }

  const prev = lastFrameT || now;
  const dt = clamp(now - prev, 5, 40);
  lastFrameT = now;

  if (!pan.dragging && (pan.vx !== 0 || pan.vy !== 0)) {
    integrateMomentum(dt);
    applyPan();
  }

  const scaleErr = updateHoneycombScales();

  const movingPan = pan.dragging || Math.hypot(pan.vx, pan.vy) > 0.00055;
  const settlingScales = scaleErr > 0.0035;

  if (movingPan || settlingScales) {
    momentumRaf = requestAnimationFrame(frame);
  }
}

function kickFrameLoop() {
  if (isModalOpen()) return;
  if (!momentumRaf) {
    lastFrameT = performance.now();
    momentumRaf = requestAnimationFrame(frame);
  }
}

function axialDistance(q, r) {
  const s = -q - r;
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
}

function axialDisk(radius) {
  const out = [];
  for (let q = -radius; q <= radius; q += 1) {
    for (let r = -radius; r <= radius; r += 1) {
      const s = -q - r;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) > radius) continue;
      out.push({ q, r });
    }
  }
  out.sort((a, b) => {
    const da = axialDistance(a.q, a.r);
    const db = axialDistance(b.q, b.r);
    if (da !== db) return da - db;
    if (a.q !== b.q) return a.q - b.q;
    return a.r - b.r;
  });
  return out;
}

/** Flat-top hex lattice; `cell` is circle / tile diameter. Centers are spaced by HEX_CENTER_SPACING. */
function axialToPixel(q, r, cell) {
  const size = cell * 0.5 * HEX_CENTER_SPACING;
  const x = size * (3 / 2) * q;
  const y = size * Math.sqrt(3) * (r + q / 2);
  return { x, y };
}

function readCanvasMetrics() {
  const cs = getComputedStyle(canvasSquare);
  let cell = parseFloat(cs.getPropertyValue("--cell"));
  let pad = parseFloat(cs.getPropertyValue("--grid-pad"));
  const m = Math.min(canvasSquare.clientWidth, canvasSquare.clientHeight);
  if (!Number.isFinite(cell) || cell < 40) {
    const padGuess = clamp(m * 0.09, 24, 96);
    cell = clamp((m - 2 * padGuess) / 2.95, 48, 220);
  }
  if (!Number.isFinite(pad) || pad < 20) {
    pad = clamp(m * 0.075, 28, 56);
  }
  return { cell, pad };
}

function computeTargetCellCount(viewW, viewH, cell) {
  void viewW;
  void viewH;
  void cell;
  /**
   * One visual tile per work item (no repeats).
   * When you add more items later, the honeycomb will expand automatically.
   */
  return projects.length;
}

function measureDisk(radius, cell, pad) {
  const coords = axialDisk(radius);
  let minEdgeX = Infinity;
  let minEdgeY = Infinity;
  let maxEdgeX = -Infinity;
  let maxEdgeY = -Infinity;
  for (const { q, r } of coords) {
    const { x: cx, y: cy } = axialToPixel(q, r, cell);
    minEdgeX = Math.min(minEdgeX, cx - cell / 2);
    minEdgeY = Math.min(minEdgeY, cy - cell / 2);
    maxEdgeX = Math.max(maxEdgeX, cx + cell / 2);
    maxEdgeY = Math.max(maxEdgeY, cy + cell / 2);
  }
  const innerW = maxEdgeX - minEdgeX;
  const innerH = maxEdgeY - minEdgeY;
  const gridW = innerW + 2 * pad;
  const gridH = innerH + 2 * pad;
  return { coords, cell, pad, minEdgeX, minEdgeY, gridW, gridH };
}

function planHoneycomb(viewW, viewH) {
  const { cell, pad } = readCanvasMetrics();
  const targetCount = computeTargetCellCount(viewW, viewH, cell);

  let chosen = measureDisk(0, cell, pad);
  for (let R = 1; R <= 36; R += 1) {
    const next = measureDisk(R, cell, pad);
    chosen = next;
    if (next.coords.length >= targetCount) {
      break;
    }
  }
  return chosen;
}

let layoutDebounce = 0;

function scheduleHoneycombLayout() {
  if (isModalOpen()) return;
  window.clearTimeout(layoutDebounce);
  layoutDebounce = window.setTimeout(() => {
    layoutDebounce = 0;
    rebuildHoneycomb();
  }, 100);
}

function rebuildHoneycomb() {
  if (isModalOpen()) return;
  const vw = scrollport.clientWidth;
  const vh = scrollport.clientHeight;
  if (vw < 40 || vh < 40) return;

  pan.x = 0;
  pan.y = 0;
  pan.vx = 0;
  pan.vy = 0;
  applyPan();

  const plan = planHoneycomb(vw, vh);
  const { coords, cell, pad, minEdgeX, minEdgeY, gridW, gridH } = plan;
  honeycombCellPx = cell;

  grid.replaceChildren();
  grid.style.width = `${Math.ceil(gridW)}px`;
  grid.style.height = `${Math.ceil(gridH)}px`;

  coords.slice(0, projects.length).forEach(({ q, r }, index) => {
    const project = projects[index];
    const { x: cx, y: cy } = axialToPixel(q, r, cell);
    const left = pad + (cx - cell / 2) - minEdgeX;
    const top = pad + (cy - cell / 2) - minEdgeY;

    const cellEl = document.createElement("div");
    cellEl.className = project.repo ? "hc-grid-cell hc-grid-cell--repo" : "hc-grid-cell";
    cellEl.setAttribute("role", "listitem");
    cellEl.tabIndex = 0;
    cellEl.dataset.projectBaseId = project.id;
    cellEl.dataset.axialQ = String(q);
    cellEl.dataset.axialR = String(r);
    cellEl.setAttribute("aria-label", `${project.title}. View details.`);
    cellEl.style.left = `${left}px`;
    cellEl.style.top = `${top}px`;
    cellEl.style.width = `${cell}px`;
    cellEl.style.height = `${cell}px`;
    cellEl.__gridCx = left + cell / 2;
    cellEl.__gridCy = top + cell / 2;

    const media = document.createElement("div");
    media.className = "hc-grid-cell__media";

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";

    media.append(img);
    cellEl.append(media);
    grid.append(cellEl);
  });

  items = Array.from(grid.querySelectorAll(".hc-grid-cell"));
  const w0 = items[0]?.getBoundingClientRect().width;
  if (Number.isFinite(w0) && w0 > 40) honeycombCellPx = w0;
  centerOnMiddleItem();
  kickFrameLoop();
}

function centerOnMiddleItem() {
  if (!items.length) return;

  pan.x = 0;
  pan.y = 0;
  pan.vx = 0;
  pan.vy = 0;
  applyPan();

  const mid =
    items.find((el) => el.dataset.axialQ === "0" && el.dataset.axialR === "0") ?? items[0];
  const sr = scrollport.getBoundingClientRect();
  const vcx = sr.left + sr.width / 2;
  const vcy = sr.top + sr.height / 2;

  if (typeof mid.__gridCx === "number" && typeof mid.__gridCy === "number") {
    const gr = grid.getBoundingClientRect();
    const scx = gr.left + mid.__gridCx;
    const scy = gr.top + mid.__gridCy;
    pan.x -= scx - vcx;
    pan.y -= scy - vcy;
  } else {
    const rect = mid.getBoundingClientRect();
    pan.x -= rect.left + rect.width / 2 - vcx;
    pan.y -= rect.top + rect.height / 2 - vcy;
  }
  applyPan();
}

function projectFromCell(el) {
  const id = el.dataset.projectBaseId;
  return projects.find((p) => p.id === id) ?? null;
}

function syncModalRepoLink(project) {
  if (!modalRepo) return;
  if (project?.repo) {
    modalRepo.href = project.repo;
    modalRepo.setAttribute("aria-label", `View ${project.title} on GitHub`);
    modalRepo.hidden = false;
  } else {
    modalRepo.removeAttribute("href");
    modalRepo.hidden = true;
  }
}

function clearMorphFallback() {
  if (morphFallbackTimer) {
    clearTimeout(morphFallbackTimer);
    morphFallbackTimer = 0;
  }
}

function removeActiveFlyer() {
  if (activeFlyer && activeFlyer.parentNode) {
    if (typeof activeFlyer.__onEnd === "function") {
      activeFlyer.removeEventListener("transitionend", activeFlyer.__onEnd);
    }
    activeFlyer.remove();
  }
  activeFlyer = null;
}

function openModalImmediate(project) {
  pan.vx = 0;
  pan.vy = 0;
  pan.dragging = false;
  stopMomentumLoop();

  modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modalImage.src = project.image;
  modalImage.alt = project.title ? `Preview: ${project.title}` : "Preview image";
  syncModalRepoLink(project);
  modal.setAttribute("aria-label", project.repo ? `${project.title} preview` : "Image preview");
  modal.classList.remove("hc-modal--entering");
  modal.removeAttribute("hidden");
  modalClose.focus({ preventScroll: true });
}

function openModalFromCell(cell, project) {
  if (morphAnimating) return;

  if (prefersReducedMotion()) {
    lastOpenedCell = cell;
    openModalImmediate(project);
    return;
  }

  morphAnimating = true;
  lastOpenedCell = cell;
  pan.vx = 0;
  pan.vy = 0;
  pan.dragging = false;
  stopMomentumLoop();

  modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modalImage.src = project.image;
  modalImage.alt = project.title ? `Preview: ${project.title}` : "Preview image";
  syncModalRepoLink(project);
  modal.setAttribute("aria-label", project.repo ? `${project.title} preview` : "Image preview");

  modal.removeAttribute("hidden");
  modal.classList.add("hc-modal--entering");
  scrollport.style.pointerEvents = "none";

  const runMorph = () => {
    const to = modalImage.getBoundingClientRect();
    const from = cell.getBoundingClientRect();

    const flyer = document.createElement("img");
    flyer.draggable = false;
    flyer.src = project.image;
    flyer.alt = "";
    activeFlyer = flyer;

    Object.assign(flyer.style, {
      position: "fixed",
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      objectFit: "cover",
      zIndex: "120",
      pointerEvents: "none",
      transformOrigin: "center center",
      borderRadius: "999px",
      boxShadow: "0 20px 55px rgba(0, 0, 0, 0.42)",
      willChange: "transform",
    });

    const scaleX = from.width / to.width;
    const scaleY = from.height / to.height;
    const tx = from.left + from.width / 2 - (to.left + to.width / 2);
    const ty = from.top + from.height / 2 - (to.top + to.height / 2);
    flyer.style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;

    document.body.appendChild(flyer);

    let openDone = false;
    const finishOpen = () => {
      if (openDone) return;
      openDone = true;
      clearMorphFallback();
      removeActiveFlyer();
      modal.classList.remove("hc-modal--entering");
      scrollport.style.pointerEvents = "";
      morphAnimating = false;
      modalClose.focus({ preventScroll: true });
    };

    const onEnd = (ev) => {
      if (ev.target !== flyer || ev.propertyName !== "transform") return;
      finishOpen();
    };
    flyer.__onEnd = onEnd;
    flyer.addEventListener("transitionend", onEnd);

    morphFallbackTimer = window.setTimeout(finishOpen, MORPH_MS + 100);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyer.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASING_OPEN}, border-radius ${MORPH_MS}ms ${MORPH_EASING_OPEN}`;
        flyer.style.transform = "translate(0px, 0px) scale(1, 1)";
        flyer.style.borderRadius = "0px";
      });
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(runMorph);
  });
}

function closeModalImmediate() {
  clearMorphFallback();
  removeActiveFlyer();
  morphAnimating = false;
  scrollport.style.pointerEvents = "";
  modal.classList.remove("hc-modal--entering");
  modal.setAttribute("hidden", "");
  syncModalRepoLink(null);
  modalReturnFocus?.focus({ preventScroll: true });
  modalReturnFocus = null;
  lastOpenedCell = null;
  kickFrameLoop();
}

function closeModal() {
  if (morphAnimating) return;

  if (prefersReducedMotion() || !lastOpenedCell || !document.body.contains(lastOpenedCell)) {
    closeModalImmediate();
    return;
  }

  morphAnimating = true;
  scrollport.style.pointerEvents = "none";

  const from = modalImage.getBoundingClientRect();
  const to = lastOpenedCell.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.draggable = false;
  flyer.src = modalImage.src;
  flyer.alt = "";
  activeFlyer = flyer;

  Object.assign(flyer.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: "cover",
    zIndex: "120",
    pointerEvents: "none",
    transformOrigin: "center center",
    borderRadius: "0px",
    boxShadow: "0 20px 55px rgba(0, 0, 0, 0.42)",
    willChange: "transform",
  });

  document.body.appendChild(flyer);
  modal.setAttribute("hidden", "");

  let closeDone = false;
  const finishClose = () => {
    if (closeDone) return;
    closeDone = true;
    clearMorphFallback();
    removeActiveFlyer();
    morphAnimating = false;
    scrollport.style.pointerEvents = "";
    modalReturnFocus?.focus({ preventScroll: true });
    modalReturnFocus = null;
    lastOpenedCell = null;
    kickFrameLoop();
  };

  const onEnd = (ev) => {
    if (ev.target !== flyer || ev.propertyName !== "transform") return;
    finishClose();
  };
  flyer.__onEnd = onEnd;
  flyer.addEventListener("transitionend", onEnd);

  morphFallbackTimer = window.setTimeout(finishClose, MORPH_MS + 110);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const scaleX = to.width / from.width;
      const scaleY = to.height / from.height;
      const tx = to.left + to.width / 2 - (from.left + from.width / 2);
      const ty = to.top + to.height / 2 - (from.top + from.height / 2);
      flyer.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASING_CLOSE}, border-radius ${MORPH_MS}ms ${MORPH_EASING_CLOSE}`;
      flyer.style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;
      flyer.style.borderRadius = "999px";
    });
  });
}

function onScrollportPointerDown(event) {
  if (!event.isPrimary) return;
  if (morphAnimating) return;
  if (isModalOpen()) return;
  if (event.button !== 0) return;

  pointerStartCell = event.target.closest?.(".hc-grid-cell") ?? null;

  pan.dragging = true;
  pan.pointerId = event.pointerId;
  pan.lastX = event.clientX;
  pan.lastY = event.clientY;
  pan.lastT = performance.now();
  pan.totalMoved = 0;
  pan.vx = 0;
  pan.vy = 0;
  stopMomentumLoop();

  scrollport.classList.add("is-dragging");
  scrollport.setPointerCapture(event.pointerId);
  kickFrameLoop();
}

function onScrollportPointerMove(event) {
  if (!pan.dragging || event.pointerId !== pan.pointerId) return;

  const coalesced =
    typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [];
  const samples = coalesced.length > 0 ? coalesced : [event];

  let accDx = 0;
  let accDy = 0;
  let lx = pan.lastX;
  let ly = pan.lastY;
  for (let i = 0; i < samples.length; i += 1) {
    const ev = samples[i];
    accDx += ev.clientX - lx;
    accDy += ev.clientY - ly;
    lx = ev.clientX;
    ly = ev.clientY;
  }

  const now = performance.now();
  const dt = Math.max(1, now - pan.lastT);

  pan.x += accDx;
  pan.y += accDy;
  pan.vx = accDx / dt;
  pan.vy = accDy / dt;

  pan.lastX = event.clientX;
  pan.lastY = event.clientY;
  pan.lastT = now;
  pan.totalMoved += Math.hypot(accDx, accDy);

  applyPan();
  updateHoneycombScales();
  kickFrameLoop();
}

function onScrollportPointerUp(event) {
  if (!pan.dragging || event.pointerId !== pan.pointerId) return;

  pan.dragging = false;
  scrollport.releasePointerCapture(event.pointerId);
  pan.pointerId = null;
  scrollport.classList.remove("is-dragging");

  const speed = Math.hypot(pan.vx, pan.vy);
  if (speed > MOMENTUM_SPEED_THRESHOLD) {
    pan.vx *= 0.985;
    pan.vy *= 0.985;
  } else {
    pan.vx = 0;
    pan.vy = 0;
  }

  if (pan.totalMoved > TAP_MAX_MOVE) {
    suppressCellClickUntil = performance.now() + 320;
  }

  const wasTap = pan.totalMoved <= TAP_MAX_MOVE;
  if (wasTap && pointerStartCell) {
    const project = projectFromCell(pointerStartCell);
    if (project) {
      openModalFromCell(pointerStartCell, project);
      suppressCellClickUntil = performance.now() + 520;
    }
  }

  pointerStartCell = null;

  kickFrameLoop();
}

function onScrollportLostCapture() {
  pan.dragging = false;
  scrollport.classList.remove("is-dragging");
  pointerStartCell = null;
}

function onWheel(event) {
  if (morphAnimating) return;
  if (isModalOpen()) return;

  event.preventDefault();

  const { dx: rawDx, dy: rawDy } = normalizeWheelDelta(event);
  let dx = rawDx * 0.98;
  let dy = rawDy * 0.98;

  if (event.shiftKey && dx === 0 && dy !== 0) {
    dx = dy;
    dy = 0;
  }

  const now = performance.now();
  if (!lastWheelT) lastWheelT = now;
  const dt = clamp(now - lastWheelT, 10, 36);
  lastWheelT = now;

  pan.x -= dx;
  pan.y -= dy;

  const wheelGain = 1.12;
  pan.vx = clamp((-dx / dt) * wheelGain, -3.1, 3.1);
  pan.vy = clamp((-dy / dt) * wheelGain, -3.1, 3.1);

  applyPan();
  updateHoneycombScales();
  kickFrameLoop();
}

function onGridClick(event) {
  if (morphAnimating) return;
  if (isModalOpen()) return;
  if (performance.now() < suppressCellClickUntil) return;

  const cell = event.target.closest?.(".hc-grid-cell");
  if (!cell) return;

  const project = projectFromCell(cell);
  if (project) openModalFromCell(cell, project);
}

grid.addEventListener("click", onGridClick);

grid.addEventListener("keydown", (event) => {
  if (morphAnimating) return;
  if (isModalOpen()) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  const cell = event.target.closest?.(".hc-grid-cell");
  if (!cell) return;
  event.preventDefault();
  const project = projectFromCell(cell);
  if (project) openModalFromCell(cell, project);
});

scrollport.addEventListener("pointerdown", onScrollportPointerDown);
scrollport.addEventListener("pointermove", onScrollportPointerMove);
scrollport.addEventListener("pointerup", onScrollportPointerUp);
scrollport.addEventListener("pointercancel", onScrollportPointerUp);
scrollport.addEventListener("lostpointercapture", onScrollportLostCapture);
scrollport.addEventListener("wheel", onWheel, { passive: false });

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!morphAnimating && modal.hasAttribute("hidden")) return;
  event.preventDefault();
  if (morphAnimating) {
    closeModalImmediate();
    return;
  }
  closeModal();
});

window.addEventListener("resize", () => {
  if (isModalOpen()) return;
  scheduleHoneycombLayout();
});

new ResizeObserver(() => {
  if (isModalOpen()) return;
  scheduleHoneycombLayout();
}).observe(scrollport);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    rebuildHoneycomb();
  });
});
