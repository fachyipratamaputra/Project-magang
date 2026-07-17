import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pekerja',
  templateUrl: './pekerja.page.html',
  styleUrls: ['./pekerja.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PekerjaPage implements OnInit {
  // ===== DATA =====
  pekerja: any[] = [];
  filteredPekerja: any[] = [];
  
  // ===== STATISTIK =====
  pekerjaAktif: number = 0;
  pekerjaTidakAktif: number = 0;
  totalGaji: string = '0';

  // ===== FILTER =====
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedPosisi: string = 'semua';

  // ===== PAGINATION =====
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // ===== MODAL =====
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  showFormPassword: boolean = false;
  formData: any = {
    nama: '',
    posisi: '',
    email: '',
    password: '',
    telepon: '',
    alamat: '',
    aktif: true
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
    this.pekerja = [
      { nama: 'Bambang Supriyadi', posisi: 'Kepala Lahan', email: 'bambang@petani.com', password: 'bambang123', telepon: '0812-3456-7890', alamat: 'Jl. Pertanian No. 1', aktif: true, showPassword: false },
      { nama: 'Siti Rahayu', posisi: 'Petani', email: 'siti@petani.com', password: 'siti123', telepon: '0812-3456-7891', alamat: 'Jl. Pertanian No. 2', aktif: true, showPassword: false },
      { nama: 'Agus Setiawan', posisi: 'Petani', email: 'agus@petani.com', password: 'agus123', telepon: '0812-3456-7892', alamat: 'Jl. Pertanian No. 3', aktif: true, showPassword: false },
      { nama: 'Dewi Lestari', posisi: 'Petani', email: 'dewi@petani.com', password: 'dewi123', telepon: '0812-3456-7893', alamat: 'Jl. Pertanian No. 4', aktif: true, showPassword: false },
      { nama: 'Joko Widodo', posisi: 'Petani', email: 'joko@petani.com', password: 'joko123', telepon: '0812-3456-7894', alamat: 'Jl. Pertanian No. 5', aktif: false, showPassword: false },
      { nama: 'Rina Anggraini', posisi: 'Penyemprot', email: 'rina@petani.com', password: 'rina123', telepon: '0812-3456-7895', alamat: 'Jl. Pertanian No. 6', aktif: true, showPassword: false },
      { nama: 'Hendra Gunawan', posisi: 'Petani', email: 'hendra@petani.com', password: 'hendra123', telepon: '0812-3456-7896', alamat: 'Jl. Pertanian No. 7', aktif: true, showPassword: false },
      { nama: 'Maya Sari', posisi: 'Petani', email: 'maya@petani.com', password: 'maya123', telepon: '0812-3456-7897', alamat: 'Jl. Pertanian No. 8', aktif: true, showPassword: false },
      { nama: 'Dedi Mulyadi', posisi: 'Petani', email: 'dedi@petani.com', password: 'dedi123', telepon: '0812-3456-7898', alamat: 'Jl. Pertanian No. 9', aktif: false, showPassword: false },
      { nama: 'Tuti Rahayu', posisi: 'Petani', email: 'tuti@petani.com', password: 'tuti123', telepon: '0812-3456-7899', alamat: 'Jl. Pertanian No. 10', aktif: true, showPassword: false },
      { nama: 'Slamet Riyadi', posisi: 'Penyemprot', email: 'slamet@petani.com', password: 'slamet123', telepon: '0812-3456-7800', alamat: 'Jl. Pertanian No. 11', aktif: true, showPassword: false }
    ];
    this.filteredPekerja = [...this.pekerja];
  }

  // ============================================
  // STATISTIK
  // ============================================
  hitungStatistik() {
    this.pekerjaAktif = this.pekerja.filter(p => p.aktif).length;
    this.pekerjaTidakAktif = this.pekerja.filter(p => !p.aktif).length;
    
    let total = 0;
    this.pekerja.forEach(p => { total += 3500000; });
    this.totalGaji = (total / 1000000).toFixed(1) + ' Jt';
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
    let data = [...this.pekerja];
    if (this.selectedStatus !== 'semua') {
      const isAktif = this.selectedStatus === 'aktif';
      data = data.filter(item => item.aktif === isAktif);
    }
    if (this.selectedPosisi !== 'semua') {
      data = data.filter(item => item.posisi === this.selectedPosisi);
    }
    this.filteredPekerja = data;
  }

  // ============================================
  // PAGINATION
  // ============================================
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredPekerja.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredPekerja.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredPekerja.length);
    return `${start} - ${end} of ${this.filteredPekerja.length}`;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  onRowsPerPageChange() { this.currentPage = 1; this.calculatePagination(); }

  // ============================================
  // TOGGLE PASSWORD
  // ============================================
  togglePassword(item: any) { item.showPassword = !item.showPassword; }
  toggleFormPassword() { this.showFormPassword = !this.showFormPassword; }

  // ============================================
  // 🔥 MODAL - FUNGSI UNTUK BUKA/TUTUP
  // ============================================
  
  // Fungsi ini akan dipanggil saat modal dibuka via trigger
  // Tapi kita tetap perlu mengatur isEditing dan formData

  editPekerja(item: any) {
    console.log('🔥 Edit pekerja:', item.nama);
    this.isEditing = true;
    this.editIndex = this.pekerja.indexOf(item);
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  closeModal() {
    console.log('🔥 Menutup modal');
    this.isModalOpen = false;
    this.showFormPassword = false;
  }

  // Fungsi ini dipanggil saat modal dibuka via trigger
  // Kita gunakan untuk reset form saat tambah baru
  openModal() {
    console.log('🔥 Membuka modal Tambah Pekerja');
    this.isEditing = false;
    this.formData = { 
      nama: '', 
      posisi: '', 
      email: '', 
      password: '', 
      telepon: '', 
      alamat: '', 
      aktif: true 
    };
    this.isModalOpen = true;
  }

  simpanPekerja() {
    console.log('🔥 Menyimpan pekerja...');
    console.log('Form Data:', this.formData);
    
    if (!this.formData.nama || !this.formData.posisi || !this.formData.email || !this.formData.password) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    if (this.formData.password.length < 6) {
      alert('⚠️ Password minimal 6 karakter!');
      return;
    }

    const emailExists = this.pekerja.some(p => p.email === this.formData.email && p !== this.pekerja[this.editIndex]);
    if (emailExists) {
      alert('⚠️ Email sudah terdaftar!');
      return;
    }

    if (this.isEditing) {
      this.pekerja[this.editIndex] = { ...this.formData, showPassword: false };
      alert(`✅ ${this.formData.nama} berhasil diupdate!`);
    } else {
      const newPekerja = { ...this.formData, showPassword: false };
      this.pekerja.push(newPekerja);
      console.log('Pekerja baru:', newPekerja);
      alert(`✅ ${this.formData.nama} berhasil ditambahkan!`);
    }

    this.closeModal();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ============================================
  // HAPUS PEKERJA
  // ============================================
  hapusPekerja(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) {
      const index = this.pekerja.indexOf(item);
      if (index !== -1) this.pekerja.splice(index, 1);
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