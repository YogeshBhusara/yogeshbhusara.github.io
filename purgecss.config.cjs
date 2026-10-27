module.exports = {
  content: [
    './*.html',
    './*.js'
  ],
  css: [
    './styles.css'
  ],
  output: './.purgecss-out',
  safelist: [
    // Classes toggled/added at runtime (JS)
    'dark',
    'reveal',
    'is-revealed',
    'work-detail-toc__link--active',
    'cursor-thumb',
    'cursor-thumb__layer',
    'cursor-thumb__swing',
    'cursor-thumb__stack',
    'cursor-thumb__item',
    'cursor-thumb__picture',
    'is-visible',
    'is-active',
    'is-armed'
  ]
};
