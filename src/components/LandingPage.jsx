import React, { useEffect } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import ModelLeaderboard from "./ModelLeaderboard";
import logoSvg from "../assets/logo.svg";

function LandingPage() {
  // Sample featured tools
  const featuredTools = [
    {
      id: 1,
      title: "AWS Security",
      description: "Resources and tools for securing your AWS cloud infrastructure with best practices and compliance frameworks.",
      category: "Cloud Security",
      stars: 5720
    },
    {
      id: 2,
      title: "Azure Defender",
      description: "Comprehensive security monitoring and threat protection for your Azure cloud environments.",
      category: "Cloud Protection",
      stars: 4350
    },
    {
      id: 3,
      title: "GCP Security Command Center",
      description: "Unified security management system providing visibility into your Google Cloud Platform resources.",
      category: "Security Management",
      stars: 3800
    }
  ];

  // Add structured data for SEO
  useEffect(() => {
    // Create JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Cloud Security Corner",
      "url": "https://cloudseccorner.github.io/",
      "logo": "https://cloudseccorner.github.io/android-icon-192x192.png",
      "description": "Cloud Security Corner is dedicated to creating, curating, and promoting resources that empower organizations to secure their cloud environments effectively.",
      "sameAs": [
        "https://github.com/cloudseccorner"
      ],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://cloudseccorner.github.io/"
      },
      "keywords": "Cloud Security, AWS Security, Azure Security, GCP Security, DevSecOps, Cloud Compliance, Cloud Security Posture Management, CSPM, Cloud Security Tools",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://cloudseccorner.github.io/tools?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Add the structured data to the document head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Clean up the script tag when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Hero Section - Modern design with professional gradient */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950">
        {/* Background gradient - refined for professional look */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900/50 dark:via-blue-950/30 dark:to-slate-950 opacity-90"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat opacity-[0.03] dark:opacity-[0.02]"></div>
        
        {/* Animated accent elements - more subtle and professional */}
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="flex flex-col items-center gap-8 text-center">
            <img 
              src={logoSvg} 
              alt="Cloud Security Corner" 
              className="h-28 md:h-40 w-auto object-contain mx-auto" 
            />
            
            <Badge variant="outline" className="bg-blue-50/80 dark:bg-blue-900/10 backdrop-blur-sm px-5 py-2 rounded-full border-blue-100 dark:border-blue-800/30">
              <span className="text-blue-700 dark:text-blue-400 text-sm font-medium">Securing Your Cloud Journey</span>
            </Badge>
            
            <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight tracking-tight">
              Building a Foundation for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Secure Cloud</span> Infrastructure
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-xl max-w-3xl">
              Cloud Security Corner is dedicated to providing resources, best practices, and tools 
              that help organizations secure their cloud environments across AWS, Azure, GCP, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-6">
              <Button 
                text={"Explore Resources"} 
                link={"/tools"} 
              />
              <Link 
                to="#community"
                className="px-6 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200 flex items-center justify-center group"
              >
                Join Our Community
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
            
            {/* Stats section - refined cards with professional shadow */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 w-full max-w-5xl">
              <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-600 dark:text-blue-400 text-3xl lg:text-4xl font-bold mb-2">500+</div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">Security Resources</div>
                </CardContent>
              </Card>
              <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-cyan-600 dark:text-cyan-400 text-3xl lg:text-4xl font-bold mb-2">30+</div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">Cloud Providers</div>
                </CardContent>
              </Card>
              <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-emerald-600 dark:text-emerald-400 text-3xl lg:text-4xl font-bold mb-2">15K+</div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">Security Professionals</div>
                </CardContent>
              </Card>
              <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-amber-600 dark:text-amber-400 text-3xl lg:text-4xl font-bold mb-2">100+</div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">Security Frameworks</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Decorative element - refined wave with subtle gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950">
          <svg className="absolute bottom-0 w-full h-12 text-slate-50 dark:text-slate-950" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0V74H1440V0C1200,40 960,64 720,64C480,64 240,40 0,0Z" />
          </svg>
        </div>
      </div>

      {/* Mission Section - Modern design with improved layout and shadows */}
      <div className="bg-slate-50 dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-sm uppercase mb-3">Our Mission</span>
              <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold mb-6 leading-tight">Empowering Secure Cloud Adoption</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
              We believe that security should be at the heart of every cloud strategy. Our mission is to democratize 
              access to cloud security best practices while promoting a shared responsibility model across organizations.
            </p>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">
              Through collaboration with security practitioners, cloud engineers, and compliance experts, we're 
              building a more secure cloud ecosystem. We focus on education, tooling, and continuous learning to 
              strengthen cloud security posture for organizations of all sizes.
            </p>
              <Link to="/about" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 flex items-center group transition-colors">
              Learn more about our approach
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 mb-10 md:mb-0">
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-70 blur-xl"></div>
                <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-xl shadow-xl">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center p-6">
                      <svg className="w-32 h-32 sm:w-48 sm:h-48 text-blue-500/80 dark:text-blue-400/80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Tools Section - Modern cards with refined design */}
      <div className="bg-white dark:bg-slate-900 py-24 relative overflow-hidden">
        {/* Cloud-themed decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 opacity-20 dark:opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-300">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-72 h-72 opacity-20 dark:opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-cyan-300">
            <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 -left-20 w-80 h-80 opacity-10 dark:opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute -right-20 top-1/3 w-80 h-80 opacity-10 dark:opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
            <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-sm uppercase mb-3">FEATURED RESOURCES</span>
            <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold mb-4 leading-tight">Discover Cloud Security Tools</h2>
            <p className="text-slate-600 dark:text-slate-300 text-xl max-w-3xl mx-auto">
              Browse through our curated collection of notable cloud security resources that are enhancing security across major cloud platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTools.map(tool => (
              <Card key={tool.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition duration-300 rounded-xl overflow-hidden relative z-10">
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge 
                      variant={tool.category === "Cloud Security" ? "ml" : tool.category === "Cloud Protection" ? "llmFramework" : "data"} 
                      className="font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tool.category}
                    </Badge>
                    <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {tool.stars.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 py-2">
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                    {tool.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-8 pt-6">
                  {/* Add tool-specific cloud security illustrations */}
                  <div className="w-12 h-12 opacity-70">
                    {tool.id === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
                        <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                      </svg>
                    )}
                    {tool.id === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
                        <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                        <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                        <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                      </svg>
                    )}
                    {tool.id === 3 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Add a cloud visual divider */}
          <div className="relative h-24 mt-8 mb-8 overflow-hidden">
            <div className="absolute inset-x-0 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto text-blue-50 dark:text-blue-900/10">
                <path fill="currentColor" fillOpacity="1" d="M0,128L60,149.3C120,171,240,213,360,213.3C480,213,600,171,720,154.7C840,139,960,149,1080,154.7C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-16 relative z-10">
            <Link to="/tools" className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition">
              View All Resources
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Cloud Security Resources Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-24 relative overflow-hidden">
        {/* Cloud-themed background elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        
        {/* Cloud illustrations */}
        <div className="absolute -left-20 top-1/4 opacity-10 dark:opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120" fill="none" className="text-blue-400">
            <path d="M168 48C168 21.49 146.51 0 120 0C93.49 0 72 21.49 72 48C72 48.34 72.03 48.67 72.05 49H72C58.75 49 48 59.75 48 73C48 86.25 58.75 97 72 97H168C184.57 97 198 83.57 198 67C198 50.43 184.57 37 168 37C168 37.34 168 36.67 168 36V48Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute -right-20 top-2/3 opacity-10 dark:opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120" fill="none" className="text-cyan-400">
            <path d="M168 48C168 21.49 146.51 0 120 0C93.49 0 72 21.49 72 48C72 48.34 72.03 48.67 72.05 49H72C58.75 49 48 59.75 48 73C48 86.25 58.75 97 72 97H168C184.57 97 198 83.57 198 67C198 50.43 184.57 37 168 37C168 37.34 168 36.67 168 36V48Z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider text-sm uppercase mb-3">TOP RESOURCES</span>
            <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold mb-4 leading-tight">Cloud Security Essentials</h2>
            <p className="text-slate-600 dark:text-slate-300 text-xl max-w-3xl mx-auto">
              Essential resources for building and maintaining secure cloud infrastructure across leading platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Resource Card 1 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
              <div className="h-3 bg-blue-500 w-full"></div>
            <CardContent className="p-8">
                <div className="rounded-full w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">AWS Well-Architected Framework</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Best practices and strategies for securing AWS infrastructure using the Security Pillar of the Well-Architected Framework.
              </CardDescription>
            </CardContent>
          </Card>
          
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
              <div className="h-3 bg-cyan-500 w-full"></div>
            <CardContent className="p-8">
                <div className="rounded-full w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">Azure Security Benchmarks</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Security controls and recommendations for Azure services based on industry standards and compliance frameworks.
              </CardDescription>
            </CardContent>
          </Card>
          
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
              <div className="h-3 bg-emerald-500 w-full"></div>
            <CardContent className="p-8">
                <div className="rounded-full w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">GCP Security Best Practices</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Comprehensive security guidelines for Google Cloud Platform covering identity, network, data, and monitoring.
              </CardDescription>
            </CardContent>
          </Card>
            
            {/* Resource Card 4 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
              <div className="h-3 bg-amber-500 w-full"></div>
              <CardContent className="p-8">
                <div className="rounded-full w-12 h-12 bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                  </svg>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-2">DevSecOps Framework</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Integration of security practices into DevOps pipelines for continuous security throughout the cloud application lifecycle.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          {/* Cloud security illustration */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-3xl h-32 md:h-48">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-blue-50 dark:text-blue-900/10">
                <path fill="currentColor" fillOpacity="1" d="M0,288L34.3,266.7C68.6,245,137,203,206,197.3C274.3,192,343,224,411,229.3C480,235,549,213,617,186.7C685.7,160,754,128,823,144C891.4,160,960,224,1029,218.7C1097.1,213,1166,139,1234,128C1302.9,117,1371,171,1406,197.3L1440,224L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
              </svg>
              
              {/* Cloud security icons */}
              <div className="absolute top-0 left-1/4 transform -translate-x-1/2 opacity-70 dark:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-400">
                  <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 opacity-70 dark:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute top-0 right-1/4 transform translate-x-1/2 opacity-70 dark:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-cyan-500">
                  <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                  <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                  <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/tools" className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-md font-medium transition-colors">
              Explore All Security Resources
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section - Modern design with improved depth and colors */}
      <div className="bg-slate-50 dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-sm uppercase mb-3">What We Offer</span>
            <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold mb-4 leading-tight">Comprehensive Cloud Security Resources</h2>
            <p className="text-slate-600 dark:text-slate-300 text-xl max-w-3xl mx-auto">
            Our comprehensive approach to cloud security provides organizations with everything they need to build secure, compliant, and resilient cloud environments.
          </p>
        </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
            <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <CardContent className="p-8">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">Security Frameworks</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Access our collection of cloud security frameworks and best practices for AWS, Azure, GCP, and multi-cloud environments, designed to protect your cloud infrastructure.
              </CardDescription>
            </CardContent>
          </Card>
          
            <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <CardContent className="p-8">
                <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">Cloud Security Tools</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Explore our detailed evaluations of cloud security tools to help you select the right solutions for vulnerability scanning, compliance monitoring, and threat detection.
              </CardDescription>
            </CardContent>
          </Card>
          
            <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <CardContent className="p-8">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                  </svg>
              </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-4">Security Community</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                Join our vibrant community of cloud security professionals, DevSecOps engineers, and compliance experts to collaborate, share insights, and stay ahead of evolving threats.
              </CardDescription>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
      
      {/* Call to Action - Professional gradient with enhanced design */}
      <div id="community" className="bg-white dark:bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            {/* Modern professional gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600"></div>
            
            {/* Refined pattern overlay */}
            <div className="absolute inset-0 bg-[url('/patterns/dot-grid.svg')] bg-repeat opacity-10"></div>
            
            {/* Add subtle animated accent */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
            
            {/* Cloud icons overlay */}
            <div className="absolute top-6 left-6 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute bottom-6 right-6 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white">
                <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="relative px-8 py-16 md:p-16 text-center">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">Join the Cloud Security Community</h2>
              <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              Connect with fellow security professionals and cloud engineers. Contribute to our resources, share best practices, and help build a more secure cloud ecosystem.
            </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <a 
                  href="https://github.com/cloudseccorner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Join on GitHub
                </a>
                <Link 
                  to="/about"
                  className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center group"
                >
                  Learn More
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 