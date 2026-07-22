import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-lahan-users',
  templateUrl: './lahan.page.html',
  styleUrls: ['./lahan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LahanUsersPage implements OnInit {
  // ===== USER =====
  user: any = {
    nama: 'Pekerja',
    id: 'PK-001',
    posisi: 'Pemilik Lahan'
  };

  // ===== DATA =====
  dataLahan: any[] = [];
  dataAsli: any[] = [];
  isLoading: boolean = true;

  // ===== RINGKASAN =====
  totalLahan: number = 0;
  totalLuas: number = 0;
  lahanAktif: number = 0;
  lahanDitanami: number = 0;

  // ===== FILTER =====
  filterStatus: string = '';
  filterSort: string = 'terbaru';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = { ...this.user, ...JSON.parse(userData) };
    }

    this.loadData();
  }

  // ============================================
  // LOAD DATA
  // ============================================
  loadData() {
    this.isLoading = true;
    const pekerjaId = this.user?.id || 1;

    this.apiService.getLahanByPekerja(pekerjaId).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.processData(data);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Gagal memuat data lahan:', err);
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
    // Mapping data
    this.dataAsli = data.map((item: any) => ({
      id: item.id || Math.random(),
      nama: item.nama || `Lahan ${item.id || ''}`,
      lokasi: item.lokasi || 'Lokasi tidak tersedia',
      luas: item.luas || 0,
      status: item.status || 'aktif',
      tanaman: item.tanaman || '-',
      tanggal_tanam: item.tanggal_tanam ? this.formatTanggal(item.tanggal_tanam) : '-',
      progress: item.progress || 0,
      gambar: item.gambar || 'assets/default-lahan.jpg',
      rawDate: item.created_at || new Date().toISOString()
    }));

    // Hitung ringkasan
    this.totalLahan = this.dataAsli.length;
    this.totalLuas = this.dataAsli.reduce((sum: number, item: any) => sum + item.luas, 0);
    this.lahanAktif = this.dataAsli.filter((item: any) => item.status === 'aktif').length;
    this.lahanDitanami = this.dataAsli.filter((item: any) => item.status === 'ditanami').length;

    // Terapkan filter
    this.applyFilter();
  }

  // ============================================
  // FILTER
  // ============================================
  applyFilter() {
    let filtered = [...this.dataAsli];

    // Filter status
    if (this.filterStatus) {
      filtered = filtered.filter((item: any) => item.status === this.filterStatus);
    }

    // Sorting
    if (this.filterSort === 'terbaru') {
      filtered.sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    } else if (this.filterSort === 'terlama') {
      filtered.sort((a: any, b: any) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
    } else if (this.filterSort === 'luas_terbesar') {
      filtered.sort((a: any, b: any) => b.luas - a.luas);
    } else if (this.filterSort === 'luas_terkecil') {
      filtered.sort((a: any, b: any) => a.luas - b.luas);
    }

    this.dataLahan = filtered;
  }

  resetFilter() {
    this.filterStatus = '';
    this.filterSort = 'terbaru';
    this.applyFilter();
  }

  // ============================================
  // ACTIONS
  // ============================================
  lihatDetail(item: any) {
    console.log('Detail lahan:', item);
    // Implementasi detail lahan
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-lahan.jpg';
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  formatTanggal(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
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
        nama: 'Lahan Padi Sawah',
        lokasi: 'Desa Sukamaju, Blok A',
        luas: 2.5,
        status: 'aktif',
        tanaman: 'Padi',
        tanggal_tanam: '2026-06-15',
        progress: 75,
        created_at: '2026-06-15'
      },
      {
        id: 2,
        nama: 'Lahan Jagung',
        lokasi: 'Desa Sukamaju, Blok B',
        luas: 1.8,
        status: 'ditanami',
        tanaman: 'Jagung',
        tanggal_tanam: '2026-07-01',
        progress: 30,
        created_at: '2026-07-01'
      },
      {
        id: 3,
        nama: 'Lahan Kedelai',
        lokasi: 'Desa Sukamaju, Blok C',
        luas: 1.2,
        status: 'panen',
        tanaman: 'Kedelai',
        tanggal_tanam: '2026-03-10',
        progress: 100,
        created_at: '2026-03-10'
      },
      {
        id: 4,
        nama: 'Lahan Cabai',
        lokasi: 'Desa Sukamaju, Blok D',
        luas: 0.8,
        status: 'istirahat',
        tanaman: '-',
        tanggal_tanam: '-',
        progress: 0,
        created_at: '2026-05-20'
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