// Fetch Medium RSS and render blog cards
(function () {
    const MEDIUM_FEED_URL = 'https://medium.com/feed/@bhusara89.yogesh';
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    const MAX_DESC_LENGTH = 120;

    const container = document.getElementById('blog-posts');
    const loadingEl = document.getElementById('blog-loading');
    const errorEl = document.getElementById('blog-error');

    function stripHtml(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return (div.textContent || div.innerText || '').trim();
    }

    function truncate(str, maxLen) {
        if (!str || str.length <= maxLen) return str || '';
        return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
    }

    function getFirstImageSrc(html) {
        if (!html) return null;
        const div = document.createElement('div');
        div.innerHTML = html;
        const img = div.querySelector('img');
        return img && img.getAttribute('src') ? img.getAttribute('src') : null;
    }

    function parseFeedXml(xmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        const entries = [];

        // Atom: feed > entry
        const atomEntries = doc.querySelectorAll('entry');
        if (atomEntries.length > 0) {
            atomEntries.forEach(function (entry) {
                const titleEl = entry.querySelector('title');
                const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link[type="text/html"]') || entry.querySelector('link');
                const contentEl = entry.querySelector('content') || entry.querySelector('summary');
                const rawContent = contentEl ? (contentEl.textContent || contentEl.innerHTML || '') : '';
                const link = linkEl ? (linkEl.getAttribute('href') || linkEl.getAttribute('url') || '') : '';
                entries.push({
                    title: titleEl ? stripHtml(titleEl.textContent) : '',
                    link: link,
                    description: truncate(stripHtml(rawContent), MAX_DESC_LENGTH),
                    image: getFirstImageSrc(rawContent) || null
                });
            });
            return entries;
        }

        // RSS 2.0: channel > item
        const items = doc.querySelectorAll('item');
        items.forEach(function (item) {
            const titleEl = item.querySelector('title');
            const linkEl = item.querySelector('link');
            const descEl = item.querySelector('description');
            let contentEl = item.querySelector('content\\:encoded');
            if (!contentEl && item.getElementsByTagName) {
                const all = item.getElementsByTagName('*');
                for (let i = 0; i < all.length; i++) {
                    if (all[i].localName === 'encoded' || (all[i].tagName && all[i].tagName.toLowerCase().includes('encoded'))) {
                        contentEl = all[i];
                        break;
                    }
                }
            }
            const content = (contentEl && contentEl.textContent) || (descEl && (descEl.textContent || descEl.innerHTML)) || '';
            entries.push({
                title: titleEl ? stripHtml(titleEl.textContent) : '',
                link: linkEl ? (linkEl.textContent || linkEl.getAttribute('href') || '').trim() : '',
                description: truncate(stripHtml(content), MAX_DESC_LENGTH),
                image: getFirstImageSrc(content) || null
            });
        });
        return entries;
    }

    function renderCards(entries) {
        if (!container) return;
        loadingEl.style.display = 'none';
        errorEl.hidden = true;
        container.innerHTML = '';

        if (entries.length === 0) {
            container.appendChild(document.createTextNode('No posts yet.'));
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'blog-grid';

        entries.forEach(function (post) {
            const card = document.createElement('a');
            card.href = post.link || '#';
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'blog-card';

            const thumb = post.image
                ? '<div class="blog-card__thumb"><img src="' + post.image + '" alt="" loading="lazy"></div>'
                : '<div class="blog-card__thumb blog-card__thumb--placeholder"></div>';

            card.innerHTML =
                thumb +
                '<div class="blog-card__body">' +
                '<h3 class="blog-card__title">' + (post.title || 'Untitled').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h3>' +
                (post.description ? '<p class="blog-card__desc">' + post.description.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' : '') +
                '<span class="blog-card__cta">Read on Medium</span>' +
                '</div>';

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    function showError() {
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.hidden = false;
        if (container) container.innerHTML = '';
    }

    function loadFeed() {
        const url = CORS_PROXY + encodeURIComponent(MEDIUM_FEED_URL);
        fetch(url)
            .then(function (res) { return res.text(); })
            .then(function (text) {
                const entries = parseFeedXml(text);
                renderCards(entries);
            })
            .catch(function () { showError(); });
    }

    if (container) loadFeed();
})();
