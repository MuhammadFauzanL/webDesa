// frontend/src/auth.js

export function logout() {
    // Hapus token dari penyimpanan
    localStorage.removeItem('token');
    
    // Beri tahu pengguna bahwa mereka sudah logout
    alert('Anda telah berhasil logout.');
    
    // Arahkan kembali ke halaman login
    window.location.href = '/login.html';
}