import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-notifikasi-admin',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NotifikasiAdminPage implements OnInit {
  notifikasi: any[] = [];
  filterStatus: string = 'semua';
  pendingCount: number = 0;
  isLoading: boolean = false;

  // Modal Approve
  isApproveModalOpen: boolean = false;
  selectedNotifikasi: any = null;
  pesanAdmin: string = '';

  // Modal Reject
  isRejectModalOpen: boolean = false;

  // 🔥 Modal Lightbox - lihat foto full-size
  isImageModalOpen: boolean = false;
  previewImageUrl: string | null = null;

  // 🔥 API Base URL untuk gambar
  apiBaseUrl: string = 'http://localhost:3000';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadNotifikasi();
    this.loadPendingCount();
  }

  loadNotifikasi() {
    this.isLoading = true;
    const status = this.filterStatus !== 'semua' ? this.filterStatus : undefined;
    
    this.apiService.getNotifikasi(status).subscribe({
      next: (res: any) => {
        this.notifikasi = res.data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Gagal memuat notifikasi:', err);
        this.isLoading = false;
        this.setDummyData();
      }
    });
  }

  loadPendingCount() {
    this.apiService.getCountNotifikasiPending().subscribe({
      next: (res: any) => {
        this.pendingCount = res.data?.total || 0;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // ===== APPROVE =====
  approveNotifikasi(item: any) {
    this.selectedNotifikasi = item;
    this.pesanAdmin = '';
    this.isApproveModalOpen = true;
  }

  submitApprove() {
    if (!this.selectedNotifikasi) return;

    this.apiService.approveNotifikasi(this.selectedNotifikasi.id, this.pesanAdmin).subscribe({
      next: () => {
        this.loadNotifikasi();
        this.loadPendingCount();
        this.closeApproveModal();
        alert('✅ Notifikasi berhasil disetujui!');
      },
      error: (err: any) => {
        console.error(err);
        alert('⚠️ Gagal menyetujui notifikasi!');
      }
    });
  }

  closeApproveModal() {
    this.isApproveModalOpen = false;
    this.selectedNotifikasi = null;
    this.pesanAdmin = '';
  }

  // ===== REJECT =====
  rejectNotifikasi(item: any) {
    this.selectedNotifikasi = item;
    this.pesanAdmin = '';
    this.isRejectModalOpen = true;
  }

  submitReject() {
    if (!this.selectedNotifikasi || !this.pesanAdmin) {
      alert('⚠️ Harap berikan alasan penolakan!');
      return;
    }

    this.apiService.rejectNotifikasi(this.selectedNotifikasi.id, this.pesanAdmin).subscribe({
      next: () => {
        this.loadNotifikasi();
        this.loadPendingCount();
        this.closeRejectModal();
        alert('❌ Notifikasi berhasil ditolak!');
      },
      error: (err: any) => {
        console.error(err);
        alert('⚠️ Gagal menolak notifikasi!');
      }
    });
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.selectedNotifikasi = null;
    this.pesanAdmin = '';
  }

  // ===== DELETE =====
  hapusNotifikasi(item: any) {
    if (confirm(`Hapus notifikasi "${item.title || item.judul}"?`)) {
      this.apiService.deleteNotifikasi(item.id).subscribe({
        next: () => {
          this.loadNotifikasi();
          this.loadPendingCount();
          alert('✅ Notifikasi berhasil dihapus!');
        },
        error: (err: any) => {
          console.error(err);
          alert('⚠️ Gagal menghapus notifikasi!');
        }
      });
    }
  }

  // ============================================
  // 🔥 LIGHTBOX - LIHAT FOTO FULL-SIZE
  // ============================================
  openImagePreview(url: string) {
    this.previewImageUrl = url;
    this.isImageModalOpen = true;
  }

  closeImagePreview() {
    this.isImageModalOpen = false;
    this.previewImageUrl = null;
  }

  // ============================================
  // DATA DUMMY
  // ============================================
  setDummyData() {
    this.notifikasi = [
      {
        id: 1,
        title: '📰 Berita Baru dari yulita',
        message: 'User "yulita" mengirimkan berita baru:\n\n📌 Judul: Panen Raya Padi Berhasil\n📂 Kategori: Pertanian',
        type: 'warning',
        status: 'pending',
        created_at: new Date().toISOString(),
        user_nama: 'yulita',
        gambar: null
      },
      {
        id: 2,
        title: '✅ Berita Disetujui',
        message: 'Berita "Teknologi Irigasi Tetes Modern" telah disetujui.',
        type: 'success',
        status: 'approve',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user_nama: 'fachyi',
        gambar: null
      }
    ];
  }

  // ============================================
  // NAVIGASI
  // ============================================
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}