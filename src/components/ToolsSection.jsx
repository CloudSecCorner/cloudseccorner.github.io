import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { entries } from "../data/entries";
import OpenGraph from "./OpenGraph";
import { REPOSITORY_URL } from "../utils/socialSharing";

const PAGE_SIZE = 30;

function escapeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function getGitHubStarsBadge(link, github) {
  if (link && link.includes("github.com")) {
    try {
      const url = new URL(link);
      if (url.hostname === "github.com") {
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          return `https://img.shields.io/github/stars/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1].replace(/\.git$/, ""))}.svg?style=flat&label=stars&color=7c3aed`;
        }
      }
    } catch {}
  }

  if (github) {
    const trimmed = github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const parts = trimmed.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://img.shields.io/github/stars/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}.svg?style=flat&label=stars&color=7c3aed`;
    }
  }

  return null;
}

function ToolsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = searchParams.get("sort") === "za" ? "za" : "az";

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState(urlSort);
  const [page, setPage] = useState(1);
  const [githubStars, setGithubStars] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);

  // Sync state when URL params change (e.g. browser back/forward)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const s = searchParams.get("sort") === "za" ? "za" : "az";
    setQuery(q);
    setCategory(cat);
    setSort(s);
  }, [searchParams]);

  // Fetch GitHub stars for repository badge
  useEffect(() => {
    fetch("https://api.github.com/repos/CloudSecCorner/cloudseccorner.github.io", {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((repo) => {
        if (Number.isFinite(repo?.stargazers_count)) {
          setGithubStars(repo.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  // Compute unique categories/tags
  const uniqueTags = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.tag).filter(Boolean))).sort();
  }, []);

  // Update URL params
  const updateUrl = (newQuery, newCategory, newSort) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newCategory) params.set("category", newCategory);
    if (newSort === "za") params.set("sort", "za");
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    updateUrl(val, category, sort);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    setPage(1);
    updateUrl(query, val, sort);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    setPage(1);
    updateUrl(query, category, val);
  };

  const handleClearFilters = () => {
    setQuery("");
    setCategory("");
    setSort("az");
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  // Quick filter presets
  const quickFilters = [
    { label: "All Tools", value: "" },
    { label: "Agentic Security", value: "AI Security" },
    { label: "Cloud Security", value: "Cloud Security" },
    { label: "Application Security", value: "Application Security" },
    { label: "Network Security", value: "Network Security" },
    { label: "Identity & Access", value: "Identity" },
  ];

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const catLower = category.toLowerCase().trim();

    return entries
      .filter((entry) => {
        const title = entry.title || "";
        const desc = entry.description || "";
        const tag = entry.tag || "";
        const haystack = `${title} ${desc} ${tag}`.toLowerCase();

        const matchesCategory =
          !catLower ||
          tag.toLowerCase() === catLower ||
          tag.toLowerCase().includes(catLower);

        const matchesWords =
          words.length === 0 || words.every((word) => haystack.includes(word));

        return matchesCategory && matchesWords;
      })
      .sort((a, b) => {
        const order = sort === "za" ? -1 : 1;
        return order * (a.title || "").localeCompare(b.title || "");
      });
  }, [query, category, sort]);

  const visibleLimit = Math.min(page * PAGE_SIZE, filteredEntries.length);
  const visibleEntries = filteredEntries.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredEntries.length;
  const isFiltering = Boolean(query || category || sort === "za");

  return (
    <div className="w-full">
      <OpenGraph
        title="Security & Agentic Tools Directory | Cloud Security Corner"
        description="Search CloudSecCorner's curated collection of 37,000+ open-source tools across AI agent security, cloud defense, identity, runtime monitoring, and governance."
        tags={["AI Agent Security Tools", "Cloud Security Tools", "Runtime Security", "Zero Trust"]}
      />

      {/* KubeDaily Tools Hero */}
      <section className="kube-tools-hero">
        <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="kube-tools-hero-copy">
            <p className="kube-label">Security &amp; Agentic Ecosystem Directory</p>
            <h1>
              Find the tools that help teams <span>secure cloud and AI agents.</span>
            </h1>
            <p>
              Search CloudSecCorner’s curated collection of 37,000+ projects across AI agent security, cloud defense, identity, runtime monitoring, and governance.
            </p>
            <a className="kube-tools-star" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              <span aria-hidden="true">★</span>
              <strong>
                {githubStars !== null ? `${githubStars.toLocaleString()} GitHub stars` : "GitHub"}
              </strong>
              <small>Star CloudSecCorner on GitHub ↗</small>
            </a>
          </div>
        </div>
      </section>

      {/* Main Directory Container */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Directory Heading */}
        <div className="kube-tools-directory-heading">
          <div>
            <p className="kube-label">Explore the directory</p>
            <h2>Search by project or category.</h2>
          </div>
          <p>
            Filter by category, sort by name, and share the URL to keep your selection. Every result links to the project; GitHub stars are informational, not a quality ranking.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Quick category filters">
          {quickFilters.map((qf) => {
            const isActive =
              qf.value === ""
                ? category === ""
                : category.toLowerCase().includes(qf.value.toLowerCase());
            return (
              <button
                key={qf.label}
                type="button"
                onClick={() => {
                  setCategory(qf.value);
                  setPage(1);
                  updateUrl(query, qf.value, sort);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-purple text-white shadow-sm"
                    : "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d4449]"
                }`}
              >
                {qf.label}
              </button>
            );
          })}
        </div>

        {/* Tool Controls Form */}
        <form
          className="kube-tool-controls mt-6"
          role="search"
          aria-label="Find security tools"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="tool-query">
            Search tools
            <input
              id="tool-query"
              name="q"
              type="search"
              placeholder="Try Agentic, Zero-Trust, Falco, IAM…"
              autoComplete="off"
              value={query}
              onChange={handleQueryChange}
            />
          </label>

          <label htmlFor="tool-category">
            Category
            <select
              id="tool-category"
              name="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All categories ({uniqueTags.length})</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="tool-sort">
            Sort by
            <select
              id="tool-sort"
              name="sort"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="az">Name: A–Z</option>
              <option value="za">Name: Z–A</option>
            </select>
          </label>
        </form>

        {/* Results Toolbar */}
        <div className="kube-results-toolbar">
          <p className="kube-tool-count" role="status" aria-live="polite" aria-atomic="true">
            Showing <strong>{visibleLimit.toLocaleString()}</strong> of{" "}
            <strong>{filteredEntries.length.toLocaleString()}</strong> matching tools ·{" "}
            {entries.length.toLocaleString()} in the directory
          </p>
          <button
            type="button"
            className="kube-filter-reset"
            onClick={handleClearFilters}
            disabled={!isFiltering}
          >
            Clear filters
          </button>
        </div>

        {/* Tool Grid */}
        <div className="kube-tool-grid" id="tool-results">
          {visibleEntries.length === 0 ? (
            <div className="col-span-full kube-tool-empty">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching tools</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Try a broader keyword or use Clear filters to start again.
              </p>
            </div>
          ) : (
            visibleEntries.map((entry, idx) => {
              const link = escapeUrl(entry.link);
              const badgeUrl = getGitHubStarsBadge(entry.link, entry.github);

              return (
                <article key={`${entry.title}-${idx}`} className="kube-tool-card">
                  <div className="kube-tool-card-meta">
                    <p className="kube-label">{entry.tag || "Security Tool"}</p>
                    {badgeUrl && (
                      <span className="kube-tool-stars">
                        <img
                          className="kube-stars-image"
                          loading="lazy"
                          width="95"
                          height="20"
                          src={badgeUrl}
                          alt="GitHub stars"
                        />
                      </span>
                    )}
                  </div>
                  <h2>{entry.title}</h2>
                  <p>{entry.description || "Explore this project's official documentation and source."}</p>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Visit official project <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="mt-auto pt-7 text-xs text-slate-400">Documentation link pending</span>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Show More Tools Button */}
        {hasMore && (
          <div className="kube-directory-more">
            <button
              type="button"
              className="kube-button"
              id="tool-more"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Show more tools ({filteredEntries.length - visibleLimit} remaining)
            </button>
          </div>
        )}
      </section>

      {/* Contribute Callout Banner */}
      <section className="kube-contribute">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="kube-contribute-copy">
            <p className="kube-label">Grow the directory</p>
            <h2>Know a tool the security community should discover?</h2>
            <p>
              Recommend a maintained project, improve a description, or help keep links and categories useful for people evaluating their cloud &amp; agentic stack.
            </p>
          </div>
          <div className="kube-contribute-actions">
            <a
              className="kube-contribute-primary"
              href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
            >
              Contribution guide ↗
            </a>
            <button
              type="button"
              onClick={() => setShowContributeModal(true)}
              className="rounded-lg border border-slate-300 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white transition hover:border-brand-purple-300"
            >
              Recommend a tool ↗
            </button>
          </div>
        </div>
      </section>

      {/* Contribute Modal */}
      {showContributeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#3d4449] bg-white dark:bg-[#22272e] p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#3d4449] pb-4">
              <div>
                <p className="kube-label">Open Source Submission</p>
                <h3 className="text-xl font-bold">Contribute a Security Tool</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowContributeModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#31373b] hover:text-slate-900 dark:hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                CloudSecCorner maintains an index of over 37,000 security and AI agent projects. We welcome community additions and corrections!
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white">How to submit:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fork the repository on GitHub.</li>
                <li>Add your project entry into <code className="rounded bg-slate-100 dark:bg-[#31373b] px-1.5 py-0.5 font-mono text-purple-600 dark:text-purple-400">src/data/entries.js</code>.</li>
                <li>Ensure it includes a title, valid project URL, category tag, and concise description.</li>
                <li>Open a Pull Request with our PR template.</li>
              </ol>

              <div className="rounded-xl border border-slate-200 dark:border-[#3d4449] bg-slate-50 dark:bg-[#18131f] p-4 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  title: "Your Tool Name",
  link: "https://your-tool.example.com",
  description: "Precise summary of what this security tool does.",
  github: "owner/repo",
  tag: "Agentic Security"
}`}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 dark:border-[#3d4449] pt-4">
              <button
                type="button"
                onClick={() => setShowContributeModal(false)}
                className="rounded-lg border border-slate-300 dark:border-[#3d4449] px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#31373b]"
              >
                Close
              </button>
              <a
                href={`${REPOSITORY_URL}/issues/new?title=Tool+Recommendation&labels=tool-submission`}
                target="_blank"
                rel="noreferrer"
                className="kube-button"
              >
                Submit on GitHub ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsSection;
