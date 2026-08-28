#!/usr/bin/env node
/**
 * serve.js — Local dev server with clean URL support. Run: npm run dev
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const PAGES = new Set(['about', 'blog', 'work', 'contact', 'playground', 'sitemap']);

function resolveFilePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const normalized = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  if (normalized === '/' || normalized === '') {
    return '/index.html';
  }

  const segment = normalized.replace(/^\//, '');
  if (PAGES.has(segment)) {
    return `/${segment}.html`;
  }

  return normalized;
}

function sendFile(res, filePath) {
  const absPath = path.join(ROOT, filePath);

  if (!absPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(absPath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'File not found.' : 'Server error.');
      return;
    }

    const ext = path.extname(absPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url || '/');
  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
