import { Link } from "react-router-dom";
import { REPOSITORY_URL } from "../utils/socialSharing";

function Footer() {
  return (
    <footer className="kube-footer">
      <div className="kube-footer-main">
        {/* Intro / Brand column */}
        <div className="kube-footer-intro">
          <Link to="/" className="kube-footer-wordmark" aria-label="Cloud Security Corner home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 text-white shadow-sm" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 3.5l10 4.2v7.1c0 6.2-3.9 11-10 13.7-6.1-2.7-10-7.5-10-13.7V7.7L16 3.5z" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="16" cy="11" r="2" fill="currentColor" stroke="none" />
                <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <circle cx="21" cy="18" r="1.7" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              CloudSec<span className="text-[#8b5cf6]">Corner</span>
            </span>
          </Link>
          <p>
            Practical, community-led learning for cloud security, DevSecOps, and the agentic AI ecosystem.
          </p>
          <a
            className="kube-footer-github"
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Join us on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Explore Nav */}
        <nav aria-label="Explore CloudSecCorner">
          <p className="kube-footer-heading">Explore</p>
          <Link to="/tools">Security tools directory</Link>
          <Link to="/tools">Agentic AI tools stack</Link>
          <Link to="/about">About CloudSecCorner</Link>
        </nav>

        {/* Learn Nav */}
        <nav aria-label="Learn with CloudSecCorner">
          <p className="kube-footer-heading">Learn</p>
          <Link to="/labs">Hands-on security labs</Link>
          <Link to="/blog">Blog &amp; guides</Link>
          <Link to="/labs/Agentic-Cloud-Security">Agentic security essentials</Link>
          <Link to="/labs/Security-Engineering-Fundamentals">Security engineering fundamentals</Link>
        </nav>

        {/* Community Nav */}
        <nav aria-label="CloudSecCorner community">
          <p className="kube-footer-heading">Community</p>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            GitHub Organization <span aria-hidden="true">↗</span>
          </a>
          <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
            Contribute a tool or lab <span aria-hidden="true">↗</span>
          </a>
          <a href="https://discord.gg/aUD4hkYYGt" target="_blank" rel="noreferrer">
            Discord Community <span aria-hidden="true">↗</span>
          </a>
          <Link to="/about">Our mission</Link>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="kube-footer-bottom">
        <p>© Cloud Security Corner. Built for the cloud security and AI community.</p>
        <p>Learn openly. Defend confidently.</p>
      </div>
    </footer>
  );
}

export default Footer;
