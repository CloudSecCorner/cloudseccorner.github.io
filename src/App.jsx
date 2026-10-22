import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import OpenGraph from "./components/OpenGraph";
import JoinCommunityPopup from "./components/JoinCommunityPopup";
import { REPOSITORY_URL } from "./utils/socialSharing";

const LandingPage = lazy(() => import("./components/LandingPage"));
const ToolsSection = lazy(() => import("./components/ToolsSection"));
const Blog = lazy(() => import("./components/Blog"));
const Labs = lazy(() => import("./components/Labs"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <OpenGraph
        title="Page not found | Cloud Security Corner"
        description="The requested Cloud Security Corner page could not be found."
      />
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">404</p>
      <h1 className="mb-4 text-4xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">The page may have moved or the address may be incorrect.</p>
      <Link className="kube-button" to="/">
        Return home
      </Link>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-[#18131f] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
        <Nav />
        <div className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={
                <>
                  <OpenGraph 
                    title="Cloud Security Corner | Agentic AI & Cloud Security"
                    description="Practical tools, labs, and guidance for securing AI agents, autonomous cloud workloads, identities, toolchains, and runtime behavior."
                    tags={["Agentic AI Security", "AI Agent Security", "Cloud Security", "Runtime Security", "AI Governance"]}
                  />
                  <LandingPage />
                </>
              } />
              <Route path="/tools" element={<ToolsSection />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs/:labId" element={<Labs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<Blog />} />
              <Route path="/about" element={
                <div className="w-full">
                  <OpenGraph 
                    title="About Cloud Security Corner"
                    description="Cloud Security Corner is an open community focused on securing AI agents and the cloud systems they can access."
                    tags={["About", "Agentic AI Security", "Cloud Security Community", "Mission"]}
                  />
                  <section className="container kube-reading mx-auto px-5 py-16">
                    <p className="kube-label">About CloudSecCorner</p>
                    <h1>Making agentic cloud security practical and bounded</h1>
                    <p className="kube-dek">
                      CloudSecCorner is an open community focused on a fast-growing challenge: AI agents can now use credentials, invoke tools, inspect sensitive data, and modify cloud infrastructure.
                    </p>
                    <p>
                      Our mission is to make agentic cloud security practical. We create and curate guidance for identity, authorization, tool isolation, runtime defense, threat modeling, evaluations, governance, and incident response.
                    </p>
                    <p>
                      We bring together security practitioners, cloud engineers, AI builders, and governance teams to develop controls that keep autonomous systems useful, observable, and bounded.
                    </p>
                    <div className="mt-12 grid gap-6 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 p-6 text-center shadow-sm">
                        <strong className="block text-3xl font-extrabold text-purple-600 dark:text-brand-purple-100">37,000+</strong>
                        <span className="text-xs font-bold text-slate-500 dark:text-brand-gray-400 uppercase tracking-wider mt-1 block">Curated Security Tools</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 p-6 text-center shadow-sm">
                        <strong className="block text-3xl font-extrabold text-purple-600 dark:text-brand-purple-100">6</strong>
                        <span className="text-xs font-bold text-slate-500 dark:text-brand-gray-400 uppercase tracking-wider mt-1 block">Hands-on Defense Labs</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 p-6 text-center shadow-sm">
                        <strong className="block text-3xl font-extrabold text-purple-600 dark:text-brand-purple-100">100%</strong>
                        <span className="text-xs font-bold text-slate-500 dark:text-brand-gray-400 uppercase tracking-wider mt-1 block">Open Source &amp; Free</span>
                      </div>
                    </div>
                  </section>
                </div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
        <JoinCommunityPopup />
      </div>
    </Router>
  );
}

export default App;
