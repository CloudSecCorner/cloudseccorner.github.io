import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync(new URL('../public/assets/site-visits.js', import.meta.url), 'utf8');
const mirrored = fs.readFileSync(new URL('../priv/static/assets/site-visits.js', import.meta.url), 'utf8');
assert.equal(mirrored, script);

function browser(hostname = 'cloudsecuritycorner.com') {
  const definitions = new Map();
  const images = [];
  const requests = [];
  const timers = new Set();
  class Element {
    constructor() { this.dataset = {}; this.children = []; }
    replaceChildren(...nodes) { this.children = nodes; }
  }
  const customElements = { get: name => definitions.get(name), define: (name, value) => definitions.set(name, value) };
  const context = vm.createContext({
    window: { customElements }, customElements, location: { hostname }, HTMLElement: Element,
    Image: class {
      constructor() { this.style = {}; images.push(this); }
      set src(value) { this._src = value; requests.push(value); }
      get src() { return this._src; }
    },
    setTimeout: callback => { timers.add(callback); return callback; },
    clearTimeout: callback => timers.delete(callback),
  });
  vm.runInContext(script, context);
  return {
    images, requests, timers,
    mount() { const node = new (definitions.get('site-visit-counter'))(); node.connectedCallback(); return node; },
    reloadScript() { vm.runInContext(script, context); },
  };
}

// A pending Elixir badge can finish after React has replaced the footer.
const page = browser();
const fallback = page.mount();
assert.equal(fallback.dataset.state, 'loading');
fallback.disconnectedCallback();
const react = page.mount();
page.images[0].onload();
assert.equal(react.dataset.state, 'ready');
assert.equal(react.children[0], page.images[0]);
assert.equal(page.timers.size, 0);
react.disconnectedCallback();
const remount = page.mount();
page.reloadScript();
assert.equal(page.images.length, 1, 'Handoff, remounts and duplicate script execution must not recount');
assert.equal(page.requests.length, 1);
assert.equal(remount.children[0], page.images[0]);
assert.equal(new URL(page.images[0].src).pathname, '/cloudsecuritycorner.com.svg');
assert.equal(new URL(page.images[0].src).searchParams.get('extraCount'), null);
assert.equal(page.images[0].referrerPolicy, 'no-referrer');

const failure = browser();
const unavailable = failure.mount();
failure.images[0].onerror();
assert.equal(unavailable.dataset.state, 'unavailable');
assert.equal(unavailable.textContent, 'Temporarily unavailable');
failure.mount();
assert.equal(failure.images.length, 1, 'A failed request must not be retried as an extra visit');

const timeout = browser();
const waiting = timeout.mount();
[...timeout.timers][0]();
assert.equal(waiting.dataset.state, 'unavailable');
timeout.images[0].onload();
assert.equal(waiting.dataset.state, 'ready', 'A slow successful response can still display its total');

for (const hostname of ['127.0.0.1', 'localhost', 'preview.example', 'cloudsecuritycorner.com.attacker.example']) {
  const preview = browser(hostname);
  assert.equal(preview.mount().dataset.state, 'preview');
  assert.equal(preview.images.length, 0, 'Preview and untrusted hosts must not change the production count');
}
console.log('Validated one shared visit request across renderer handoffs, remounts, errors, timeouts, and preview hosts.');
