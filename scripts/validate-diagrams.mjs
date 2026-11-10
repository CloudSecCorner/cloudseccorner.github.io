import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DIAGRAM_REVISION } from './lib/control-diagrams.mjs';
import { labDiagrams } from './data/lab-diagrams.mjs';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = content => createHash('sha256').update(content).digest('hex');

function validateSvg(svg, label, requireLogos = true) {
  assert.match(svg, /^<svg\s/, `${label}: missing SVG`);
  assert.match(svg, /viewBox="0 0 [\d.]+ [\d.]+"/, `${label}: missing viewport`);
  if (requireLogos) assert.match(svg, /data-service-logo="/, `${label}: missing embedded logo`);
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const idSet = new Set(ids);
  assert.equal(idSet.size, ids.length, `${label}: duplicate SVG IDs`);
  for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) assert(idSet.has(id), `${label}: unresolved SVG paint reference ${id}`);
  assert(!svg.includes('<image'), `${label}: unexpected external image dependency`);
}

let catalogCount = 0;
const diagnostics = new Set();
for (const provider of ['aws', 'azure', 'gcp', 'kspm', 'cnapp', 'vultr', 'oracle', 'digitalocean', 'alicloud']) {
  const filename = `${provider}-best-practices.json`;
  const source = read(`public/data/${filename}`);
  const sourceHash = hash(source);
  for (const directory of ['priv/data', 'priv/static/data']) {
    assert.equal(hash(read(`${directory}/${filename}`)), sourceHash, `${provider}: divergent mirrored data`);
  }
  const entries = JSON.parse(source);
  for (const item of entries) {
    assert.equal(item.diagram_revision, DIAGRAM_REVISION, `${item.id}: stale content revision`);
    assert.match(item.deployment_mermaid, /requirement --> check/, `${item.id}: missing deployment evaluation`);
    assert.match(item.deployment_mermaid, /No or unknown/, `${item.id}: missing failure path`);
    assert.match(item.deployment_mermaid, /Separate audit or evidence path/, `${item.id}: audit path conflated with traffic`);
    assert.notEqual(item.mermaid, item.deployment_mermaid, `${item.id}: missing separate integration view`);
    assert(item.developer_guide.contract, `${item.id}: missing integration contract`);
    assert(item.developer_guide.dependencies.length >= 2, `${item.id}: missing dependencies`);
    assert(item.developer_guide.steps.length >= 3, `${item.id}: missing implementation steps`);
    assert(item.developer_guide.tests.length >= 2, `${item.id}: missing integration tests`);
    assert(item.developer_guide.failures.length >= 2, `${item.id}: missing debugging guidance`);
    diagnostics.add(item.developer_guide.diagnostics);
    assert(item.diagram_details.checks.length >= 3, `${item.id}: incomplete verification content`);
    assert(item.diagram_details.sources.length >= 2, `${item.id}: missing primary references`);
    for (const source of item.diagram_details.sources) assert.equal(new URL(source).protocol, 'https:');
    validateSvg(item.svg, `${provider}/${item.id}`);
    validateSvg(item.deployment_svg, `${provider}/${item.id}/deployment`);
  }
  catalogCount += entries.length;
}
for (const commands of diagnostics) {
  const result = spawnSync('sh', ['-n'], { input: commands, encoding: 'utf8' });
  assert.equal(result.status, 0, `Invalid diagnostic shell syntax: ${result.stderr}`);
}

let labCount = 0;
const renderedLabs = JSON.parse(read('src/data/lab-diagrams.json'));
for (const [filename, diagrams] of Object.entries(labDiagrams)) {
  const source = read(`public/labs/${filename}`);
  assert.equal(read(`priv/static/labs/${filename}`), source, `${filename}: divergent lab mirror`);
  const blocks = [...source.matchAll(/^```(?:mermaid|pele|architecture)\n([\s\S]*?)^```/gm)].map(match => match[1].trim());
  assert.deepEqual(blocks, diagrams.map(code => code.trim()), `${filename}: stale diagram content`);
  for (const code of blocks) validateSvg(renderedLabs[code], filename, code.includes('logos:'));
  labCount += blocks.length;
}
assert.equal(Object.keys(renderedLabs).length, labCount, 'Stale lab render cache');
const references = JSON.parse(read('src/data/reference-architectures.json'));
let referenceCount = 0;
for (const entries of Object.values(references)) {
  for (const item of entries) {
    validateSvg(item.svg, item.id);
    referenceCount++;
  }
}
console.log(`Validated ${catalogCount} catalog diagrams, ${labCount} lab diagrams, ${referenceCount} runnable references, embedded logos and all data mirrors.`);
