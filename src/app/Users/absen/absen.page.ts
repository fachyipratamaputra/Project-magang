import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-absensi-users',
  templateUrl: './absen.page.html',
  styleUrls: ['./absen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AbsensiUsersPage implements OnInit {
  // ===== USER =====
  user: any = {
    nama: 'Fachyi Pratama Putra',
    id: 'PK-001',
    posisi: 'Pemilik Lahan',
    lahan: 'Lahan A'
  };

  // ===== STATISTIK =====
  totalLahan: number = 0;
  totalHadir: number = 0;
  totalTidakHadir: number = 0;
  persentaseKehadiran: number = 0;

  // ===== DATA =====
  dataKehadiran: any[] = [];
  dataAsli: any[] = [];
  isLoading: boolean = true;

  // ===== FILTER =====
  filterLahan: string = '';
  filterStatus: string = '';
  filterPeriode: string = 'month';
  daftarLahan: string[] = ['Lahan A', 'Lahan B', 'Lahan C'];

  // ===== PAGINATION =====
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalData: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Ambil data user
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

    this.apiService.getKehadiranByPekerja(pekerjaId).subscribe({
      next: (res: any) => {
        try {
          const data = res?.data ?? res ?? [];
          this.processData(data);
        } catch (procErr) {
          // 🔥 FIX: kalau processData gagal (misal format data gak sesuai),
          // tangkap di sini supaya isLoading tetap dimatikan dan spinner
          // tidak muter selamanya.
          console.error('Gagal memproses data kehadiran:', procErr);
          this.setDummyData();
        } finally {
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('Gagal memuat data:', err);
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
  processData(data: any) {
    // 🔥 FIX: pastikan selalu array, apapun bentuk response dari backend
    // (bisa jadi backend balikin objek tunggal, null, atau array)
    let arr: any[];
    if (Array.isArray(data)) {
      arr = data;
    } else if (data) {
      arr = [data];
    } else {
      arr = [];
    }

    // Mapping data ke format tabel
    this.dataAsli = arr.map((item: any) => ({
      id: item.id || Math.random(),
      lahan: item.lahan || 'Lahan A',
      tanaman: item.tanaman || 'Padi',
      kegiatan: item.kegiatan || 'Bekerja',
      tanggal: this.formatTanggal(item.tanggal),
      status: item.status || 'belum',
      rawDate: item.tanggal
    }));

    // Hitung statistik
    this.totalLahan = [...new Set(this.dataAsli.map((d: any) => d.lahan))].length;
    this.totalHadir = this.dataAsli.filter((d: any) => d.status === 'hadir').length;
    this.totalTidakHadir = this.dataAsli.filter((d: any) => d.status === 'tidak' || d.status === 'alfa').length;

    const total = this.dataAsli.length;
    this.persentaseKehadiran = total > 0 ? Math.round((this.totalHadir / total) * 100) : 0;

    // Terapkan filter
    this.applyFilter();
  }

  // ============================================
  // FILTER
  // ============================================
  applyFilter() {
    let filtered = [...this.dataAsli];

    // Filter lahan
    if (this.filterLahan) {
      filtered = filtered.filter((d: any) => d.lahan === this.filterLahan);
    }

    // Filter status
    if (this.filterStatus) {
      filtered = filtered.filter((d: any) => d.status === this.filterStatus);
    }

    // Filter periode
    if (this.filterPeriode === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((d: any) => d.rawDate === today);
    } else if (this.filterPeriode === 'week') {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() + (6 - now.getDay()));
      filtered = filtered.filter((d: any) => {
        const date = new Date(d.rawDate);
        return date >= weekStart && date <= weekEnd;
      });
    } else if (this.filterPeriode === 'month') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = filtered.filter((d: any) => {
        const date = new Date(d.rawDate);
        return date >= monthStart && date <= monthEnd;
      });
    }

    // Urutkan dari terbaru
    filtered.sort((a: any, b: any) => {
      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    });

    this.totalData = filtered.length;
    this.dataKehadiran = filtered;

    // Pagination
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilter() {
    this.filterLahan = '';
    this.filterStatus = '';
    this.filterPeriode = 'month';
    this.applyFilter();
  }

  // ============================================
  // PAGINATION
  // ============================================
  get startIndex(): number {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.rowsPerPage, this.totalData);
  }

  get totalPages(): number {
    return Math.ceil(this.totalData / this.rowsPerPage);
  }

  updatePagination() {
    this.dataKehadiran = this.dataAsli.slice(this.startIndex, this.endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onRowsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  // ============================================
  // ABSEN
  // ============================================
  absen(status: string) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const waktu = now.toTimeString().slice(0, 5);

    // Cek apakah sudah absen hari ini
    const sudahAbsen = this.dataAsli.some((d: any) => d.rawDate === today);
    if (sudahAbsen) {
      console.log('Anda sudah absen hari ini');
      return;
    }

    const data = {
      pekerja_id: this.user?.id || 1,
      tanggal: today,
      status: status,
      waktu: waktu,
      lahan: this.user?.lahan || 'Lahan A',
      tanaman: 'Padi',
      kegiatan: 'Bekerja'
    };

    this.apiService.absen(data).subscribe({
      next: (res: any) => {
        console.log('Absen berhasil:', res);
        this.loadData();
      },
      error: (err: any) => {
        console.error('Gagal absen:', err);
        // Untuk testing, tambahkan data dummy
        this.dataAsli.push({
          id: Math.random(),
          lahan: data.lahan,
          tanaman: data.tanaman,
          kegiatan: data.kegiatan,
          tanggal: this.formatTanggal(today),
          status: status,
          rawDate: today
        });
        this.applyFilter();
      }
    });
  }

  ubahStatus(item: any) {
    console.log('Ubah status:', item);
    // Implementasi edit status
  }

  // ============================================
  // EXPORT
  // ============================================
  exportData() {
    console.log('Export data');
    // Implementasi export ke CSV/Excel
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  formatTanggal(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const bulan = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  }

  // ============================================
  // DATA DUMMY
  // ============================================
  setDummyData() {
    const dummyData = [];
    const statuses = ['hadir', 'hadir', 'hadir', 'izin', 'hadir', 'tidak', 'hadir', 'sakit', 'hadir', 'hadir'];
    const lahanList = ['Lahan A', 'Lahan B', 'Lahan A', 'Lahan C', 'Lahan A', 'Lahan B', 'Lahan A', 'Lahan C', 'Lahan A', 'Lahan B'];
    const tanamanList = ['Padi', 'Jagung', 'Padi', 'Kedelai', 'Padi', 'Jagung', 'Padi', 'Kedelai', 'Padi', 'Jagung'];

    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dummyData.push({
        id: i + 1,
        lahan: lahanList[i % lahanList.length],
        tanaman: tanamanList[i % tanamanList.length],
        kegiatan: 'Bekerja',
        tanggal: date.toISOString().split('T')[0],
        status: statuses[i % statuses.length],
        rawDate: date.toISOString().split('T')[0]
      });
    }

    this.processData(dummyData);
  }

  // ============================================
  // NAVIGASI
  // ============================================
  goBack() {
    this.router.navigate(['/user-dashboard']);
  }
}