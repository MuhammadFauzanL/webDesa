const express = require('express');
const router = express.Router();

// Impor model Aspirasi Anda
// Pastikan path-nya benar, mungkin ../models/Aspirasi
const Aspirasi = require('../models/Aspirasi');

// @route   POST api/aspirasi
// @desc    Membuat aspirasi baru
// @access  Public
router.post('/', async (req, res) => {
  // Cek data yang masuk dari body request
  const { nama, aspirasi } = req.body;

  // Validasi sederhana
  if (!nama || !aspirasi) {
    return res.status(400).json({ msg: 'Nama dan isi aspirasi tidak boleh kosong' });
  }

  try {
    const aspirasiBaru = new Aspirasi({
      nama,
      aspirasi,
    });

    
    const dataTersimpan = await aspirasiBaru.save();

    console.log('Data aspirasi berhasil disimpan:', dataTersimpan);
    res.status(201).json(dataTersimpan);

  } catch (err) {
    console.error('Server Error saat menyimpan aspirasi:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
  try {
    const semuaAspirasi = await Aspirasi.find().sort({ tanggal: -1 });
    res.json(semuaAspirasi);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
