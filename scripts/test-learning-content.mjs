import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const blogs = JSON.parse(read('priv/data/blog.json')).blogs;
const labs = JSON.parse(read('priv/data/labs.json')).labs;
assert(blogs.length >= 10 && labs.length >= 10);
const awsPath = ['AWS-Credential-Review', 'AWS-Role-Delegation', 'AWS-S3-Plan-Review', 'AWS-CloudTrail-Triage'];
for (const [index, id] of awsPath.entries()) {
  const lab = labs.find(item => item.id === id);
  assert(lab && blogs.some(item => item.id === id), `${id}: missing paired guide/lab`);
  assert.equal(lab.track, 'AWS Defender');
  assert.equal(lab.track_order, index + 1);
  assert.equal(lab.guide, `/blog/${id}`);
}
const routes = new Set(['/', '/blog', '/labs', ...blogs.map(p => `/blog/${p.id}`), ...labs.map(p => `/labs/${p.id}`)].map(p => p.toLowerCase()));
const primaryHosts = new Set(['docs.aws.amazon.com', 'developer.hashicorp.com', 'modelcontextprotocol.io', 'blog.modelcontextprotocol.io', 'genai.owasp.org', 'cheatsheetseries.owasp.org', 'spiffe.io', 'slsa.dev', 'docs.sigstore.dev', 'docs.github.com', 'kubernetes.io', 'nmap.org', 'www.first.org', 'www.cisa.gov']);
for (const [name, items, field] of [['blog', blogs, 'file'], ['labs', labs, 'path']]) {
  for (const mirror of ['public/data', 'priv/static/data']) {
    assert.equal(read(`${mirror}/${name}.json`), read(`priv/data/${name}.json`), `${name}: index drift`);
  }
  for (const item of items) {
    assert.match(item.updated, /^\d{4}-\d{2}-\d{2}$/);
    const markdown = read(`public${item[field]}`);
    assert.equal(markdown, read(`priv/static${item[field]}`), `${item.id}: content mirror drift`);
    const prose = markdown.replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '');
    assert.equal((prose.match(/^# /gm) || []).length, 1, `${item.id}: missing unique title`);
    assert.equal((markdown.match(/^```/gm) || []).length % 2, 0, `${item.id}: unbalanced code fence`);
    assert(!markdown.includes('placeholder --> replacement'), `${item.id}: diagram not generated`);
    assert(markdown.includes(item.updated) || markdown.includes('November 6, 2026'), `${item.id}: missing review date`);
    const sources = new Set();
    for (const [, href] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (href.startsWith('https://')) {
        const url = new URL(href);
        if (primaryHosts.has(url.hostname)) sources.add(url.href);
      } else if (href.startsWith('/')) {
        const target = href.split('#')[0];
        assert(routes.has(target.toLowerCase()) || fs.existsSync(path.join(root, 'public', target)), `${item.id}: broken local link ${target}`);
      }
    }
    assert(sources.size >= 2, `${item.id}: primary references missing`);
    if (field === 'path') {
      for (const section of ['Prerequisites', 'Exercise', 'Expected evidence']) {
        assert(markdown.toLowerCase().includes(section.toLowerCase()), `${item.id}: missing ${section}`);
      }
      assert(/clean\s*up/i.test(prose), `${item.id}: missing cleanup`);
      const source = read(`public${item.exercise}`);
      for (const download of item.downloads || []) assert.equal(read(`public${download}`), read(`priv/static${download}`), `${item.id}: download mirror drift`);
      assert.equal(source, read(`priv/static${item.exercise}`), `${item.id}: exercise mirror drift`);
      const result = spawnSync('python3', [path.join(root, 'public', item.exercise)], { cwd: root, encoding: 'utf8', timeout: 60000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
      assert.equal(result.status, 0, `${item.id}: exercise failed\n${result.stdout}\n${result.stderr}`);
      const output = `${result.stdout}\n${result.stderr}`;
      const count = output.match(/Ran (\d+) tests?/);
      assert(count, `${item.id}: no executable tests`);
      console.log(`${item.id}: ${count[1]} exercise tests passed${output.includes('skipped=') ? ' (optional Nmap scan skipped; install Nmap for the complete lab)' : ''}.`);
    }
  }
}
console.log(`Validated ${blogs.length} reviewed field notes, ${labs.length} labs, the ordered AWS Defender path, primary references, internal links, mirrors, and executable exercise downloads.`);
