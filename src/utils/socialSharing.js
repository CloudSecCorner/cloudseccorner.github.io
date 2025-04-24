/**
 * Utility functions for handling social sharing and OpenGraph metadata
 */

/**
 * Get the absolute URL for the current page or a specific path
 * @param {string} path - Optional path to append to the base URL
 * @returns {string} Absolute URL
 */
export const getAbsoluteUrl = (path = '') => {
  const baseUrl = 'https://cloudseccorner.github.io';
  const relativePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${relativePath}`;
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
    title: 'Cloud Security Corner | Cloud Security Resources & Best Practices',
    description: 'A comprehensive resource for cloud security tools, frameworks, best practices, and methodologies. Explore the latest in AWS, Azure, GCP security, DevSecOps, and compliance.',
    image: getImageUrl('og-image.png'),
    siteName: 'Cloud Security Corner',
    type: 'website',
    tags: ['Cloud Security', 'AWS Security', 'Azure Security', 'GCP Security', 'DevSecOps']
  };
}; 