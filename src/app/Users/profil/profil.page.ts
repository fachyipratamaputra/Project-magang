import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-users',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilUsersPage implements OnInit {
  // Default/fallback kalau localStorage kosong (belum login / data rusak)
  profile = {
    nama: '-',
    role: '-',
    avatar: '',
    totalLahan: 0,
    totalTanaman: 0,
    totalPanen: 0
  };

  personalInfo: any[] = [];

  settings = [
    { 
      icon: 'lock-closed-outline', 
      label: 'Ubah Password', 
      color: '#ff9800',
      action: () => this.changePassword() 
    },
    { 
      icon: 'notifications-outline', 
      label: 'Notifikasi', 
      value: 'Aktif',
      color: '#2196f3',
      action: () => this.notificationSettings() 
    },
    { 
      icon: 'shield-checkmark-outline', 
      label: 'Keamanan', 
      value: 'Terlindungi',
      color: '#4caf50',
      action: () => this.securitySettings() 
    },
    { 
      icon: 'language-outline', 
      label: 'Bahasa', 
      value: 'Indonesia',
      color: '#9c27b0',
      action: () => this.languageSettings() 
    },
    { 
      icon: 'information-circle-outline', 
      label: 'Tentang Aplikasi', 
      value: 'v1.0.0',
      color: '#607d8b',
      action: () => this.aboutApp() 
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
  }

  // ============================================
  // 🔥 AMBIL DATA USER YANG SEDANG LOGIN
  // ============================================
  loadUserData() {
    const userData = localStorage.getItem('user');

    if (!userData) {
      console.warn('Tidak ada data user di localStorage, mungkin belum login.');
      return;
    }

    let user: any;
    try {
      user = JSON.parse(userData);
    } catch (e) {
      console.error('Gagal parse data user:', e);
      return;
    }

    // Update kartu profil atas
    this.profile = {
      ...this.profile,
      nama: user.nama || '-',
      role: this.formatRole(user.role),
      avatar: user.foto || ''
    };

    // Update daftar info personal — field ini menyesuaikan kolom
    // tabel users: username, nama, email, no_telepon/no_telp, alamat
    this.personalInfo = [
      { icon: 'person-outline', label: 'Nama Lengkap', value: user.nama || '-' },
      { icon: 'at-outline', label: 'Username', value: user.username || '-' },
      { icon: 'mail-outline', label: 'Email', value: user.email || '-' },
      { icon: 'call-outline', label: 'No. Telepon', value: user.no_telepon || user.no_telp || '-' },
      { icon: 'location-outline', label: 'Alamat', value: user.alamat || '-' },
    ];
  }

  // 🔥 Avatar fallback yang aman dari karakter spasi/spesial di nama
  get avatarUrl(): string {
    if (this.profile.avatar) return this.profile.avatar;
    const nama = encodeURIComponent(this.profile.nama || 'User');
    return `https://ui-avatars.com/api/?name=${nama}&background=2e7d32&color=fff&size=200&bold=true`;
  }

  formatRole(role: string): string {
    if (!role) return '-';
    const roleMap: any = {
      admin: 'Administrator',
      petani: 'Petani',
      pekerja: 'Pekerja',
      user: 'Pengguna'
    };
    return roleMap[role] || role;
  }

  goBack() {
    this.router.navigate(['/user-dashboard']);
  }

  editProfile() {
    console.log('Edit profile clicked');
    // Navigasi ke halaman edit profil
  }

  changeAvatar() {
    console.log('Change avatar clicked');
    // Buka dialog upload foto
  }

  changePassword() {
    console.log('Change password clicked');
    // Navigasi ke halaman ganti password
  }

  notificationSettings() {
    console.log('Notification settings clicked');
    // Navigasi ke halaman pengaturan notifikasi
  }

  securitySettings() {
    console.log('Security settings clicked');
    // Navigasi ke halaman keamanan
  }

  languageSettings() {
    console.log('Language settings clicked');
    // Buka dialog pilihan bahasa
  }

  aboutApp() {
    console.log('About app clicked');
    // Tampilkan dialog tentang aplikasi
  }

  // ============================================
  // 🔥 LOGOUT — HAPUS SEMUA DATA SESI
  // ============================================
  logout() {
    console.log('Logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');   // 🔥 FIX: sebelumnya ini gak dihapus,
                                        // jadi data user lama bisa nyangkut
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}