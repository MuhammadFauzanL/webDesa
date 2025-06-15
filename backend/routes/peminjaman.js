const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); 
const Peminjaman = require('../models/Peminjaman');

router.post('/', auth, async (req, res) => {
    const { nama, barang, keperluan, tanggalPinjam } = req.body;
    try {
        const peminjamanBaru = new Peminjaman({ nama, barang, keperluan, tanggalPinjam });
        await peminjamanBaru.save();
        res.status(201).json({ message: 'Pengajuan peminjaman berhasil dikirim.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const semuaPeminjaman = await Peminjaman.find().sort({ createdAt: -1 });
        res.json(semuaPeminjaman);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/:id', [auth, isAdmin], async (req, res) => {
    const { status, tanggalKembali } = req.body;
    try {
        const fieldsToUpdate = { status };
        if (tanggalKembali) fieldsToUpdate.tanggalKembali = tanggalKembali;

        const peminjaman = await Peminjaman.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true }
        );
        res.json(peminjaman);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;