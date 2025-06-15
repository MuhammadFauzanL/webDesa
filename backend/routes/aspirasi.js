
const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const Aspirasi = require('../models/Aspirasi');

// Membuat instance router
const router = express.Router();

// @route   POST api/aspirasi
// @desc    Warga mengirim aspirasi baru dengan logging detail
router.post('/', async (req, res) => {
    console.log('--- [1] MENERIMA REQUEST POST KE /api/aspirasi ---');
    console.log('Isi Body Request:', req.body);

    const { nama, aspirasi } = req.body;
    try {
        console.log('--- [2] Masuk ke blok TRY. Membuat dokumen baru...');
        const aspirasiBaru = new Aspirasi({ nama, aspirasi });
        console.log('--- [3] Dokumen dibuat. Mencoba menyimpan ke database...');

        await aspirasiBaru.save();

        // Jika kode sampai ke sini, artinya .save() berhasil tanpa error
        console.log('--- [4] SUKSES menyimpan ke database! Mengirim respons ke frontend.');
        res.status(201).json({ message: 'Aspirasi Anda telah terkirim. Terima kasih!' });

    } catch (err) {
        // Jika ada error APAPUN di dalam blok TRY, kode akan masuk ke sini
        console.error('--- [X] TERJADI ERROR SAAT MENYIMPAN! ---');
        console.error('Pesan Error Detail:', err); // Menggunakan console.error(err) untuk detail lengkap
        res.status(500).send('Server Error: Gagal menyimpan data.');
    }
});


// @route   GET api/aspirasi
// @desc    Admin mendapatkan semua aspirasi
router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const semuaAspirasi = await Aspirasi.find().sort({ createdAt: -1 });
        res.json(semuaAspirasi);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/aspirasi/:id
// @desc    Admin menanggapi aspirasi
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

// Mengekspor router agar bisa digunakan di server.js
module.exports = router;
