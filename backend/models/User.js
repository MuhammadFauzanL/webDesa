const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Menghapus field nama dan NIK sesuai permintaan
    email: {
        type: String,
        required: true,
        unique: true // Pastikan setiap email hanya bisa mendaftar sekali
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'warga' // Role default untuk user yang mendaftar
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
