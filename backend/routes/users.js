const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

router.post('/', [
    
    check('email', 'Harap masukkan email yang valid').isEmail(),
    check('password', 'Password harus terdiri dari minimal 6 karakter').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   
    const { email, password } = req.body;

    try {
      
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Email sudah terdaftar' }] });
        }
        user = new User({
            email,
            password,
            
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);


        await user.save();
        
       
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); 
            }
        );

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan pada server' }] });
    }
});

module.exports = router;
