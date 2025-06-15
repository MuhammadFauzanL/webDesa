const mongoose = require('mongoose');

const ProfilDesaSchema = new mongoose.Schema({
    namaDesa: { type: String, default: "Desa Cibiru" },
    kecamatan: { type: String, default: "Kecamatan Cibiru" },
    visi: { type: String, default: "Visi desa..." },
    misi: { type: String, default: "Misi desa..." }
});

module.exports = mongoose.model('ProfilDesa', ProfilDesaSchema);