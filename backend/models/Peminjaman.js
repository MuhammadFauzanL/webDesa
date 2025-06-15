const mongoose = require('mongoose');

const PeminjamanSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    barang: { type: String, required: true },
    keperluan: { type: String, required: true },
    tanggalPinjam: { type: Date, required: true },
    tanggalKembali: { type: Date },
    status: { type: String, enum: ['Diajukan', 'Dipinjam', 'Dikembalikan', 'Ditolak'], default: 'Diajukan' }
}, { timestamps: true });

module.exports = mongoose.model('Peminjaman', PeminjamanSchema);