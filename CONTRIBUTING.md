# Contributing to Cloud Security Corner

Thank you for helping improve the community's cloud security resources. Keep each pull request focused and verify it with:

```bash
npm ci
npm run check
```

## Add a tool

Add the tool to `src/data/security-entries.js`. Include a clear title, official URL, concise description, category tag, and GitHub repository when one exists. Agentic security contributions should explain how the resource helps with identity, authorization, tool security, runtime defense, testing, governance, or incident response.

## Add a lab

1. Add the lab markdown file under `public/labs/`.
2. Add its metadata to `public/data/labs.json`.
3. Use a unique URL-safe `id` and make `path` point to the markdown file.

See `public/labs/CONTRIBUTING.md` for the lab format and content guidelines.

## Add a blog post

1. Add the markdown file under `public/blog/`.
2. Add its metadata to `public/data/blog.json`.
3. Use a unique URL-safe `id` and make `file` point to the markdown file.

Do not include credentials, private data, or instructions that require readers to use systems they do not own or have permission to test.
