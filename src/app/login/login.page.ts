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
  username: string = '51240075';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  connectionStatus: string = '🔄 Mengecek koneksi...';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.testConnection();
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
        console.log('✅ Login berhasil:', response);
        this.isLoading = false;
        
        if (response.status === 'success') {
          this.apiService.setToken(response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.navigate(['/dashboard']);
        } else {
          alert(response.message || 'Login gagal!');
        }
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.isLoading = false;
        alert('Login gagal! Periksa username dan password.');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    alert('Silakan hubungi admin untuk reset password.');
  }

  onLoginGoogle() {
    alert('Fitur Google Login segera hadir!');
  }

  onLoginFacebook() {
    alert('Fitur Facebook Login segera hadir!');
  }
}