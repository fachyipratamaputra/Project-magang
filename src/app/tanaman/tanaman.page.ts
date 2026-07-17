import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tanaman',
  templateUrl: './tanaman.page.html',
  styleUrls: ['./tanaman.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TanamanPage implements OnInit {
  // ===== DATA =====
  tanaman: any[] = [];
  filteredTanaman: any[] = [];
  
  // ===== STATISTIK =====
  tanamanAktif: number = 0;
  tanamanPanen: number = 0;
  totalProduksi: number = 0;

  // ===== FILTER =====
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedLahan: string = 'semua';

  // ===== PAGINATION =====
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // ===== MODAL =====
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  formData: any = {
    nama: '',
    varietas: '',
    lahan: '',
    luas: '',
    progress: '',
    status: 'aktif',
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
    this.tanaman = [
      { nama: 'Padi', varietas: 'Ciherang', lahan: 'Lahan A', luas: 2, progress: 85, status: 'aktif', warna: '#2e7d32' },
      { nama: 'Jagung', varietas: 'BISI-2', lahan: 'Lahan B', luas: 1.5, progress: 70, status: 'aktif', warna: '#f57c00' },
      { nama: 'Cabai', varietas: 'Kriting', lahan: 'Lahan C', luas: 0.8, progress: 95, status: 'panen', warna: '#c62828' },
      { nama: 'Kedelai', varietas: 'Anjasmoro', lahan: 'Lahan A', luas: 1, progress: 45, status: 'aktif', warna: '#7b1fa2' },
      { nama: 'Kacang Tanah', varietas: 'Kelinci', lahan: 'Lahan B', luas: 0.5, progress: 100, status: 'selesai', warna: '#0277bd' },
      { nama: 'Mentimun', varietas: 'Mercedes', lahan: 'Lahan C', luas: 0.3, progress: 60, status: 'aktif', warna: '#2e7d32' },
      { nama: 'Tomat', varietas: 'Tymoti', lahan: 'Lahan A', luas: 0.4, progress: 80, status: 'panen', warna: '#c62828' },
      { nama: 'Bayam', varietas: 'Kangaroo', lahan: 'Lahan B', luas: 0.2, progress: 30, status: 'aktif', warna: '#2e7d32' }
    ];
    this.filteredTanaman = [...this.tanaman];
  }

  // ============================================
  // STATISTIK
  // ============================================
  hitungStatistik() {
    this.tanamanAktif = this.tanaman.filter(t => t.status === 'aktif').length;
    this.tanamanPanen = this.tanaman.filter(t => t.status === 'panen').length;
    this.totalProduksi = this.tanaman.reduce((sum, t) => sum + (t.luas * 500), 0);
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
    let data = [...this.tanaman];
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }
    if (this.selectedLahan !== 'semua') {
      data = data.filter(item => item.lahan === this.selectedLahan);
    }
    this.filteredTanaman = data;
  }

  // ============================================
  // PAGINATION
  // ============================================
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredTanaman.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredTanaman.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredTanaman.length);
    return `${start} - ${end} of ${this.filteredTanaman.length}`;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  onRowsPerPageChange() { this.currentPage = 1; this.calculatePagination(); }

  // ============================================
  // MODAL - TAMBAH / EDIT
  // ============================================
  openTambahModal() {
    this.isEditing = false;
    this.formData = { nama: '', varietas: '', lahan: '', luas: '', progress: '', status: 'aktif', warna: '#2e7d32' };
    this.isModalOpen = true;
  }

  editTanaman(item: any) {
    this.isEditing = true;
    this.editIndex = this.tanaman.indexOf(item);
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  simpanTanaman() {
    if (!this.formData.nama || !this.formData.varietas || !this.formData.lahan || !this.formData.luas || !this.formData.progress || !this.formData.status) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    const progress = Number(this.formData.progress);
    if (progress < 0 || progress > 100) {
      alert('⚠️ Progress harus antara 0-100!');
      return;
    }

    if (this.isEditing) {
      this.tanaman[this.editIndex] = { ...this.formData };
      alert(`✅ ${this.formData.nama} berhasil diupdate!`);
    } else {
      this.tanaman.push({ ...this.formData });
      alert(`✅ ${this.formData.nama} berhasil ditambahkan!`);
    }

    this.closeModal();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ============================================
  // HAPUS TANAMAN
  // ============================================
  hapusTanaman(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) {
      const index = this.tanaman.indexOf(item);
      if (index !== -1) this.tanaman.splice(index, 1);
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      alert(`✅ ${item.nama} berhasil dihapus!`);
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