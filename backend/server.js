const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // PENTING: Pastikan baris ini ada
const connectDB = require('./config/db');

// --- PERBAIKAN UTAMA ADA DI SINI ---
// Baris ini memberi tahu dotenv untuk mencari file .env satu tingkat di atas direktori saat ini (yaitu di folder root 'WebDesa')
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// ------------------------------------

// Panggil connectDB SETELAH dotenv dikonfigurasi
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Buat folder 'public' menjadi statis agar gambar bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('API Desa Cibiru Berjalan...'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/berita', require('./routes/berita'));
app.use('/api/profil', require('./routes/profile'));
app.use('/api/aspirasi', require('./routes/aspirasi'));
app.use('/api/peminjaman', require('./routes/peminjaman'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));