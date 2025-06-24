const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Upload ke lokal
const uploads = require('../middleware/cloudynaryUpload'); // Upload ke Cloudinary
const Berita = require('../models/Berita');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Fungsi untuk mengekstrak public_id dari URL Cloudinary (versi lebih andal)
const getPublicIdFromUrl = (url) => {
    try {
        if (!url || !url.includes('cloudinary.com')) return null;
        
        // Cari string setelah '/upload/'
        const uploadMarker = '/upload/';
        const uploadIndex = url.indexOf(uploadMarker);
        if (uploadIndex === -1) return null;

        // Potong URL untuk mendapatkan bagian setelah '/upload/'
        const afterUpload = url.substring(uploadIndex + uploadMarker.length);
        
        // Lewati bagian versi (misal: v1234567890/)
        const versionIndex = afterUpload.indexOf('/');
        if (versionIndex === -1) return null;

        // public_id adalah sisa string setelah versi, tanpa ekstensi file
        const publicIdWithFormat = afterUpload.substring(versionIndex + 1);
        const publicId = publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf('.'));
        
        return publicId;
    } catch (e) {
        console.error("Gagal mengekstrak Public ID dari URL:", url, e);
        return null;
    }
};

// =============================
// POST: Tambah Berita (Cloudinary)
// =============================
router.post('/cloud', [auth, isAdmin, uploads.single('gambar')], async (req, res) => {
    const { judul, isi } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'Gambar wajib diupload' });

    try {
        const beritaBaru = new Berita({
            judul,
            isi,
            tanggal: new Date(),
            gambar: req.file.path, // Cloudinary URL
            penulis: req.user.id
        });
        const berita = await beritaBaru.save();
        res.status(201).json(berita);
    } catch (err) {
        console.error("Error saat membuat berita (Cloudinary):", err);
        res.status(500).json({ msg: 'Server Error saat membuat berita' });
    }
});

// =============================
// GET: Semua Berita
// =============================
router.get('/', async (req, res) => {
    try {
        const allBerita = await Berita.find().sort({ tanggal: -1 });
        res.json(allBerita);
    } catch (err) {
        console.error('Error saat mengambil semua berita:', err);
        res.status(500).json({ msg: 'Server Error saat mengambil semua berita' });
    }
});

// =============================
// GET: Berita berdasarkan ID
// =============================
router.get('/:id', async (req, res) => {
    try {
        const berita = await Berita.findById(req.params.id);
        if (!berita) return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        res.json(berita);
    } catch (err) {
        console.error(`Error saat mengambil berita ID ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Server Error saat mengambil berita' });
    }
});


// =============================
// PUT: Edit Berita
// =============================
router.put('/:id', [auth, isAdmin, uploads.single('gambar')], async (req, res) => {
    const { judul, isi } = req.body;

    try {
        let berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        }

        const oldImage = berita.gambar;

        // Jika ada file baru yang di-upload, ganti gambar lama
        if (req.file && req.file.path) {
            berita.gambar = req.file.path; // Set URL Cloudinary yang baru

            // Hapus gambar lama dari Cloudinary jika ada
            if (oldImage && oldImage.includes('cloudinary.com')) {
                const publicId = getPublicIdFromUrl(oldImage);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        if (judul) berita.judul = judul;
        if (isi) berita.isi = isi;

        const beritaUpdated = await berita.save();
        res.json(beritaUpdated);

    } catch (err) {
        console.error(`Error saat mengedit berita ID ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Server Error saat mengedit berita' });
    }
});


// =============================
// DELETE: Hapus Berita
// =============================
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        }

        const imagePath = berita.gambar;


        if (imagePath) {
            if (imagePath.includes('cloudinary.com')) {
                const publicId = getPublicIdFromUrl(imagePath);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            } else if (imagePath.startsWith('/uploads/')) {
                const localPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(localPath)) {
                    fs.unlinkSync(localPath);
                }
            }
        }
        
        await Berita.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Berita berhasil dihapus' });
    } catch (err) {
        console.error(`Error saat menghapus berita ID ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Server Error saat menghapus berita' });
    }
});


module.exports = router;