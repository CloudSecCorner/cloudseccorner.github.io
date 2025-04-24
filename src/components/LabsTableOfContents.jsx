import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// Fallback data in case the fetch fails
const fallbackLabsData = [
  {
    id: "NMAP-Practical-Labs",
    title: "NMAP Practical Labs",
    description: "NMAP is a network scanner that can be used to scan networks and identify open ports, services, and other information.",
    category: "Network Security",
    path: "/labs/NMAP-Practical-Labs.md",
    contributors: ["Sangam Biradar"],
    tags: ["Network Security"],
  },
  {
    id: "Security Engineering Fundamentals",
    title: "Security Engineering Fundamentals",
    description: " Understanding the core principles of security engineering and how to apply them to real-world scenarios.",
    category: "Security Engineering",
    path: "/labs/Security-Engineering-Fundamentals.md",
    contributors: ["Sangam Biradar"],
    tags: ["Security Engineering"]
  },
];

const LabsTableOfContents = () => {
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Fetch labs data from the JSON file
    const fetchLabsData = async () => {
      try {
        setLoading(true);
        
        // Try multiple potential locations for the data
        const potentialUrls = [
          '/data/labs.json',
          '/labs/index.json', // Original location
          `${window.location.origin}/data/labs.json`,
          `${window.location.origin}/labs/index.json`
        ];
        
        let fetchSuccess = false;
        
        // Try each URL in sequence
        for (const url of potentialUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              const labs = data.labs || [];
              setLabsData(labs);
              
              // Initialize all categories as expanded
              const categories = {};
              labs.forEach(lab => {
                if (lab.category) {
                  categories[lab.category] = true;
                }
              });
              setExpandedCategories(categories);
              
              fetchSuccess = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, err);
            // Continue to next URL
          }
        }
        
        // If all fetches fail, use the fallback data
        if (!fetchSuccess) {
          console.warn("All fetch attempts failed, using fallback data for TOC");
          setLabsData(fallbackLabsData);
          
          // Initialize all fallback categories as expanded
          const categories = {};
          fallbackLabsData.forEach(lab => {
            if (lab.category) {
              categories[lab.category] = true;
            }
          });
          setExpandedCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching labs data for TOC:", error);
        setLabsData(fallbackLabsData);
        
        // Initialize all fallback categories as expanded
        const categories = {};
        fallbackLabsData.forEach(lab => {
          if (lab.category) {
            categories[lab.category] = true;
          }
        });
        setExpandedCategories(categories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLabsData();
  }, []);

  // Group labs by category
  const labsByCategory = labsData.reduce((acc, lab) => {
    const category = lab.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lab);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Helper function to get badge color based on category
  const getCategoryColor = (category) => {
    const categoryColors = {
      "Application Security": "bg-red-500/20 text-red-500",
      "Web Security": "bg-amber-500/20 text-amber-500", 
      "Network Security": "bg-blue-500/20 text-blue-500",
      "Cloud Security": "bg-cyan-500/20 text-cyan-500",
      "Container Security": "bg-emerald-500/20 text-emerald-500",
      "Penetration Testing": "bg-violet-500/20 text-violet-500",
      "Vulnerability Scanner": "bg-fuchsia-500/20 text-fuchsia-500",
      "Intrusion Detection": "bg-yellow-500/20 text-yellow-500",
      "System Auditing": "bg-indigo-500/20 text-indigo-500",
      "Threat Intelligence": "bg-rose-500/20 text-rose-500",
      "Security Distribution": "bg-teal-500/20 text-teal-500",
      "Wireless Security": "bg-green-500/20 text-green-500",
      "Password Cracking": "bg-pink-500/20 text-pink-500",
      "Reconnaissance": "bg-sky-500/20 text-sky-500",
      "Agentic Security": "bg-orange-500/20 text-orange-500",
      "AI Security": "bg-purple-500/20 text-purple-500",
      "Security Engineering": "bg-indigo-500/20 text-indigo-500"
    };
    
    return categoryColors[category] || "bg-gray-500/20 text-gray-500";
  };

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-6 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-slate-800 border border-slate-700 shadow-xl">
      <CardHeader className="bg-slate-900/50 border-b border-slate-700">
        <CardTitle className="text-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Labs Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {Object.keys(labsByCategory).length === 0 ? (
          <div className="text-center text-slate-400 py-4">No labs available</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(labsByCategory).map(([category, labs]) => (
              <div key={category} className="border border-slate-700 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-2 flex items-center justify-between bg-slate-900/70 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                    <span className="text-sm font-medium">{labs.length} Labs</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${expandedCategories[category] ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedCategories[category] && (
                  <div className="bg-slate-800/50 p-2">
                    <ul className="space-y-1">
                      {labs.map(lab => (
                        <li key={lab.id} className="text-sm">
                          <Link 
                            to={`/labs/${lab.id}`}
                            className="block px-3 py-2 rounded hover:bg-slate-700 transition-colors flex justify-between items-center"
                          >
                            <span className="line-clamp-1">{lab.title}</span>
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LabsTableOfContents; 