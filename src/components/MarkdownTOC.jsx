import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * Generates a table of contents from markdown content
 * 
 * @param {Object} props
 * @param {string} props.content - The markdown content to parse
 * @param {string} props.containerSelector - The selector for scrollable container
 */
const MarkdownTOC = ({ content, containerSelector = 'window' }) => {
  const [toc, setToc] = useState([]);
  
  useEffect(() => {
    if (!content) return;
    
    // Parse markdown for headings
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      
      // Skip level 1 headings (usually the title)
      if (level === 1) continue;
      
      // Generate a slug for the heading - only include alphanumeric characters and hyphens
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({
        level,
        title,
        slug
      });
    }
    
    setToc(headings);
  }, [content]);
  
  if (toc.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-slate-800 border border-slate-700 shadow-xl">
      <CardHeader className="bg-slate-900/50 border-b border-slate-700 py-3 px-4">
        <CardTitle className="text-base flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
          </svg>
          Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <nav className="toc-nav">
          <ul className="space-y-1 text-sm">
            {toc.map((heading, index) => (
              <li 
                key={index} 
                className={`${heading.level === 2 ? 'pl-0' : 'pl-4'} py-1`}
              >
                <Link
                  to={heading.slug}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  containerId={containerSelector !== 'window' ? containerSelector : undefined}
                  className="hover:text-indigo-400 cursor-pointer block text-left transition-colors flex items-center"
                >
                  <span 
                    className={`inline-block w-1.5 h-1.5 mr-2 rounded-full ${
                      heading.level === 2 ? 'bg-indigo-500' : 'bg-slate-500'
                    }`}
                  />
                  {heading.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
};

export default MarkdownTOC; 