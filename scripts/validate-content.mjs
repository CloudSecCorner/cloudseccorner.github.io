import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { securityEntries } from '../src/data/security-entries.js';

const root = process.cwd();

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function validateCollection(name, items, contentKey) {
  const ids = new Set();

  for (const item of items) {
    if (!item.id || !item.title || !item[contentKey]) {
      throw new Error(`${name} entry is missing id, title, or ${contentKey}: ${JSON.stringify(item)}`);
    }
    if (ids.has(item.id)) {
      throw new Error(`${name} contains duplicate id: ${item.id}`);
    }
    ids.add(item.id);

    const publicPath = item[contentKey].replace(/^\//, '');
    await access(path.join(root, 'public', publicPath));
  }
}

const [{ blogs }, { labs }] = await Promise.all([
  readJson('public/data/blog.json'),
  readJson('public/data/labs.json'),
]);

await validateCollection('Blog index', blogs, 'file');
await validateCollection('Labs index', labs, 'path');

for (const tool of securityEntries) {
  if (!tool.title || !tool.link || !tool.description || !tool.tag) {
    throw new Error(`Tool entry is missing title, link, description, or tag: ${JSON.stringify(tool)}`);
  }

  const url = new URL(tool.link);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Tool entry has unsupported URL: ${tool.link}`);
  }
}

console.log(`Validated ${blogs.length} blog post, ${labs.length} labs, and ${securityEntries.length} tools.`);
