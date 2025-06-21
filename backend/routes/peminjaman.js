// backend/routes/peminjaman.js

const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); 
const Peminjaman = require('../models/Peminjaman');

// @route   POST api/peminjaman
// @desc    User mengajukan peminjaman baru
// @access  Private
router.post('/', auth, async (req, res) => {
    // Ambil semua data dari form, TERMASUK tanggalKembali
    const { nama, barang, keperluan, tanggalPinjam, tanggalKembali } = req.body;
    try {
        const peminjamanBaru = new Peminjaman({ 
            user: req.user.id, // Simpan ID user yang meminjam
            nama, 
            barang, 
            keperluan, 
            tanggalPinjam, 
            tanggalKembali // Tambahkan tanggal kembali ke data yang disimpan
        });
        await peminjamanBaru.save();
        res.status(201).json({ message: 'Pengajuan peminjaman berhasil dikirim.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/peminjaman/:id
// @desc    Admin mengupdate status DAN/ATAU tanggal kembali
// @access  Private (Admin)
router.put('/:id', [auth, isAdmin], async (req, res) => {
    const { status, tanggalKembali } = req.body;
    try {
        const fieldsToUpdate = {};
        if (status) fieldsToUpdate.status = status;
        // Izinkan tanggalKembali diupdate menjadi kosong atau tanggal baru
        fieldsToUpdate.tanggalKembali = tanggalKembali;

        const peminjaman = await Peminjaman.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true }
        );
        if (!peminjaman) return res.status(404).json({ msg: 'Data tidak ditemukan' });
        res.json(peminjaman);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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
        res.status(500).send('Server Error');
    }
});


module.exports = router;