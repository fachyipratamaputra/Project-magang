import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  connectionStatus: string = '🔄 Mengecek koneksi...';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // 🔥 CEK APAKAH SUDAH LOGIN
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.redirectByRole(user?.role || 'user');
      return;
    }
    this.testConnection();
    this.preventBackButton();
  }

  // 🔥 MENCEGAH BACK BUTTON
  preventBackButton() {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', (event) => {
      window.history.pushState(null, '', window.location.href);
    });
  }

  testConnection() {
    this.connectionStatus = '🔄 Mengecek koneksi...';
    
    this.apiService.testConnection().subscribe({
      next: (response) => {
        console.log('✅ Backend terhubung:', response);
        this.connectionStatus = '✅ Backend terhubung!';
      },
      error: (error) => {
        console.error('❌ Gagal koneksi:', error);
        this.connectionStatus = '❌ Gagal terhubung ke backend!';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ==========================================
  // 🔥 LOGIN - DENGAN DEBUG
  // ==========================================
  onLogin() {
    if (!this.username || !this.password) {
      alert('Harap isi username dan password!');
      return;
    }

    this.isLoading = true;
    console.log('📤 Mencoba login dengan:', this.username);

    this.apiService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Response dari server:', response);
        this.isLoading = false;
        
        // 🔥 CEK RESPONSE - SUPPORT BEBERAPA FORMAT
        // Format 1: { status: 'success', token: '...', user: {...} }
        // Format 2: { token: '...', user: {...} }
        // Format 3: { data: { token: '...', user: {...} } }
        // Format 4: { success: true, data: { token: '...', user: {...} } }
        
        let token = null;
        let user = null;
        let isSuccess = false;

        // Cek format response
        if (response.token) {
          // Format 2: { token: '...', user: {...} }
          token = response.token;
          user = response.user;
          isSuccess = true;
        } else if (response.status === 'success' && response.data) {
          // Format 1: { status: 'success', data: { token: '...', user: {...} } }
          token = response.data.token;
          user = response.data.user;
          isSuccess = true;
        } else if (response.data && response.data.token) {
          // Format 3: { data: { token: '...', user: {...} } }
          token = response.data.token;
          user = response.data.user;
          isSuccess = true;
        } else if (response.success && response.data) {
          // Format 4: { success: true, data: { token: '...', user: {...} } }
          token = response.data.token;
          user = response.data.user;
          isSuccess = true;
        } else if (response.user && response.token) {
          // Format langsung
          token = response.token;
          user = response.user;
          isSuccess = true;
        }

        if (isSuccess && token) {
          console.log('✅ Login berhasil! Token:', token);
          console.log('👤 User:', user);
          
          this.apiService.setToken(token);
          
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }

          // 🔥 REDIRECT BERDASARKAN ROLE
          const role = user?.role || response.role || 'user';
          console.log('🔑 Role:', role);
          this.redirectByRole(role);
          
        } else {
          console.error('❌ Response tidak valid:', response);
          alert('Login gagal! Format response tidak sesuai. Silakan cek console.');
        }
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.isLoading = false;
        
        // Tampilkan pesan error yang lebih informatif
        let errorMessage = 'Login gagal! Periksa username dan password.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      }
    });
  }

  // ==========================================
  // 🔥 REDIRECT FUNCTION
  // ==========================================
  redirectByRole(role: string) {
    console.log('🔑 Redirect berdasarkan role:', role);
    
    if (role === 'admin') {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    } else {
      this.router.navigate(['/user-dashboard'], { replaceUrl: true });
    }
  }

  // ==========================================
  // SOCIAL LOGIN
  // ==========================================
  onLoginGoogle() {
    alert('Fitur Google Login segera hadir!');
  }

  onLoginFacebook() {
    alert('Fitur Facebook Login segera hadir!');
  }

  goToRegister() {
    this.router.navigate(['/register'], { replaceUrl: true });
  }

  forgotPassword() {
    alert('Silakan hubungi admin untuk reset password.');
  }
}