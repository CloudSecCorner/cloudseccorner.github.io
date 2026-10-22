/**
 * Utility functions for handling social sharing and OpenGraph metadata
 */

export const SITE_URL = 'https://cloudsecuritycorner.com';
export const REPOSITORY_URL = 'https://github.com/CloudSecCorner/cloudseccorner.github.io';

/**
 * Get the absolute URL for the current page or a specific path
 * @param {string} path - Optional path to append to the base URL
 * @returns {string} Absolute URL
 */
export const getAbsoluteUrl = (path = '') => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const relativePath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${relativePath}`;
};

/**
 * Get the absolute URL for an image
 * @param {string} imagePath - Path to the image
 * @returns {string} Absolute image URL
 */
export const getImageUrl = (imagePath) => {
  // If image already has an absolute URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, construct the full URL
  return getAbsoluteUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`);
};

/**
 * Format tags for meta keywords
 * @param {string[]} tags - Array of tags
 * @returns {string} Comma-separated string of tags
 */
export const formatTags = (tags = []) => {
  return tags.join(', ');
};

/**
 * Get default OpenGraph metadata
 * @returns {Object} Default metadata object
 */
export const getDefaultMetadata = () => {
  return {
    title: 'Cloud Security Corner | Agentic AI & Cloud Security',
    description: 'Practical tools, labs, and guidance for securing AI agents, autonomous cloud workloads, identities, toolchains, and runtime behavior.',
    image: getImageUrl('og-image.png'),
    siteName: 'Cloud Security Corner',
    type: 'website',
    tags: ['Agentic AI Security', 'AI Agent Security', 'Cloud Security', 'Runtime Security', 'AI Governance']
  };
};
