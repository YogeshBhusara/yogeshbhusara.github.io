/**
 * Fetches latest Medium posts from RSS and renders titles in the bento card.
 * Uses a CORS proxy because Medium's feed does not allow direct browser requests.
 */
(function () {
  const LIST_ID = 'medium-blog-list';
  const FEED_URL = 'https://medium.com/feed/@bhusara89.yogesh';
  const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  const MAX_ITEMS = 3;

  function getListEl() {
    return document.getElementById(LIST_ID);
  }

  function setListHtml(html) {
    var el = getListEl();
    if (el) el.innerHTML = html;
  }

  function renderItems(items) {
    if (!items || items.length === 0) {
      setListHtml('<li class="bento-card__blog-list-fallback">Design &amp; UX writing. Essays and thoughts on the blog.</li>');
      return;
    }
    var html = items
      .slice(0, MAX_ITEMS)
      .map(function (item) {
        var title = escapeHtml(item.title);
        var url = item.link || FEED_URL.replace(/\/feed\/.*/, '');
        return '<li class="bento-card__blog-item"><a href="' + escapeAttr(url) + '" target="_blank" rel="noopener noreferrer">' + title + '</a></li>';
      })
      .join('');
    setListHtml(html);
  }

  function showError() {
    setListHtml('<li class="bento-card__blog-list-fallback">Design &amp; UX writing. Essays and thoughts on the blog.</li>');
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function parseRssXml(text) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/xml');
    var items = [];
    var nodes = doc.querySelectorAll('item, entry');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var titleEl = n.querySelector('title');
      var title = (titleEl && titleEl.textContent) || '';
      var linkEl = n.querySelector('link');
      var link = '';
      if (linkEl) {
        link = linkEl.getAttribute('href') || linkEl.textContent || '';
      }
      if (title) items.push({ title: title.trim(), link: link.trim() });
    }
    return items;
  }

  function run() {
    var listEl = getListEl();
    if (!listEl) return;

    fetch(CORS_PROXY + encodeURIComponent(FEED_URL))
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var items = parseRssXml(text);
        renderItems(items);
      })
      .catch(function () {
        showError();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
