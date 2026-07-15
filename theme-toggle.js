/**
 * theme-toggle.js — Paper (light) by default; dark ink theme via html.dark.
 * Persists to localStorage. An inline head snippet applies the saved theme
 * before first paint to avoid a flash.
 */
(function () {
    'use strict';
    const toggles = document.querySelectorAll('.theme-toggle');
    if (!toggles.length) return;

    const THEME_KEY = 'portfolio-theme';
    const DEFAULT_THEME = 'light';
    const THEME_COLORS = {
        light: '#faf8f3',
        dark: '#18160f'
    };

    function getTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        } catch (e) {
            return DEFAULT_THEME;
        }
    }

    function syncThemeColor(theme) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.light);
        }
    }

    function setTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        syncThemeColor(theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) { /* private mode */ }
        document.dispatchEvent(new Event('themechange'));
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });
    });

    setTheme(getTheme());
})();
