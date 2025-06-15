const mongoose = require('mongoose');

const AspirasiSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    aspirasi: { type: String, required: true },
    status: { type: String, enum: ['Belum Ditanggapi', 'Sudah Ditanggapi'], default: 'Belum Ditanggapi' },
    tanggapan: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Aspirasi', AspirasiSchema);