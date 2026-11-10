import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(process.argv[2] || "_site");
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const entry = manifest["index.html"];
assert(entry?.isEntry, "Vite's React entry is missing");

const publicFile = async (url) => {
  const filename = path.join(output, url.replace(/^\//, ""));
  assert((await stat(filename)).isFile(), `Missing published asset: ${url}`);
  return filename;
};

// Check every emitted chunk, including lazy routes, imported CSS, and images.
for (const chunk of Object.values(manifest)) {
  for (const file of [chunk.file, ...(chunk.css || []), ...(chunk.assets || [])]) {
    await publicFile(file);
  }
}

const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/cloudsecuritycorner\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1] || "/");
assert(routes.length >= 20, "Export is missing content routes");
for (const route of ["/", "/tools", "/labs", "/blog", "/about", "/aws-architectures", "/azure-architectures", "/gcp-architectures", "/kspm-architectures", "/cnapp-architectures", "/vultr-architectures", "/oracle-architectures", "/digitalocean-architectures", "/alicloud-architectures"]) {
  assert(routes.includes(route), `Route absent from sitemap: ${route}`);
}
assert(routes.some((route) => route.startsWith("/labs/")), "Missing lab deep links");
assert(routes.some((route) => route.startsWith("/blog/")), "Missing blog deep links");

for (const route of [...routes, "/404.html"]) {
  const file = route === "/404.html" ? "404.html" : path.join(route, "index.html");
  const html = await readFile(path.join(output, file), "utf8");
  assert.match(html, /id="root"[^>]*data-renderer="elixir"/, `${route}: no Phoenix fallback root`);
  assert(html.includes(`src="/${entry.file}"`), `${route}: missing React module`);
  assert.match(html, /<script[^>]*type="module"[^>]*src="\/assets\//, `${route}: entry is not a module`);
  for (const css of entry.css || []) {
    assert(html.includes(`href="/${css}"`), `${route}: missing React stylesheet`);
  }
  assert.match(html, /<main[\s>]/, `${route}: no server-rendered page content`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route}: no server-rendered title`);
  assert.match(html, /<script defer src="\/assets\/site-visits\.js\?v=1"><\/script>/, `${route}: missing shared visit counter`);
  assert.match(html, /<site-visit-counter aria-live="polite">/, `${route}: missing visit counter fallback`);
  assert(!html.includes('src="https://hits.sh/'), `${route}: a fallback image would count again when React loads`);
  assert(!html.includes("/src/main.jsx"), `${route}: points at source instead of built React`);
  assert(!/<script[^>]+src="(?:\/site\.js|\/tools\.js|\/assets\/(?:pele\.global|(?:aws|azure|gcp|kspm|cnapp|vultr|oracle|digitalocean|alicloud)-architectures)\.js)/.test(html), `${route}: legacy JavaScript competes with React`);
  if (route !== "/404.html") {
    // Lab/blog aliases differ only in case and share their canonical content URL.
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
    assert.equal(canonical?.[1].toLowerCase(), `https://cloudsecuritycorner.com${route}`.toLowerCase(), `${route}: incorrect canonical`);
  } else {
    assert(html.includes("Page not found"), "404 fallback is missing");
  }
}

for (const provider of ["aws", "azure", "gcp", "kspm", "cnapp", "vultr", "oracle", "digitalocean", "alicloud"]) {
  for (const file of ["diagram.mmd", "policy.rego", ["kspm", "cnapp"].includes(provider) ? "workload.yaml" : "main.tf"]) {
    await publicFile(`reference-architectures/${provider}/${file}`);
  }
}
for (const provider of ["aws", "azure", "gcp", "kspm", "cnapp", "vultr", "oracle", "digitalocean", "alicloud"]) {
  await publicFile(`images/provider-logos/${provider}.svg`);
}
for (const data of ["aws", "azure", "gcp", "kspm", "cnapp", "vultr", "oracle", "digitalocean", "alicloud"]) {
  await publicFile(`data/${data}-best-practices.json`);
}
await publicFile("assets/app.css");
await publicFile("assets/initialize-theme.js");
await publicFile("assets/site-visits.js");
const cloudFeed = JSON.parse(await readFile(await publicFile("data/cloud-security-feed.json"), "utf8"));
assert.equal(cloudFeed.version, 1);
assert(cloudFeed.items.length > 0, "Cloud security feed is empty");
await publicFile("feeds/cloud-security.xml");
await publicFile("feeds/cloud-security.opml");
const fieldNotes = await readFile(path.join(output, "blog/index.html"), "utf8");
assert(fieldNotes.includes('id="cloud-feed"') && fieldNotes.includes('href="/feeds/cloud-security.xml"'), "Field Notes lacks server-rendered cloud headlines or RSS discovery");
const labs = JSON.parse(await readFile(await publicFile("data/labs.json"), "utf8")).labs;
const blogs = JSON.parse(await readFile(await publicFile("data/blog.json"), "utf8")).blogs;
for (const content of [...labs.map((lab) => lab.path), ...blogs.map((post) => post.file)]) {
  await publicFile(content);
}
for (const lab of labs) {
  if (lab.exercise) await publicFile(lab.exercise);
  for (const download of lab.downloads || []) await publicFile(download);
}
const labLibrary = await readFile(path.join(output, "labs/index.html"), "utf8");
assert(labLibrary.includes('id="aws-defender-path"'), "Missing server-rendered AWS Defender path");
for (const lab of labs.filter(lab => lab.track === 'AWS Defender')) {
  assert(labLibrary.includes(`href="/labs/${lab.id}"`) && labLibrary.includes(`href="${lab.guide}"`), `Missing path step: ${lab.id}`);
}
await publicFile(".nojekyll");
assert.equal(await readFile(path.join(output, "CNAME"), "utf8"), "cloudsecuritycorner.com\n");
console.log(`Combined export verified: ${routes.length} Elixir routes, React entry and lazy assets, 404, diagrams, downloads, and logos.`);
