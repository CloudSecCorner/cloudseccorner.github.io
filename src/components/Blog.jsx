import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import OpenGraph from "./OpenGraph";
import { getAbsoluteUrl, REPOSITORY_URL, SITE_URL } from "../utils/socialSharing";

const fallbackBlogData = [
  {
    id: "Safeguarding-the-AI-Frontier",
    title: "Safeguarding the AI Frontier: An In-Depth Analysis of Enterprise Agentic Security",
    date: "April 23, 2025",
    excerpt: "An architectural deep-dive into protecting autonomous AI agents, toolchain isolation, and credential boundaries in production cloud systems.",
    author: "Sangam Biradar",
    file: "/blog/Straikers-Revouktionary-solution.md",
    category: "Agentic Security",
    tags: ["Agent Security", "AI Cloud", "Threat Modeling"]
  }
];

// Blog List View (Matching KubeDaily Blog Library)
function BlogList({ blogPosts }) {
  const [selectedTag, setSelectedTag] = useState("all");

  const allTags = ["all", ...new Set(blogPosts.flatMap(post => post.tags || []))];

  const filteredPosts = selectedTag === "all"
    ? blogPosts
    : blogPosts.filter(post => post.tags && post.tags.includes(selectedTag));

  return (
    <>
      {/* KubeDaily Blog Hero */}
      <section className="kube-blog-hero">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
          <div className="kube-blog-hero-copy">
            <span className="kube-label">Field Notes &amp; Research</span>
            <h1>
              Agentic Security &amp; <span>Cloud Defense Guides.</span>
            </h1>
            <p>
              Practical guides, threat analyses, and field notes on securing autonomous workloads, credential delegation, and runtime cloud guardrails.
            </p>
            <div className="kube-blog-topics" aria-label="Popular topics">
              {allTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition capitalize ${
                    selectedTag === tag
                      ? "border-brand-purple-300 bg-brand-purple-800 text-white"
                      : "border-brand-gray-650 bg-brand-gray-800/70 text-brand-gray-200 hover:border-brand-purple-100 hover:text-white"
                  }`}
                >
                  {tag === "all" ? "All topics" : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="kube-blog-section-heading">
          <div>
            <p className="kube-label">The Library</p>
            <h2>All Guides &amp; Research</h2>
          </div>
          <p>{filteredPosts.length} {filteredPosts.length === 1 ? "guide" : "guides"} available</p>
        </div>

        <div className="kube-blog-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="kube-blog-card group">
              <div className="kube-blog-card-top">
                <span className="kube-label">{post.category}</span>
                <time className="text-xs font-semibold text-slate-500 dark:text-slate-400">{post.date}</time>
              </div>
              <h2>
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <div className="kube-blog-card-tags">
                {post.tags && post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <Link className="kube-blog-card-link" to={`/blog/${post.id}`}>
                Read guide <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        {/* Contribute Box */}
        <div className="mt-16 rounded-xl border border-slate-200 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="kube-label">Share with the community</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Want to contribute a security guide?</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl text-sm leading-relaxed">
                We welcome research and field notes from practitioners. Submit a pull request on GitHub with markdown in the <code>public/blog</code> directory.
              </p>
            </div>
            <a
              href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
              className="kube-button shrink-0"
            >
              Contribution guide <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Blog Post Detail (Matching KubeDaily's post.html.heex)
function BlogPostDetail({ post }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(post.file);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent(`# ${post.title}\n\n${post.excerpt}\n\nContent could not be retrieved from ${post.file}.`);
        }
      } catch (err) {
        console.error("Error loading blog content:", err);
        setContent(`# ${post.title}\n\n${post.excerpt}`);
      } finally {
        setLoading(false);
      }
    };

    if (post && post.file) {
      fetchPostContent();
    }
  }, [post]);

  return (
    <>
      <OpenGraph
        title={`${post.title} | Cloud Security Corner`}
        description={post.excerpt}
        url={`/blog/${post.id}`}
        type="article"
        tags={post.tags || []}
      />

      {/* Article Hero */}
      <section className="kube-article-hero" id="reader-top">
        <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Link className="kube-article-back" to="/blog">
            <span aria-hidden="true">←</span> Back to the blog
          </Link>
          <p className="kube-label mt-6">
            {post.category} · {post.date}
          </p>
          <h1>{post.title}</h1>
          <p className="kube-dek">{post.excerpt}</p>
          <div className="kube-article-byline">
            <span>By <strong>{post.author}</strong></span>
            <span aria-hidden="true">•</span>
            <span>Practical field guide</span>
          </div>
        </div>
      </section>

      {/* Article Shell */}
      <div className="kube-article-shell">
        <aside className="kube-article-aside" aria-label="Article details">
          <p className="kube-label">Article details</p>
          <dl>
            <div>
              <dt>Topic</dt>
              <dd>{post.category}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{post.date}</dd>
            </div>
          </dl>
          <div className="kube-article-tags">
            {post.tags && post.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <a
            className="kube-contribute-link"
            href={`${REPOSITORY_URL}/blob/main/public${post.file}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit this guide on GitHub →
          </a>
          <a
            className="kube-contribute-link"
            href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noreferrer"
          >
            Contribution guide
          </a>
        </aside>

        <article className="kube-reading">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent mx-auto mb-3" />
              Loading guide…
            </div>
          ) : (
            <div className="kube-markdown">
              <MarkdownRenderer content={content} />
            </div>
          )}
          <footer className="kube-reader-end">
            <p>Put the ideas into practice.</p>
            <Link to="/labs">Explore hands-on labs →</Link>
            <a href="#reader-top">Back to top ↑</a>
          </footer>
        </article>
      </div>
    </>
  );
}

// Main Blog Component
function Blog() {
  const { postId } = useParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogIndex = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/blog.json');
        if (response.ok) {
          const jsonData = await response.json();
          setBlogPosts(jsonData.blogs || fallbackBlogData);
        } else {
          setBlogPosts(fallbackBlogData);
        }
      } catch (err) {
        console.error("Failed to load blog index:", err);
        setBlogPosts(fallbackBlogData);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogIndex();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const currentPost = postId
    ? blogPosts.find((p) => p.id.toLowerCase() === postId.toLowerCase())
    : null;

  return postId && currentPost ? (
    <BlogPostDetail post={currentPost} />
  ) : (
    <BlogList blogPosts={blogPosts} />
  );
}

export default Blog;
