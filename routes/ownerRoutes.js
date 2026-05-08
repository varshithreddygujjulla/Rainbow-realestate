const express = require('express');
const router = express.Router();

// ===== CONTROLLERS =====
const {
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiryController');

const {
  getLoginPage,
  loginOwner,
  logoutOwner,
  getDashboard
} = require('../controllers/ownerController');

const {
  getSettingsPage,
  updateSettings,
  removeHeroImage
} = require('../controllers/settingsController');

const { uploadImage } = require('../utils/upload');

// ===== AUTH MIDDLEWARE =====
const isOwnerLoggedIn = (req, res, next) => {
  if (req.session?.isOwner) return next();

  req.flash('error', 'Please login first');
  return res.redirect('/owner/login');
};

// ===== AUTH ROUTES =====
router.get('/login', getLoginPage);
router.post('/login', loginOwner);
router.get('/logout', logoutOwner);

// ===== DASHBOARD =====
router.get('/dashboard', isOwnerLoggedIn, getDashboard);

// ===== ENQUIRIES =====
router.get('/enquiries', isOwnerLoggedIn, getAllEnquiries);

router.put('/enquiries/:id/status', isOwnerLoggedIn, updateEnquiryStatus);

router.delete('/enquiries/:id', isOwnerLoggedIn, deleteEnquiry);

// ===== SITE SETTINGS =====
router.get('/settings', isOwnerLoggedIn, getSettingsPage);

router.post(
  '/settings',
  isOwnerLoggedIn,
  uploadImage.single('homeHeroImage'),
  updateSettings
);

router.post('/settings/hero/remove', isOwnerLoggedIn, removeHeroImage);

module.exports = router;