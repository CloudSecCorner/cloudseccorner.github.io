import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REPOSITORY_URL, getAbsoluteUrl } from "../utils/socialSharing";

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Cloud Security Corner",
      url: getAbsoluteUrl(),
      description: "Practical learning, hands-on labs, and curated tools for cloud security and agentic AI systems.",
      sameAs: ["https://github.com/CloudSecCorner"]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/tools");
    }
  };

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. KubeDaily Style Hero Section */}
      <section className="kube-home-hero">
        <div className="relative mx-auto grid items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-20 max-w-7xl">
          {/* Left Column Copy */}
          <div className="kube-home-copy">
            <span className="kube-kicker">Your cloud &amp; agentic security hub</span>
            <h1>
              Build confidence in <span>cloud &amp; agentic security.</span>
            </h1>
            <p>
              Practical paths through Cloud Security, Agentic AI, Zero Trust, Threat Modeling, and the tools that power modern platform defense—without the noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="kube-button" to="/labs/Agentic-Cloud-Security">
                Start with Agentic Security <span aria-hidden="true">→</span>
              </Link>
              <Link className="kube-button kube-button-outline" to="/tools">
                Browse the tool stack
              </Link>
            </div>
            <div className="kube-home-proof" aria-label="CloudSecCorner resource summary">
              <div>
                <strong>37,000+</strong>
                <span>tools curated</span>
              </div>
              <div>
                <strong>6</strong>
                <span>hands-on learning labs</span>
              </div>
              <div>
                <strong>1</strong>
                <span>place to start</span>
              </div>
            </div>
          </div>

          {/* Right Column Map Card with Orbit Graphic */}
          <aside className="kube-home-map" aria-label="Explore CloudSecCorner">
            <div className="kube-home-map-top">
              <span>Start here</span>
              <span>Learn · Practice · Defend</span>
            </div>
            <div className="kube-home-map-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="kube-home-map-content">
              <p className="kube-label">Choose your path</p>
              <h2>From first threat model to production guardrails.</h2>
              <ol>
                <li>
                  <span>01</span>
                  <Link to="/labs">Learn the fundamentals</Link>
                </li>
                <li>
                  <span>02</span>
                  <Link to="/tools">Choose the right security tools</Link>
                </li>
                <li>
                  <span>03</span>
                  <Link to="/blog">Explore agentic defense research</Link>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Clear Learning Path Section (kube-start-section) */}
      <section className="kube-start-section" aria-labelledby="learning-path-title">
        <div className="kube-section-container">
          <div className="kube-home-section-heading">
            <div>
              <p className="kube-label">Less searching. More learning.</p>
              <h2 id="learning-path-title">A clear path through cloud &amp; agentic security.</h2>
            </div>
            <p>
              New to security? Begin with fundamentals. Securing autonomous systems? Jump into agentic defense. Every lab is hands-on, free, and self-paced.
            </p>
          </div>

          {/* Learning Cards Grid */}
          <div className="kube-learning-grid">
            <Link className="kube-learning-card group" to="/labs/Security-Engineering-Fundamentals">
              <span className="kube-learning-step">01 · Start here</span>
              <h3>Security Engineering Fundamentals</h3>
              <p>Understand core defense principles, threat postures, and identity boundaries before configuring production systems.</p>
              <span className="kube-learning-action">
                Open Fundamentals lab <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link className="kube-learning-card group" to="/labs/Agentic-Cloud-Security">
              <span className="kube-learning-step">02 · Agentic AI</span>
              <h3>Agentic Cloud Security Essentials</h3>
              <p>Threat-model AI agents with cloud access. Design controls for identity, tools, sandboxes, approvals, and runtime response.</p>
              <span className="kube-learning-action">
                Open Agentic lab <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link className="kube-learning-card group" to="/labs/Zero-Trust-Architecture">
              <span className="kube-learning-step">03 · Architecture</span>
              <h3>Zero-Trust Architecture</h3>
              <p>Eliminate implicit trust with least-privilege access, workload identity, continuous attestation, and microsegmentation.</p>
              <span className="kube-learning-action">
                Open Zero-Trust guide <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link className="kube-learning-card group" to="/labs/Threat-Modeling">
              <span className="kube-learning-step">04 · Recon &amp; Audit</span>
              <h3>Threat Modeling &amp; Auditing</h3>
              <p>Map attack vectors, evaluate privilege escalation, scan networks with NMAP, and test real-world exploit mechanics safely.</p>
              <span className="kube-learning-action">
                Open Threat Modeling lab <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>

          {/* KubeDaily Style Quick Search Form */}
          <form className="kube-home-search" onSubmit={handleSearchSubmit} role="search" aria-label="Search the tool directory">
            <label htmlFor="home-tool-search">Looking for a security tool instead?</label>
            <div>
              <input
                id="home-tool-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CSPM, SAST, Agent Guardrails, Zero Trust, IAM, Network scanner…"
                aria-label="Search tools"
              />
              <button className="kube-button" type="submit">
                Find tools <span aria-hidden="true">→</span>
              </button>
            </div>
            <p>A curated directory of 37,000+ security tools, with filters you can bookmark and share.</p>
          </form>
        </div>
      </section>

      {/* 3. Community & Practice Gallery (kube-events style) */}
      <section className="kube-events">
        <div className="kube-section-container">
          <div className="kube-events-heading">
            <div>
              <p className="kube-label">In the community &amp; practice</p>
              <h2>Real-world defense, open community.</h2>
            </div>
            <p>
              From threat research to production platform security, Cloud Security Corner unites security engineers, cloud architects, red teamers, and AI builders.
            </p>
          </div>

          <div className="kube-events-gallery">
            <figure className="group kube-event-featured">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-900 to-slate-900" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
              <figcaption>
                <span>Core Defense Focus</span>
                <strong>Agent Identity &amp; Delegation Boundaries</strong>
                <p>Architect short-lived credentials, just-in-time access, and delegated authorization boundaries for autonomous workloads.</p>
              </figcaption>
            </figure>

            <figure className="group kube-event-card">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
              <figcaption>
                <span>Runtime Security</span>
                <strong>Tool Sandboxing &amp; Policy Gates</strong>
                <p>Isolate agent tools, execute code safely, and enforce policy guardrails on every action.</p>
              </figcaption>
            </figure>

            <figure className="group kube-event-card">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-900 to-cyan-950" />
              <figcaption>
                <span>Telemetry &amp; Audit</span>
                <strong>Real-Time Behavior Monitoring</strong>
                <p>Observe prompts, plans, tool calls, and cloud changes in context to stop rogue actions.</p>
              </figcaption>
            </figure>

            <figure className="group kube-event-wide">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950" />
              <figcaption>
                <span>Platform Architecture</span>
                <strong>Zero-Trust Cloud Workloads &amp; IAM</strong>
                <p>Implement continuous identity verification, automated secret rotation, and strict microsegmentation across multi-cloud environments.</p>
              </figcaption>
            </figure>

            <figure className="group kube-event-card">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
              <figcaption>
                <span>Offensive Recon</span>
                <strong>Network Scanning with NMAP</strong>
                <p>Hands-on network exploration, service auditing, and perimeter mapping techniques.</p>
              </figcaption>
            </figure>

            <figure className="group kube-event-card">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950" />
              <figcaption>
                <span>Assurance</span>
                <strong>AI Red Teaming &amp; Evaluations</strong>
                <p>Systematically probe prompt injection, privilege escalation, and unsafe cloud mutations.</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 4. Explore With Intent Section (kube-home-paths) */}
      <section className="kube-section-container">
        <div className="kube-home-section-heading">
          <div>
            <p className="kube-label">Explore with intent</p>
            <h2>Your next useful step</h2>
          </div>
          <p>Start with the kind of problem you are solving today, then follow a focused path.</p>
        </div>

        <div className="kube-home-paths">
          <article className="kube-home-path kube-home-path-featured">
            <span className="kube-home-path-number">01</span>
            <p className="kube-label">Practice</p>
            <h3>Learn by doing</h3>
            <p>Build real intuition with guided Agentic Security, Threat Modeling, Zero-Trust, and Network Auditing labs.</p>
            <Link to="/labs">
              Browse hands-on labs <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="kube-home-path">
            <span className="kube-home-path-number">02</span>
            <p className="kube-label">Discover</p>
            <h3>Find the right tools</h3>
            <p>Compare the open-source and modern security tools shaping AI, cloud, and runtime defense across 37,000+ entries.</p>
            <Link to="/tools">
              Explore the tool stack <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="kube-home-path">
            <span className="kube-home-path-number">03</span>
            <p className="kube-label">Understand</p>
            <h3>Keep learning</h3>
            <p>Read practical guides, attack surface breakdowns, and field notes from security practitioners.</p>
            <Link to="/blog">
              Read the blog <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      {/* 5. KubeDaily Style Contribute Section */}
      <section className="kube-contribute">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="kube-contribute-copy">
            <p className="kube-label">Grow the community</p>
            <h2>Know a tool or pattern the security community should discover?</h2>
            <p>
              Recommend a maintained project, contribute a lab, improve a threat model, or help keep categories useful for security teams building modern cloud and AI systems.
            </p>
          </div>
          <div className="kube-contribute-actions">
            <a
              className="kube-contribute-primary"
              href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
            >
              Contribution guide <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`${REPOSITORY_URL}/issues/new/choose`}
              target="_blank"
              rel="noreferrer"
            >
              Recommend a tool <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
