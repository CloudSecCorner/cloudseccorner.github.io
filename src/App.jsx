import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import LandingPage from "./components/LandingPage";
import ToolsSection from "./components/ToolsSection";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import Labs from "./components/Labs";
import OpenGraph from "./components/OpenGraph";
import JoinCommunityPopup from "./components/JoinCommunityPopup";

function App() {
  return (
    <Router>
      <div className="bg-bgPrimary min-h-screen">
        <Nav />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <OpenGraph 
                  title="Cloud Security Corner | Cloud Security Resources & Best Practices"
                  description="A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance."
                  tags={["Cloud Security", "AWS Security", "Azure Security", "GCP Security", "DevSecOps"]}
                />
                <LandingPage />
              </>
            } />
            <Route path="/tools" element={
              <div className="text-primary max-w-[1280px] mx-auto px-4 py-8">
                <OpenGraph 
                  title="Cloud Security Tools | Cloud Security Corner"
                  description="Explore our curated collection of cloud security tools, frameworks, libraries, and resources for AWS, Azure, GCP, and multi-cloud environments."
                  tags={["Cloud Security Tools", "CSPM", "Cloud Security Posture Management", "DevSecOps Tools"]}
                />
                <h1 className="text-3xl font-bold mb-8 text-center">Cloud Security Tools Collection</h1>
                <ToolsSection />
              </div>
            } />
            <Route path="/labs" element={
              <>
                <OpenGraph 
                  title="Security Labs | Cloud Security Corner"
                  description="Interactive cloud security labs and workshops showcasing cutting-edge security practices and technologies."
                  tags={["Security Labs", "Cloud Security Practice", "Hands-on Security", "Security Workshops"]}
                />
                <Labs />
              </>
            } />
            <Route path="/labs/:labId" element={<Labs />} />
            <Route path="/blog" element={
              <>
                <OpenGraph 
                  title="Cloud Security Blog | Cloud Security Corner"
                  description="Latest insights, tutorials, and news about cloud security, DevSecOps, and compliance best practices."
                  tags={["Cloud Security Blog", "DevSecOps", "Security Best Practices", "Tutorials", "Security News"]}
                />
                <Blog />
              </>
            } />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/about" element={
              <div className="text-primary max-w-[1280px] mx-auto px-4 py-8">
                <OpenGraph 
                  title="About Cloud Security Corner"
                  description="Cloud Security Corner is a community dedicated to advancing cloud security through high-quality resources, best practices, and expert guidance."
                  tags={["About", "Cloud Security Organization", "Security Community", "Mission"]}
                />
                <h1 className="text-3xl font-bold mb-8 text-center">About Cloud Security Corner</h1>
                <p className="text-grayFill text-lg mb-6">
                  Cloud Security Corner is a community dedicated to advancing the field of cloud security through high-quality resources, best practices, and expert guidance.
                </p>
                <p className="text-grayFill text-lg mb-6">
                  Our mission is to democratize access to cloud security knowledge, enabling organizations of all sizes to implement robust security practices in their cloud environments.
                </p>
                <p className="text-grayFill text-lg">
                  Founded in 2023, we collaborate with security practitioners, cloud engineers, and compliance experts to build a more secure cloud ecosystem.
                </p>
              </div>
            } />
          </Routes>
        </div>
        <Footer />
        <JoinCommunityPopup />
      </div>
    </Router>
  );
}

export default App;
