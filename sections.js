const articleTrack = document.querySelector('.article-track');
const articleControls = document.querySelector('.article-controls');

if (articleTrack && articleControls) {
  const previous = articleControls.querySelector('[data-direction="-1"]');
  const next = articleControls.querySelector('[data-direction="1"]');

  function updateControls() {
    const maximum = articleTrack.scrollWidth - articleTrack.clientWidth;
    previous.disabled = articleTrack.scrollLeft <= 2;
    next.disabled = articleTrack.scrollLeft >= maximum - 2;
  }

  articleControls.hidden = false;
  articleControls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const cardWidth = articleTrack.querySelector('.article-card').getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(articleTrack).columnGap);
    articleTrack.scrollBy({
      left: Number(button.dataset.direction) * (cardWidth + gap),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
  articleTrack.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
}
