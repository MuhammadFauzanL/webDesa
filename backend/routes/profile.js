

const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const ProfilDesa = require('../models/ProfilDesa');


router.get('/', async (req, res) => {
    try {
        let profil = await ProfilDesa.findOne();
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

router.put('/', [auth, isAdmin], async (req, res) => {
    const { namaDesa, kecamatan, visi, misi } = req.body;

    try {
       
        const profil = await ProfilDesa.findOneAndUpdate(
            {}, 
            { $set: { namaDesa, kecamatan, visi, misi } },
            { new: true, upsert: true } 
        );
        res.json(profil);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;