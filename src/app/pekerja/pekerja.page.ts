import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

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

  // ===== LOADING =====
  isLoading: boolean = false;
  isSaving: boolean = false;

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
  editingId: number | null = null; // 🔥 pakai ID dari backend, bukan index array

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadPekerja();
  }

  // ============================================
  // 🔥 LOAD DATA DARI BACKEND
  // ============================================
  loadPekerja() {
    this.isLoading = true;
    this.apiService.getPekerja().subscribe({
      next: (res: any) => {
        // Sesuaikan kalau struktur response backend kamu beda,
        // misal { data: [...] } atau langsung array [...]
        const data = res?.data ?? res ?? [];
        this.pekerja = data.map((p: any) => ({ ...p, showPassword: false }));
        this.filterData();
        this.hitungStatistik();
        this.calculatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Gagal memuat data pekerja:', err);
        alert('⚠️ Gagal memuat data pekerja. Cek koneksi ke server.');
        this.isLoading = false;
      }
    });
  }

  // ============================================
  // STATISTIK
  // ============================================
  hitungStatistik() {
    this.pekerjaAktif = this.pekerja.filter(p => p.aktif).length;
    this.pekerjaTidakAktif = this.pekerja.filter(p => !p.aktif).length;

    let total = 0;
    this.pekerja.forEach(p => { total += (p.gaji ?? 3500000); });
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
  // 🔥 MODAL - TAMBAH PEKERJA
  // ============================================
  openModal() {
    this.isEditing = false;
    this.editingId = null;
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

  // ============================================
  // 🔥 EDIT PEKERJA
  // ============================================
  editPekerja(item: any) {
    this.isEditing = true;
    this.editingId = item.id; // 🔥 simpan ID asli dari backend
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  // ============================================
  // 🔥 CLOSE MODAL
  // ============================================
  closeModal() {
    this.isModalOpen = false;
    this.showFormPassword = false;
  }

  // ============================================
  // 🔥 SIMPAN PEKERJA (TAMBAH / UPDATE) — VIA API
  // ============================================
  simpanPekerja() {
    // Validasi
    if (!this.formData.nama || !this.formData.posisi || !this.formData.email || !this.formData.password) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    if (this.formData.password.length < 6) {
      alert('⚠️ Password minimal 6 karakter!');
      return;
    }

    // Cek duplikat email (kecuali email milik data yang sedang diedit)
    const emailExists = this.pekerja.some(
      p => p.email === this.formData.email && p.id !== this.editingId
    );
    if (emailExists) {
      alert('⚠️ Email sudah terdaftar!');
      return;
    }

    this.isSaving = true;
    const payload = { ...this.formData };
    delete payload.showPassword;

    if (this.isEditing && this.editingId !== null) {
      // 🔥 UPDATE PEKERJA VIA API
      this.apiService.updatePekerja(this.editingId, payload).subscribe({
        next: () => {
          alert(`✅ ${this.formData.nama} berhasil diupdate!`);
          this.isSaving = false;
          this.closeModal();
          this.loadPekerja(); // refresh data dari server
        },
        error: (err) => {
          console.error('❌ Gagal update pekerja:', err);
          alert('⚠️ Gagal mengupdate pekerja. Coba lagi.');
          this.isSaving = false;
        }
      });
    } else {
      // 🔥 TAMBAH PEKERJA BARU VIA API
      this.apiService.createPekerja(payload).subscribe({
        next: () => {
          alert(`✅ ${this.formData.nama} berhasil ditambahkan!`);
          this.isSaving = false;
          this.closeModal();
          this.loadPekerja(); // refresh data dari server
        },
        error: (err) => {
          console.error('❌ Gagal menambah pekerja:', err);
          alert('⚠️ Gagal menambahkan pekerja. Coba lagi.');
          this.isSaving = false;
        }
      });
    }
  }

  // ============================================
  // 🔥 HAPUS PEKERJA — VIA API
  // ============================================
  hapusPekerja(item: any) {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) return;

    this.apiService.deletePekerja(item.id).subscribe({
      next: () => {
        alert(`✅ ${item.nama} berhasil dihapus!`);
        this.loadPekerja(); // refresh data dari server
      },
      error: (err) => {
        console.error('❌ Gagal menghapus pekerja:', err);
        alert('⚠️ Gagal menghapus pekerja. Coba lagi.');
      }
    });
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