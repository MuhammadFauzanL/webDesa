// backend/routes/aspirasi.js
const express = require('express');
const router = express.Router();

const Aspirasi = require('../models/aspirasi');

router.post('/', async (req, res) => {
  const { nama, aspirasi } = req.body;

  if (!nama || !aspirasi) {
    return res.status(400).json({ msg: 'Nama dan isi aspirasi tidak boleh kosong' });
  }

  try {
    const aspirasiBaru = new Aspirasi({
      nama,
      aspirasi,
    });

    const dataTersimpan = await aspirasiBaru.save();

 
    res.status(201).json(dataTersimpan);

  } catch (err) {
    console.error('Server Error saat menyimpan aspirasi:', err.message);
    // Ubah di sini: kirim respons JSON
    res.status(500).json({ msg: 'Server Error saat menyimpan aspirasi' });
  }
});


router.get('/', async (req, res) => {
  try {
    const semuaAspirasi = await Aspirasi.find().sort({ tanggal: -1 });
    res.json(semuaAspirasi);
  } catch (err) {
    console.error(err.message);
    // Ubah di sini: kirim respons JSON
    res.status(500).json({ msg: 'Server Error saat mengambil aspirasi' });
  }
});

module.exports = router;