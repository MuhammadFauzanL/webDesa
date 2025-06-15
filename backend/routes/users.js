const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/users
// @desc    Registrasi user baru dengan email dan password
// @access  Public
router.post('/', [
    // Validasi untuk email dan password
    check('email', 'Harap masukkan email yang valid').isEmail(),
    check('password', 'Password harus terdiri dari minimal 6 karakter').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Mengambil email dan password dari body
    const { email, password } = req.body;

    try {
        // Cek apakah email sudah terdaftar
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Email sudah terdaftar' }] });
        }

        // Buat instance user baru
        user = new User({
            email,
            password,
            // Anda bisa set role default di sini jika perlu, contoh:
            // role: 'warga' 
        });

        // Enkripsi password sebelum disimpan
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Simpan user ke database
        await user.save();
        
        // Buat dan kirim token setelah registrasi berhasil
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 }, // Token berlaku selama 1 jam
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); // Kirim token dengan status 201 Created
            }
        );

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan pada server' }] });
    }
});

module.exports = router;
