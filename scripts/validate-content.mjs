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

    const relativeContentPath = item[contentKey].replace(/^\//, '');
    const candidatePaths = [
      path.join(root, 'priv', 'static', relativeContentPath),
      path.join(root, 'public', relativeContentPath)
    ];

    let found = false;
    for (const p of candidatePaths) {
      try {
        await access(p);
        found = true;
        break;
      } catch {}
    }

    if (!found) {
      throw new Error(`Cannot locate content file for ${item.id} at ${candidatePaths.join(' or ')}`);
    }
  }
}

async function readJsonCandidates(relPath) {
  const candidates = [
    path.join(root, 'priv', 'data', path.basename(relPath)),
    path.join(root, 'public', 'data', path.basename(relPath)),
    path.join(root, relPath)
  ];
  for (const c of candidates) {
    try {
      return JSON.parse(await readFile(c, 'utf8'));
    } catch {}
  }
  throw new Error(`Cannot find JSON at candidates: ${candidates.join(', ')}`);
}

const [{ blogs }, { labs }, awsPractices, azurePractices, gcpPractices] = await Promise.all([
  readJsonCandidates('blog.json'),
  readJsonCandidates('labs.json'),
  readJsonCandidates('aws-best-practices.json'),
  readJsonCandidates('azure-best-practices.json'),
  readJsonCandidates('gcp-best-practices.json')
]);

await validateCollection('Blog index', blogs, 'file');
await validateCollection('Labs index', labs, 'path');

if (!Array.isArray(awsPractices) || awsPractices.length < 1000) {
  throw new Error(`AWS Best Practices dataset must have at least 1,000 entries; found ${awsPractices?.length}`);
}

if (!Array.isArray(azurePractices) || azurePractices.length < 1000) {
  throw new Error(`Azure Best Practices dataset must have at least 1,000 entries; found ${azurePractices?.length}`);
}

if (!Array.isArray(gcpPractices) || gcpPractices.length < 1000) {
  throw new Error(`GCP Best Practices dataset must have at least 1,000 entries; found ${gcpPractices?.length}`);
}

for (const tool of securityEntries) {
  if (!tool.title || !tool.link || !tool.description || !tool.tag) {
    throw new Error(`Tool entry is missing title, link, description, or tag: ${JSON.stringify(tool)}`);
  }

  const url = new URL(tool.link);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Tool entry has unsupported URL: ${tool.link}`);
  }
}

console.log(`Validated ${blogs.length} blog post, ${labs.length} labs, ${awsPractices.length} AWS architectures, ${azurePractices.length} Azure architectures, ${gcpPractices.length} GCP architectures (Pele, OPA & Terraform), and ${securityEntries.length} tools.`);
