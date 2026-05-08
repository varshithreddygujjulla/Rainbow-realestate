const mongoose = require('mongoose');

// ==================== SITE SETTINGS SCHEMA ====================
const siteSettingsSchema = new mongoose.Schema(
  {
    // Homepage hero section
    homeHeroImage: {
      url: {
        type: String,
        default: null
      },
      filename: {
        type: String,
        default: null
      }
    },
    
    heroTitle: {
      type: String,
      default: 'Welcome to Rainbow Developers & Agro Farms',
      trim: true
    },
    
    heroSubtitle: {
      type: String,
      default: 'Building Premium Real Estate',
      trim: true
    },
    
    // About section
    aboutTitle: {
      type: String,
      default: 'About Rainbow Developers & Agro Farms',
      trim: true
    },
    
    aboutText: {
      type: String,
      default: '',
      trim: true
    },
    
    // Contact information
    phoneNumber: {
      type: String,
      trim: true
    },
    
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    
    address: {
      type: String,
      trim: true
    },
    
    // Social links
    whatsappNumber: {
      type: String,
      trim: true
    },
    
    facebookUrl: {
      type: String,
      trim: true
    },
    
    instagramUrl: {
      type: String,
      trim: true
    },
    
    linkedinUrl: {
      type: String,
      trim: true
    },
    
    // Company info
    companyName: {
      type: String,
      default: 'Rainbow Developers & Agro Farms',
      trim: true
    },
    
    tagline: {
      type: String,
      default: 'Building Premium Real Estate',
      trim: true
    },
    
    footerText: {
      type: String,
      default: '© 2024 Rainbow Developers & Agro Farms. All rights reserved.',
      trim: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// ==================== CREATE & EXPORT MODEL ====================
module.exports = mongoose.model('SiteSettings', siteSettingsSchema);