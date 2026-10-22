# Cloud Security Corner on Phoenix

This is the Phoenix/Elixir server-rendered version of Cloud Security Corner. It follows KubeDaily's focused learning-hub layout while retaining the Cloud Security Corner identity, security content, and routes.

## Run locally

Requirements: Elixir 1.20+ and Erlang/OTP 27+.

```sh
cd phoenix
mix local.hex --force
mix deps.get
mix test
mix phx.server
```

Open <http://localhost:4000>. In production, set `SECRET_KEY_BASE` (generate one with `mix phx.gen.secret`) and optionally `PORT`.

## Routes and content

- `/` — learning-hub homepage
- `/tools` — searchable, filterable, paginated security tools
- `/labs` and `/labs/:id` — lab catalogue and markdown guides
- `/blog` and `/blog/:id` — article catalogue and markdown posts
- `/about` — community information

The source data is kept under `priv/data`, and static article, lab, and image files are under `priv/static`. The tool catalogue is exported from `src/data/security-entries.js` to `priv/data/security-entries.json`.

## Deployment (GitHub Pages via Elixir Export)

Following KubeDaily's architecture (`kubernetesdaily/kubernetesdaily.github.io`), Cloud Security Corner uses Phoenix and exports to static HTML for GitHub Pages:

1. **Static Export Task**: `mix site.export --output _site` renders all public routes (`/`, `/tools`, `/labs`, `/labs/:id`, `/blog`, `/blog/:id`, `/about`, `404.html`) and bundles static assets, `robots.txt`, `sitemap.xml`, and `.nojekyll`.
2. **GitHub Actions Workflow**: `.github/workflows/pages.yml` uses `erlef/setup-beam` with Elixir 1.20 and OTP 29, runs `mix site.export`, and publishes the resulting `_site` to GitHub Pages via `actions/deploy-pages@v4`.
3. **Continuous Integration**: `.github/workflows/ci.yml` runs formatting checks (`mix format --check-formatted`), compilation, test suites (`mix test`), and content verification.

