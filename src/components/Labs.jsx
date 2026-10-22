import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import OpenGraph from "./OpenGraph";
import { REPOSITORY_URL, SITE_URL } from "../utils/socialSharing";

// Fallback data in case the fetch fails
const fallbackLabsData = [
  {
    id: "Agentic-Cloud-Security",
    title: "Agentic Cloud Security Essentials",
    description: "Threat-model an AI agent with cloud access and design controls for identity, tools, approvals, isolation, observability, and response.",
    category: "Agentic Security",
    path: "/labs/agentic-cloud-security.md",
    contributors: ["Sangam Biradar"],
    tags: ["Cloud Security", "AI Security", "Agentic Defense"]
  },
  {
    id: "Security-Engineering-Fundamentals",
    title: "Security Engineering Fundamentals",
    description: "Understand the core principles of security engineering and how to apply them to modern infrastructure and workload boundaries.",
    category: "Security Engineering",
    path: "/labs/Security-Engineering-Fundamentals.md",
    contributors: ["Sangam Biradar"],
    tags: ["Security Engineering", "Defense In Depth", "Identity"]
  },
  {
    id: "Zero-Trust-Architecture",
    title: "Zero-Trust Architecture",
    description: "A security model assuming all users, devices, and agents are hostile. Enforce mutual attestation, least privilege, and continuous verification.",
    category: "Security Engineering",
    path: "/labs/Zero-Trust-Architecture.md",
    contributors: ["Sangam Biradar"],
    tags: ["Zero Trust", "Cloud Architecture", "IAM"]
  },
  {
    id: "Threat-Modeling",
    title: "Threat Modeling Practical Guide",
    description: "Learn how to systematically create a threat model, map trust boundaries, and evaluate attack surfaces for real-world cloud architectures.",
    category: "Security Engineering",
    path: "/labs/threat-modeling.md",
    contributors: ["Sangam Biradar"],
    tags: ["Threat Modeling", "Architecture", "STRIDE"]
  },
  {
    id: "Nmap-Practical-Labs",
    title: "NMAP Practical Auditing Labs",
    description: "Network reconnaissance, service discovery, open port auditing, and banner grabbing techniques for security engineers.",
    category: "Network Security",
    path: "/labs/NMAP-Practical-Labs.md",
    contributors: ["Sangam Biradar"],
    tags: ["Network Security", "Reconnaissance", "Auditing"]
  },
  {
    id: "ethical-hacker-easy-way",
    title: "Ethical Hacker Practical Lab",
    description: "Hands-on fundamentals of ethical hacking, penetration testing workflows, vulnerability assessment, and defense validation.",
    category: "Ethical Hacking",
    path: "/labs/ethical-hacker-easy-way.md",
    contributors: ["Sangam Biradar"],
    tags: ["Ethical Hacking", "Penetration Testing"]
  }
];

// 1. Labs Library Listing Component (matching KubeDaily's labs.html.heex)
function LabsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabsData = async () => {
      try {
        setLoading(true);
        const potentialUrls = [
          '/data/labs.json',
          '/labs/index.json',
          `${window.location.origin}/data/labs.json`
        ];

        let fetchSuccess = false;
        for (const url of potentialUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              setLabsData(data.labs || []);
              fetchSuccess = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, err);
          }
        }

        if (!fetchSuccess) {
          setLabsData(fallbackLabsData);
        }
      } catch (error) {
        console.error("Error fetching labs data:", error);
        setLabsData(fallbackLabsData);
      } finally {
        setLoading(false);
      }
    };

    fetchLabsData();
  }, []);

  const categories = ["all", ...new Set(labsData.map(lab => lab.category))];

  const filteredLabs = labsData.filter(lab => {
    const matchesSearch =
      searchQuery === "" ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.tags && lab.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = activeCategory === "all" || lab.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* KubeDaily Library Header */}
      <header className="kube-library-header">
        <div className="kube-library-container">
          <p className="kube-label">The CloudSecCorner workshop</p>
          <h1>
            Less theory.<br />
            <span>More hands-on understanding.</span>
          </h1>
          <p className="kube-library-intro">
            Explore cloud and agentic security at your own pace. Start with Security Engineering Fundamentals, inspect agent boundaries, and build up to zero-trust architectures.
          </p>
          <div className="kube-library-links">
            <Link to="/labs/Agentic-Cloud-Security">Start with Agentic Security →</Link>
            <Link to="/blog">Looking for an explanation? Read the guides →</Link>
          </div>
        </div>
      </header>

      {/* KubeDaily Library Section */}
      <section id="lab-library" className="kube-library-container kube-library-section">
        <div className="kube-library-toolbar">
          <div>
            <p className="kube-label">Practice &amp; explore</p>
            <h2>Choose your next lab</h2>
          </div>
          <div className="kube-library-search">
            <label htmlFor="lab-search">Find a lab</label>
            <input
              id="lab-search"
              type="search"
              placeholder="Search Agentic, Threat, Zero-Trust…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${
                activeCategory === cat
                  ? "bg-purple text-white shadow-sm"
                  : "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d4449]"
              }`}
            >
              {cat === "all" ? "All Labs" : cat}
            </button>
          ))}
        </div>

        <p className="kube-library-count" role="status">
          {filteredLabs.length} {filteredLabs.length === 1 ? "lab" : "labs"} to explore
        </p>

        {/* Labs Grid */}
        <div className="kube-labs-grid">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent mx-auto mb-3" />
              Loading labs…
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-[#3d4449] p-10 text-center text-slate-600 dark:text-slate-400">
              No labs match that search. Try another query or clear the filter to see everything.
            </div>
          ) : (
            filteredLabs.map((lab) => (
              <article key={lab.id} className="kube-lab-card group">
                <div className="kube-lab-card-top">
                  <span className="kube-lab-number" aria-hidden="true">&gt;_</span>
                  <p className="kube-label">{lab.category}</p>
                </div>
                <h3>
                  <Link to={`/labs/${lab.id}`}>{lab.title}</Link>
                </h3>
                <p>{lab.description}</p>
                <div className="kube-lab-card-tags" aria-label="Topics">
                  {lab.tags && lab.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="kube-lab-card-link" to={`/labs/${lab.id}`}>
                  Open lab <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))
          )}
        </div>

        {/* Good Habit Callout */}
        <div className="kube-library-practice">
          <strong>A good defense habit</strong>
          <p>
            Use a disposable sandboxed environment. Verify IAM trust boundaries, read policies before applying them, and clean up temporary test resources when finished.
          </p>
        </div>
      </section>

      {/* Library Footer */}
      <section className="kube-library-container kube-library-footer">
        <div>
          <p className="kube-label">Learn in the open</p>
          <h2>Make the next step easier for someone.</h2>
          <p>Report an outdated policy, clarify a threat model, or contribute an exercise.</p>
        </div>
        <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
          Improve a lab →
        </a>
      </section>
    </>
  );
}

// 2. Individual Lab Reader Component (matching KubeDaily's lab.html.heex)
function LabDetail() {
  const { labId } = useParams();
  const [content, setContent] = useState("");
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        let labsData = [];
        let fetchSuccess = false;

        const potentialUrls = [
          '/data/labs.json',
          '/labs/index.json',
          `${window.location.origin}/data/labs.json`
        ];

        for (const url of potentialUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              labsData = data.labs || [];
              fetchSuccess = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, err);
          }
        }

        if (!fetchSuccess) {
          labsData = fallbackLabsData;
        }

        const selectedLab = labsData.find((l) => l.id.toLowerCase() === labId.toLowerCase());
        if (!selectedLab) {
          navigate("/labs");
          return;
        }

        setLab(selectedLab);

        try {
          const markdownResponse = await fetch(selectedLab.path);
          if (markdownResponse.ok) {
            const text = await markdownResponse.text();
            setContent(text);
          } else {
            setContent(`# ${selectedLab.title}\n\n${selectedLab.description}\n\nContent for this lab will be updated shortly.`);
          }
        } catch (err) {
          console.error("Error fetching markdown:", err);
          setContent(`# ${selectedLab.title}\n\n${selectedLab.description}`);
        }
      } catch (error) {
        console.error("Error fetching lab details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [labId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!lab) {
    return null;
  }

  return (
    <div>
      <OpenGraph
        title={`${lab.title} | Cloud Security Corner Labs`}
        description={lab.description}
        url={`/labs/${lab.id}`}
        type="article"
        tags={lab.tags || []}
      />

      {/* Reader Header */}
      <header className="kube-lab-reader-header" id="reader-top">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
          <nav className="kube-lab-breadcrumb" aria-label="Breadcrumb">
            <Link to="/labs">Labs</Link>
            <span aria-hidden="true">/</span>
            <span>{lab.category}</span>
          </nav>
          <p className="kube-label">Self-paced lab</p>
          <h1>{lab.title}</h1>
          <p>{lab.description}</p>
          <div className="kube-lab-reader-tags" aria-label="Lab topics">
            {lab.tags && lab.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </header>

      {/* Reader Steps */}
      <section className="kube-lab-steps" aria-label="How to use this lab">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-10">
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Read the concept</strong>
                <small>Build the mental model first.</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Try the commands</strong>
                <small>Use a disposable sandboxed environment.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Keep the notes</strong>
                <small>Return when you need a refresher.</small>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Reader Shell */}
      <article className="kube-lab-reader-shell">
        <aside className="kube-lab-outline" aria-label="Lesson contents">
          <Link className="kube-lab-outline-all" to="/labs">
            ← All labs
          </Link>
          <a
            className="kube-contribute-link"
            href={`${REPOSITORY_URL}/blob/main/public${lab.path}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit this lab on GitHub →
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

        <div className="kube-lab-reading">
          <div className="kube-lab-reading-note">
            <strong>Before you start:</strong> Read commands and policies before executing them. Avoid using production accounts for testing.
          </div>
          <div className="kube-markdown">
            <MarkdownRenderer content={content} />
          </div>
          <footer className="kube-reader-end">
            <p>Ready for another topic?</p>
            <Link to="/labs">Browse all labs →</Link>
            <a href="#reader-top">Back to top ↑</a>
          </footer>
        </div>
      </article>
    </div>
  );
}

// Main Component Router
function Labs() {
  const { labId } = useParams();
  return !labId ? <LabsList /> : <LabDetail />;
}

export default Labs;
