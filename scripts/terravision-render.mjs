import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { createIconResolver } from './lib/diagram-icons.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * TerraVision & Pele diagram compiler for CloudSecCorner.
 * Compiles Mermaid and TerraVision architecture definitions to Pele SVGs with embedded provider logos.
 */
export function renderMermaidToSvg(mermaidSource, provider = 'cnapp') {
  const resolver = createIconResolver(provider);
  return render(mermaidSource, { icons: resolver });
}

export function compileArchitectureDiagram(inputFile, outputFile, provider = 'cnapp') {
  const resolvedInput = path.isAbsolute(inputFile) ? inputFile : path.join(root, inputFile);
  const resolvedOutput = path.isAbsolute(outputFile) ? outputFile : path.join(root, outputFile);

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`Input file not found: ${resolvedInput}`);
  }

  const content = fs.readFileSync(resolvedInput, 'utf8');
  const result = renderMermaidToSvg(content, provider);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, result.svg);
  console.log(`Successfully compiled ${inputFile} -> ${outputFile} (${result.svg.length} bytes)`);
  return result;
}

// CLI usage: node scripts/terravision-render.mjs <input.mmd> <output.svg> [provider]
if (process.argv[1] && process.argv[1].endsWith('terravision-render.mjs')) {
  const [, , inputFile, outputFile, provider = 'cnapp'] = process.argv;
  if (!inputFile || !outputFile) {
    console.log('Usage: node scripts/terravision-render.mjs <input.mmd> <output.svg> [provider]');
    process.exit(1);
  }
  try {
    compileArchitectureDiagram(inputFile, outputFile, provider);
  } catch (err) {
    console.error('TerraVision Pele render error:', err);
    process.exit(1);
  }
}
