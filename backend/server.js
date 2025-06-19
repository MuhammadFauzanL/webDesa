const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// ✅ Karena .env di luar folder backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug output
console.log("MONGO_URI dari .env:", process.env.MONGO_URI);


// Menghubungkan ke DB setelah .env dimuat
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Membuat folder 'public' menjadi statis agar gambar bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('API Desa Cibiru Berjalan...'));

app.use('/api/users', require('./routes/users'));

// Route yang sudah ada sebelumnya
app.use('/api/auth', require('./routes/auth'));
app.use('/api/berita', require('./routes/berita'));
app.use('/api/profil', require('./routes/profile'));
app.use('/api/aspirasi', require('./routes/aspirasi'));
app.use('/api/peminjaman', require('./routes/peminjaman'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));


