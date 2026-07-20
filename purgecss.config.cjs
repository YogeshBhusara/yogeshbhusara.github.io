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
    'is-visible'
  ]
};
