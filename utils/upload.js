const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================= UPLOADS DIR =================
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e6) +
      ext;

    cb(null, uniqueName);
  }
});

// ================= FILE FILTER =================
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Only JPG, PNG, WEBP allowed'));
};

// ================= MULTER INSTANCE =================
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,

  // 🔥 Reduced size (VERY IMPORTANT)
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max per image
  }
});

// ================= SAFE DELETE =================
const deleteUploadedFile = (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;

    const filename = fileUrl.replace('/uploads/', '');
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.warn('Delete error:', err.message);
      });
    }

  } catch (err) {
    console.warn('Delete failed:', err.message);
  }
};

module.exports = {
  uploadImage,
  deleteUploadedFile,
  UPLOADS_DIR
};