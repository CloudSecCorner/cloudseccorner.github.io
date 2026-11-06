// One shared badge request survives the Elixir-to-React handoff and route changes.
(() => {
  if (!window.customElements || customElements.get('site-visit-counter')) return;

  const live = ['cloudsecuritycorner.com', 'www.cloudsecuritycorner.com', 'cloudseccorner.github.io'].includes(location.hostname.toLowerCase());
  const mounts = new Set();
  let image;
  let state = 'loading';
  let timeout;
  const update = () => mounts.forEach(node => node.showCount());
  const finish = next => {
    clearTimeout(timeout);
    state = next;
    update();
  };

  customElements.define('site-visit-counter', class extends HTMLElement {
    connectedCallback() {
      if (!live) {
        this.textContent = 'Live site only';
        this.dataset.state = 'preview';
        return;
      }

      mounts.add(this);
      if (!image) {
        image = new Image();
        image.alt = 'Recorded site visits; repeat page loads included';
        image.height = 20;
        image.style.display = 'block';
        image.referrerPolicy = 'no-referrer';
        image.decoding = 'async';
        image.onload = () => finish('ready');
        image.onerror = () => finish('unavailable');
        timeout = setTimeout(() => finish('unavailable'), 10000);
        image.src = 'https://hits.sh/cloudsecuritycorner.com.svg?label=total&color=0e7490&labelColor=172126&style=flat-square';
      }
      this.showCount();
    }

    disconnectedCallback() {
      mounts.delete(this);
    }

    showCount() {
      this.dataset.state = state;
      if (state === 'ready') this.replaceChildren(image);
      else this.textContent = state === 'loading' ? 'Loading…' : 'Temporarily unavailable';
    }
  });
})();
