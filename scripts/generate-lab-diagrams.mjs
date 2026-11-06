import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { createIconResolver } from './lib/diagram-icons.mjs';
import { labDiagrams } from './data/lab-diagrams.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = {};
let total = 0;
for (const [name, diagrams] of Object.entries(labDiagrams)) {
  const file = path.join(root, 'public/labs', name);
  let count = 0;
  const content = fs.readFileSync(file, 'utf8').replace(/^```(?:mermaid|architecture|pele)\r?\n[\s\S]*?^```/gm, () => {
    const code = diagrams[count++];
    if (!code) throw new Error(`Unexpected extra diagram in ${name}`);
    assets[code.trim()] = render(code, { icons: createIconResolver('cnapp') }).svg;
    return '```mermaid\n' + code + '\n```';
  });
  if (count !== diagrams.length) throw new Error(`Diagram count mismatch in ${name}: ${count}/${diagrams.length}`);
  fs.writeFileSync(file, content);
  fs.writeFileSync(path.join(root, 'priv/static/labs', name), content);
  total += count;
}
fs.writeFileSync(path.join(root, 'src/data/lab-diagrams.json'), JSON.stringify(assets, null, 2) + '\n');
console.log(`Updated and rendered all ${total} lab diagrams with embedded logos where applicable.`);
