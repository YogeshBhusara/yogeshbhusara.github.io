#!/usr/bin/env node
/** Create a deployable copy of the static site without modifying its sources. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const output = path.join(root, 'dist');
const siteExtensions = new Set(['.html', '.css', '.js', '.json', '.txt', '.xml']);
const excludedFiles = new Set(['build.js', 'serve.js', 'package.json', 'package-lock.json']);

// dist is generated output; recreate it so deleted source files cannot linger.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile() || excludedFiles.has(entry.name)) continue;
  if (!siteExtensions.has(path.extname(entry.name)) && !['CNAME', '.nojekyll'].includes(entry.name)) continue;
  fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
}

fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Built static site in dist/');
