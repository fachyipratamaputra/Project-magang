import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-notifikasi-users',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NotifikasiUsersPage implements OnInit {
  // ===== DATA =====
  dataNotifikasi: any[] = [];
  dataAsli: any[] = [];
  isLoading: boolean = true;

  // ===== STATISTIK =====
  totalNotifikasi: number = 0;
  totalPending: number = 0;
  totalApprove: number = 0;
  totalReject: number = 0;

  // ===== FILTER =====
  filterStatusSelected: string = '';
  filterSort: string = 'terbaru';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // ============================================
  // LOAD DATA
  // ============================================
  loadData() {
    this.isLoading = true;
    const userId = this.getUserId();

    this.apiService.getNotifikasiByUser(userId).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.processData(data);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Gagal memuat notifikasi:', err);
        this.isLoading = false;
        this.setDummyData();
      }
    });
  }

  refreshData() {
    this.loadData();
  }

  // ============================================
  // PROCESS DATA
  // ============================================
  processData(data: any[]) {
    this.dataAsli = data.map((item: any) => ({
      id: item.id || Math.random(),
      title: item.title || 'Notifikasi',
      message: item.message || '',
      type: item.type || 'info',
      status: item.status || 'pending',
      is_read: item.is_read || false,
      time: this.formatTime(item.created_at || new Date().toISOString()),
      rawDate: item.created_at || new Date().toISOString()
    }));

    // Hitung statistik
    this.totalNotifikasi = this.dataAsli.length;
    this.totalPending = this.dataAsli.filter((item: any) => item.status === 'pending').length;
    this.totalApprove = this.dataAsli.filter((item: any) => item.status === 'approve').length;
    this.totalReject = this.dataAsli.filter((item: any) => item.status === 'reject').length;

    // Terapkan filter
    this.applyFilter();
  }

  // ============================================
  // FILTER
  // ============================================
  applyFilter() {
    let filtered = [...this.dataAsli];

    // Filter status
    if (this.filterStatusSelected) {
      filtered = filtered.filter((item: any) => item.status === this.filterStatusSelected);
    }

    // Sorting
    if (this.filterSort === 'terbaru') {
      filtered.sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    } else if (this.filterSort === 'terlama') {
      filtered.sort((a: any, b: any) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
    }

    this.dataNotifikasi = filtered;
  }

  filterStatus(status: string) {
    this.filterStatusSelected = status;
    this.applyFilter();
  }

  resetFilter() {
    this.filterStatusSelected = '';
    this.filterSort = 'terbaru';
    this.applyFilter();
  }

  // ============================================
  // ACTIONS
  // ============================================
  lihatDetail(item: any) {
    // Tandai sebagai dibaca
    if (!item.is_read) {
      this.apiService.markNotifikasiRead(item.id).subscribe({
        next: () => {
          item.is_read = true;
          // Update statistik
          this.totalPending = this.dataAsli.filter((d: any) => d.status === 'pending' && !d.is_read).length;
        },
        error: (err: any) => console.error('Gagal menandai notifikasi:', err)
      });
    }

    // Navigasi ke detail atau halaman terkait
    console.log('Detail notifikasi:', item);
  }

  markAllRead() {
    const unreadIds = this.dataAsli
      .filter((item: any) => !item.is_read)
      .map((item: any) => item.id);

    if (unreadIds.length === 0) return;

    this.apiService.markAllNotifikasiRead(unreadIds).subscribe({
      next: () => {
        this.dataAsli.forEach((item: any) => {
          if (!item.is_read) item.is_read = true;
        });
        this.totalPending = 0;
        this.applyFilter();
      },
      error: (err: any) => console.error('Gagal menandai semua:', err)
    });
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || 1;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'info': return 'information-circle-outline';
      case 'success': return 'checkmark-circle-outline';
      case 'warning': return 'warning-outline';
      case 'danger': return 'alert-circle-outline';
      case 'approve': return 'checkmark-circle-outline';
      case 'reject': return 'close-circle-outline';
      default: return 'notifications-outline';
    }
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Jika kurang dari 1 menit
    if (diff < 60000) {
      return 'Baru saja';
    }
    // Jika kurang dari 1 jam
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} menit lalu`;
    }
    // Jika kurang dari 1 hari
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} jam lalu`;
    }
    // Jika kurang dari 7 hari
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} hari lalu`;
    }

    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  }

  // ============================================
  // DATA DUMMY
  // ============================================
  setDummyData() {
    const dummyData = [
      {
        id: 1,
        title: '✅ Berita Disetujui',
        message: 'Berita "Panen Raya Padi Berhasil" telah disetujui oleh Admin dan akan ditampilkan di website.',
        type: 'success',
        status: 'approve',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      },
      {
        id: 2,
        title: '⏳ Berita Menunggu Review',
        message: 'Berita "Teknologi Irigasi Tetes Modern" sedang dalam proses review oleh Admin.',
        type: 'warning',
        status: 'pending',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: 3,
        title: '❌ Berita Ditolak',
        message: 'Berita "Harga Pupuk Naik 15%" ditolak oleh Admin karena tidak sesuai dengan pedoman penulisan.',
        type: 'danger',
        status: 'reject',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 4,
        title: '✅ Berita Disetujui',
        message: 'Berita "Ketahanan Pangan Nasional" telah disetujui oleh Admin dan akan ditampilkan di website.',
        type: 'success',
        status: 'approve',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: 5,
        title: '📢 Pengumuman',
        message: 'Admin mengumumkan bahwa pendaftaran program pelatihan pertanian dibuka hingga 31 Juli 2026.',
        type: 'info',
        status: 'approve',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
      }
    ];

    this.processData(dummyData);
  }

  // ============================================
  // NAVIGASI
  // ============================================
  goBack() {
    this.router.navigate(['/user-dashboard']);
  }
}