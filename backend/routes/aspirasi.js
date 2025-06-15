const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Aspirasi = require('../models/Aspirasi'); // <-- PERUBAHAN DI SINI

// @route   POST api/aspirasi
// @desc    Warga mengirim aspirasi baru (Publik, tapi idealnya butuh login warga)
router.post('/', async (req, res) => {
    // ========== TAMBAHKAN DUA BARIS INI UNTUK DEBUGGING ==========
    console.log('--- MENERIMA REQUEST POST KE /api/aspirasi ---');
    console.log('Isi Body Request:', req.body);
    // =============================================================

    const { nama, aspirasi } = req.body;
    try {
        const aspirasiBaru = new Aspirasi({ nama, aspirasi });
        await aspirasiBaru.save();
        res.status(201).json({ message: 'Aspirasi Anda telah terkirim. Terima kasih!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   GET api/aspirasi
// @desc    Admin mendapatkan semua aspirasi
router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const semuaAspirasi = await Aspirasi.find().sort({ createdAt: -1 });
        res.json(semuaAspirasi);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/aspirasi/:id
// @desc    Admin menanggapi aspirasi
router.put('/:id', [auth, isAdmin], async (req, res) => {
    const { tanggapan } = req.body;
    try {
        const aspirasi = await Aspirasi.findByIdAndUpdate(
            req.params.id,
            { $set: { tanggapan, status: 'Sudah Ditanggapi' } },
            { new: true }
        );
        res.json(aspirasi);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;