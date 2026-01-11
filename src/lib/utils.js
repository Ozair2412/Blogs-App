import imageCompression from 'browser-image-compression';

/**
 * Compress image to approximately 200-300KB
 * @param {File} imageFile - The image file to compress
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(imageFile) {
  const options = {
    maxSizeMB: 0.25, // 250KB max
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`Original: ${(imageFile.size / 1024).toFixed(2)}KB`);
    console.log(`Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
}

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate WhatsApp link with pre-filled message
 * @param {string} phoneNumber - WhatsApp number
 * @param {string} pageTitle - Current page title
 * @param {string} pageUrl - Current page URL
 * @returns {string} - WhatsApp link
 */
export function generateWhatsAppLink(phoneNumber, pageTitle, pageUrl) {
  const message = encodeURIComponent(
    `Hi! I have feedback about: ${pageTitle}\n\nPage: ${pageUrl}`
  );
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
