const SiteSettings = require('../models/SiteSettings');
const { deleteUploadedFile } = require('../utils/upload');

// ================= SAFE CLEAN =================
const clean = (val) => (typeof val === 'string' ? val.trim() : val);

// ================= GET =================
const getSettingsPage = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});

    res.render('owner/siteSettings', {
      title: 'Site Settings - Owner',
      settings
    });

  } catch (error) {
    console.error('Error loading settings:', error.message);
    req.flash('error', 'Failed to load settings');
    res.redirect('/owner/dashboard');
  }
};

// ================= UPDATE =================
const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    const fields = [
      'heroTitle', 'heroSubtitle',
      'aboutTitle', 'aboutText',
      'phoneNumber', 'email', 'address',
      'whatsappNumber', 'facebookUrl', 'instagramUrl', 'linkedinUrl',
      'companyName', 'tagline', 'footerText'
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        settings[f] = clean(req.body[f]) || '';
      }
    });

    // 🔥 Basic validation
    if (settings.email && !settings.email.includes('@')) {
      req.flash('error', 'Invalid email format');
      return res.redirect('/owner/settings');
    }

    if (settings.whatsappNumber && !/^[0-9]{10,15}$/.test(settings.whatsappNumber)) {
      req.flash('error', 'Invalid WhatsApp number');
      return res.redirect('/owner/settings');
    }

    // HERO IMAGE
    if (req.file) {
      try {
        if (settings.homeHeroImage?.url) {
          deleteUploadedFile(settings.homeHeroImage.url);
        }
      } catch (e) {
        console.warn('Delete failed:', e.message);
      }

      settings.homeHeroImage = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await settings.save();

    req.flash('success', 'Settings updated successfully');
    res.redirect('/owner/settings');

  } catch (error) {
    console.error('Error updating settings:', error.message);
    req.flash('error', 'Update failed');
    res.redirect('/owner/settings');
  }
};

// ================= REMOVE HERO =================
const removeHeroImage = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();

    if (settings?.homeHeroImage?.url) {
      try {
        deleteUploadedFile(settings.homeHeroImage.url);
      } catch (e) {
        console.warn('Delete error:', e.message);
      }

      settings.homeHeroImage = {
        url: null,
        filename: null
      };

      await settings.save();
    }

    req.flash('success', 'Hero image removed');
    res.redirect('/owner/settings');

  } catch (error) {
    console.error('Error removing hero:', error.message);
    req.flash('error', 'Failed to remove hero');
    res.redirect('/owner/settings');
  }
};

module.exports = {
  getSettingsPage,
  updateSettings,
  removeHeroImage
};