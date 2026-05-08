// ==================== SLUG GENERATION ====================
/**
 * Convert project name to URL-friendly slug
 * Examples:
 *   "Sree Mallikarjuna Nagar" -> "sree-mallikarjuna-nagar"
 *   "Sree Lakshmi Nagar-IV" -> "sree-lakshmi-nagar-iv"
 */
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()                    // Convert to lowercase
    .trim()                          // Remove whitespace from ends
    .replace(/[^\w\s-]/g, '')        // Remove special characters except hyphens
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-');            // Replace multiple hyphens with single hyphen
};

// ==================== FORMAT CURRENCY ====================
/**
 * Format number as currency
 * Examples:
 *   formatCurrency(1000000) -> "10,00,000" (Indian format)
 */
const formatCurrency = (amount) => {
  if (!amount) return '0';
  
  return amount
    .toString()
    .replace(/\B(?=(\d{2})+(?!\d))/g, ','); // Indian numbering system
};

// ==================== FORMAT DATE ====================
/**
 * Format date to readable format
 * Examples:
 *   formatDate(new Date()) -> "05 May 2026"
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('en-IN', options);
};

// ==================== TRUNCATE TEXT ====================
/**
 * Truncate text to a certain length and add ellipsis
 * Examples:
 *   truncateText("This is a long text", 10) -> "This is..."
 */
const truncateText = (text, length = 100) => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// ==================== EXTRACT YOUTUBE VIDEO ID ====================
/**
 * Extract YouTube video ID from various YouTube URL formats
 * Examples:
 *   "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 *   "https://youtu.be/dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // Try different YouTube URL formats
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
};

// ==================== GENERATE YOUTUBE EMBED URL ====================
/**
 * Generate YouTube embed URL from video ID
 * Examples:
 *   generateYouTubeEmbed("dQw4w9WgXcQ") -> "https://www.youtube.com/embed/dQw4w9WgXcQ"
 */
const generateYouTubeEmbed = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

// ==================== CAPITALIZE STRING ====================
/**
 * Capitalize first letter of string
 * Examples:
 *   capitalize("hello") -> "Hello"
 *   capitalize("hello world") -> "Hello world"
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ==================== FORMAT PHONE NUMBER ====================
/**
 * Format Indian phone number
 * Examples:
 *   formatPhone("9876543210") -> "+91-98765-43210"
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If already has country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.substring(0, 2)}-${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  
  // If 10 digit number
  if (cleaned.length === 10) {
    return `+91-${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
  }
  
  return phone;
};

// ==================== VALIDATE EMAIL ====================
/**
 * Simple email validation
 * Examples:
 *   validateEmail("test@example.com") -> true
 *   validateEmail("invalid-email") -> false
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ==================== GET TIME AGO ====================
/**
 * Get human-readable time difference
 * Examples:
 *   getTimeAgo(new Date(Date.now() - 3600000)) -> "1 hour ago"
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(secondsAgo / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

// ==================== EXPORT ALL HELPERS ====================
module.exports = {
  generateSlug,
  formatCurrency,
  formatDate,
  truncateText,
  extractYouTubeId,
  generateYouTubeEmbed,
  capitalize,
  formatPhone,
  validateEmail,
  getTimeAgo
};