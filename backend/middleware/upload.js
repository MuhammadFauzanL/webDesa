const multer = require('multer');
const path = require('path');

// Atur penyimpanan
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Inisialisasi upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Batas ukuran file 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('gambar'); // 'gambar' harus sama dengan nama field di form

// Cek tipe file
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Hanya gambar yang diizinkan!');
    }
}

module.exports = upload;