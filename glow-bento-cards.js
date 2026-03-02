// Glowing edge effect for .bento-card elements (vanilla JS version)

(function () {
  const cards = Array.from(document.querySelectorAll(".bento-card"));
  if (!cards.length) return;

  const inactiveZone = 0.7; // fraction of card radius in which glow stays off
  const proximity = 64; // px outside card bounds where glow is still active

  let lastPointer = null;

  function updateCardGlow(card, x, y) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    const distanceFromCenter = Math.hypot(x - centerX, y - centerY);
    const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * inactiveZone;

    if (distanceFromCenter < inactiveRadius) {
      card.style.setProperty("--glow-active", "0");
      return;
    }

    const isInsideProximity =
      x > rect.left - proximity &&
      x < rect.right + proximity &&
      y > rect.top - proximity &&
      y < rect.bottom + proximity;

    card.style.setProperty("--glow-active", isInsideProximity ? "1" : "0");
    if (!isInsideProximity) return;

    const currentAngle =
      parseFloat(getComputedStyle(card).getPropertyValue("--glow-start")) || 0;
    let targetAngle =
      (180 * Math.atan2(y - centerY, x - centerX)) / Math.PI + 90;

    const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
    const newAngle = currentAngle + angleDiff * 0.2; // simple smoothing

    card.style.setProperty("--glow-start", String(newAngle));
  }

  function handlePointerMove(event) {
    const x = event.clientX;
    const y = event.clientY;
    lastPointer = { x, y };
    cards.forEach((card) => updateCardGlow(card, x, y));
  }

  function handleScroll() {
    if (!lastPointer) return;
    const { x, y } = lastPointer;
    cards.forEach((card) => updateCardGlow(card, x, y));
  }

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
})();

