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

## Deployment status

The existing GitHub Pages workflow still builds and publishes the current static site. GitHub Pages cannot run a Phoenix server, so this app is staged separately in `phoenix/` until a server host is selected. Switching the live site to Phoenix requires configuring that host and replacing the Pages deployment workflow.
