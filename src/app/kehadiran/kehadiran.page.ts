import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-kehadiran',
  templateUrl: './kehadiran.page.html',
  styleUrls: ['./kehadiran.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class KehadiranPage implements OnInit {
  todayDate: Date = new Date();
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedAktif: string = 'semua';
  selectedTanggal: string = '';
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = true;

  pekerja: any[] = [];
  filteredPekerja: any[] = [];

  totalHadir: number = 0;
  totalIzin: number = 0;
  totalSakit: number = 0;
  totalAlpha: number = 0;

  // ===== 🔥 MODAL TAMBAH KARYAWAN =====
  isModalOpen: boolean = false;
  isSaving: boolean = false;
  formData: any = {
    nama: '',
    posisi: '',
    username: '',
    email: '',
    password: '',
    lahan: '',
    no_telepon: '',
    alamat: ''
  };

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    this.selectedTanggal = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadData();
  }

  // ============================================
  // 🔥 LOAD DATA ASLI DARI BACKEND
  // ============================================
  loadData() {
    this.isLoading = true;

    // Ambil list pekerja & kehadiran hari yang dipilih secara paralel
    this.apiService.getPekerja().subscribe({
      next: (pekerjaRes: any) => {
        const pekerjaList = pekerjaRes?.data ?? [];

        this.apiService.getKehadiran(this.selectedTanggal).subscribe({
          next: (kehadiranRes: any) => {
            const kehadiranList = kehadiranRes?.data ?? [];
            this.mergeData(pekerjaList, kehadiranList);
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error('Gagal memuat kehadiran:', err);
            // Tetap tampilkan list pekerja walau kehadiran gagal dimuat
            this.mergeData(pekerjaList, []);
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Gagal memuat pekerja:', err);
        this.isLoading = false;
        this.pekerja = [];
        this.filterData();
      }
    });
  }

  // ============================================
  // 🔥 GABUNGKAN DATA PEKERJA + STATUS KEHADIRAN HARI ITU
  // ============================================
  mergeData(pekerjaList: any[], kehadiranList: any[]) {
    this.pekerja = pekerjaList.map((p: any) => {
      const kehadiranHariIni = kehadiranList.find((k: any) => k.pekerja_id === p.id);

      return {
        pekerjaId: p.id,
        nama: p.nama,
        posisi: p.posisi,
        status: kehadiranHariIni?.status || 'belum',   // status kehadiran hari ini
        alasan: kehadiranHariIni?.alasan || '-',
        aktif: p.status === 'aktif'                     // status aktif/tidaknya pekerja (bukan kehadiran)
      };
    });

    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  toggleFilter() { this.showFilter = !this.showFilter; }

  onFilterChange() {
    this.currentPage = 1;
    // Kalau tanggal berubah, ambil ulang data kehadiran untuk tanggal itu
    this.loadData();
  }

  filterData() {
    let data = [...this.pekerja];
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }
    if (this.selectedAktif !== 'semua') {
      const isAktif = this.selectedAktif === 'aktif';
      data = data.filter(item => item.aktif === isAktif);
    }
    this.filteredPekerja = data;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredPekerja.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredPekerja.length);
    return `${start} - ${end} of ${this.filteredPekerja.length}`;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  onRowsPerPageChange() { this.currentPage = 1; this.calculatePagination(); }

  hitungStatistik() {
    const aktif = this.pekerja.filter(p => p.aktif);
    this.totalHadir = aktif.filter(p => p.status === 'hadir').length;
    this.totalIzin = aktif.filter(p => p.status === 'izin').length;
    this.totalSakit = aktif.filter(p => p.status === 'sakit').length;
    this.totalAlpha = aktif.filter(p => p.status === 'alpha').length;
  }

  hitungPersentase(status: string): number {
    const aktif = this.pekerja.filter(p => p.aktif);
    const total = aktif.length || 1;
    let count = 0;
    switch (status) {
      case 'hadir': count = this.totalHadir; break;
      case 'izin': count = this.totalIzin; break;
      case 'sakit': count = this.totalSakit; break;
      case 'alpha': count = this.totalAlpha; break;
    }
    return Math.round((count / total) * 100);
  }

  // ============================================
  // 🔥 UPDATE STATUS KEHADIRAN — sekarang beneran simpan ke backend
  // ============================================
  updateStatus(item: any) {
    if (item.status === 'hadir') item.alasan = '-';

    this.apiService.saveKehadiran({
      pekerja_id: item.pekerjaId,
      tanggal: this.selectedTanggal,
      status: item.status,
      alasan: item.alasan
    }).subscribe({
      next: () => {
        this.hitungStatistik();
      },
      error: (err: any) => {
        console.error('Gagal update status kehadiran:', err);
        alert('⚠️ Gagal menyimpan perubahan status. Coba lagi.');
      }
    });
  }

  updateAlasan(item: any) {
    // Simpan alasan bareng status saat blur/ganti (dipicu manual dari template kalau perlu)
    this.updateStatus(item);
  }

  // ============================================
  // 🔥 TOGGLE AKTIF/TIDAK AKTIF — ini status PEKERJA, beda dari kehadiran
  // ============================================
  toggleAktif(item: any) {
    const statusBaru = item.aktif ? 'aktif' : 'nonaktif';

    this.apiService.updatePekerja(item.pekerjaId, {
      nama: item.nama,
      posisi: item.posisi,
      status: statusBaru
    }).subscribe({
      next: () => {
        this.filterData();
        this.hitungStatistik();
      },
      error: (err: any) => {
        console.error('Gagal update status aktif:', err);
        alert('⚠️ Gagal menyimpan perubahan status aktif.');
        item.aktif = !item.aktif; // rollback tampilan kalau gagal
      }
    });
  }

  // ============================================
  // 🔥 MODAL - TAMBAH KARYAWAN
  // ============================================
  openModal() {
    this.formData = {
      nama: '',
      posisi: '',
      username: '',
      email: '',
      password: '',
      lahan: '',
      no_telepon: '',
      alamat: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // 🔥 Auto-suggest username dari nama, tetap bisa diedit manual
  onNamaChange() {
    if (!this.formData.username && this.formData.nama) {
      this.formData.username = this.formData.nama
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '.');
    }
  }

  simpanKaryawan() {
    if (!this.formData.nama || !this.formData.posisi || !this.formData.username || !this.formData.email || !this.formData.password) {
      alert('⚠️ Harap isi Nama, Posisi, Username, Email, dan Password!');
      return;
    }

    if (this.formData.password.length < 6) {
      alert('⚠️ Password minimal 6 karakter!');
      return;
    }

    this.isSaving = true;

    this.apiService.createPekerja(this.formData).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        alert(`✅ ${this.formData.nama} berhasil ditambahkan!`);
        this.closeModal();
        this.loadData();
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Gagal tambah karyawan:', err);
        const pesan = err?.error?.message || 'Gagal menambahkan karyawan.';
        alert('⚠️ ' + pesan);
      }
    });
  }

  hapusKaryawan(item: any) {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) return;

    this.apiService.deletePekerja(item.pekerjaId).subscribe({
      next: () => {
        alert(`✅ ${item.nama} berhasil dihapus!`);
        this.loadData();
      },
      error: (err: any) => {
        console.error('Gagal hapus karyawan:', err);
        alert('⚠️ Gagal menghapus karyawan.');
      }
    });
  }

  saveAll() {
    alert('✅ Semua perubahan sudah otomatis tersimpan setiap kali diubah.');
  }

  exportData() {
    alert('📥 Fitur export segera hadir!');
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}