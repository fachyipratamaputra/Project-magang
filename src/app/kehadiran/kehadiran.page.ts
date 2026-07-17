import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  pekerja: any[] = [];
  filteredPekerja: any[] = [];

  totalHadir: number = 0;
  totalIzin: number = 0;
  totalSakit: number = 0;
  totalAlpha: number = 0;

  constructor(private router: Router) {
    this.selectedTanggal = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initData();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  initData() {
    this.pekerja = [
      { nama: 'Bambang Supriyadi', posisi: 'Kepala Lahan', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Siti Rahayu', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Agus Setiawan', posisi: 'Petani', status: 'izin', alasan: 'Ada keperluan keluarga', aktif: true },
      { nama: 'Dewi Lestari', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Joko Widodo', posisi: 'Petani', status: 'sakit', alasan: 'Demam tinggi', aktif: false },
      { nama: 'Rina Anggraini', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Hendra Gunawan', posisi: 'Petani', status: 'alpha', alasan: 'Tidak ada kabar', aktif: true },
      { nama: 'Maya Sari', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Dedi Mulyadi', posisi: 'Petani', status: 'izin', alasan: 'Menghadiri acara keluarga', aktif: true },
      { nama: 'Tuti Rahayu', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: false },
      { nama: 'Slamet Riyadi', posisi: 'Petani', status: 'sakit', alasan: 'Masuk angin', aktif: true },
      { nama: 'Yanti Susanti', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Rudi Hartono', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true },
      { nama: 'Sri Mulyani', posisi: 'Petani', status: 'izin', alasan: 'Urusan mendadak', aktif: true },
      { nama: 'Andi Wijaya', posisi: 'Petani', status: 'hadir', alasan: '-', aktif: true }
    ];
    this.filteredPekerja = [...this.pekerja];
  }

  toggleFilter() { this.showFilter = !this.showFilter; }

  onFilterChange() {
    this.currentPage = 1;
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
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
    const aktif = this.filteredPekerja.filter(p => p.aktif);
    this.totalHadir = aktif.filter(p => p.status === 'hadir').length;
    this.totalIzin = aktif.filter(p => p.status === 'izin').length;
    this.totalSakit = aktif.filter(p => p.status === 'sakit').length;
    this.totalAlpha = aktif.filter(p => p.status === 'alpha').length;
  }

  hitungPersentase(status: string): number {
    const aktif = this.filteredPekerja.filter(p => p.aktif);
    const total = aktif.length || 1;
    let count = 0;
    switch(status) {
      case 'hadir': count = this.totalHadir; break;
      case 'izin': count = this.totalIzin; break;
      case 'sakit': count = this.totalSakit; break;
      case 'alpha': count = this.totalAlpha; break;
    }
    return Math.round((count / total) * 100);
  }

  updateStatus(item: any) {
    if (item.status === 'hadir') item.alasan = '-';
    this.hitungStatistik();
  }

  updateAlasan(item: any) {}

  toggleAktif(item: any) {
    if (!item.aktif) { item.status = 'alpha'; item.alasan = 'Tidak aktif'; } 
    else { item.status = 'hadir'; item.alasan = '-'; }
    this.hitungStatistik();
    this.filterData();
  }

  tambahKaryawan() { alert('Fitur tambah karyawan segera hadir!'); }

  hapusKaryawan(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) {
      const index = this.pekerja.indexOf(item);
      if (index !== -1) this.pekerja.splice(index, 1);
      this.filterData();
      this.hitungStatistik();
      this.calculatePagination();
      alert(`✅ ${item.nama} berhasil dihapus!`);
    }
  }

  saveAll() { alert('✅ Semua perubahan berhasil disimpan!'); }
  exportData() { alert('📥 Data berhasil diekspor!'); }
  goBack() { this.router.navigate(['/dashboard']); }
}