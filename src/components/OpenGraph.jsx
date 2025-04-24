import React from 'react';
import { Helmet } from 'react-helmet';
import { getAbsoluteUrl, getImageUrl, formatTags, getDefaultMetadata } from '../utils/socialSharing';

/**
 * Dynamic OpenGraph component that sets metadata for social sharing
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - URL to the OpenGraph image
 * @param {string} props.type - Content type (website, article, etc.)
 * @param {string} props.url - Canonical URL for the page
 * @param {string} props.siteName - Site name
 * @param {string[]} props.tags - Array of relevant keywords/tags
 */
const OpenGraph = (props) => {
  // Use default metadata and override with provided props
  const defaults = getDefaultMetadata();
  const {
    title = defaults.title,
    description = defaults.description,
    image = defaults.image,
    type = defaults.type,
    url,
    siteName = defaults.siteName,
    tags = defaults.tags
  } = props;
  
  // Format tags as a comma-separated string
  const keywordsString = formatTags(tags);
  
  // Ensure URL is absolute
  const currentUrl = url ? getAbsoluteUrl(url) : (typeof window !== 'undefined' ? window.location.href : getAbsoluteUrl());
  
  // Make sure image URL is absolute
  const absoluteImageUrl = getImageUrl(image);
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {siteName && <meta property="og:site_name" content={siteName} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteImageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default OpenGraph; 