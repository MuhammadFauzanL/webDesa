const mongoose = require('mongoose');

const AspirasiSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    aspirasi: { type: String, required: true },
    status: { type: String, default: 'Belum Ditanggapi' },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Aspirasi', AspirasiSchema);
