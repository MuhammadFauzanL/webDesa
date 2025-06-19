

import { isLoggedIn, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('nav'); 
    if (!navbar) return;

    const loginLink = navbar.querySelector('a[href="login.html"]');
    if (!loginLink) return;

    if (isLoggedIn()) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#'; 

       
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        // Tampilkan menu Admin jika pengguna adalah admin
        const token = parseJwt(getToken());
        if (token && token.role === 'admin') {
            const adminMenu = document.getElementById('admin-menu');
            if(adminMenu) {
                adminMenu.style.display = 'block';
            }
        }

    } else {
        // Sembunyikan menu Admin jika tidak login
        const adminMenu = document.getElementById('admin-menu');
        if(adminMenu) {
            adminMenu.style.display = 'none';
        }
    }
});

function parseJwt(token) {
    if (!token) {
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

function getToken() {
    return localStorage.getItem('token');
}