import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildDeveloperArchitecture } from './lib/developer-architectures.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const pattern = (platform, category) => buildDeveloperArchitecture(platform, {
  category, title: 'Test application integration', service: category,
  icon_url: `/images/example/${category}.svg`
});

const queue = pattern('aws', 'messaging-sns-sqs');
assert.match(queue.mermaid, /resource -->\|SQS queue consumed by Lambda event source mapping\| worker/);
assert.match(queue.mermaid, /worker -->\|Apply idempotent side effect before acknowledgement\| store/);
assert(!/resource -->[^\n]+ store/.test(queue.mermaid), 'Queues must not write application data without a consumer');
const events = pattern('aws', 'decoupled-eventbridge');
assert.match(events.mermaid, /resource -->\|EventBridge target rule\| queue/);
assert.match(events.mermaid, /queue -->\|Lambda event source mapping polls SQS\| worker/);
const pubsub = pattern('gcp', 'gcp-pubsub');
assert.match(pubsub.mermaid, /Configured Pub\/Sub push subscription with OIDC/);
const identity = pattern('aws', 'iam-access');
assert.match(identity.mermaid, /AWS STS role-session endpoint/);
assert.match(identity.mermaid, /resource -.->\|Trust and permission configuration\| issuer/);
const policy = pattern('kspm', 'k8s-networkpolicy');
assert.match(policy.mermaid, /client -->\|Application TCP or UDP traffic\| server/);
assert.match(policy.mermaid, /resource -.->\|Select Pods and define allowed peers\| cni/);
const admission = pattern('kspm', 'k8s-webhook');
assert.match(admission.mermaid, /mutate -->\|Mutated object and schema validation\| validate/);
const edge = pattern('aws', 'edge-cloudfront');
assert.match(edge.mermaid, /OAC signs origin request with SigV4/);
assert.match(edge.mermaid, /Private S3 REST origin/);
assert.throws(() => pattern('aws', 'unsupported-service'), /No developer architecture/);

async function component(file) {
  const result = await build({ absWorkingDir: root, entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' } });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports);
  return module.exports.default;
}

const examples = JSON.parse(fs.readFileSync(path.join(root, 'src/data/reference-architectures.json'), 'utf8'));
const sample = examples.aws[0];
const Viewer = await component('src/components/DiagramViewer.jsx');
const viewer = renderToStaticMarkup(React.createElement(Viewer, { svg: sample.svg, architecture: sample, title: sample.title }));
assert.equal((viewer.match(/role="tab"/g) || []).length, 5, 'Integration, deployment, build, STRIDE, and MITRE views must be available');
assert.match(viewer, /aria-selected="true"/);
assert.match(viewer, /Download Mermaid source/);
assert.match(viewer, /data-service-logo="storage-s3"/);
const Guide = await component('src/components/DeveloperGuide.jsx');
const guide = renderToStaticMarkup(React.createElement(Guide, { guide: sample.developer_guide }));
for (const label of ['Integration Contract', 'Dependencies', 'Implementation', 'Integration Tests', 'Read-Only Diagnostics', 'Debugging']) assert(guide.includes(label), `Missing developer section: ${label}`);
const Header = await component('src/components/ArchitectureHeader.jsx');
const header = renderToStaticMarkup(React.createElement(Header, { provider: 'AWS', count: 1033, services: 24, references: 1 }));
assert.match(header, /AWS Developer Architectures/);
assert.match(header, /1,033/);
console.log('Validated developer integration semantics, component server rendering, three architecture views and implementation notes.');
