// backend/middleware/cloudinaryUpload.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Memuat variabel dari .env
require('dotenv').config();

// Konfigurasi Cloudinary dengan kredensial Anda dari file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Konfigurasi penyimpanan ke Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'webdesa-cibiru/berita', // Nama folder di dalam Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }] // Otomatis resize gambar
  },
});

// Inisialisasi Multer dengan penyimpanan Cloudinary
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batas ukuran file tetap 5MB
    } 
});

module.exports = upload;