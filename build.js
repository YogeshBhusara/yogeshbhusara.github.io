#!/usr/bin/env node
/**
 * build.js — Adds defer to script tags in all HTML pages. Run: node build.js (optional).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const PAGES = ['index.html', 'about.html', 'blog.html', 'work.html', 'contact.html'];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function addDeferToScripts(html) {
  return html.replace(/<script src=/g, '<script defer src=');
}

function build() {
  PAGES.forEach((pageFile) => {
    let html = read(pageFile);
    html = addDeferToScripts(html);
    fs.writeFileSync(path.join(ROOT, pageFile), html, 'utf8');
    console.log('Built:', pageFile);
  });
  console.log('Build complete.');
}

build();
