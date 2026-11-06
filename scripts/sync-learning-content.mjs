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
const feed = path.join(root, 'priv/data/cloud-security-feed.json');
if (fs.existsSync(feed)) {
  for (const target of ['public/data', 'priv/static/data']) fs.copyFileSync(feed, path.join(root, target, 'cloud-security-feed.json'));
}
console.log('Synchronized learning content and cloud security feed snapshots for React and Elixir.');
