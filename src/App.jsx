import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import OpenGraph from "./components/OpenGraph";
import JoinCommunityPopup from "./components/JoinCommunityPopup";

const LandingPage = lazy(() => import("./components/LandingPage"));
const ToolsSection = lazy(() => import("./components/ToolsSection"));
const Blog = lazy(() => import("./components/Blog"));
const Labs = lazy(() => import("./components/Labs"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center text-primary">
      <OpenGraph
        title="Page not found | Cloud Security Corner"
        description="The requested Cloud Security Corner page could not be found."
      />
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-500">404</p>
      <h1 className="mb-4 text-4xl font-bold">Page not found</h1>
      <p className="mb-8 text-grayFill">The page may have moved or the address may be incorrect.</p>
      <Link className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700" to="/">
        Return home
      </Link>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-bgPrimary min-h-screen">
        <Nav />
        <div className="pt-16">
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
            <Route path="/tools" element={
              <div className="text-primary max-w-[1280px] mx-auto px-4 py-8">
                <OpenGraph 
                  title="Agentic AI & Cloud Security Tools | Cloud Security Corner"
                  description="Explore tools for AI agent security, cloud defense, identity, policy enforcement, runtime monitoring, testing, and governance."
                  tags={["AI Agent Security Tools", "Cloud Security Tools", "Agent Runtime Security", "AI Governance"]}
                />
                <h1 className="text-3xl font-bold mb-3 text-center">Agentic AI & Cloud Security Tools</h1>
                <p className="mx-auto mb-8 max-w-3xl text-center text-grayFill">Curated tools for protecting AI agents, cloud workloads, identities, data, and the systems that connect them.</p>
                <ToolsSection />
              </div>
            } />
            <Route path="/labs" element={
              <>
                <OpenGraph 
                  title="Security Labs | Cloud Security Corner"
                  description="Hands-on labs for agentic AI security, threat modeling, zero trust, cloud defense, and security engineering."
                  tags={["Agentic Security Labs", "Cloud Security Practice", "Threat Modeling", "Zero Trust"]}
                />
                <Labs />
              </>
            } />
            <Route path="/labs/:labId" element={<Labs />} />
            <Route path="/blog" element={
              <>
                <OpenGraph 
                  title="Agentic Cloud Security Blog | Cloud Security Corner"
                  description="Research and practical guidance for securing AI agents, autonomous workloads, and cloud infrastructure."
                  tags={["Agentic AI Security", "Cloud Security Blog", "AI Governance", "Security Research"]}
                />
                <Blog />
              </>
            } />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/about" element={
              <div className="text-primary max-w-[1280px] mx-auto px-4 py-8">
                <OpenGraph 
                  title="About Cloud Security Corner"
                  description="Cloud Security Corner is an open community focused on securing AI agents and the cloud systems they can access."
                  tags={["About", "Agentic AI Security", "Cloud Security Community", "Mission"]}
                />
                <h1 className="text-3xl font-bold mb-8 text-center">About Cloud Security Corner</h1>
                <div className="mx-auto max-w-3xl space-y-6 text-grayFill text-lg leading-8">
                  <p>Cloud Security Corner is an open community focused on a fast-growing security problem: AI agents can now use credentials, call tools, access sensitive data, and change cloud infrastructure.</p>
                  <p>Our mission is to make agentic cloud security practical. We create and curate guidance for identity, authorization, tool isolation, runtime defense, threat modeling, evaluations, governance, and incident response.</p>
                  <p>We bring together security practitioners, cloud engineers, AI builders, and governance teams to develop controls that keep autonomous systems useful, observable, and bounded.</p>
                </div>
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
