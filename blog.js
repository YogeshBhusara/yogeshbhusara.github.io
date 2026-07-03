/**
 * blog.js — Notes lists: full list on blog page, latest three on home.
 * Entries are plain editorial rows (title, one-line description, date).
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

  function renderRow(post) {
    const li = document.createElement('li');
    li.className = 'row-list__item';
    li.innerHTML =
      '<a class="row-list__row" href="' + escapeHtml(post.link) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="row-list__title">' + escapeHtml(post.title) + '</span>' +
        '<span class="row-list__aside">' +
          '<span class="meta">' + escapeHtml(post.date || 'Medium') + '</span>' +
        '</span>' +
        (post.description
          ? '<span class="row-list__desc">' + escapeHtml(post.description) + '</span>'
          : '') +
      '</a>';
    return li;
  }

  function renderList(target, items) {
    if (!target || !items.length) return;
    target.innerHTML = '';
    items.forEach(function (post) {
      target.appendChild(renderRow(post));
    });
  }

  renderList(container, posts);
  renderList(homeArticles, posts.slice(0, 3));
})();
