const express = require('express');
const router = express.Router();

const {
  getProjectsList,
  getAddProjectPage,
  createProject,
  getEditProjectPage,
  updateProject,
  deleteProject,
  uploadHeroImage,
  uploadPhotos,
  deletePhoto,
  addVideo,
  deleteVideo
} = require('../controllers/projectController');

const { uploadImage } = require('../utils/upload');

// ===== AUTH =====
const isOwnerLoggedIn = (req, res, next) => {
  if (req.session?.isOwner) return next();
  req.flash('error', 'Please login first');
  return res.redirect('/owner/login');
};

// ===== SAFE WRAPPER =====
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ===== ROUTES =====

// LIST
router.get('/', isOwnerLoggedIn, asyncHandler(getProjectsList));

// ADD
router.get('/add', isOwnerLoggedIn, getAddProjectPage);

router.post(
  '/add',
  isOwnerLoggedIn,
  uploadImage.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'photos', maxCount: 20 }
  ]),
  asyncHandler(createProject)
);

// EDIT
router.get('/:id/edit', isOwnerLoggedIn, asyncHandler(getEditProjectPage));
router.put('/:id/edit', isOwnerLoggedIn, asyncHandler(updateProject));

// DELETE
router.delete('/delete/:id', isOwnerLoggedIn, asyncHandler(deleteProject));

// ===== MEDIA =====

// HERO
router.post(
  '/:id/hero',
  isOwnerLoggedIn,
  uploadImage.single('heroImage'),
  asyncHandler(uploadHeroImage)
);

// PHOTOS
router.post(
  '/:id/photos',
  isOwnerLoggedIn,
  uploadImage.array('photos', 20),
  asyncHandler(uploadPhotos)
);

router.delete(
  '/:id/photos/:photoId',
  isOwnerLoggedIn,
  asyncHandler(deletePhoto)
);

// VIDEOS
router.post('/:id/videos', isOwnerLoggedIn, asyncHandler(addVideo));

router.delete(
  '/:id/videos/:videoId',
  isOwnerLoggedIn,
  asyncHandler(deleteVideo)
);

module.exports = router;