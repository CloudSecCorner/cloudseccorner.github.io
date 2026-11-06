import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import OpenGraph from "./components/OpenGraph";
import JoinCommunityPopup from "./components/JoinCommunityPopup";

const LandingPage = lazy(() => import("./components/LandingPage"));
const AwsArchitectures = lazy(() => import("./components/AwsArchitectures"));
const AzureArchitectures = lazy(() => import("./components/AzureArchitectures"));
const GcpArchitectures = lazy(() => import("./components/GcpArchitectures"));
const KspmArchitectures = lazy(() => import("./components/KspmArchitectures"));
const ToolsSection = lazy(() => import("./components/ToolsSection"));
const Blog = lazy(() => import("./components/Blog"));
const Labs = lazy(() => import("./components/Labs"));
const AboutPage = lazy(() => import("./components/AboutPage"));

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
    <main className="dev-page dev-not-found mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
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
      <div className="developer-shell min-h-screen flex flex-col transition-colors duration-200">
        <Nav />
        <div className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={
                <>
                  <OpenGraph 
                    title="Cloud Security Corner | Developer Architectures & Security Labs"
                    description="Application integration patterns for AWS, Azure, Google Cloud and Kubernetes, with configuration examples, hands-on security labs and a searchable tool directory."
                    tags={["Developer Architecture", "Cloud Security", "AWS", "Azure", "Google Cloud", "Kubernetes", "Security Engineering"]}
                  />
                  <LandingPage />
                </>
              } />
              <Route path="/aws-architectures" element={<AwsArchitectures />} />
              <Route path="/azure-architectures" element={<AzureArchitectures />} />
              <Route path="/gcp-architectures" element={<GcpArchitectures />} />
              <Route path="/kspm-architectures" element={<KspmArchitectures />} />
              <Route path="/tools" element={<ToolsSection />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs/:labId" element={<Labs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<Blog />} />
              <Route path="/about" element={<AboutPage />} />
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
