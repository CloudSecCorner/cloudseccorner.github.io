import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function createIconResolver(provider) {
  const directories = [...new Set([provider === 'kspm' ? 'k8s' : provider, 'cnapp', 'aws', 'azure', 'gcp', 'k8s', 'vultr', 'oracle'])];
  const cache = new Map();
  let instance = 0;
  return name => {
    const icon = name.replace(/^logos:/, '');
    if (!/^[a-z0-9-]+$/.test(icon)) throw new Error(`Invalid icon name: ${name}`);
    if (!cache.has(icon)) {
      const asset = directories.map(directory => path.join(root, 'public/images', `${directory}-icons`, `${icon}.svg`)).find(file => fs.existsSync(file));
      if (!asset) throw new Error(`Missing diagram logo: ${name}`);
      const source = fs.readFileSync(asset, 'utf8');
      const start = source.indexOf('<svg');
      if (start < 0) throw new Error(`Invalid SVG logo: ${asset}`);
      // Existing logos have 40px outer canvases; preserve their different inner viewBoxes.
      cache.set(icon, source.slice(start));
    }
    const prefix = `${provider}-${icon}-${instance++}`;
    const svg = cache.get(icon)
      .replace(/\sid="([^"]+)"/g, ` id="${prefix}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
      .replace(/\bhref="#([^"]+)"/g, `href="#${prefix}-$1"`);
    return `<g data-service-logo="${icon}" transform="scale(0.6)" fill="currentColor" stroke="none">${svg}</g>`;
  };
}
