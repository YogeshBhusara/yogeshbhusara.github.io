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
    const TRANSITION_MS = 460;
    let transitionLock = false;

    function getTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        } catch (e) {
            return DEFAULT_THEME;
        }
    }

    function setTheme(theme) {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) { /* private mode */ }
        document.dispatchEvent(new Event('themechange'));
    }

    function playThemeTransition(previousTheme) {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay theme-transition-overlay--' + previousTheme;
        document.body.appendChild(overlay);

        let finished = false;
        const finish = function () {
            if (finished) return;
            finished = true;
            overlay.remove();
            transitionLock = false;
            document.documentElement.classList.remove('is-theme-transitioning');
        };

        overlay.addEventListener(
            'transitionend',
            function (event) {
                if (event.propertyName === 'opacity') finish();
            },
            { once: true }
        );

        window.setTimeout(finish, TRANSITION_MS);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.classList.add('is-dissolving');
            });
        });
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const currentTheme = getTheme();
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

            if (
                transitionLock ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                setTheme(nextTheme);
                return;
            }

            transitionLock = true;
            document.documentElement.classList.add('is-theme-transitioning');
            setTheme(nextTheme);
            playThemeTransition(currentTheme);
        });
    });

    setTheme(getTheme());
})();
