import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lahan',
  templateUrl: './lahan.page.html',
  styleUrls: ['./lahan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LahanPage implements OnInit {
  // ===== DATA =====
  lahan: any[] = [];
  filteredLahan: any[] = [];
  tanamanList: string[] = ['Padi', 'Jagung', 'Cabai', 'Kedelai', 'Kacang Tanah', 'Mentimun', 'Tomat', 'Bayam'];
  
  // ===== STATISTIK =====
  lahanAktif: number = 0;
  lahanPanen: number = 0;
  totalLuas: number = 0;

  // ===== FILTER =====
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedTanaman: string = 'semua';

  // ===== PAGINATION =====
  rowsPerPage: number = 4;
  currentPage: number = 1;
  totalPages: number = 1;

  // ===== MODAL =====
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  formData: any = {
    nama: '',
    luas: '',
    lokasi: '',
    tanggalBuka: '',
    progress: '',
    status: 'aktif',
    warna: '#2e7d32',
    warna2: '#4caf50'
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
    this.lahan = [
      { 
        nama: 'A', 
        luas: 2, 
        lokasi: 'Desa Sukamaju, Kec. X',
        tanggalBuka: '2024-01-01',
        progress: 85, 
        status: 'aktif', 
        warna: '#2e7d32', 
        warna2: '#4caf50',
        tanaman: [{ nama: 'Padi', progress: 85 }, { nama: 'Jagung', progress: 70 }]
      },
      { 
        nama: 'B', 
        luas: 1.5, 
        lokasi: 'Desa Sukamaju, Kec. X',
        tanggalBuka: '2024-02-15',
        progress: 70, 
        status: 'aktif', 
        warna: '#1a472a', 
        warna2: '#388e3c',
        tanaman: [{ nama: 'Jagung', progress: 70 }, { nama: 'Kacang Tanah', progress: 100 }]
      },
      { 
        nama: 'C', 
        luas: 0.8, 
        lokasi: 'Desa Sukamaju, Kec. X',
        tanggalBuka: '2024-03-01',
        progress: 95, 
        status: 'panen', 
        warna: '#f57c00', 
        warna2: '#ffa726',
        tanaman: [{ nama: 'Cabai', progress: 95 }, { nama: 'Mentimun', progress: 60 }]
      },
      { 
        nama: 'D', 
        luas: 1.2, 
        lokasi: 'Desa Sukamaju, Kec. X',
        tanggalBuka: '2024-04-01',
        progress: 45, 
        status: 'aktif', 
        warna: '#7b1fa2', 
        warna2: '#ab47bc',
        tanaman: [{ nama: 'Kedelai', progress: 45 }, { nama: 'Tomat', progress: 80 }]
      },
      { 
        nama: 'E', 
        luas: 1.0, 
        lokasi: 'Desa Sukamaju, Kec. X',
        tanggalBuka: '2024-05-01',
        progress: 100, 
        status: 'selesai', 
        warna: '#0277bd', 
        warna2: '#42a5f5',
        tanaman: [{ nama: 'Kacang Tanah', progress: 100 }]
      }
    ];
    this.filteredLahan = [...this.lahan];
  }

  // ============================================
  // STATISTIK
  // ============================================
  hitungStatistik() {
    this.lahanAktif = this.lahan.filter(l => l.status === 'aktif').length;
    this.lahanPanen = this.lahan.filter(l => l.status === 'panen').length;
    this.totalLuas = this.lahan.reduce((sum, l) => sum + (parseFloat(l.luas) || 0), 0);
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
    let data = [...this.lahan];
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }
    if (this.selectedTanaman !== 'semua') {
      data = data.filter(item => {
        return item.tanaman && item.tanaman.some((t: any) => t.nama === this.selectedTanaman);
      });
    }
    this.filteredLahan = data;
  }

  // ============================================
  // PAGINATION
  // ============================================
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredLahan.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredLahan.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredLahan.length);
    return `${start} - ${end} of ${this.filteredLahan.length}`;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  onRowsPerPageChange() { this.currentPage = 1; this.calculatePagination(); }

  // ============================================
  // MODAL - TAMBAH / EDIT
  // ============================================
  openTambahModal() {
    this.isEditing = false;
    this.formData = { 
      nama: '', 
      luas: '', 
      lokasi: '', 
      tanggalBuka: '', 
      progress: '', 
      status: 'aktif', 
      warna: '#2e7d32',
      warna2: '#4caf50'
    };
    this.isModalOpen = true;
  }

  editLahan(item: any) {
    this.isEditing = true;
    this.editIndex = this.lahan.indexOf(item);
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  simpanLahan() {
    if (!this.formData.nama || !this.formData.luas || !this.formData.progress || !this.formData.status) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    const progress = Number(this.formData.progress);
    if (progress < 0 || progress > 100) {
      alert('⚠️ Progress harus antara 0-100!');
      return;
    }

    // Tambahkan tanaman default jika belum ada
    if (!this.formData.tanaman) {
      this.formData.tanaman = [];
    }

    if (this.isEditing) {
      this.lahan[this.editIndex] = { ...this.formData };
      alert(`✅ Lahan ${this.formData.nama} berhasil diupdate!`);
    } else {
      this.lahan.push({ ...this.formData });
      alert(`✅ Lahan ${this.formData.nama} berhasil ditambahkan!`);
    }

    this.closeModal();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ============================================
  // HAPUS LAHAN
  // ============================================
  hapusLahan(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus Lahan ${item.nama}?`)) {
      const index = this.lahan.indexOf(item);
      if (index !== -1) this.lahan.splice(index, 1);
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      alert(`✅ Lahan ${item.nama} berhasil dihapus!`);
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