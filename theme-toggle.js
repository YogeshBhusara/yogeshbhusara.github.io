/**
 * theme-toggle.js — Dark/light theme toggle; persists to localStorage, syncs data-theme on body.
 */
(function () {
    'use strict';
    const toggles = document.querySelectorAll('.theme-toggle');
    if (!toggles.length) return;

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
        // DarkVeil background reads data-theme in its loop for light/dark tint
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

    // Event listeners (main nav + bento header)
    toggles.forEach(function(btn) {
        btn.addEventListener('click', toggleTheme);
    });

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
