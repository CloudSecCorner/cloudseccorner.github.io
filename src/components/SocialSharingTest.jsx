import React, { useState } from 'react';
import OpenGraph from './OpenGraph';
import { getImageUrl, getAbsoluteUrl } from '../utils/socialSharing';

/**
 * A component to test and verify social sharing functionality
 */
const SocialSharingTest = () => {
  const [url, setUrl] = useState('');

  const handleCopyMetaTags = () => {
    const metaTags = `
<!-- Primary Tags -->
<title>Cloud Security Corner | Cloud Security Resources & Best Practices</title>
<meta name="title" content="Cloud Security Corner | Cloud Security Resources & Best Practices">
<meta name="description" content="A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance.">

<!-- Twitter -->
<meta property="twitter:title" content="Cloud Security Corner | Cloud Security Resources & Best Practices">
<meta property="twitter:description" content="A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance.">
<meta property="twitter:image" content="${getImageUrl('og-image.png')}">
<meta property="twitter:url" content="${getAbsoluteUrl()}">
<meta property="twitter:card" content="summary_large_image">

<!-- Facebook / Open Graph -->
<meta property="og:title" content="Cloud Security Corner | Cloud Security Resources & Best Practices">
<meta property="og:description" content="A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance.">
<meta property="og:url" content="${getAbsoluteUrl()}">
<meta property="og:image" content="${getImageUrl('og-image.png')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cloud Security Corner">
`;
    
    navigator.clipboard.writeText(metaTags);
    alert('Meta tags copied to clipboard!');
  };

  const handleCheckOgTags = () => {
    if (!url) {
      alert('Please enter a URL to check');
      return;
    }
    
    window.open(`https://www.opengraph.xyz/url/${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 bg-slate-800 rounded-xl shadow-lg text-white">
      <OpenGraph 
        title="Social Sharing Test | Cloud Security Corner"
        description="A test page for verifying social sharing functionality and Open Graph meta tags."
        tags={["Social Sharing", "Open Graph", "Meta Tags"]}
      />
      
      <h1 className="text-2xl font-bold mb-4">Social Sharing Test</h1>
      <p className="mb-6">
        This page helps you verify that social media previews work correctly when sharing links from Cloud Security Corner.
      </p>
      
      <div className="border border-slate-700 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Preview</h2>
        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <div className="bg-slate-800 rounded-lg overflow-hidden mb-4">
            <img 
              src={getImageUrl('og-image.png')} 
              alt="Open Graph Preview" 
              className="w-full h-auto"
            />
          </div>
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-xl text-white">Cloud Security Corner | Cloud Security Resources & Best Practices</p>
            <p className="text-slate-400 text-sm mt-1">A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance.</p>
            <p className="text-slate-500 text-xs mt-2">{getAbsoluteUrl()}</p>
          </div>
        </div>
      </div>
      
      <div className="border border-slate-700 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Copy Meta Tags</h2>
        <p className="text-sm text-slate-300 mb-4">
          For developers: Copy the Open Graph meta tags to use in your HTML.
        </p>
        <button 
          onClick={handleCopyMetaTags}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Copy Meta Tags
        </button>
      </div>
      
      <div className="border border-slate-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Check Your URL</h2>
        <p className="text-sm text-slate-300 mb-4">
          Use this tool to check how your URL will appear when shared on social media.
        </p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL to check"
            className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleCheckOgTags}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors whitespace-nowrap"
          >
            Check Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialSharingTest; 