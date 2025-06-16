function decodeJwt(token) {
    try {
        // Mengambil bagian payload (tengah), lalu di-decode dari Base64
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        // Mengembalikan null jika token tidak valid
        return null;
    }
}

document.addEventListener('alpine:init', () => {
    // Komponen Alpine.js ini akan mengontrol semua status yang berhubungan dengan autentikasi
    Alpine.data('authController', () => ({
        // State untuk Navbar
        isLoggedIn: false,
        isAdmin: false,

        // Fungsi yang berjalan otomatis saat halaman dimuat
        init() {
            console.log('Auth controller initialized.');
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = decodeJwt(token);
                // Cek apakah token ada dan belum kedaluwarsa
                if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                    this.isLoggedIn = true;
                    // Cek apakah pengguna memiliki role 'admin'
                    if (decodedToken.user && decodedToken.user.role === 'admin') {
                        this.isAdmin = true;
                    }
                } else {
                    // Hapus token jika sudah kedaluwarsa
                    localStorage.removeItem('token');
                }
            }
        },

        // Fungsi untuk logout
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.isAdmin = false;
            alert('Anda telah berhasil logout.');
            window.location.href = '/login.html';
        }
    }));
});
