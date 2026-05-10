require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('CLOUD NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API KEY EXISTS:', !!process.env.CLOUDINARY_API_KEY);
console.log('API SECRET EXISTS:', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim()
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'rainbow-developers',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  })
});

module.exports = {
  cloudinary,
  storage
};