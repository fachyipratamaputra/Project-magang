import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pekerja',
  templateUrl: './pekerja.page.html',
  styleUrls: ['./pekerja.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // ✅ Pastikan IonicModule diimport
})
export class PekerjaPage implements OnInit {
  // Info Petani
  namaPetani: string = 'FACHYI PRATAMA PUTRA';
  pekerjaAktif: number = 0;
  pekerjaTidakAktif: number = 0;

  // Filter
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedPosisi: string = 'semua';

  // Tabel
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // Data Pekerja
  pekerja: any[] = [];
  filteredPekerja: any[] = [];

  // Modal
  isModalOpen: boolean = false;
  isEditing: boolean = false; // ✅ Pastikan ini ada
  showFormPassword: boolean = false;
  formData: any = {
    nama: '',
    posisi: '',
    email: '',
    password: '',
    telepon: '',
    alamat: '',
    aktif: true,
    avatar: ''
  };
  editIndex: number = -1;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initData();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  initData() {
    this.pekerja = [
      {
        nama: 'Bambang Supriyadi',
        posisi: 'Kepala Lahan',
        email: 'bambang@petani.com',
        password: 'bambang123',
        telepon: '0812-3456-7890',
        alamat: 'Jl. Pertanian No. 1',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Siti Rahayu',
        posisi: 'Petani',
        email: 'siti@petani.com',
        password: 'siti123',
        telepon: '0812-3456-7891',
        alamat: 'Jl. Pertanian No. 2',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Agus Setiawan',
        posisi: 'Petani',
        email: 'agus@petani.com',
        password: 'agus123',
        telepon: '0812-3456-7892',
        alamat: 'Jl. Pertanian No. 3',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Dewi Lestari',
        posisi: 'Petani',
        email: 'dewi@petani.com',
        password: 'dewi123',
        telepon: '0812-3456-7893',
        alamat: 'Jl. Pertanian No. 4',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Joko Widodo',
        posisi: 'Petani',
        email: 'joko@petani.com',
        password: 'joko123',
        telepon: '0812-3456-7894',
        alamat: 'Jl. Pertanian No. 5',
        aktif: false,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Rina Anggraini',
        posisi: 'Penyemprot',
        email: 'rina@petani.com',
        password: 'rina123',
        telepon: '0812-3456-7895',
        alamat: 'Jl. Pertanian No. 6',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Hendra Gunawan',
        posisi: 'Pemanen',
        email: 'hendra@petani.com',
        password: 'hendra123',
        telepon: '0812-3456-7896',
        alamat: 'Jl. Pertanian No. 7',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Maya Sari',
        posisi: 'Petani',
        email: 'maya@petani.com',
        password: 'maya123',
        telepon: '0812-3456-7897',
        alamat: 'Jl. Pertanian No. 8',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Dedi Mulyadi',
        posisi: 'Petani',
        email: 'dedi@petani.com',
        password: 'dedi123',
        telepon: '0812-3456-7898',
        alamat: 'Jl. Pertanian No. 9',
        aktif: false,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Tuti Rahayu',
        posisi: 'Petani',
        email: 'tuti@petani.com',
        password: 'tuti123',
        telepon: '0812-3456-7899',
        alamat: 'Jl. Pertanian No. 10',
        aktif: true,
        avatar: '',
        showPassword: false
      },
      {
        nama: 'Slamet Riyadi',
        posisi: 'Penyemprot',
        email: 'slamet@petani.com',
        password: 'slamet123',
        telepon: '0812-3456-7800',
        alamat: 'Jl. Pertanian No. 11',
        aktif: true,
        avatar: '',
        showPassword: false
      }
    ];

    this.filteredPekerja = [...this.pekerja];
  }

  // ===== FILTER =====
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterChange() {
    this.currentPage = 1;
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  filterData() {
    let data = [...this.pekerja];

    // Filter by status aktif
    if (this.selectedStatus !== 'semua') {
      const isAktif = this.selectedStatus === 'aktif';
      data = data.filter(item => item.aktif === isAktif);
    }

    // Filter by posisi
    if (this.selectedPosisi !== 'semua') {
      data = data.filter(item => item.posisi === this.selectedPosisi);
    }

    this.filteredPekerja = data;
  }

  // ===== STATISTIK =====
  hitungStatistik() {
    this.pekerjaAktif = this.pekerja.filter(p => p.aktif).length;
    this.pekerjaTidakAktif = this.pekerja.filter(p => !p.aktif).length;
  }

  // ===== PAGINATION =====
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredPekerja.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredPekerja.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredPekerja.length);
    const total = this.filteredPekerja.length;
    return `${start} - ${end} of ${total}`;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onRowsPerPageChange() {
    this.currentPage = 1;
    this.calculatePagination();
  }

  // ===== TOGGLE PASSWORD =====
  togglePassword(item: any) {
    item.showPassword = !item.showPassword;
  }

  toggleFormPassword() {
    this.showFormPassword = !this.showFormPassword;
  }

  // ===== TAMBAH PEKERJA =====
  tambahPekerja() {
    this.isEditing = false;
    this.formData = {
      nama: '',
      posisi: '',
      email: '',
      password: '',
      telepon: '',
      alamat: '',
      aktif: true,
      avatar: ''
    };
    this.isModalOpen = true;
  }

  // ===== EDIT PEKERJA =====
  editPekerja(item: any) {
    this.isEditing = true;
    this.editIndex = this.pekerja.indexOf(item);
    this.formData = { ...item };
    this.isModalOpen = true;
  }

  // ===== SIMPAN PEKERJA =====
  simpanPekerja() {
    if (!this.formData.nama || !this.formData.posisi || !this.formData.email || !this.formData.password) {
      alert('⚠️ Harap isi semua field yang wajib (*)!');
      return;
    }

    if (this.isEditing) {
      // Update data
      this.pekerja[this.editIndex] = { ...this.formData };
      console.log(`✏️ ${this.formData.nama} berhasil diupdate!`);
      alert(`✅ ${this.formData.nama} berhasil diupdate!`);
    } else {
      // Tambah data baru
      this.formData.showPassword = false;
      this.pekerja.push({ ...this.formData });
      console.log(`✅ ${this.formData.nama} berhasil ditambahkan!`);
      alert(`✅ ${this.formData.nama} berhasil ditambahkan sebagai ${this.formData.posisi}!`);
    }

    this.closeModal();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  // ===== HAPUS PEKERJA =====
  hapusPekerja(item: any) {
    const confirmMsg = `Apakah Anda yakin ingin menghapus ${item.nama} dari daftar pekerja?`;
    
    if (confirm(confirmMsg)) {
      const index = this.pekerja.indexOf(item);
      if (index !== -1) {
        this.pekerja.splice(index, 1);
      }
      
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      
      console.log(`🗑️ ${item.nama} berhasil dihapus!`);
      alert(`✅ ${item.nama} berhasil dihapus dari daftar pekerja!`);
    }
  }

  // ===== MODAL =====
  closeModal() {
    this.isModalOpen = false;
    this.showFormPassword = false;
  }

  // ===== EXPORT =====
  exportData() {
    console.log('📥 Export data...');
    alert('📥 Data pekerja berhasil diekspor!');
  }

  // ===== NAVIGASI =====
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}