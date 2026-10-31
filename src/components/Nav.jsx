import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { REPOSITORY_URL } from "../utils/socialSharing";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem("kube-banner-dismissed") === "true";
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return true;
  });

  const location = useLocation();

  // Sync document root class with theme state
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isMenuOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const dismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem("kube-banner-dismissed", "true");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const desktopNavLinks = [
    { path: "/", label: "Home" },
    {
      path: "/aws-architectures",
      label: "AWS Architectures",
      badge: "1,000+",
      badgeClass: "bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30"
    },
    {
      path: "/azure-architectures",
      label: "Azure Architectures",
      badge: "1,000+",
      badgeClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
    },
    {
      path: "/gcp-architectures",
      label: "GCP Architectures",
      badge: "1,000+",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
    },
    {
      path: "/kspm-architectures",
      label: "KSPM Kubernetes",
      badge: "1,000+",
      badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30"
    },
    { path: "/tools", label: "Tools" },
    { path: "/labs", label: "Labs" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" }
  ];

  const architectureLinks = [
    {
      path: "/aws-architectures",
      label: "AWS Architectures",
      badge: "1,000+",
      badgeClass: "bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30",
      description: "Well-Architected, IAM & VPC Security"
    },
    {
      path: "/azure-architectures",
      label: "Azure Architectures",
      badge: "1,000+",
      badgeClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30",
      description: "Entra ID, NSG & Defender Security"
    },
    {
      path: "/gcp-architectures",
      label: "GCP Architectures",
      badge: "1,000+",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
      description: "Workload Identity, VPC SC & SCC"
    },
    {
      path: "/kspm-architectures",
      label: "KSPM Kubernetes",
      badge: "1,000+",
      badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30",
      description: "Pod & Kind Hardening with Pele & OPA"
    }
  ];

  const resourceLinks = [
    { path: "/tools", label: "Security Tools", description: "37,000+ Curated Open Source Tools" },
    { path: "/labs", label: "Hands-on Labs", description: "Agentic AI & Cloud Security Roadmaps" },
    { path: "/blog", label: "Engineering Blog", description: "Architecture Teardowns & Guides" },
    { path: "/about", label: "About Mission", description: "Open source community & contributors" }
  ];

  return (
    <>
      {/* Top Pick-up / Announcement Bar */}
      {!bannerDismissed && (
        <div id="pick-up" role="region" aria-label="Announcement">
          <span>⚡ Want to pick up where you left off? Practice Agentic Cloud Defense</span>
          <Link to="/labs/Agentic-Cloud-Security" onClick={dismissBanner}>
            Take me there
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <button
            onClick={dismissBanner}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/80 hover:text-white transition rounded-md hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="kube-site-header">
        <nav className="kube-header-inner" aria-label="Main navigation">
          {/* Brand */}
          <Link to="/" className="kube-brand" aria-label="Cloud Security Corner Home">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 text-white shadow-md shadow-purple-500/25" aria-hidden="true">
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 3.5l10 4.2v7.1c0 6.2-3.9 11-10 13.7-6.1-2.7-10-7.5-10-13.7V7.7L16 3.5z" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="16" cy="11" r="2" fill="currentColor" stroke="none" />
                <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <circle cx="21" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <path d="M16 13v2.5m-1.5 1L12.4 17.5m5.1-1l2.1 1" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-slate-900 dark:text-white font-extrabold text-lg tracking-tight">
                CloudSec<span className="text-[#8b5cf6]">Corner</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c6f89] dark:text-[#caa2f5] mt-1">
                Cloud &amp; Agentic Security
              </span>
            </div>
          </Link>

          {/* Desktop Center Pill Menu (Shown on xl screens >= 1280px) */}
          <div className="hidden xl:flex kube-nav-menu" role="menubar">
            {desktopNavLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`kube-nav-link ${active ? "active" : ""} inline-flex items-center gap-1.5`}
                  aria-current={active ? "page" : undefined}
                  role="menuitem"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions (Theme toggle + GitHub link) */}
          <div className="hidden xl:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#3d4449] transition"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <a
              href={REPOSITORY_URL}
              className="kube-header-github"
              target="_blank"
              rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Mobile & Tablet Actions (Shown on < xl screens) */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#3d4449] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#3d4449] transition min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`kube-mobile-backdrop ${isMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile & Tablet Slide-Over Drawer */}
      <div
        id="mobile-nav-drawer"
        className={`kube-mobile-drawer ${isMenuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#3d4449] bg-slate-50/80 dark:bg-[#1a1f26]/80 backdrop-blur-md">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 text-left leading-none"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 text-white shadow-md shadow-purple-500/25" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 3.5l10 4.2v7.1c0 6.2-3.9 11-10 13.7-6.1-2.7-10-7.5-10-13.7V7.7L16 3.5z" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="16" cy="11" r="2" fill="currentColor" stroke="none" />
                <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <circle cx="21" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <path d="M16 13v2.5m-1.5 1L12.4 17.5m5.1-1l2.1 1" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-extrabold text-base tracking-tight">
                CloudSec<span className="text-[#8b5cf6]">Corner</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7c6f89] dark:text-[#caa2f5] mt-0.5">
                Cloud &amp; Agentic Security
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#3d4449] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="kube-drawer-body space-y-6">
          {/* Section 1: Overview */}
          <div>
            <div className="kube-drawer-group-title">Overview</div>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`kube-drawer-link ${isActive("/") ? "active" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Home Hub</span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Section 2: Cloud & Kubernetes Architectures (4,000+ Blueprints) */}
          <div>
            <div className="flex items-center justify-between pr-2">
              <span className="kube-drawer-group-title">Architectures (4,000+)</span>
              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Pele + OPA</span>
            </div>
            <div className="space-y-1.5 mt-1">
              {architectureLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`kube-drawer-link ${active ? "active" : ""}`}
                  >
                    <div className="flex flex-col text-left py-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                        {item.description}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: Resources & Community */}
          <div>
            <div className="kube-drawer-group-title">Resources &amp; Labs</div>
            <div className="space-y-1 mt-1">
              {resourceLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`kube-drawer-link ${active ? "active" : ""}`}
                  >
                    <div className="flex flex-col text-left py-0.5">
                      <span className="text-sm font-semibold">{item.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                        {item.description}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-[#3d4449] bg-slate-50 dark:bg-[#1a1f26] space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Appearance
            </span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#2b323c] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:border-purple-500 transition"
            >
              {isDark ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <a
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-[#22272e] text-white hover:bg-[#31373b] transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Nav;
