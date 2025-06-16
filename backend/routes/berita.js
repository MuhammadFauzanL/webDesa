const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Berita = require('../models/berita');
const User = require('../models/User');

router.post('/', [auth, isAdmin, upload], async (req, res) => {
    const { judul, tanggal, isi } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ message: 'Gambar wajib diupload' });
    }
    
    try {
        const beritaBaru = new Berita({
            judul,
            tanggal,
            isi,
            gambar: `/uploads/${req.file.filename}`, 
            penulis: req.user.id
        });

        const berita = await beritaBaru.save();
        res.status(201).json(berita);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat membuat berita' }); // Ubah di sini
    }
});

router.get('/', async (req, res) => {
    try {
        const allBerita = await Berita.find().sort({ tanggal: -1 });
        res.json(allBerita);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat mengambil semua berita' }); // Ubah di sini
    }
});

router.get('/:id', async (req, res) => {
    try {
        const berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ message: 'Berita tidak ditemukan' });
        }
        res.json(berita);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat mengambil berita berdasarkan ID' }); // Ubah di sini
    }
});

router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        let berita = await Berita.findById(req.params.id);
        if (!berita) {
            return res.status(404).json({ message: 'Berita tidak ditemukan' });
        }
        await Berita.findByIdAndDelete(req.params.id);
        res.json({ message: 'Berita berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat menghapus berita' }); // Ubah di sini
    }
});

module.exports = router;