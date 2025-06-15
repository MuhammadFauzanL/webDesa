// File: backend/routes/profile.js

const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const ProfilDesa = require('../models/ProfilDesa');

// @route   GET api/profil
// @desc    Mendapatkan data profil desa (Publik)
router.get('/', async (req, res) => {
    try {
        let profil = await ProfilDesa.findOne();
        // Jika belum ada profil sama sekali, buat satu dengan data default
        if (!profil) {
            profil = new ProfilDesa();
            await profil.save();
        }
        res.json(profil);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profil
// @desc    Update data profil desa (Admin)
router.put('/', [auth, isAdmin], async (req, res) => {
    const { namaDesa, kecamatan, visi, misi } = req.body;

    try {
        // Cari profil yang ada, atau buat baru jika tidak ada. 'upsert: true' melakukannya secara otomatis.
        const profil = await ProfilDesa.findOneAndUpdate(
            {}, // filter kosong, karena hanya ada 1 dokumen
            { $set: { namaDesa, kecamatan, visi, misi } },
            { new: true, upsert: true } // 'new: true' mengembalikan dokumen yang sudah diupdate
        );
        res.json(profil);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;