(() => {
  const time = document.querySelector('[data-pune-time]');
  if (time) {
    const update = () => { time.textContent = `${new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date())} in Pune, India`; };
    update();
    setInterval(update, 60000);
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
