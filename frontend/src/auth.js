// Fungsi untuk 'membaca' isi token JWT
// Ini tidak memverifikasi token, hanya membaca datanya (payload)
function decodeJwt(token) {
    try {
        // Mengambil bagian tengah dari token (payload), lalu di-decode
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        // Jika token tidak valid, kembalikan null
        return null;
    }
}

document.addEventListener('alpine:init', () => {
    // State ini akan digunakan oleh navbar di semua halaman
    Alpine.data('navState', () => ({
        isLoggedIn: false, // Defaultnya, pengguna belum login
        isAdmin: false,    // Defaultnya, pengguna bukan admin

        // Fungsi init() akan berjalan otomatis saat halaman dimuat
        init() {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = decodeJwt(token);
                // Cek apakah token ada dan belum kedaluwarsa
                if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                    this.isLoggedIn = true;
                    // Cek apakah pengguna memiliki role 'admin' di dalam token
                    if (decodedToken.user && decodedToken.user.role === 'admin') {
                        this.isAdmin = true;
                    }
                } else {
                    // Jika token tidak valid atau kedaluwarsa, hapus dari penyimpanan
                    localStorage.removeItem('token');
                }
            }
        },

        // Fungsi logout
        logout() {
            // Hapus token dari penyimpanan
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.isAdmin = false;
            // Arahkan pengguna kembali ke halaman login
            alert('Anda telah berhasil logout.');
            window.location.href = '/login.html';
        }
    }));
});
