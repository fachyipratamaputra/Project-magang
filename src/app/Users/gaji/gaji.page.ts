import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-gaji-users',
  templateUrl: './gaji.page.html',
  styleUrls: ['./gaji.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GajiUsersPage implements OnInit {
  // ===== USER =====
  user: any = {
    nama: 'Pekerja',
    id: 'PK-001',
    posisi: 'Pemilik Lahan',
    lahan: 'Lahan A'
  };

  // ===== DATA =====
  dataGaji: any[] = [];
  dataAsli: any[] = [];
  isLoading: boolean = true;
  bulanSekarang: string = '';

  // ===== RINGKASAN =====
  totalGaji: number = 0;
  gajiDibayar: number = 0;
  gajiBelumDibayar: number = 0;
  persentasePembayaran: number = 0;

  // ===== FILTER =====
  filterPeriode: string = 'all';
  filterStatus: string = '';

  // ===== PAGINATION =====
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalData: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = { ...this.user, ...JSON.parse(userData) };
    }

    const now = new Date();
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.bulanSekarang = `${bulan[now.getMonth()]} ${now.getFullYear()}`;

    this.loadData();
  }

  // ============================================
  // 🔥 LOAD DATA - sudah dengan try/catch + finally
  // biar isLoading SELALU direset apapun yang terjadi
  // ============================================
  loadData() {
    this.isLoading = true;
    const pekerjaId = this.user?.id || 1;

    this.apiService.getPembayaranByPekerja(pekerjaId).subscribe({
      next: (res: any) => {
        try {
          // Backend bisa balikin array (data: [...]) atau object tunggal (data: {...} / null)
          // jadi kita pastikan hasilnya selalu array sebelum diproses
          const raw = res?.data ?? res ?? [];
          const data = Array.isArray(raw) ? raw : (raw ? [raw] : []);
          this.processData(data);
        } catch (e) {
          console.error('❌ Gagal memproses data gaji:', e);
          this.setDummyData();
        } finally {
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('❌ Gagal memuat data gaji:', err);
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
      periode: item.periode || this.generatePeriode(item.tanggal_bayar),
      jumlah: item.jumlah || 0,
      tanggal_bayar: item.tanggal_bayar ? this.formatTanggal(item.tanggal_bayar) : '-',
      status: item.status || 'pending',
      rawDate: item.tanggal_bayar
    }));

    // Hitung ringkasan
    this.totalGaji = this.dataAsli.reduce((sum: number, item: any) => sum + item.jumlah, 0);
    this.gajiDibayar = this.dataAsli
      .filter((item: any) => item.status === 'dibayar')
      .reduce((sum: number, item: any) => sum + item.jumlah, 0);
    this.gajiBelumDibayar = this.dataAsli
      .filter((item: any) => item.status !== 'dibayar')
      .reduce((sum: number, item: any) => sum + item.jumlah, 0);

    this.persentasePembayaran = this.totalGaji > 0 
      ? Math.round((this.gajiDibayar / this.totalGaji) * 100) 
      : 0;

    // Terapkan filter
    this.applyFilter();
  }

  // ============================================
  // FILTER
  // ============================================
  applyFilter() {
    let filtered = [...this.dataAsli];

    // Filter periode
    if (this.filterPeriode === 'month') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = filtered.filter((item: any) => {
        if (!item.rawDate) return false;
        const date = new Date(item.rawDate);
        return date >= monthStart && date <= monthEnd;
      });
    } else if (this.filterPeriode === '3months') {
      const now = new Date();
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filtered = filtered.filter((item: any) => {
        if (!item.rawDate) return false;
        const date = new Date(item.rawDate);
        return date >= threeMonthsAgo && date <= now;
      });
    } else if (this.filterPeriode === '6months') {
      const now = new Date();
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      filtered = filtered.filter((item: any) => {
        if (!item.rawDate) return false;
        const date = new Date(item.rawDate);
        return date >= sixMonthsAgo && date <= now;
      });
    } else if (this.filterPeriode === 'year') {
      const now = new Date();
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      filtered = filtered.filter((item: any) => {
        if (!item.rawDate) return false;
        const date = new Date(item.rawDate);
        return date >= yearStart && date <= yearEnd;
      });
    }

    // Filter status
    if (this.filterStatus) {
      filtered = filtered.filter((item: any) => item.status === this.filterStatus);
    }

    // Urutkan dari terbaru
    filtered.sort((a: any, b: any) => {
      if (!a.rawDate) return 1;
      if (!b.rawDate) return -1;
      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    });

    this.totalData = filtered.length;
    this.dataGaji = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilter() {
    this.filterPeriode = 'all';
    this.filterStatus = '';
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
    this.dataGaji = this.dataAsli.slice(this.startIndex, this.endIndex);
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
  // ACTIONS
  // ============================================
  lihatDetail(item: any) {
    console.log('Detail gaji:', item);
    // Implementasi detail gaji
  }

  exportData() {
    console.log('Export data gaji');
    // Implementasi export CSV/Excel
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

  generatePeriode(dateStr?: string): string {
    if (dateStr) {
      const date = new Date(dateStr);
      const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${bulan[date.getMonth()]} ${date.getFullYear()}`;
    }
    const now = new Date();
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${bulan[now.getMonth()]} ${now.getFullYear()}`;
  }

  // ============================================
  // DATA DUMMY (fallback kalau API gagal)
  // ============================================
  setDummyData() {
    const dummyData = [
      { id: 1, periode: 'Jul 2026', jumlah: 3500000, tanggal_bayar: '2026-07-25', status: 'dibayar', rawDate: '2026-07-25' },
      { id: 2, periode: 'Jun 2026', jumlah: 3500000, tanggal_bayar: '2026-06-25', status: 'dibayar', rawDate: '2026-06-25' },
      { id: 3, periode: 'Mei 2026', jumlah: 3500000, tanggal_bayar: '2026-05-25', status: 'dibayar', rawDate: '2026-05-25' },
      { id: 4, periode: 'Apr 2026', jumlah: 3000000, tanggal_bayar: '2026-04-25', status: 'pending', rawDate: '2026-04-25' },
      { id: 5, periode: 'Mar 2026', jumlah: 3000000, tanggal_bayar: '2026-03-25', status: 'dibayar', rawDate: '2026-03-25' },
      { id: 6, periode: 'Feb 2026', jumlah: 3000000, tanggal_bayar: '2026-02-25', status: 'dibayar', rawDate: '2026-02-25' }
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