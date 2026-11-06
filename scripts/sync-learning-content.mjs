import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['blog', 'labs']) {
  const index = fs.readFileSync(path.join(root, 'priv/data', `${name}.json`));
  for (const target of ['public/data', 'priv/static/data']) {
    fs.mkdirSync(path.join(root, target), { recursive: true });
    fs.writeFileSync(path.join(root, target, `${name}.json`), index);
  }
  fs.cpSync(path.join(root, 'public', name), path.join(root, 'priv/static', name), { recursive: true });
}
console.log('Synchronized learning indexes, articles, labs, and exercise downloads for React and Elixir.');
