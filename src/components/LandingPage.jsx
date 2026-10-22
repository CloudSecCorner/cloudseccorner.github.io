import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { REPOSITORY_URL, getAbsoluteUrl } from "../utils/socialSharing";

const focusAreas = [
  {
    title: "Agent identity & access",
    description: "Design short-lived identity, least-privilege permissions, delegated authorization, and approval boundaries for autonomous workloads.",
    color: "blue",
    icon: "identity"
  },
  {
    title: "Tool & workload isolation",
    description: "Contain agent tools, code execution, data access, and cloud actions with sandboxing, policy enforcement, and secure defaults.",
    color: "cyan",
    icon: "isolation"
  },
  {
    title: "Runtime defense",
    description: "Observe prompts, plans, tool calls, and infrastructure changes so risky behavior can be detected and stopped in context.",
    color: "violet",
    icon: "runtime"
  },
  {
    title: "Governance & assurance",
    description: "Turn threat models, evaluations, audit trails, and human oversight into evidence that agentic systems are operating safely.",
    color: "emerald",
    icon: "governance"
  }
];

const lifecycle = [
  { step: "01", title: "Model the agent", text: "Map goals, identities, tools, data, trust boundaries, and possible failure modes." },
  { step: "02", title: "Constrain access", text: "Give every agent the smallest useful permissions and require approval for high-impact actions." },
  { step: "03", title: "Observe behavior", text: "Capture decisions and tool calls with enough context to investigate and respond." },
  { step: "04", title: "Test continuously", text: "Evaluate prompt attacks, privilege escalation, data leakage, and unsafe cloud changes." }
];

const resources = [
  {
    eyebrow: "Curated stack",
    title: "Agentic security tools",
    description: "Explore open-source projects and platforms for AI agents, cloud controls, detection, testing, and governance.",
    link: "/tools",
    action: "Browse tools"
  },
  {
    eyebrow: "Practice",
    title: "Hands-on security labs",
    description: "Build practical skills in threat modeling, zero trust, security engineering, and cloud defense.",
    link: "/labs",
    action: "Start a lab"
  },
  {
    eyebrow: "Research",
    title: "Field notes & analysis",
    description: "Read focused guidance on protecting AI applications and the cloud systems that give agents real-world access.",
    link: "/blog",
    action: "Read the blog"
  }
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
};

function FocusIcon({ type }) {
  const paths = {
    identity: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.1a7.5 7.5 0 0115 0A17.9 17.9 0 0112 21.75a17.9 17.9 0 01-7.5-1.65z" />,
    isolation: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v9m8-4.5l-8 4.5m-8-4.5l8 4.5m0 9v-9" />,
    runtime: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 12h4l2.1-5 4.2 10 2.1-5H21M5 4.5h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2v-11a2 2 0 012-2z" />,
    governance: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M12 3l7 3v5c0 4.6-2.8 8.1-7 10-4.2-1.9-7-5.4-7-10V6l7-3zm-3 9l2 2 4-4" />
  };

  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

function LandingPage() {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Cloud Security Corner",
      url: getAbsoluteUrl(),
      logo: getAbsoluteUrl("/android-icon-192x192.png"),
      description: "Practical resources for securing AI agents, autonomous cloud workloads, and the infrastructure they can access.",
      sameAs: ["https://github.com/CloudSecCorner"],
      knowsAbout: ["Agentic AI Security", "Cloud Security", "AI Agent Identity", "Runtime Security", "AI Governance", "Threat Modeling"]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-950" />
        <div className="absolute inset-0 -z-10 bg-[url('/patterns/grid.svg')] opacity-[0.035] dark:opacity-[0.06]" />
        <div className="absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl dark:bg-blue-500/10" />

        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="min-w-0">
            <Badge variant="outline" className="mb-6 border-blue-200 bg-white/70 px-4 py-2 text-blue-700 backdrop-blur dark:border-blue-800 dark:bg-slate-900/70 dark:text-blue-300">
              Open community for agentic cloud security
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl lg:leading-[1.05]">
              Secure the agents that can
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
                act on your cloud
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Practical guidance, tools, and labs for protecting AI agents, their identities, their toolchains, and the cloud infrastructure they can change.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to="/tools" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950">
                Explore the security stack <span className="ml-2" aria-hidden="true">→</span>
              </Link>
              <Link to="/labs" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/70 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900">
                Practice in the labs
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              {["Agent identity", "Tool security", "Runtime defense", "AI governance"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-xl" aria-label="Agentic cloud security architecture">
            <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-black/30 sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Control plane</p>
                  <p className="mt-1 font-semibold">Agent execution boundary</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Guarded
                </span>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M9 4h6m-3-2v2m-7 6h14v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8zm3 4h.01M16 14h.01M9 17h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Cloud operations agent</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Plans, reasons, and requests actions</p>
                  </div>
                </div>
              </div>
              <div className="my-3 flex justify-center text-blue-500" aria-hidden="true">↓</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Policy gate", "Tool sandbox", "Audit stream"].map((item, index) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/70">
                    <div className={`mx-auto mb-2 h-2 w-2 rounded-full ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-cyan-500" : "bg-violet-500"}`} />
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <div className="my-3 flex justify-center text-blue-500" aria-hidden="true">↓</div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
                {["Cloud APIs", "Sensitive data", "Workloads"].map((item) => (
                  <div key={item} className="rounded-lg border border-dashed border-slate-300 px-2 py-3 dark:border-slate-600">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Security focus</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Protect every layer of agentic execution</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Agentic systems connect models to credentials, data, APIs, and infrastructure. We focus on the controls that keep that autonomy useful, observable, and bounded.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {focusAreas.map((area) => (
              <Card key={area.title} className="border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex gap-5 p-7">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClasses[area.color]}`}>
                    <FocusIcon type={area.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{area.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{area.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Practical lifecycle</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From prototype to production guardrails</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Security starts before an agent gets credentials and continues through every action it takes in production.</p>
            </div>
            <ol className="space-y-5">
              {lifecycle.map((item) => (
                <li key={item.step} className="grid grid-cols-[auto_1fr] gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                  <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1.5 leading-7 text-slate-600 dark:text-slate-400">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">Learn, build, contribute</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Resources for security teams building with agents</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {resources.map((resource) => (
              <Link key={resource.title} to={resource.link} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">{resource.eyebrow}</p>
                <h3 className="mt-3 text-xl font-semibold">{resource.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{resource.description}</p>
                <span className="mt-7 inline-flex items-center font-semibold text-blue-600 dark:text-blue-400">
                  {resource.action}<span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-14 text-center text-white shadow-2xl shadow-blue-900/20 sm:px-12 sm:py-16">
          <div className="absolute inset-0 bg-[url('/patterns/dot-grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Help define secure agentic cloud systems</h2>
            <p className="mt-5 text-lg leading-8 text-blue-50">Share a tool, improve a lab, publish a field note, or help turn emerging attack patterns into practical guidance for the community.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50">Contribute on GitHub</a>
              <Link to="/about" className="inline-flex items-center justify-center rounded-lg border border-white/60 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">About the community</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
