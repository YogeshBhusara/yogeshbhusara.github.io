const canvas = document.getElementById("distort-canvas");
if (!canvas) {
  throw new Error('Missing <canvas id="distort-canvas"> in the DOM.');
}

// Respect reduced motion + avoid touch/coarse pointers (cursor effect doesn't make sense there).
const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const isCoarsePointer =
  window.matchMedia?.("(pointer: coarse)")?.matches ??
  window.matchMedia?.("(hover: none)")?.matches ??
  "ontouchstart" in window;

const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

let width = 0;
let height = 0;

// Tunables (dialed for a UX portfolio: subtle, calm, premium)
const background = "#0b0b0b";
const pixelSize = 14;
const baseRadius = 105;
const maxOpacity = 0.22; // overall cap for overlay opacity
const jitterScale = 0.35; // 0..1 (lower = less visual noise)
const wobbleScale = 0.18; // subtle movement, avoids "sparkle"
const grainScale = 0.22; // color variation per cell
const aberrationScale = 0.45; // chromatic split strength

// Pointer state + velocity smoothing
const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.4,
  lastX: window.innerWidth * 0.5,
  lastY: window.innerHeight * 0.4,
  vx: 0,
  vy: 0,
  speed: 0,
};

let lastT = performance.now();
let rafId = 0;
let time = 0;

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

function smoothstep01(t) {
  // Smoothstep in [0..1]
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(n) {
  return n - Math.floor(n);
}

// Fast deterministic hash in [0, 1)
function hash2(x, y, seed = 0) {
  // "random" based on cell coords; cheap + stable
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function snapToGrid(value) {
  return Math.floor(value / pixelSize) * pixelSize;
}

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  width = Math.floor(window.innerWidth);
  height = Math.floor(window.innerHeight);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function onPointerMove(e) {
  // Use client coords (already in CSS pixels).
  pointer.x = e.clientX;
  pointer.y = e.clientY;
}

function start() {
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Pointer events are unified (mouse/pen). If not supported, fall back.
  if ("PointerEvent" in window) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  } else {
    window.addEventListener(
      "mousemove",
      (e) => onPointerMove(e),
      { passive: true }
    );
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastT = performance.now();
      rafId = requestAnimationFrame(draw);
    }
  });

  rafId = requestAnimationFrame(draw);
}

function draw(now) {
  const dt = Math.max(0.001, Math.min(0.05, (now - lastT) / 1000));
  lastT = now;
  time += dt;

  // Estimate velocity + smooth it (reduces jitter and looks more premium).
  const instVx = (pointer.x - pointer.lastX) / dt;
  const instVy = (pointer.y - pointer.lastY) / dt;
  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;

  const lerpFactor = 1 - Math.pow(0.001, dt); // framerate-independent smoothing
  pointer.vx += (instVx - pointer.vx) * lerpFactor;
  pointer.vy += (instVy - pointer.vy) * lerpFactor;

  const instSpeed = Math.hypot(pointer.vx, pointer.vy);
  pointer.speed += (instSpeed - pointer.speed) * lerpFactor;

  // Background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Velocity-driven radius + intensity
  const speed01 = clamp(pointer.speed / 1400, 0, 1);
  const radius = baseRadius + speed01 * 140;
  const r2 = radius * radius;

  // Clamp drawing bounds to canvas, and snap to our pixel grid.
  const minX = snapToGrid(clamp(pointer.x - radius, 0, width));
  const maxX = snapToGrid(clamp(pointer.x + radius, 0, width));
  const minY = snapToGrid(clamp(pointer.y - radius, 0, height));
  const maxY = snapToGrid(clamp(pointer.y + radius, 0, height));

  // Color dynamics: slight shift with speed; alpha + brightness with falloff.
  const baseR = 135 + Math.floor(speed01 * 40);
  const baseG = 75 + Math.floor(speed01 * 20);
  const baseB = 255;

  for (let gx = minX; gx <= maxX; gx += pixelSize) {
    for (let gy = minY; gy <= maxY; gy += pixelSize) {
      // Organic jitter: per-cell offsets that animate subtly over time.
      // Jitter strength scales with falloff so it feels "liquid" near cursor and stable outside.
      const cellX = Math.floor(gx / pixelSize);
      const cellY = Math.floor(gy / pixelSize);
      const n1 = hash2(cellX, cellY, 1);
      const n2 = hash2(cellX, cellY, 2);

      // Cheap animated wobble (no external noise): phase derived from cell hash.
      const phase = (n1 + n2) * 6.283185307179586; // 2π
      const wobble = Math.sin(time * (0.6 + n2 * 0.6) + phase) * wobbleScale;

      // Compute distance using jittered sample point (helps break grid feel).
      const jitterMax = pixelSize * (0.55 * jitterScale);
      const jx = (n1 - 0.5) * jitterMax + wobble * pixelSize * 0.18;
      const jy = (n2 - 0.5) * jitterMax - wobble * pixelSize * 0.18;

      const x = gx + jx;
      const y = gy + jy;

      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;

      // Smooth falloff: 1 at center -> 0 at edge (no hard ring).
      const t = 1 - d2 / r2;
      const falloff = smoothstep01(t);

      // Distortion strength increases with speed but remains subtle when slow.
      const strength = falloff * (0.22 + speed01 * 0.6);

      const a = Math.min(maxOpacity, 0.06 + strength * 0.26);
      // Per-cell variation in brightness/saturation to feel more organic.
      const grain = ((n1 - 0.5) * 2) * grainScale; // [-grainScale, grainScale]
      const r = baseR + Math.floor(strength * (70 + grain * 18));
      const g = baseG + Math.floor(strength * (28 + grain * 8));
      const b = baseB;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      // Vary square size slightly, biased by falloff (more variation near cursor).
      const sizeJitter = 0.78 + (n2 * 0.28) * (0.25 + falloff * 0.75);
      const s = Math.max(4, Math.floor(pixelSize * sizeJitter));
      const half = s * 0.5;
      ctx.fillRect(x - half, y - half, s, s);

      // Subtle chromatic aberration near cursor: tiny RGB split along radial direction.
      // Only apply in the strongest region to keep it subtle + fast.
      if (strength > 0.38 && speed01 > 0.25) {
        const len = Math.sqrt(d2) + 1e-6;
        const nx = dx / len;
        const ny = dy / len;

        // Aberration distance in px. Scales with speed + falloff.
        const ab =
          aberrationScale *
          (0.5 + speed01 * 1.0) *
          (falloff * falloff) *
          2.2;
        const ox = nx * ab;
        const oy = ny * ab;

        // Very low alpha so it reads as lens split, not neon.
        const caA = (0.02 + strength * 0.06) * (0.35 + speed01 * 0.45);

        // Red shifted outward
        ctx.fillStyle = `rgba(255, 70, 70, ${caA})`;
        ctx.fillRect(x + ox - half, y + oy - half, s, s);

        // Cyan/blue shifted inward (opposite)
        ctx.fillStyle = `rgba(70, 190, 255, ${caA})`;
        ctx.fillRect(x - ox - half, y - oy - half, s, s);

        // Optional faint green core to keep perceived brightness centered
        ctx.fillStyle = `rgba(120, 255, 170, ${caA * 0.22})`;
        ctx.fillRect(x - half, y - half, s, s);
      }
    }
  }

  rafId = requestAnimationFrame(draw);
}

// Gate start conditions.
if (!prefersReducedMotion && !isCoarsePointer) {
  start();
} else {
  // Reduced motion / touch: paint a static background and stop.
  resize();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
}
