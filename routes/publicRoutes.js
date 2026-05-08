const express = require('express');
const router = express.Router();

const {
  getHomePage,
  getAboutPage,
  getCompletedProjects,
  getOngoingProjects,
  getProjectDetails,
  getTestimonialsPage,
  getContactPage,
  submitEnquiry
} = require('../controllers/publicController');

// ================= ASYNC WRAPPER =================
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ================= SIMPLE RATE LIMIT (ENQUIRY) =================
const enquiryLimiter = {};
const LIMIT_TIME = 60 * 1000; // 1 minute

const rateLimitEnquiry = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (enquiryLimiter[ip] && now - enquiryLimiter[ip] < LIMIT_TIME) {
    return res.status(429).send('Too many requests. Try again later.');
  }

  enquiryLimiter[ip] = now;
  next();
};

// ================= PUBLIC ROUTES =================

// Home
router.get('/', asyncHandler(getHomePage));

// About
router.get('/about', asyncHandler(getAboutPage));

// Listings
router.get('/completed-projects', asyncHandler(getCompletedProjects));
router.get('/ongoing-projects', asyncHandler(getOngoingProjects));

// Testimonials
router.get('/testimonials', asyncHandler(getTestimonialsPage));

// Contact
router.get('/contact', asyncHandler(getContactPage));

// Enquiry (protected)
router.post('/enquiry', rateLimitEnquiry, asyncHandler(submitEnquiry));

// Project Detail (keep LAST)
router.get('/projects/:slug', asyncHandler(getProjectDetails));

module.exports = router;