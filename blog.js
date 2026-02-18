// Blog cards from static content (Medium links)
(function () {
    const posts = [
        {
            title: 'Develop First, Design Later (I\'m Still Figuring This Out)',
            description: 'What Happens When a Designer Builds Before Designing?',
            link: 'https://medium.com/@bhusara89.yogesh/develop-first-design-later-im-still-figuring-this-out-53e4885bcf00'
        },
        {
            title: 'Learning SwiftUI by Building My Camera App (with Cursor)',
            description: 'I learn best when I build things that I personally care about.',
            link: 'https://medium.com/@bhusara89.yogesh/learning-swiftui-by-building-my-camera-app-with-cursor-1726c1ebc282'
        },
        {
            title: 'Code Can Be Generic, But Design Can\'t',
            description: 'There\'s a quiet truth most product teams learn over time: code scales, design differentiates.',
            link: 'https://medium.com/@bhusara89.yogesh/code-can-be-generic-but-design-cant-b1ef5f0d8e59'
        },
        {
            title: 'Built a Semantic Search for Our Figma Library — And Learned RAG Along the Way',
            description: 'A side project to fix my own "where did we do this before?" problem, built with Cursor, and how it could scale for the full design team.',
            link: 'https://medium.com/@bhusara89.yogesh/built-a-semantic-search-for-our-figma-library-and-learned-rag-along-the-way-1de2f43e3d44'
        }
    ];

    const container = document.getElementById('blog-posts');

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function renderCards() {
        if (!container) return;
        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'blog-grid';

        posts.forEach(function (post, index) {
            const card = document.createElement('a');
            card.href = post.link;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'blog-card';

            const imageNum = index + 1;
            const imageSrc = 'assets/' + imageNum + '.webp';
            const thumbHtml = '<div class="blog-card__thumb">' +
                '<img src="' + imageSrc + '" alt="" loading="lazy">' +
                '</div>';

            card.innerHTML =
                '<div class="blog-card__body">' +
                '<h3 class="blog-card__title">' + escapeHtml(post.title) + '</h3>' +
                (post.description ? '<p class="blog-card__desc">' + escapeHtml(post.description) + '</p>' : '') +
                '</div>' +
                thumbHtml;

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    if (container) renderCards();
})();
