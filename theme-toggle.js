// Theme toggle functionality
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const THEME_KEY = 'portfolio-theme';
    const DEFAULT_THEME = 'dark';

    // Get saved theme or default to dark
    function getTheme() {
        return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    }

    // Set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Update canvas background if it exists
        const canvas = document.getElementById('distort-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = theme === 'light' ? '#ffffff' : '#0b0b0b';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getTheme();
        setTheme(savedTheme);
    }

    // Event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
