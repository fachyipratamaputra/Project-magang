import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('panenChart') panenChartRef!: ElementRef;

  isSidebarOpen: boolean = false;
  activeMenu: string = 'beranda';
  todayDate: string = '';
  
  user: any = {};
  isLoading: boolean = true;
  
  totalPekerja: number = 0;
  pekerjaAktif: number = 0;
  totalKehadiran: number = 0;
  kehadiranHadir: number = 0;
  totalPembayaran: number = 0;
  pembayaranBerhasil: number = 0;
  totalLahan: number = 5;
  totalLuasLahan: number = 6.5;
  totalTanaman: number = 8;
  tanamanAktif: number = 6;
  totalPanen: number = 8;
  totalProduksiPanen: number = 1850;
  totalPendapatan: string = '25.5 Jt';

  activities = [
    { icon: 'leaf-outline', type: 'plant', text: 'Menanam padi di lahan seluas 2 hektar', time: '2 jam lalu' },
    { icon: 'checkmark-done-outline', type: 'harvest', text: 'Panen jagung berhasil 500 kg', time: '5 jam lalu' },
    { icon: 'bug-outline', type: 'pest', text: 'Mengatasi hama wereng dengan pestisida organik', time: '1 hari lalu' },
    { icon: 'bulb-outline', type: 'tip', text: 'Mempelajari teknik irigasi tetes modern', time: '2 hari lalu' }
  ];

  popularPlants = [
    { name: 'Padi', detail: '2 hektar • 70 hari', color: 'linear-gradient(135deg, #2e7d32, #66bb6a)', progress: 85, status: 'healthy' },
    { name: 'Jagung', detail: '1.5 hektar • 60 hari', color: 'linear-gradient(135deg, #f57c00, #ffb74d)', progress: 70, status: 'warning' },
    { name: 'Cabai', detail: '0.8 hektar • 45 hari', color: 'linear-gradient(135deg, #c62828, #ef5350)', progress: 95, status: 'healthy' },
    { name: 'Kedelai', detail: '1 hektar • 50 hari', color: 'linear-gradient(135deg, #4a148c, #7b1fa2)', progress: 45, status: 'danger' }
  ];

  tips = [
    { icon: 'water-outline', title: 'Irigasi Tetes Hemat Air', description: 'Sistem irigasi tetes dapat menghemat air hingga 60%' },
    { icon: 'leaf-outline', title: 'Pupuk Organik untuk Hasil Panen', description: 'Gunakan pupuk organik untuk meningkatkan kualitas tanah' },
    { icon: 'bug-outline', title: 'Pengendalian Hama Alami', description: 'Manfaatkan predator alami untuk mengendalikan hama' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    const now = new Date();
    this.todayDate = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit() {
    // 🔥 CEK APAKAH ADA TOKEN
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    if (this.panenChartRef) {
      const ctx = this.panenChartRef.nativeElement.getContext('2d');
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
          datasets: [
            {
              label: 'Hasil Panen (kg)',
              data: [120, 190, 170, 220, 280, 250],
              borderColor: '#2e7d32',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#2e7d32',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 },
                color: '#999'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 },
                color: '#999'
              }
            }
          }
        }
      });
    }
  }

  loadDashboard() {
    this.isLoading = true;
    
    this.apiService.getDashboard().subscribe({
      next: (response: any) => {
        console.log('✅ Dashboard data:', response);
        this.isLoading = false;
        
        if (response?.status === 'success') {
          const data = response.data || {};
          this.totalPekerja = data.total_pekerja || 0;
          this.pekerjaAktif = data.pekerja_aktif || 0;
          this.totalKehadiran = data.total_kehadiran || 0;
          this.kehadiranHadir = data.kehadiran_hadir || 0;
          this.totalPembayaran = data.total_pembayaran || 0;
          this.pembayaranBerhasil = data.pembayaran_berhasil || 0;
        }
      },
      error: (error) => {
        console.error('❌ Dashboard error:', error);
        this.isLoading = false;
        this.totalPekerja = 15;
        this.pekerjaAktif = 13;
        this.totalKehadiran = 0;
        this.kehadiranHadir = 0;
        this.totalPembayaran = 25500000;
        this.pembayaranBerhasil = 7;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goToBeranda() {
    this.activeMenu = 'beranda';
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  goToLahan() {
    this.router.navigate(['/lahan']);
  }

  goToTanaman() {
    this.router.navigate(['/tanaman']);
  }

  goToPanen() {
    this.router.navigate(['/panen']);
  }

  goToKehadiran() {
    this.router.navigate(['/kehadiran']);
  }

  goToPekerja() {
    this.router.navigate(['/pekerja']);
  }

  goToPembayaran() {
    this.router.navigate(['/pembayaran']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'beranda': 'Beranda',
      'profil': 'Profil',
      'lahan': 'Lahan Pertanian',
      'tanaman': 'Tanaman',
      'panen': 'Panen',
      'kehadiran': 'Kehadiran',
      'pekerja': 'Pekerja',
      'pembayaran': 'Pembayaran',
      'bantuan': 'Bantuan',
      'pengaturan': 'Pengaturan'
    };
    return titles[this.activeMenu] || 'Beranda';
  }

  getPageSubtitle(): string {
    const subtitles: { [key: string]: string } = {
      'beranda': 'Kelola aktivitas pertanian Anda',
      'profil': 'Informasi profil petani',
      'lahan': 'Kelola data lahan pertanian',
      'tanaman': 'Kelola data tanaman',
      'panen': 'Catat hasil panen',
      'kehadiran': 'Pantau kehadiran pekerja',
      'pekerja': 'Kelola data pekerja',
      'pembayaran': 'Kelola penggajian karyawan',
      'bantuan': 'Pusat bantuan',
      'pengaturan': 'Pengaturan aplikasi'
    };
    return subtitles[this.activeMenu] || '';
  }

  getMenuIcon(): string {
    const icons: { [key: string]: string } = {
      'profil': 'person-outline',
      'lahan': 'map-outline',
      'tanaman': 'leaf-outline',
      'panen': 'checkmark-done-outline',
      'kehadiran': 'calendar-outline',
      'pekerja': 'people-outline',
      'pembayaran': 'wallet-outline',
      'bantuan': 'help-circle-outline',
      'pengaturan': 'settings-outline'
    };
    return icons[this.activeMenu] || 'home-outline';
  }

  // 🔥 LOGOUT - HAPUS TOKEN DAN REDIRECT KE LOGIN
  logout() {
    // Hapus semua data
    this.apiService.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 🔥 NAVIGASI KE LOGIN DENGAN REPLACEURL
    this.router.navigate(['/login'], { replaceUrl: true });
    
    // 🔥 BERSIHKAN HISTORY BROWSER
    setTimeout(() => {
      window.history.pushState(null, '', window.location.href);
    }, 100);
  }
}