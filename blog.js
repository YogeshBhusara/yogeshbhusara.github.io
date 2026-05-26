/**
 * blog.js — Home: horizontal article cards. Blog page: vertical list.
 */
(function () {
  'use strict';

  const posts = window.BLOG_POSTS || [];

  const container = document.getElementById('blog-posts');
  const homeArticles = document.getElementById('home-articles');

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderBlogPageList() {
    if (!container) return;
    container.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'blog-posts-list';

    posts.forEach(function (post) {
      const li = document.createElement('li');
      li.className = 'blog-posts-item';
      const date = post.date
        ? '<span class="blog-posts-date">' + escapeHtml(post.date) + '</span>'
        : '';
      const desc = post.description
        ? '<p class="blog-posts-desc">' + escapeHtml(post.description) + '</p>'
        : '';
      const imgSrc =
        typeof post.image === 'string' && post.image.length > 0 ? post.image : '';
      const thumbInner = imgSrc
        ? '<img class="blog-posts-thumb__img" src="' +
          escapeHtml(imgSrc) +
          '" alt="" loading="lazy" decoding="async" width="220" height="160">'
        : '<div class="blog-posts-thumb__grad" aria-hidden="true"></div>';

      const thumbLabel = post.title + ' — open article';
      const thumb =
        '<a href="' +
        escapeHtml(post.link) +
        '" class="blog-posts-thumb" target="_blank" rel="noopener noreferrer" aria-label="' +
        escapeHtml(thumbLabel) +
        '">' +
        thumbInner +
        '</a>';

      li.innerHTML =
        '<div class="blog-posts-main">' +
        date +
        '<a href="' +
        escapeHtml(post.link) +
        '" class="blog-posts-link" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(post.title) +
        '</a>' +
        desc +
        '</div>' +
        thumb;
      ul.appendChild(li);
    });

    container.appendChild(ul);
  }

  function renderHomeArticles() {
    if (!homeArticles || !posts.length) return;
    homeArticles.innerHTML = '';
    homeArticles.className = 'home-articles-scroller';

    posts.slice(0, 5).forEach(function (post) {
      const imgSrc =
        typeof post.image === 'string' && post.image.length > 0 ? post.image : '';

      const a = document.createElement('a');
      a.href = post.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'home-article-card';
      a.setAttribute('role', 'listitem');

      const media = imgSrc
        ? '<div class="home-article-card__media"><img src="' +
          escapeHtml(imgSrc) +
          '" alt="' +
          escapeHtml(post.title) +
          '" width="480" height="360" loading="lazy" decoding="async"></div>'
        : '<div class="home-article-card__media home-article-card__media--placeholder" aria-hidden="true"></div>';

      const dateHtml = post.date
        ? '<span class="home-article-card__meta">' + escapeHtml(post.date) + '</span>'
        : '<span class="home-article-card__meta">Article</span>';

      a.innerHTML =
        media +
        '<div class="home-article-card__body">' +
        dateHtml +
        '<span class="home-article-card__title">' +
        escapeHtml(post.title) +
        '</span></div>';

      homeArticles.appendChild(a);
    });
  }

  renderBlogPageList();
  renderHomeArticles();
})();
