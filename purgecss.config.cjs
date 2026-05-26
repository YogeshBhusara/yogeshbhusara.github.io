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
    'has-custom-cursor',
    'is-hover',
    'is-hidden',
    'variable-proximity-ready',
    'is-active',
    'reveal-reduced',
    'reveal',
    'is-revealed',
    'light',
    'hc-modal--entering',
    'is-dragging'
  ]
};

