import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage {
  fullname: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  // ===== VALIDASI USERNAME =====
  usernameAvailable: boolean = true;
  usernameChecking: boolean = false;
  usernameSuggestions: string[] = [];
  usernameMessage: string = '';
  usernameError: boolean = false;
  private usernameSubject = new Subject<string>();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    // Setup debounce untuk cek username
    this.usernameSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((username: string) => {
        if (username.length < 3) {
          return new Promise((resolve) => {
            resolve({
              status: 'success',
              data: { available: true, suggestions: [] }
            });
          });
        }
        return this.apiService.checkUsername(username);
      })
    ).subscribe({
      next: (response: any) => {
        this.usernameChecking = false;
        if (response?.status === 'success') {
          const data = response.data;
          this.usernameAvailable = data.available;
          this.usernameSuggestions = data.suggestions || [];
          
          if (!data.available) {
            this.usernameError = true;
            this.usernameMessage = `⚠️ Username "${this.username}" sudah terdaftar!`;
            if (this.usernameSuggestions.length > 0) {
              this.usernameMessage += ` Coba: ${this.usernameSuggestions.join(', ')}`;
            }
          } else if (this.username.length >= 3) {
            this.usernameError = false;
            this.usernameMessage = '✅ Username tersedia!';
          } else {
            this.usernameError = false;
            this.usernameMessage = '';
          }
        }
      },
      error: (error) => {
        this.usernameChecking = false;
        console.error('Error checking username:', error);
      }
    });
  }

  // ===== CEK USERNAME REAL-TIME =====
  onUsernameChange() {
    this.usernameChecking = true;
    this.usernameSubject.next(this.username);
  }

  // ===== GUNAKAN SARAN USERNAME =====
  useSuggestion(suggestion: string) {
    this.username = suggestion;
    this.onUsernameChange();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ===== REGISTER =====
  onRegister() {
    // Validasi
    if (!this.fullname || !this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('⚠️ Harap isi semua field!');
      return;
    }

    if (this.password.length < 6) {
      alert('⚠️ Password minimal 6 karakter!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('⚠️ Password dan konfirmasi password tidak sama!');
      return;
    }

    if (!this.usernameAvailable) {
      alert(`⚠️ Username "${this.username}" sudah terdaftar! ${this.usernameSuggestions.length > 0 ? 'Coba: ' + this.usernameSuggestions.join(', ') : ''}`);
      return;
    }

    this.isLoading = true;

    this.apiService.register({
      nama: this.fullname,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Register berhasil:', response);
        this.isLoading = false;
        
        if (response.status === 'success') {
          alert('✅ Registrasi berhasil! Silakan login.');
          this.router.navigate(['/login']);
        } else {
          alert(response.message || 'Registrasi gagal!');
        }
      },
      error: (error: any) => {
        console.error('❌ Register error:', error);
        this.isLoading = false;
        
        if (error.status === 409) {
          alert('⚠️ Username atau email sudah terdaftar!');
        } else if (error.status === 400) {
          alert('⚠️ ' + (error.error?.message || 'Data tidak lengkap!'));
        } else {
          alert('⚠️ Registrasi gagal! Periksa koneksi ke server.');
        }
      }
    });
  }

  // ===== GO TO LOGIN =====
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // ===== SOCIAL REGISTER =====
  onRegisterGoogle() {
    alert('Fitur Google Register segera hadir!');
  }

  onRegisterFacebook() {
    alert('Fitur Facebook Register segera hadir!');
  }
}