import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { REPOSITORY_URL } from "../utils/socialSharing";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
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

  // Close mobile dropdown on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on Escape key press
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

  // Close dropdown on click outside header
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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

  const navLinks = [
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
      sublabel: "1,000+ threat models & IAM controls",
      badge: "1,000+",
      badgeClass: "bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30",
      iconBg: "bg-amber-500/15 text-amber-500 dark:text-amber-300",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      )
    },
    {
      path: "/azure-architectures",
      label: "Azure Architectures",
      sublabel: "1,000+ cloud security blueprints",
      badge: "1,000+",
      badgeClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30",
      iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      path: "/gcp-architectures",
      label: "GCP Architectures",
      sublabel: "1,000+ Google Cloud patterns",
      badge: "1,000+",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    {
      path: "/kspm-architectures",
      label: "KSPM Kubernetes",
      sublabel: "1,000+ pod & posture rules",
      badge: "1,000+",
      badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
      )
    }
  ];

  const exploreLinks = [
    {
      path: "/",
      label: "Home",
      sublabel: "Hub & overview",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      path: "/tools",
      label: "Tools",
      sublabel: "37,000+ security & agentic tools",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      path: "/labs",
      label: "Labs",
      sublabel: "Hands-on guided curricula",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.17 20.3a2 2 0 0 0 1.7 3.7h12.26a2 2 0 0 0 1.7-3.7L14 9.31V2" />
          <path d="M8.5 2h7" />
        </svg>
      )
    },
    {
      path: "/blog",
      label: "Blog",
      sublabel: "Field notes & deep dives",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      path: "/about",
      label: "About",
      sublabel: "Mission & contributors",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Dropdown Backdrop */}
      {isMenuOpen && (
        <div
          className="kube-dropdown-backdrop is-open"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Top Pick-up / Announcement Bar */}
      {!bannerDismissed && (
        <div id="pick-up" role="region" aria-label="Announcement">
          <span>⚡ Want to pick up where you left off? Practice Agentic Cloud Defense</span>
          <Link to="/labs/Agentic-Cloud-Security" onClick={dismissBanner}>
            Take me there
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <button
            onClick={dismissBanner}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/80 hover:text-white transition rounded-md hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Main Header */}
      <header ref={headerRef} className="kube-site-header">
        <nav className="kube-header-inner" aria-label="Main navigation">
          {/* Brand */}
          <Link to="/" className="kube-brand" aria-label="Cloud Security Corner Home">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 text-white shadow-md shadow-purple-500/25" aria-hidden="true">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 3.5l10 4.2v7.1c0 6.2-3.9 11-10 13.7-6.1-2.7-10-7.5-10-13.7V7.7L16 3.5z" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="16" cy="11" r="2" fill="currentColor" stroke="none" />
                <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <circle cx="21" cy="18" r="1.7" fill="currentColor" stroke="none" />
                <path d="M16 13v2.5m-1.5 1L12.4 17.5m5.1-1l2.1 1" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div className="flex flex-col text-left leading-none min-w-0">
              <span className="text-slate-900 dark:text-white font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap">
                CloudSec<span className="text-[#8b5cf6]">Corner</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#7c6f89] dark:text-[#caa2f5] mt-0.5 sm:mt-1 whitespace-nowrap">
                Cloud &amp; Agentic Security
              </span>
            </div>
          </Link>

          {/* Desktop Center Pill Menu (Shown on desktop >= 1200px) */}
          <div className="kube-desktop-nav kube-nav-menu" role="menubar">
            {navLinks.map((item) => {
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
          <div className="kube-desktop-nav items-center gap-3">
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

          {/* Mobile & Tablet Actions (Shown on < 1200px) */}
          <div className="kube-mobile-actions">
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
              aria-controls="mobile-dropdown-menu"
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

        {/* Mobile Dropdown directly attached below navbar */}
        {isMenuOpen && (
          <div
            id="mobile-dropdown-menu"
            className="kube-mobile-dropdown is-open border-t border-slate-200 dark:border-[#3d4449] bg-white/98 dark:bg-[#1a1f26]/98 backdrop-blur-xl px-3.5 sm:px-6 py-4 shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto"
            role="menu"
            aria-label="Navigation menu"
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="sm:grid sm:grid-cols-2 sm:gap-6 space-y-4 sm:space-y-0">
                {/* Architecture Blueprints Column */}
                <div>
                  <div className="flex items-center justify-between px-3 py-1 mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Architecture Catalog
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      4,000+
                    </span>
                  </div>
                  <div className="space-y-1">
                    {architectureLinks.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition min-h-[44px] ${
                            active
                              ? "bg-purple-100 text-purple-800 dark:bg-[#44354f] dark:text-[#c4b5fd] font-bold shadow-sm"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2c333a]"
                          }`}
                          role="menuitem"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}>
                              {item.icon}
                            </span>
                            <div className="flex flex-col text-left leading-tight min-w-0">
                              <span className="font-semibold truncate">{item.label}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.sublabel}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-2 ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Explore & Resources Column */}
                <div>
                  <div className="px-3 py-1 mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Explore & Resources
                    </span>
                  </div>
                  <div className="space-y-1">
                    {exploreLinks.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition min-h-[44px] ${
                            active
                              ? "bg-purple-100 text-purple-800 dark:bg-[#44354f] dark:text-[#c4b5fd] font-bold shadow-sm"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2c333a]"
                          }`}
                          role="menuitem"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#2c333a] text-slate-600 dark:text-slate-300">
                              {item.icon}
                            </span>
                            <div className="flex flex-col text-left leading-tight min-w-0">
                              <span className="font-semibold truncate">{item.label}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.sublabel}</span>
                            </div>
                          </div>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">→</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom GitHub Link */}
              <div className="pt-3 border-t border-slate-200 dark:border-[#31373b]">
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2c333a] transition min-h-[44px]"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </span>
                    <span>Join us on GitHub</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">cloudseccorner ↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Nav;
