(() => {
  const storageKey = 'yb-portfolio-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  let toggle;

  function readPreference() {
    try {
      const value = localStorage.getItem(storageKey);
      preference = value === 'dark' || value === 'light' ? value : null;
    } catch {
      // Keep the current in-memory choice when storage is unavailable.
    }
  }

  function updateTheme() {
    const theme = preference ?? (systemTheme.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }

  // Apply the saved palette before the first paint, including on case-study pages.
  readPreference();
  updateTheme();
  systemTheme.addEventListener('change', updateTheme);
  window.addEventListener('pageshow', () => { readPreference(); updateTheme(); });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      readPreference();
      updateTheme();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    toggle = document.querySelector('.theme-toggle');
    toggle.hidden = false;
    updateTheme();
    toggle.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      updateTheme();
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // The toggle still works for this page if saving the choice is blocked.
      }
    });
  });
})();
