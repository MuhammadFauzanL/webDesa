// backend/routes/peminjaman.js

const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); 
const Peminjaman = require('../models/Peminjaman');

// @route   POST api/peminjaman
// @desc    User mengajukan peminjaman baru
// @access  Private
router.post('/', auth, async (req, res) => {
    const { nama, barang, keperluan, tanggalPinjam, tanggalKembali } = req.body;
    try {
        const peminjamanBaru = new Peminjaman({ 
            user: req.user.id,
            nama, 
            barang, 
            keperluan, 
            tanggalPinjam, 
            tanggalKembali
        });
        await peminjamanBaru.save();
        res.status(201).json({ message: 'Pengajuan peminjaman berhasil dikirim.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/peminjaman
// @desc    Admin mengambil SEMUA data peminjaman
// @access  Private (Admin)
router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const semuaPeminjaman = await Peminjaman.find().sort({ createdAt: -1 });
        res.json(semuaPeminjaman);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/peminjaman/:id
// @desc    Admin mengambil detail SATU peminjaman
// @access  Private (Admin)
router.get('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const peminjaman = await Peminjaman.findById(req.params.id);
        if (!peminjaman) {
            return res.status(404).json({ msg: 'Data peminjaman tidak ditemukan' });
        }
        res.json(peminjaman);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Data peminjaman tidak ditemukan' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});


// ====================================================================
// ===== PERBAIKAN: Rute PUT untuk mengupdate semua field =====
// ====================================================================
// @route   PUT api/peminjaman/:id
// @desc    Admin mengupdate data peminjaman
// @access  Private (Admin)
router.put('/:id', [auth, isAdmin], async (req, res) => {
    // Ambil semua field yang mungkin diubah dari body
    const { nama, barang, keperluan, tanggalPinjam, status, tanggalKembali } = req.body;
    
    try {
        // Buat objek berisi field yang akan diupdate
        const fieldsToUpdate = {
            nama,
            barang,
            keperluan,
            tanggalPinjam,
            status,
            tanggalKembali: tanggalKembali || null // Set ke null jika kosong
        };

        const peminjaman = await Peminjaman.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true } // Opsi ini untuk mendapatkan dokumen yang sudah terupdate sebagai respons
        );

        if (!peminjaman) {
            return res.status(404).json({ msg: 'Data peminjaman tidak ditemukan' });
        }
        
        res.json(peminjaman);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/peminjaman/:id
// @desc    Admin menghapus data peminjaman
// @access  Private (Admin)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const peminjaman = await Peminjaman.findById(req.params.id);
        if (!peminjaman) {
            return res.status(404).json({ msg: 'Data peminjaman tidak ditemukan' });
        }
        await Peminjaman.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Data peminjaman berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;