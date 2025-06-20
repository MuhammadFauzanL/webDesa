// frontend/src/main.js

import './style.css';
import { login } from './auth.js'; // Impor fungsi login

document.addEventListener('DOMContentLoaded', () => {
    // Menangani form login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Panggil fungsi login dan tunggu hasilnya
                const data = await login(email, password);

                // Jika berhasil dan ada token, SIMPAN DI SINI
                if (data.token) {
                    localStorage.setItem('token', data.token);

                    // SETELAH token disimpan, baru pindah halaman
                    alert('Login berhasil!');
                    window.location.href = data.user && data.user.role === 'admin' ? '/admin.html' : '/index.html';
                
                } else {
                    throw new Error('Respons tidak valid dari server.');
                }
            } catch (error) {
                // Menampilkan pesan error dari server atau default
                const errorMessage = error.message || 'Email atau password salah.';
                alert(errorMessage);
                console.error('Login error:', error);
            }
        });
    }
});