import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let total = 0;
for (const provider of ['aws', 'azure', 'gcp', 'kspm', 'cnapp']) {
  const name = `${provider}-best-practices.json`;
  const entries = JSON.parse(fs.readFileSync(path.join(root, 'public/data', name), 'utf8'));
  refreshDiagramCollection(provider, entries);
  const content = JSON.stringify(entries, null, 2) + '\n';
  for (const directory of ['public/data', 'priv/data', 'priv/static/data']) {
    fs.writeFileSync(path.join(root, directory, name), content);
  }
  total += entries.length;
  console.log(`Updated ${entries.length} ${provider} diagrams with embedded logos and verification content.`);
}
console.log(`Updated all ${total} catalog diagrams in all three data locations.`);
