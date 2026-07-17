import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.page.html',
  styleUrls: ['./pembayaran.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PembayaranPage implements OnInit {
  // Info Petani
  namaPetani: string = 'FACHYI PRATAMA PUTRA';
  nikPetani: string = '51240075';
  periodeGaji: string = 'Juli 2026';
  statusPembayaran: string = 'Sebagian Dibayar';

  // Filter
  showFilter: boolean = false;
  selectedStatus: string = 'semua';
  selectedBank: string = 'semua';

  // Tabel
  rowsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // Peringatan
  showWarning: boolean = true;
  pesanPeringatan: string = '⚠️ Pastikan data rekening karyawan sudah benar sebelum mengirim gaji.';

  todayDate: Date = new Date();

  // Data Karyawan
  karyawan: any[] = [];
  filteredKaryawan: any[] = [];

  // Statistik
  totalKaryawan: number = 0;
  totalBelum: number = 0;
  totalProses: number = 0;
  totalBerhasil: number = 0;
  totalGaji: string = 'Rp 0';

  constructor(private router: Router) {}

  ngOnInit() {
    this.initData();
    this.filterData();
    this.hitungStatistik();
    this.calculatePagination();
  }

  initData() {
    this.karyawan = [
      {
        nama: 'Bambang Supriyadi',
        posisi: 'Kepala Lahan',
        avatar: '',
        bank: 'BCA',
        noRekening: '1234567890',
        gaji: 4500000,
        status: 'berhasil'
      },
      {
        nama: 'Siti Rahayu',
        posisi: 'Petani',
        avatar: '',
        bank: 'Mandiri',
        noRekening: '9876543210',
        gaji: 3500000,
        status: 'berhasil'
      },
      {
        nama: 'Agus Setiawan',
        posisi: 'Petani',
        avatar: '',
        bank: 'BNI',
        noRekening: '5678901234',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Dewi Lestari',
        posisi: 'Petani',
        avatar: '',
        bank: 'BRI',
        noRekening: '4321098765',
        gaji: 3500000,
        status: 'berhasil'
      },
      {
        nama: 'Joko Widodo',
        posisi: 'Petani',
        avatar: '',
        bank: 'BCA',
        noRekening: '8765432109',
        gaji: 3500000,
        status: 'proses'
      },
      {
        nama: 'Rina Anggraini',
        posisi: 'Petani',
        avatar: '',
        bank: 'Mandiri',
        noRekening: '2109876543',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Hendra Gunawan',
        posisi: 'Petani',
        avatar: '',
        bank: 'BNI',
        noRekening: '6543210987',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Maya Sari',
        posisi: 'Petani',
        avatar: '',
        bank: 'BRI',
        noRekening: '1098765432',
        gaji: 3500000,
        status: 'berhasil'
      },
      {
        nama: 'Dedi Mulyadi',
        posisi: 'Petani',
        avatar: '',
        bank: 'BCA',
        noRekening: '5432109876',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Tuti Rahayu',
        posisi: 'Petani',
        avatar: '',
        bank: 'Lainnya',
        noRekening: '0987654321',
        gaji: 3500000,
        status: 'berhasil'
      },
      {
        nama: 'Slamet Riyadi',
        posisi: 'Petani',
        avatar: '',
        bank: 'Mandiri',
        noRekening: '7654321098',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Yanti Susanti',
        posisi: 'Petani',
        avatar: '',
        bank: 'BNI',
        noRekening: '3210987654',
        gaji: 3500000,
        status: 'berhasil'
      },
      {
        nama: 'Rudi Hartono',
        posisi: 'Petani',
        avatar: '',
        bank: 'BRI',
        noRekening: '8765432101',
        gaji: 3500000,
        status: 'proses'
      },
      {
        nama: 'Sri Mulyani',
        posisi: 'Petani',
        avatar: '',
        bank: 'BCA',
        noRekening: '2109876544',
        gaji: 3500000,
        status: 'belum'
      },
      {
        nama: 'Andi Wijaya',
        posisi: 'Petani',
        avatar: '',
        bank: 'Lainnya',
        noRekening: '6543210988',
        gaji: 3500000,
        status: 'berhasil'
      }
    ];

    this.filteredKaryawan = [...this.karyawan];
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
    let data = [...this.karyawan];

    // Filter by status
    if (this.selectedStatus !== 'semua') {
      data = data.filter(item => item.status === this.selectedStatus);
    }

    // Filter by bank
    if (this.selectedBank !== 'semua') {
      data = data.filter(item => item.bank.toLowerCase() === this.selectedBank);
    }

    this.filteredKaryawan = data;
  }

  // ===== PAGINATION =====
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredKaryawan.length / this.rowsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredKaryawan.slice(start, end);
  }

  getPaginationText(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, this.filteredKaryawan.length);
    const total = this.filteredKaryawan.length;
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
    this.totalKaryawan = this.filteredKaryawan.length;
    this.totalBelum = this.filteredKaryawan.filter(k => k.status === 'belum').length;
    this.totalProses = this.filteredKaryawan.filter(k => k.status === 'proses').length;
    this.totalBerhasil = this.filteredKaryawan.filter(k => k.status === 'berhasil').length;
    
    // Hitung total gaji
    let total = 0;
    this.filteredKaryawan.forEach(k => {
      total += k.gaji;
    });
    this.totalGaji = 'Rp ' + total.toLocaleString('id-ID');
  }

  hitungPersentase(status: string): number {
    const total = this.totalKaryawan;
    if (total === 0) return 0;
    
    let count = 0;
    switch(status) {
      case 'belum': count = this.totalBelum; break;
      case 'proses': count = this.totalProses; break;
      case 'berhasil': count = this.totalBerhasil; break;
    }
    return Math.round((count / total) * 100);
  }

  // ===== STATUS HELPERS =====
  getStatusIcon(status: string): string {
    switch(status) {
      case 'belum': return 'time-outline';
      case 'proses': return 'sync-outline';
      case 'berhasil': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  }

  // ===== KIRIM GAJI =====
  kirimGaji(item: any) {
    if (item.status === 'belum') {
      // Ubah status ke proses
      item.status = 'proses';
      this.hitungStatistik();
      
      // Simulasi proses pengiriman
      setTimeout(() => {
        item.status = 'berhasil';
        this.hitungStatistik();
        console.log(`✅ Gaji ${item.nama} berhasil dikirim!`);
        alert(`✅ Gaji ${item.nama} berhasil dikirim!\n\nBank: ${item.bank}\nNo. Rekening: ${item.noRekening}\nNominal: Rp ${item.gaji.toLocaleString('id-ID')}`);
      }, 2000);
    }
  }

  kirimSemuaGaji() {
    const belumBayar = this.karyawan.filter(k => k.status === 'belum');
    if (belumBayar.length === 0) {
      alert('Semua gaji sudah dibayar!');
      return;
    }

    const confirmMsg = `Anda akan mengirim gaji untuk ${belumBayar.length} karyawan dengan total ${this.totalGaji}. Lanjutkan?`;
    if (confirm(confirmMsg)) {
      // Ubah semua status menjadi proses
      belumBayar.forEach(k => k.status = 'proses');
      this.hitungStatistik();

      // Simulasi proses pengiriman semua
      let completed = 0;
      belumBayar.forEach((k, index) => {
        setTimeout(() => {
          k.status = 'berhasil';
          completed++;
          this.hitungStatistik();
          
          if (completed === belumBayar.length) {
            console.log('✅ Semua gaji berhasil dikirim!');
            alert(`✅ Semua gaji berhasil dikirim!\n\nTotal: ${belumBayar.length} karyawan\nTotal Nominal: ${this.totalGaji}`);
          }
        }, 2000 + (index * 500));
      });
    }
  }

  // ===== EXPORT =====
  exportData() {
    console.log('📥 Export data...');
    alert('📥 Data penggajian berhasil diekspor!');
  }

  // ===== NAVIGASI =====
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}