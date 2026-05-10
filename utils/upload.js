const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');

// ================= FILE FILTER =================
const imageFilter = (req, file, cb) => {

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Only JPG, PNG, WEBP allowed'));

};

// ================= MULTER INSTANCE =================
const uploadImage = multer({

  storage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }

});

// ================= DELETE IMAGE =================
const deleteUploadedFile = async (imageUrl) => {

  try {

    if (!imageUrl) return;

    // extract filename
    const parts = imageUrl.split('/');

    const filename = parts[parts.length - 1];

    // remove extension
    const fileWithoutExt = filename.split('.')[0];

    // correct cloudinary public id
    const publicId = `rainbow-developers/${fileWithoutExt}`;

    await cloudinary.uploader.destroy(publicId);

    console.log('Deleted from Cloudinary:', publicId);

  } catch (err) {

    console.warn('Cloudinary delete failed:', err.message);

  }

};

module.exports = {
  uploadImage,
  deleteUploadedFile
};