// backend/routes/aspirasi.js

const express = require('express');
const router = express.Router();
const Aspirasi = require('../models/Aspirasi'); // Pastikan nama model 'A' besar
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET api/aspirasi
// @desc    Get all aspirasi (HANYA UNTUK ADMIN)
// @access  Private (Admin)
router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const semuaAspirasi = await Aspirasi.find().sort({ createdAt: -1 });
        res.json(semuaAspirasi);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat mengambil aspirasi' });
    }
});

// @route   POST api/aspirasi
// @desc    Add new aspirasi (tetap publik)
// @access  Public
router.post('/', async (req, res) => {
    const { nama, aspirasi } = req.body;
    if (!nama || !aspirasi) {
        return res.status(400).json({ msg: 'Nama dan isi aspirasi tidak boleh kosong' });
    }
    try {
        const aspirasiBaru = new Aspirasi({ nama, aspirasi });
        const dataTersimpan = await aspirasiBaru.save();
        res.status(201).json(dataTersimpan);
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).json({ msg: 'Server Error saat menyimpan aspirasi' });
    }
});

// @route   DELETE api/aspirasi/:id (RUTE BARU)
// @desc    Delete aspirasi by ID (HANYA UNTUK ADMIN)
// @access  Private (Admin)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const aspirasi = await Aspirasi.findById(req.params.id);
        if (!aspirasi) {
            return res.status(404).json({ msg: 'Aspirasi tidak ditemukan' });
        }
        await Aspirasi.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Aspirasi berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error saat menghapus aspirasi' });
    }
});

module.exports = router;