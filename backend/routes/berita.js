// backend/routes/berita.js

const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Berita = require('../models/Berita'); // Pastikan nama model 'B' besar

// POST: Membuat berita baru
router.post('/', [auth, isAdmin, upload], async (req, res) => {
    const { judul, isi } = req.body;
    if (!req.file) {
        return res.status(400).json({ msg: 'Gambar wajib diupload' });
    }
    try {
        const beritaBaru = new Berita({
            judul,
            isi,
            tanggal: new Date(),
            gambar: `/uploads/${req.file.filename}`,
            penulis: req.user.id
        });
        const berita = await beritaBaru.save();
        res.status(201).json(berita);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat membuat berita' });
    }
});

// GET: Mengambil semua berita
router.get('/', async (req, res) => {
    try {
        const allBerita = await Berita.find().sort({ tanggal: -1 });
        res.json(allBerita);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error saat mengambil semua berita' });
    }
});

// GET: Mengambil satu berita berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        }
        res.json(berita);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error saat mengambil berita' });
    }
});

// =============================================
// @route   PUT api/berita/:id (RUTE BARU UNTUK EDIT)
// @desc    Update/Edit berita berdasarkan ID
// @access  Private (Admin)
// =============================================
router.put('/:id', [auth, isAdmin, upload], async (req, res) => {
    const { judul, isi } = req.body;

    try {
        let berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        }

        // Perbarui field jika ada data baru yang dikirim
        if (judul) berita.judul = judul;
        if (isi) berita.isi = isi;
        // Jika ada file gambar baru yang di-upload, perbarui path gambarnya
        if (req.file) {
            berita.gambar = `/uploads/${req.file.filename}`;
            // Anda bisa menambahkan logika untuk menghapus file gambar lama di sini
        }

        const beritaUpdated = await berita.save();
        res.json(beritaUpdated);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Menghapus berita
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ msg: 'Berita tidak ditemukan' });
        }
        await Berita.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Berita berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error saat menghapus berita' });
    }
});

module.exports = router;