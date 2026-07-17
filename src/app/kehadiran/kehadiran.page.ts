import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kehadiran',
  templateUrl: './kehadiran.page.html',
  styleUrls: ['./kehadiran.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class KehadiranPage implements OnInit {
  // Info Petani
  namaPetani: string = 'FACHYI PRATAMA PUTRA';
  nikPetani: string = '51240075';
  lahanPetani: string = 'Lahan Sawah 2 Hektar';
  periode: string = 'Juli 2026';

  // Filter
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedAktif: string = 'semua';
  selectedTanggal: string = '';

  // Tabel
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // Peringatan
  showWarning: boolean = true;
  pesanPeringatan: string = '⚠️ Bukan periode absen! Pastikan data kehadiran sudah benar.';

  todayDate: Date = new Date();

  // Data Pekerja
  pekerja: any[] = [];
  filteredPekerja: any[] = [];

  // Statistik
  totalHadir: number = 0;
  totalIzin: number = 0;
  totalSakit: number = 0;
  totalAlpha: number = 0;
  persentaseKehadiran: number = 0;

  // Modal Tambah
  isModalOpen: boolean = false;
  newKaryawan: any = {
    nama: '',
    posisi: '',
    status: 'hadir',
    alasan: '-',
    aktif: true,
    avatar: ''
  };

  constructor(private router: Router) {
    this.selectedTanggal = this.todayDate.toISOString().split('T')[0];
  }

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
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Siti Rahayu',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Agus Setiawan',
        posisi: 'Petani',
        avatar: '',
        status: 'izin',
        alasan: 'Ada keperluan keluarga',
        aktif: true
      },
      {
        nama: 'Dewi Lestari',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Joko Widodo',
        posisi: 'Petani',
        avatar: '',
        status: 'sakit',
        alasan: 'Demam tinggi',
        aktif: false
      },
      {
        nama: 'Rina Anggraini',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Hendra Gunawan',
        posisi: 'Petani',
        avatar: '',
        status: 'alpha',
        alasan: 'Tidak ada kabar',
        aktif: true
      },
      {
        nama: 'Maya Sari',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Dedi Mulyadi',
        posisi: 'Petani',
        avatar: '',
        status: 'izin',
        alasan: 'Menghadiri acara keluarga',
        aktif: true
      },
      {
        nama: 'Tuti Rahayu',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: false
      },
      {
        nama: 'Slamet Riyadi',
        posisi: 'Petani',
        avatar: '',
        status: 'sakit',
        alasan: 'Masuk angin',
        aktif: true
      },
      {
        nama: 'Yanti Susanti',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Rudi Hartono',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
      },
      {
        nama: 'Sri Mulyani',
        posisi: 'Petani',
        avatar: '',
        status: 'izin',
        alasan: 'Urusan mendadak',
        aktif: true
      },
      {
        nama: 'Andi Wijaya',
        posisi: 'Petani',
        avatar: '',
        status: 'hadir',
        alasan: '-',
        aktif: true
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

    // Filter by status kehadiran
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }

    // Filter by status aktif
    if (this.selectedAktif !== 'semua') {
      const isAktif = this.selectedAktif === 'aktif';
      data = data.filter(item => item.aktif === isAktif);
    }

    // Filter by tanggal (simulasi)
    if (this.selectedTanggal) {
      // Bisa ditambahkan jika ada field tanggal
    }

    this.filteredPekerja = data;
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

  // ===== STATISTIK =====
  hitungStatistik() {
    // Hanya hitung yang aktif
    const aktif = this.filteredPekerja.filter(p => p.aktif);
    
    this.totalHadir = aktif.filter(p => p.status === 'hadir').length;
    this.totalIzin = aktif.filter(p => p.status === 'izin').length;
    this.totalSakit = aktif.filter(p => p.status === 'sakit').length;
    this.totalAlpha = aktif.filter(p => p.status === 'alpha').length;
    
    const total = aktif.length;
    if (total > 0) {
      this.persentaseKehadiran = Math.round((this.totalHadir / total) * 100);
    } else {
      this.persentaseKehadiran = 0;
    }
  }

  hitungPersentase(status: string): number {
    const aktif = this.filteredPekerja.filter(p => p.aktif);
    const total = aktif.length;
    if (total === 0) return 0;
    
    let count = 0;
    switch(status) {
      case 'hadir': count = this.totalHadir; break;
      case 'izin': count = this.totalIzin; break;
      case 'sakit': count = this.totalSakit; break;
      case 'alpha': count = this.totalAlpha; break;
    }
    return Math.round((count / total) * 100);
  }

  // ===== UPDATE STATUS =====
  updateStatus(item: any) {
    console.log(`Status ${item.nama} diubah menjadi: ${item.status}`);
    if (item.status === 'hadir') {
      item.alasan = '-';
    }
    this.hitungStatistik();
  }

  updateAlasan(item: any) {
    console.log(`Alasan ${item.nama}: ${item.alasan}`);
  }

  // ===== TOGGLE AKTIF =====
  toggleAktif(item: any) {
    console.log(`${item.nama} menjadi ${item.aktif ? 'Aktif' : 'Tidak Aktif'}`);
    
    // Jika tidak aktif, disable status dan alasan
    if (!item.aktif) {
      item.status = 'alpha';
      item.alasan = 'Tidak aktif';
    } else {
      item.status = 'hadir';
      item.alasan = '-';
    }
    
    this.hitungStatistik();
    this.filterData();
  }

  // ===== HAPUS KARYAWAN =====
  hapusKaryawan(item: any, index: number) {
    const confirmMsg = `Apakah Anda yakin ingin menghapus ${item.nama} dari daftar pekerja?`;
    
    if (confirm(confirmMsg)) {
      // Hapus dari data utama
      const mainIndex = this.pekerja.indexOf(item);
      if (mainIndex !== -1) {
        this.pekerja.splice(mainIndex, 1);
      }
      
      // Hapus dari filtered
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      
      console.log(`🗑️ ${item.nama} berhasil dihapus!`);
      alert(`✅ ${item.nama} berhasil dihapus dari daftar pekerja!`);
    }
  }

  // ===== TAMBAH KARYAWAN =====
  tambahKaryawan() {
    this.newKaryawan = {
      nama: '',
      posisi: '',
      status: 'hadir',
      alasan: '-',
      aktif: true,
      avatar: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  simpanKaryawan() {
    if (!this.newKaryawan.nama || !this.newKaryawan.posisi) {
      alert('⚠️ Harap isi nama dan posisi karyawan!');
      return;
    }

    // Tambahkan karyawan baru
    this.pekerja.push({
      ...this.newKaryawan
    });

    // Refresh data
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
    
    this.closeModal();
    console.log(`✅ Karyawan baru berhasil ditambahkan!`);
    alert(`✅ ${this.newKaryawan.nama} berhasil ditambahkan sebagai ${this.newKaryawan.posisi}!`);
  }

  // ===== SIMPAN SEMUA =====
  saveAll() {
    console.log('💾 Menyimpan semua perubahan...');
    alert('✅ Semua perubahan berhasil disimpan!');
  }

  // ===== EXPORT =====
  exportData() {
    console.log('📥 Export data...');
    alert('📥 Data berhasil diekspor!');
  }

  // ===== NAVIGASI =====
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}