import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { toolsSearchPath, selectedHomeProvider } from '../src/lib/home-navigation.js';
import { securityEntries } from '../src/data/security-entries.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const catalog = read('src/data/home-catalog.json');
const examples = read('src/data/reference-architectures.json');
const require = createRequire(import.meta.url);

assert.equal(toolsSearchPath('  IAM & OPA/rego  '), '/tools?q=IAM%20%26%20OPA%2Frego');
assert.equal(toolsSearchPath('   '), '/tools');
assert.equal(selectedHomeProvider(catalog.providers, 'unknown').id, 'aws');
assert.equal(catalog.counts.tools, securityEntries.length);
assert.equal(catalog.counts.labs, read('public/data/labs.json').labs.length);
let profileCount = 0;
for (const provider of catalog.providers) {
  const data = read(`public/data/${provider.id}-best-practices.json`);
  assert.equal(provider.profileCount, data.length + examples[provider.id].length);
  assert.equal(provider.serviceCount, new Set(data.map(item => item.category)).size);
  const logo = fs.readFileSync(path.join(root, 'public', provider.logo), 'utf8');
  assert.match(logo, /<svg[^>]+viewBox="0 0 [\d.]+ [\d.]+"/);
  profileCount += provider.profileCount;
}
assert.equal(profileCount, catalog.counts.profiles);

const bundled = await build({ absWorkingDir: root, entryPoints: ['src/components/LandingPage.jsx'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-router-dom'], loader: { '.css': 'empty' } });
const module = { exports: {} };
new Function('require', 'module', 'exports', bundled.outputFiles[0].text)(require, module, module.exports);
const LandingPage = module.exports.default;
for (const provider of catalog.providers) {
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: `/?provider=${provider.id}` }, React.createElement(LandingPage)));
  assert.match(html, /<h1>Cloud Security Corner<\/h1>/);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.match(html, /diagram-viewport diagram-fit/);
  assert(html.includes(`href="${examples[provider.id][0].reference.asset}"`), `${provider.id}: wrong configuration download`);
  assert(html.includes(`href="${examples[provider.id][0].reference.policy}"`), `${provider.id}: wrong policy download`);
  for (const item of catalog.providers) assert(html.includes(`href="${item.route}"`), `Missing provider route: ${item.route}`);
  for (const lab of catalog.labs) assert(html.includes(`href="${lab.route}"`), `Missing lab route: ${lab.route}`);
  for (const blog of catalog.blogs) assert(html.includes(`href="${blog.route}"`), `Missing article route: ${blog.route}`);
  assert(html.includes('role="search"'));
  assert(!html.includes('AGENT_RUNTIME_SHIELD'));
  assert(!html.includes('POLICY ENFORCED'));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
  for (const [, target] of html.matchAll(/aria-controls="([^"]+)"/g)) assert(ids.has(target), `Missing tab panel: ${target}`);
  const activeProvider = html.match(/class="home-provider-tabs"[\s\S]*?<\/div>/)?.[0];
  assert.match(activeProvider, new RegExp(`id="[^"]+-${provider.id}"[^>]+aria-selected="true"`));
}
console.log('Validated all landing-page provider deep links, generated counts, native logos, resource links, configuration downloads, search routing and server rendering.');
