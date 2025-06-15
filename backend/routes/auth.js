const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


const User = require('../models/User'); 
router.post('/', [
    
    check('email', 'Harap masukkan email yang valid').isEmail(),
    check('password', 'Password harus diisi').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    
    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Email atau password salah' }] });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Email atau password salah' }] });
        }

        
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan pada server' }] });
    }
});

module.exports = router;
