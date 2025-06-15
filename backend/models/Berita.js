const mongoose = require('mongoose');

const BeritaSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    isi: { type: String, required: true }, // Konten HTML dari editor
    gambar: { type: String, required: true }, // URL atau path ke gambar
    tanggal: { type: Date, required: true },
    penulis: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // ID Admin
}, { timestamps: true });

module.exports = mongoose.model('Berita', BeritaSchema);