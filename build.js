#!/usr/bin/env node
/**
 * Build script: injects reusable components (nav, footer, work-detail) into pages,
 * adds SEO meta tags, and optimizes script loading (defer).
 * Run: node build.js
 * Output: overwrites HTML files in place. Deploy the built files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const COMPONENTS = path.join(ROOT, 'components');
const PAGES = ['index.html', 'about.html', 'blog.html', 'work.html', 'contact.html'];

// Base URL for canonical and OG (change when you have a production URL)
const BASE_URL = process.env.SITE_URL || 'https://yogeshbhusara.com';
const DEFAULT_IMAGE = BASE_URL + '/assets/profile-image.png';

const PAGE_CONFIG = {
  'index.html': {
    title: 'Yogesh Bhusara — UI/UX Designer',
    description: 'UI/UX Designer with 12+ years of experience. Creating scalable, user-centric digital solutions. Based in Pune, India. Currently at MangoApps.',
    canonical: '',
    active: 'index',
  },
  'about.html': {
    title: 'About — Yogesh Bhusara',
    description: 'Over 12 years in UI/UX design. Specializing in enterprise collaboration and productivity platforms. Sr. UI/UX Designer at MangoApps.',
    canonical: 'about.html',
    active: 'about',
  },
  'blog.html': {
    title: 'Blog — Yogesh Bhusara',
    description: 'Thoughts on design, UX, and building digital experiences. Read writing on Medium.',
    canonical: 'blog.html',
    active: 'blog',
  },
  'work.html': {
    title: 'Work — Yogesh Bhusara',
    description: 'Selected UI/UX and product design work. Enterprise collaboration, task management, and user-centric digital solutions.',
    canonical: 'work.html',
    active: 'work',
  },
  'contact.html': {
    title: 'Contact — Yogesh Bhusara',
    description: 'Get in touch for projects and collaborations. Open to meaningful connections and creative opportunities.',
    canonical: 'contact.html',
    active: 'contact',
  },
};

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function readComponent(name) {
  return fs.readFileSync(path.join(COMPONENTS, name + '.html'), 'utf8').trim();
}

function getNavWithActive(activePage) {
  return readComponent('nav');
}

function getSiteNavWithActive(activePage) {
  const activeClass = 'site-nav__link--active';
  const pages = ['work', 'about', 'blog', 'contact'];
  let siteNav = readComponent('site-nav');
  pages.forEach((p) => {
    siteNav = siteNav.replace(new RegExp('\\{\\{ACTIVE_' + p.toUpperCase() + '\\}\\}', 'g'), p === activePage ? activeClass : '');
  });
  return siteNav;
}

function getSeoMeta(pageFile) {
  const config = PAGE_CONFIG[pageFile];
  if (!config) return '';
  const url = config.canonical ? BASE_URL + '/' + config.canonical : BASE_URL + '/';
  const title = config.title;
  const desc = config.description;
  const image = DEFAULT_IMAGE;

  const jsonLd = pageFile === 'index.html' ? `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Yogesh Bhusara",
    "url": "${url}",
    "image": "${image}",
    "jobTitle": "UI/UX Designer",
    "worksFor": { "@type": "Organization", "name": "MangoApps" },
    "sameAs": [
      "https://www.linkedin.com/in/yogeshbhusara/",
      "https://github.com/yogeshbhusara",
      "https://www.behance.net/yogeshbhusara",
      "https://dribbble.com/YBhusara",
      "https://medium.com/@bhusara89.yogesh"
    ]
  }
  </script>` : '';

  return `
    <meta name="description" content="${escapeHtml(desc)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:image" content="${image}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">${jsonLd}`;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function injectNav(html, activePage) {
  const navBlock = /<nav class="main-nav" id="main-nav"[^>]*>[\s\S]*?<\/nav>/;
  return html.replace(navBlock, getNavWithActive(activePage));
}

function injectSiteNav(html, activePage) {
  const placeholder = /<!-- SITE_NAV -->/;
  return html.replace(placeholder, getSiteNavWithActive(activePage));
}

function injectFooter(html) {
  const footerBlock = /<section class="footer"[^>]*>[\s\S]*?<\/section>(?=\s*<\/main>)/;
  return html.replace(footerBlock, readComponent('footer'));
}

function injectWorkDetail(html) {
  const workDetailBlock = /<div class="work-detail" id="work-detail" aria-hidden="true">\s*<div class="work-detail-overlay"><\/div>\s*<div class="work-detail-content">\s*<button[^>]*>[^<]*<\/button>\s*<div class="work-detail-inner" id="work-detail-inner">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  return html.replace(workDetailBlock, readComponent('work-detail'));
}

function injectSeoMeta(html, pageFile) {
  const meta = getSeoMeta(pageFile);
  return html.replace(/\s*<!-- SEO_META -->\s*/, meta ? '\n' + meta + '\n    ' : '');
}

function addDeferToScripts(html) {
  return html.replace(/<script src=/g, '<script defer src=');
}

function build() {
  const nav = readComponent('nav');
  const footer = readComponent('footer');
  const workDetail = readComponent('work-detail');

  PAGES.forEach((pageFile) => {
    let html = read(pageFile);
    const activePage = PAGE_CONFIG[pageFile]?.active || 'index';

    html = injectNav(html, activePage);
    html = injectSiteNav(html, activePage);
    html = injectFooter(html);

    if (pageFile === 'index.html' || pageFile === 'work.html') {
      html = injectWorkDetail(html);
    }

    html = injectSeoMeta(html, pageFile);
    html = addDeferToScripts(html);

    fs.writeFileSync(path.join(ROOT, pageFile), html, 'utf8');
    console.log('Built:', pageFile);
  });

  console.log('Build complete.');
}

build();
