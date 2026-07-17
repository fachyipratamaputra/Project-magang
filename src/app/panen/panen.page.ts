import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panen',
  templateUrl: './panen.page.html',
  styleUrls: ['./panen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PanenPage implements OnInit {
  // ===== DATA =====
  panen: any[] = [];
  filteredPanen: any[] = [];
  tanamanList: string[] = ['Padi', 'Jagung', 'Cabai', 'Kedelai', 'Kacang Tanah', 'Mentimun', 'Tomat', 'Bayam'];
  
  // ===== STATISTIK =====
  panenBerhasil: number = 0;
  panenProses: number = 0;
  totalProduksi: number = 0;

  // ===== FILTER =====
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedTanaman: string = 'semua';

  // ===== PAGINATION =====
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // ===== MODAL =====
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  formData: any = {
    tanaman: '',
    tanggal: '',
    jumlah: '',
    lahan: 'Lahan A',
    status: 'berhasil',
    warna: '#2e7d32'
  };
  editIndex: number = -1;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initData();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ============================================
  // INIT DATA
  // ============================================
  initData() {
    this.panen = [
      { tanaman: 'Padi', tanggal: '2026-07-15', jumlah: 500, lahan: 'Lahan A', status: 'berhasil', warna: '#2e7d32' },
      { tanaman: 'Jagung', tanggal: '2026-07-12', jumlah: 350, lahan: 'Lahan B', status: 'proses', warna: '#f57c00' },
      { tanaman: 'Cabai', tanggal: '2026-07-10', jumlah: 200, lahan: 'Lahan C', status: 'berhasil', warna: '#c62828' },
      { tanaman: 'Kedelai', tanggal: '2026-07-08', jumlah: 150, lahan: 'Lahan A', status: 'berhasil', warna: '#7b1fa2' },
      { tanaman: 'Kacang Tanah', tanggal: '2026-07-05', jumlah: 100, lahan: 'Lahan B', status: 'berhasil', warna: '#0277bd' },
      { tanaman: 'Mentimun', tanggal: '2026-07-03', jumlah: 80, lahan: 'Lahan C', status: 'proses', warna: '#2e7d32' },
      { tanaman: 'Tomat', tanggal: '2026-06-28', jumlah: 120, lahan: 'Lahan A', status: 'berhasil', warna: '#c62828' },
      { tanaman: 'Bayam', tanggal: '2026-06-25', jumlah: 50, lahan: 'Lahan B', status: 'gagal', warna: '#2e7d32' }
    ];
    this.filteredPanen = [...this.panen];
  }

  // ============================================
  // STATISTIK
  // ============================================
  hitungStatistik() {
    this.panenBerhasil = this.panen.filter(p => p.status === 'berhasil').length;
    this.panenProses = this.panen.filter(p => p.status === 'proses').length;
    this.totalProduksi = this.panen.reduce((sum, p) => sum + p.jumlah, 0);
  }

  // ============================================
  // FILTER
  // ============================================
  toggleFilter() { this.showFilter = !this.showFilter; }

  onFilterChange() {
    this.currentPage = 1;
    this.filterData();
    this.calculatePagination();
  }

  filterData() {
    let data = [...this.panen];
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }
    if (this.selectedTanaman !== 'semua') {
      data = data.filter(item => item.tanaman === this.selectedTanaman);
    }
    this.filteredPanen = data;
  }

  // ============================================
  // PAGINATION
  // ============================================
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredPanen.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredPanen.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredPanen.length);
    return `${start} - ${end} of ${this.filteredPanen.length}`;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  onRowsPerPageChange() { this.currentPage = 1; this.calculatePagination(); }

  // ============================================
  // MODAL - TAMBAH / EDIT
  // ============================================
  openTambahModal() {
    this.isEditing = false;
    this.formData = { tanaman: '', tanggal: '', jumlah: '', lahan: 'Lahan A', status: 'berhasil', warna: '#2e7d32' };
    this.isModalOpen = true;
  }

  editPanen(item: any) {
    this.isEditing = true;
    this.editIndex = this.panen.indexOf(item);
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  simpanPanen() {
    if (!this.formData.tanaman || !this.formData.tanggal || !this.formData.jumlah || !this.formData.status) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    if (this.isEditing) {
      this.panen[this.editIndex] = { ...this.formData };
      alert(`✅ Panen ${this.formData.tanaman} berhasil diupdate!`);
    } else {
      this.panen.push({ ...this.formData });
      alert(`✅ Panen ${this.formData.tanaman} berhasil ditambahkan!`);
    }

    this.closeModal();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ============================================
  // HAPUS PANEN
  // ============================================
  hapusPanen(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus panen ${item.tanaman}?`)) {
      const index = this.panen.indexOf(item);
      if (index !== -1) this.panen.splice(index, 1);
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      alert(`✅ Panen ${item.tanaman} berhasil dihapus!`);
    }
  }

  // ============================================
  // EXPORT
  // ============================================
  exportData() { alert('📥 Data berhasil diekspor!'); }

  // ============================================
  // NAVIGASI
  // ============================================
  goBack() { this.router.navigate(['/dashboard']); }
}