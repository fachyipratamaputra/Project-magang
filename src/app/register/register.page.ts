import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    if (!this.fullname || !this.username || !this.email || !this.password || !this.confirmPassword) {
      console.log('Harap isi semua field');
      return;
    }

    if (this.password.length < 6) {
      console.log('Password minimal 6 karakter');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Password dan konfirmasi password tidak sama');
      return;
    }

    console.log('Register dengan:', {
      fullname: this.fullname,
      username: this.username,
      email: this.email,
      password: this.password,
    });

    // this.router.navigate(['/login']);
  }

  onRegisterGoogle() {
    console.log('Register dengan Google');
  }

  onRegisterFacebook() {
    console.log('Register dengan Facebook');
  }

  goToLogin() {
    console.log('Navigasi ke halaman login');
    this.router.navigate(['/login']);
  }
}