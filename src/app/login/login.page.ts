import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { HttpClientModule } from '@angular/common/http';  // 🔥 IMPORT INI

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  // standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule ],
})
export class LoginPage {
  username: string = '51240075';
  password: string = '';
  showPassword: boolean = false;  // ✅ Tambahkan ini
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  // ✅ Tambahkan semua fungsi yang dipanggil di HTML
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    alert('Silakan hubungi admin untuk reset password.');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLoginGoogle() {
    alert('Fitur Google Login segera hadir!');
  }

  onLoginFacebook() {
    alert('Fitur Facebook Login segera hadir!');
  }

  onLogin() {
    if (!this.username || !this.password) {
      alert('Harap isi username dan password!');
      return;
    }

    this.isLoading = true;

    this.apiService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.status === 'success') {
          this.apiService.setToken(response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.navigate(['/dashboard']);
        } else {
          alert('Login gagal: ' + (response?.message || 'Unknown error'));
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        alert('Login gagal! Periksa username dan password.');
      }
    });
  }
}