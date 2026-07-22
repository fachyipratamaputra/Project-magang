import { Component, OnInit } from '@angular/core';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserDashboardPage implements OnInit, ViewWillEnter {
  isSidebarOpen: boolean = false;
  activeMenu: string = 'dashboard';
  todayDate: string = '';
  isLoading: boolean = true;

  user: any = {
    nama: 'Pekerja',
    posisi: 'Pemilik Lahan'
  };

  // ===== STATISTIK =====
  hadirBulanIni: number = 0;
  totalHariKerja: number = 0;
  gajiBelumDibayar: number = 0;
  totalLahanDikelola: number = 0;
  notifikasiBelumDibaca: number = 0;

  // ===== RIWAYAT AKTIVITAS =====
  aktivitasTerbaru: any[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.todayDate = now.toLocaleDateString('id-ID', options);

    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    this.loadDashboardData();
  }

  // 🔥 PERBAIKI INI - Reset activeMenu ke dashboard
  ionViewWillEnter() {
    // Reset active menu ke dashboard setiap kali halaman ditampilkan
    this.activeMenu = 'dashboard';
  }

  // ============================================
  // LOAD SEMUA DATA DASHBOARD
  // ============================================
  loadDashboardData() {
    this.isLoading = true;
    const pekerjaId = this.user?.id || 1;

    this.apiService.getKehadiranByPekerja(pekerjaId).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.totalHariKerja = data.length;
        this.hadirBulanIni = data.filter((k: any) => k.status === 'hadir').length;

        const riwayatKehadiran = [...data]
          .sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
          .slice(0, 3)
          .map((k: any) => ({
            icon: k.status === 'hadir' ? 'checkmark-circle-outline' : 'time-outline',
            type: k.status === 'hadir' ? 'hadir' : 'lainnya',
            text: `Kehadiran: ${k.status === 'hadir' ? 'Hadir' : k.status}`,
            time: this.formatTanggal(k.tanggal)
          }));

        this.aktivitasTerbaru = [...this.aktivitasTerbaru, ...riwayatKehadiran];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Gagal memuat kehadiran:', err);
        this.isLoading = false;
        this.setDummyData();
      }
    });

    this.apiService.getPembayaranByPekerja(pekerjaId).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.gajiBelumDibayar = data
          .filter((g: any) => g.status !== 'dibayar')
          .reduce((total: number, g: any) => total + (g.jumlah || 0), 0);
      },
      error: (err: any) => console.error('Gagal memuat gaji:', err)
    });

    this.apiService.getCountNotifikasiPending().subscribe({
      next: (res: any) => {
        this.notifikasiBelumDibaca = res?.data?.total || 0;
      },
      error: (err: any) => console.error('Gagal memuat notifikasi:', err)
    });
  }

  // ===== Data dummy untuk testing =====
  setDummyData() {
    this.totalHariKerja = 22;
    this.hadirBulanIni = 18;
    this.gajiBelumDibayar = 2500000;
    this.notifikasiBelumDibaca = 3;
    this.aktivitasTerbaru = [
      {
        icon: 'checkmark-circle-outline',
        type: 'hadir',
        text: 'Kehadiran: Hadir',
        time: '21 Juli 2026'
      },
      {
        icon: 'time-outline',
        type: 'lainnya',
        text: 'Kehadiran: Izin',
        time: '20 Juli 2026'
      },
      {
        icon: 'checkmark-circle-outline',
        type: 'hadir',
        text: 'Kehadiran: Hadir',
        time: '19 Juli 2026'
      }
    ];
  }

  formatTanggal(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const bulan = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }

    // ===== NAVIGASI KE HALAMAN =====
    if (menu === 'profil') {
      this.router.navigate(['/user-profil']);
    } else if (menu === 'absensi') {
      this.router.navigate(['/user-absensi']);
    } else if (menu === 'gaji') {
      this.router.navigate(['/user-gaji']);
    } else if (menu === 'lahan') {
      this.router.navigate(['/user-lahan']);
    } else if (menu === 'berita') {
      this.router.navigate(['/user-berita']);
    } else if (menu === 'notifikasi') {
      this.router.navigate(['/user-notifikasi']);
    } else if (menu === 'pengaturan') {
      // Belum ada halaman pengaturan
    }
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      profil: 'Profil',
      absensi: 'Absensi',
      gaji: 'Gaji',
      lahan: 'Lahan',
      berita: 'Berita',
      notifikasi: 'Notifikasi',
      pengaturan: 'Pengaturan'
    };
    return titles[this.activeMenu] || 'Dashboard';
  }

  getMenuIcon(): string {
    const icons: { [key: string]: string } = {
      dashboard: 'grid-outline',
      profil: 'person-outline',
      absensi: 'calendar-outline',
      gaji: 'cash-outline',
      lahan: 'leaf-outline',
      berita: 'newspaper-outline',
      notifikasi: 'notifications-outline',
      pengaturan: 'settings-outline'
    };
    return icons[this.activeMenu] || 'grid-outline';
  }

  logout() {
    this.apiService.clearToken();
    localStorage.removeItem('user');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}