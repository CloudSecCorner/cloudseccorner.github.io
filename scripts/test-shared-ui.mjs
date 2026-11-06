import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import postcss from 'postcss';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const css = postcss.parse(read('src/styles/developer-theme.css'));
const selectors = new Set();
css.walkRules(rule => selectors.add(rule.selector));
assert(selectors.has(':root') && selectors.has('.dark'), 'Missing light or dark tokens');
for (const selector of ['.dev-page-header', '.developer-shell .kube-site-header', '.developer-shell .kube-footer', '.developer-shell .dev-reader-progress']) assert(selectors.has(selector), `Missing shared surface: ${selector}`);
assert(read('src/main.jsx').includes('./styles/developer-theme.css'));

async function load(file) {
  const result = await build({ absWorkingDir: root, entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react-router-dom'], loader: { '.css': 'empty' } });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports);
  return module.exports;
}
const render = (Component, location, props = {}) => renderToStaticMarkup(React.createElement(StaticRouter, { location }, React.createElement(Component, props)));

const Tools = (await load('src/components/ToolsSection.jsx')).default;
const normal = render(Tools, '/tools');
assert.match(normal, /<h1>Security Tool Directory<\/h1>/);
assert.match(normal, /37,750/);
assert(normal.indexOf('id="tool-query"') < normal.indexOf('aria-label="Curated security category filters"'), 'Search must appear before quick categories');
assert.equal((normal.match(/class="kube-tool-card"/g) || []).length, 30);
assert(!normal.includes('kube-tools-hero'));
const filtered = render(Tools, '/tools?q=Kubernetes&category=cloud-container&sort=za');
assert.match(filtered, /value="Kubernetes"/);
assert.match(filtered, /value="za" selected=""/);
assert.match(filtered, /aria-pressed="true"/);
const empty = render(Tools, '/tools?q=__no_such_project_93c984__');
assert.match(empty, /No matching security tools/);
assert.equal((empty.match(/class="kube-tool-card"/g) || []).length, 0);

const blogModule = await load('src/components/Blog.jsx');
const blog = render(blogModule.BlogList, '/blog', { blogPosts: [{ id: 'test-note', title: 'Test Field Note', tags: ['Cloud'], date: '2026-11-06', category: 'Engineering', excerpt: 'Test article' }] });
assert.match(blog, /<h1>Field Notes<\/h1>/);
assert.match(blog, /href="\/blog\/test-note"/);
assert.match(blog, /aria-pressed="true"/);
const About = (await load('src/components/AboutPage.jsx')).default;
assert.match(render(About, '/about'), /<h1>About Cloud Security Corner<\/h1>/);
const Nav = (await load('src/components/Nav.jsx')).default;
const nav = render(Nav, '/tools');
assert.match(nav, /aria-label="Main navigation"/);
assert.match(nav, /href="\/tools"/);
assert.match(nav, /dev-brand-mark/);
const Footer = (await load('src/components/Footer.jsx')).default;
const footer = render(Footer, '/tools');
assert.match(footer, /<site-visit-counter aria-live="polite">/);
assert.match(footer, /href="https:\/\/hits.sh\/cloudsecuritycorner.com\/"/);
for (const route of ['/tools', '/labs', '/blog', '/about', '/aws-architectures', '/azure-architectures', '/gcp-architectures', '/kspm-architectures']) assert(footer.includes(`href="${route}"`));
const labs = read('src/components/Labs.jsx');
assert(labs.indexOf('<section id="lab-library"') < labs.indexOf('className="dev-roadmap'), 'Lab catalog must precede the learning roadmap');
assert(labs.includes('dev-reader-progress'));
console.log('Validated shared UI surfaces, light/dark styles, tool query/category/sort and empty states, field-note links, About, navigation and footer rendering.');
