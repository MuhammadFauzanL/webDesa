// frontend/src/auth.js

import { API_URL } from './config.js';

/**
 * Fungsi untuk mendekode token JWT dan mengambil payload-nya.
 * @param {string} token - Token JWT yang akan di-decode.
 * @returns {object|null} - Payload dari token atau null jika token tidak valid.
 */
function decodeJwt(token) {
    if (!token) {
        return null;
    }
    try {
        // Mengambil bagian payload (bagian kedua), lalu di-decode dari Base64.
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Gagal mendekode token:", e);
        return null; // Mengembalikan null jika token tidak valid
    }
}

/**
 * Fungsi untuk mendapatkan token dari localStorage.
 * @returns {string|null} Token atau null jika tidak ada.
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Fungsi untuk memeriksa apakah pengguna sudah login.
 * Memeriksa keberadaan dan validitas (belum kedaluwarsa) token.
 * @returns {boolean} - True jika login, false jika tidak.
 */
export function isLoggedIn() {
    const token = getToken();
    if (!token) {
        return false;
    }
    const decodedToken = decodeJwt(token);
    // Cek apakah token ada dan belum kedaluwarsa
    if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        return true;
    }
    // Jika token kedaluwarsa, hapus dari localStorage
    localStorage.removeItem('token');
    return false;
}

/**
 * Fungsi untuk login pengguna.
 * Mengirimkan data ke API dan menyimpan token jika berhasil.
 * @param {string} email - Email pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Promise<object>} - Hasil dari proses login.
 */
export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login gagal.');
        }

        // Simpan token ke localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        return data;
    } catch (error) {
        console.error('Error saat login:', error);
        throw error;
    }
}

/**
 * Fungsi untuk logout pengguna.
 * Menghapus token dari localStorage dan mengarahkan ke halaman login.
 */
export function logout() {
    localStorage.removeItem('token');
    // Arahkan ke halaman login atau halaman utama
    window.location.href = '/login.html';
}

/**
 * Fungsi untuk memeriksa apakah pengguna yang sedang login adalah admin.
 * Fungsi ini harus dipanggil di halaman yang memerlukan hak akses admin.
 */
export function checkAdmin() {
    const token = getToken();
    if (!token) {
        alert('Anda harus login untuk mengakses halaman ini.');
        window.location.href = '/login.html';
        return;
    }
    
    try {
        const decodedToken = decodeJwt(token);
        // Pastikan token valid dan memiliki role 'admin'
        if (!decodedToken || !decodedToken.user || decodedToken.user.role !== 'admin') {
            alert('Akses ditolak. Halaman ini hanya untuk admin.');
            window.location.href = '/index.html'; // Alihkan ke halaman utama
        }
    } catch (error) {
        console.error("Token tidak valid:", error);
        alert('Sesi tidak valid, silakan login kembali.');
        logout();
    }
}

/**
 * Komponen Alpine.js untuk mengelola state autentikasi di seluruh aplikasi,
 * terutama untuk kebutuhan UI seperti navbar.
 */
document.addEventListener('alpine:init', () => {
    Alpine.data('authController', () => ({
        isLoggedIn: false,
        isAdmin: false,

        // Fungsi yang berjalan otomatis saat komponen dimuat
        init() {
            const token = getToken();
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
                    // Hapus token jika sudah kedaluwarsa atau tidak valid
                    localStorage.removeItem('token');
                }
            }
        },

        // Fungsi untuk logout yang bisa dipanggil dari UI
        handleLogout() {
            logout();
            alert('Anda telah berhasil logout.');
        }
    }));
});