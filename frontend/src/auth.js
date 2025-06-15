/**
 * Komponen Alpine.js untuk mengelola state navigasi di seluruh situs.
 * Ini memeriksa localStorage untuk token dan peran pengguna,
 * lalu mengatur variabel untuk menampilkan link yang sesuai.
 */
document.addEventListener('alpine:init', () => {
    Alpine.data('navState', () => ({
        // Properti untuk menyimpan status login dan peran pengguna
        isLoggedIn: false,
        isAdmin: false,
        
        // Fungsi init() akan otomatis berjalan saat komponen navigasi dimuat
        init() {
            // Cek status login dan peran dari localStorage
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            
            if (token) {
                this.isLoggedIn = true;
            }
            
            if (role === 'admin') {
                this.isAdmin = true;
            }
        },
        
        // Fungsi logout yang akan dipanggil oleh tombol di navigasi
        logout() {
            // Tampilkan konfirmasi sebelum logout
            if (confirm('Apakah Anda yakin ingin logout?')) {
                // Hapus data sesi dari localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                
                // Beri notifikasi dan arahkan ke halaman login
                alert('Anda telah berhasil logout.');
                window.location.href = 'login.html';
            }
        }
    }));
});