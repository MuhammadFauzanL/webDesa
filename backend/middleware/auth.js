// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// Fungsi middleware untuk otentikasi
const auth = (req, res, next) => {
    
    const authHeader = req.header('Authorization');

    
    if (!authHeader) {
        return res.status(401).json({ msg: 'Akses ditolak, header Authorization tidak ditemukan' });
    }

  
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Format token salah, harus "Bearer <token>"' });
    }

   
    const token = tokenParts[1];

    try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token tidak valid atau kedaluwarsa' });
    }
};

// Fungsi middleware untuk mengecek peran admin
const isAdmin = (req, res, next) => {
    // Middleware ini HARUS dijalankan setelah middleware 'auth'
    if (req.user && req.user.role === 'admin') {
        next(); // Lanjutkan jika user adalah admin
    } else {
        // Kirim error jika bukan admin
        res.status(403).json({ msg: 'Akses ditolak, peran admin diperlukan' });
    }
};

module.exports = {
    auth,
    isAdmin
};