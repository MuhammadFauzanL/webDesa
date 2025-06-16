const mongoose = require('mongoose');

const BeritaSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    isi: { type: String, required: true }, 
    gambar: { type: String, required: true }, 
    tanggal: { type: Date, required: true },
    penulis: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

module.exports = mongoose.model('berita', BeritaSchema);
