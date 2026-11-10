// DigitalOcean Architecture Catalog Legacy Fallback Controller
(function() {
  const container = document.getElementById("digitalocean-architecture-app");
  if (!container) return;

  fetch("/data/digitalocean-best-practices.json")
    .then(r => r.json())
    .then(data => {
      container.innerHTML = `
        <div class="space-y-6">
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-700 text-sm text-slate-300">
            Loaded \${data.length} DigitalOcean architecture blueprints.
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            \${data.slice(0, 12).map(item => \`
              <div class="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400">\${item.category || "DigitalOcean"}</span>
                    <span class="text-xs text-slate-400">\${item.pillar || "Security"}</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base mb-2">\${item.title}</h3>
                  <p class="text-xs text-slate-400 line-clamp-3 mb-4">\${item.description}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
                  <span>ID: \${item.id}</span>
                  <span class="font-mono text-emerald-400">\${item.severity || "HIGH"}</span>
                </div>
              </div>
            \`).join("")}
          </div>
        </div>
      \`;
    })
    .catch(err => {
      console.error("Failed to load DigitalOcean architectures:", err);
    });
})();
