import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {
  isEditing: boolean = false;

  profileData = {
    nama: 'FACHYI PRATAMA PUTRA',
    role: 'Petani Profesional',
    status: 'Aktif',
    avatar: ''
  };

  infoItems = [
    { 
      icon: 'person-outline', 
      label: 'Nama Lengkap', 
      value: 'FACHYI PRATAMA PUTRA',
      type: 'text'
    },
    { 
      icon: 'at-outline', 
      label: 'Username', 
      value: 'fachyipetani',
      type: 'text'
    },
    { 
      icon: 'mail-outline', 
      label: 'Email', 
      value: 'fachyi.petani@email.com',
      type: 'email'
    },
    { 
      icon: 'call-outline', 
      label: 'No. Telepon', 
      value: '0812-3456-7890',
      type: 'tel'
    },
    { 
      icon: 'location-outline', 
      label: 'Alamat', 
      value: 'Perum KSB C39 No.17',
      type: 'text'
    },
    { 
      icon: 'calendar-outline', 
      label: 'Tempat & Tanggal Lahir', 
      value: 'Kota Tegal, 22 Februari 2006',
      type: 'text'
    },
    { 
      icon: 'people-outline', 
      label: 'Agama', 
      value: 'Islam',
      type: 'text'
    },
    { 
      icon: 'male-outline', 
      label: 'Jenis Kelamin', 
      value: 'Laki-laki',
      type: 'text'
    },
    { 
      icon: 'school-outline', 
      label: 'Asal SLTA', 
      value: 'SMAN 4 TEGAL',
      type: 'text'
    },
    { 
      icon: 'calendar-outline', 
      label: 'Tanggal Terdaftar', 
      value: '26 Juli 2024',
      type: 'text'
    },
    { 
      icon: 'flag-outline', 
      label: 'Warga Negara', 
      value: 'Indonesia',
      type: 'text'
    },
    { 
      icon: 'leaf-outline', 
      label: 'Spesialisasi Tanaman', 
      value: 'Padi, Jagung, Cabai',
      type: 'text'
    }
  ];

  settingsMenu = [
    {
      icon: 'notifications-outline',
      label: 'Notifikasi',
      description: 'Atur notifikasi aplikasi',
      color: 'blue',
      action: () => this.showToast('Pengaturan Notifikasi')
    },
    {
      icon: 'lock-closed-outline',
      label: 'Keamanan',
      description: 'Ubah password & keamanan akun',
      color: 'orange',
      action: () => this.showToast('Pengaturan Keamanan')
    },
    {
      icon: 'color-palette-outline',
      label: 'Tema',
      description: 'Ubah tema tampilan aplikasi',
      color: 'purple',
      action: () => this.showToast('Pengaturan Tema')
    },
    {
      icon: 'water-outline',
      label: 'Manajemen Lahan',
      description: 'Atur data lahan pertanian',
      color: 'teal',
      action: () => this.showToast('Manajemen Lahan')
    },
    {
      icon: 'help-circle-outline',
      label: 'Bantuan & FAQ',
      description: 'Pusat bantuan dan pertanyaan',
      color: 'green',
      action: () => this.showToast('Pusat Bantuan')
    },
    {
      icon: 'information-circle-outline',
      label: 'Tentang Aplikasi',
      description: 'Informasi tentang Petani App',
      color: 'red',
      action: () => this.showToast('Tentang Aplikasi')
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  cancelEdit() {
    this.isEditing = false;
    // Reset ke default
    this.infoItems = [
      { 
        icon: 'person-outline', 
        label: 'Nama Lengkap', 
        value: 'FACHYI PRATAMA PUTRA',
        type: 'text'
      },
      { 
        icon: 'at-outline', 
        label: 'Username', 
        value: 'fachyipetani',
        type: 'text'
      },
      { 
        icon: 'mail-outline', 
        label: 'Email', 
        value: 'fachyi.petani@email.com',
        type: 'email'
      },
      { 
        icon: 'call-outline', 
        label: 'No. Telepon', 
        value: '0812-3456-7890',
        type: 'tel'
      },
      { 
        icon: 'location-outline', 
        label: 'Alamat', 
        value: 'Perum KSB C39 No.17',
        type: 'text'
      },
      { 
        icon: 'calendar-outline', 
        label: 'Tempat & Tanggal Lahir', 
        value: 'Kota Tegal, 22 Februari 2006',
        type: 'text'
      },
      { 
        icon: 'people-outline', 
        label: 'Agama', 
        value: 'Islam',
        type: 'text'
      },
      { 
        icon: 'male-outline', 
        label: 'Jenis Kelamin', 
        value: 'Laki-laki',
        type: 'text'
      },
      { 
        icon: 'school-outline', 
        label: 'Asal SLTA', 
        value: 'SMAN 4 TEGAL',
        type: 'text'
      },
      { 
        icon: 'calendar-outline', 
        label: 'Tanggal Terdaftar', 
        value: '26 Juli 2024',
        type: 'text'
      },
      { 
        icon: 'flag-outline', 
        label: 'Warga Negara', 
        value: 'Indonesia',
        type: 'text'
      },
      { 
        icon: 'leaf-outline', 
        label: 'Spesialisasi Tanaman', 
        value: 'Padi, Jagung, Cabai',
        type: 'text'
      }
    ];
  }

  saveProfile() {
    this.isEditing = false;
    console.log('Profil disimpan:', this.infoItems);
    const nameItem = this.infoItems.find(item => item.label === 'Nama Lengkap');
    if (nameItem) {
      this.profileData.nama = nameItem.value;
    }
    this.showToast('✅ Profil berhasil disimpan!');
  }

  changeAvatar() {
    console.log('Ganti avatar');
    this.showToast('📸 Fitur ganti avatar segera hadir!');
  }

  logout() {
    console.log('Logout');
    this.router.navigate(['/login']);
  }

  showToast(message: string) {
    alert(message);
  }
}