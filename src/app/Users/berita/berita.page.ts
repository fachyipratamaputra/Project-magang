import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-berita-users',
  templateUrl: './berita.page.html',
  styleUrls: ['./berita.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class BeritaUsersPage implements OnInit {
  // ===== DATA =====
  berita: any[] = [];
  isLoading: boolean = false;
  isLoadingModal: boolean = false;
  
  // ===== USER =====
  user: any = {};

  // ===== FILTER =====
  filterStatus: string = 'semua';
  filterKategori: string = 'semua';
  kategoriList: string[] = [];

  // ===== MODAL =====
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;

  formData: any = {
    judul: '',
    kategori: '',
    deskripsi: '',
    status: 'pending',
    gambar: null,
    gambarPreview: null,
    existingGambar: null
  };

  // ===== FILE INPUT =====
  @ViewChild('fileInput') fileInput!: ElementRef;

  // ===== API URL =====
  apiBaseUrl: string = 'http://localhost:3000';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    this.loadBerita();
    this.loadKategori();
  }

  // ============================================
  // 🔥 LOAD BERITA DARI DATABASE
  // ============================================
  loadBerita() {
    this.isLoading = true;
    
    let kategori = this.filterKategori !== 'semua' ? this.filterKategori : undefined;
    let status = this.filterStatus !== 'semua' ? this.filterStatus : undefined;

    console.log('📤 Memuat berita dengan filter:', { kategori, status });

    this.apiService.getBerita(kategori, status).subscribe({
      next: (response: any) => {
        console.log('✅ Response berita:', response);
        if (response.status === 'success') {
          this.berita = response.data || [];
          this.updateKategoriList();
        } else {
          this.berita = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Gagal memuat berita:', error);
        this.isLoading = false;
        // ❌ JANGAN PAKAI DUMMY DATA LAGI
        this.berita = [];
        // Tampilkan pesan error ke user
        alert('Gagal memuat berita! Periksa koneksi ke server.');
      }
    });
  }

  // ============================================
  // 🔥 LOAD KATEGORI DARI DATABASE
  // ============================================
  loadKategori() {
    this.apiService.getKategoriBerita().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.kategoriList = response.data || [];
        }
      },
      error: (error) => {
        console.error('❌ Gagal memuat kategori:', error);
      }
    });
  }

  // ============================================
  // UPDATE KATEGORI LIST
  // ============================================
  updateKategoriList() {
    const kategoriSet = new Set<string>();
    this.berita.forEach(item => {
      if (item.kategori) kategoriSet.add(item.kategori);
    });
    // Gabung dengan kategori dari database
    this.apiService.getKategoriBerita().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          const dbKategori = response.data || [];
          dbKategori.forEach((k: string) => kategoriSet.add(k));
          this.kategoriList = Array.from(kategoriSet);
        }
      }
    });
  }

  // ============================================
  // GET TOTAL BY STATUS
  // ============================================
  getTotalByStatus(status: string): number {
    return this.berita.filter(item => item.status === status).length;
  }

  // ============================================
  // MODAL
  // ============================================
  openTambahModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = {
      judul: '',
      kategori: '',
      deskripsi: '',
      status: 'pending',
      gambar: null,
      gambarPreview: null,
      existingGambar: null
    };
    this.isModalOpen = true;
  }

  editBerita(item: any) {
    this.isEditing = true;
    this.editingId = item.id;
    this.formData = {
      judul: item.judul,
      kategori: item.kategori || '',
      deskripsi: item.deskripsi,
      status: item.status || 'pending',
      gambar: null,
      gambarPreview: item.gambar ? this.apiBaseUrl + item.gambar : null,
      existingGambar: item.gambar
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isLoadingModal = false;
  }

  // ============================================
  // FILE UPLOAD
  // ============================================
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 5MB!');
        return;
      }
      this.formData.gambar = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.gambarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.formData.gambar = null;
    this.formData.gambarPreview = null;
    this.formData.existingGambar = null;
    this.fileInput.nativeElement.value = '';
  }

  // ============================================
  // 🔥 SIMPAN BERITA KE DATABASE
  // ============================================
  simpanBerita() {
    if (!this.formData.judul || !this.formData.deskripsi || !this.formData.kategori) {
      alert('Harap isi semua field yang wajib!');
      return;
    }

    this.isLoadingModal = true;

    const formData = new FormData();
    formData.append('judul', this.formData.judul);
    formData.append('kategori', this.formData.kategori);
    formData.append('deskripsi', this.formData.deskripsi);
    formData.append('status', this.formData.status || 'pending');

    // Jika ada gambar baru
    if (this.formData.gambar && typeof this.formData.gambar !== 'string') {
      formData.append('gambar', this.formData.gambar);
    }

    console.log('📤 Mengirim berita:', {
      judul: this.formData.judul,
      kategori: this.formData.kategori,
      deskripsi: this.formData.deskripsi,
      status: this.formData.status,
      hasGambar: !!this.formData.gambar
    });

    if (this.isEditing && this.editingId) {
      // 🔥 UPDATE BERITA
      this.apiService.updateBerita(this.editingId, formData).subscribe({
        next: (response: any) => {
          console.log('✅ Berita diupdate:', response);
          this.isLoadingModal = false;
          if (response.status === 'success') {
            alert('✅ Berita berhasil diupdate!');
            this.closeModal();
            this.loadBerita();
          } else {
            alert(response.message || 'Gagal mengupdate berita!');
          }
        },
        error: (error) => {
          this.isLoadingModal = false;
          console.error('❌ Error update:', error);
          alert('Gagal mengupdate berita! ' + (error.error?.message || ''));
        }
      });
    } else {
      // 🔥 CREATE BERITA
      this.apiService.createBerita(formData).subscribe({
        next: (response: any) => {
          console.log('✅ Berita dibuat:', response);
          this.isLoadingModal = false;
          if (response.status === 'success') {
            alert('✅ Berita berhasil dikirim! Menunggu review admin.');
            this.closeModal();
            this.loadBerita();
          } else {
            alert(response.message || 'Gagal mengirim berita!');
          }
        },
        error: (error) => {
          this.isLoadingModal = false;
          console.error('❌ Error create:', error);
          alert('Gagal mengirim berita! ' + (error.error?.message || ''));
        }
      });
    }
  }

  // ============================================
  // 🔥 HAPUS BERITA DARI DATABASE
  // ============================================
  hapusBerita(item: any) {
    if (confirm(`Batalkan pengiriman berita "${item.judul}"?`)) {
      console.log('🗑️ Menghapus berita ID:', item.id);
      this.apiService.deleteBerita(item.id).subscribe({
        next: (response: any) => {
          console.log('✅ Berita dihapus:', response);
          if (response.status === 'success') {
            alert('🗑️ Berita berhasil dibatalkan!');
            this.loadBerita();
          } else {
            alert(response.message || 'Gagal membatalkan berita!');
          }
        },
        error: (error) => {
          console.error('❌ Error delete:', error);
          alert('Gagal membatalkan berita! ' + (error.error?.message || ''));
        }
      });
    }
  }

  // ============================================
  // HELPER
  // ============================================
  handleImageError(event: any) {
    event.target.src = 'assets/default-news.jpg';
  }

  // ============================================
  // NAVIGASI
  // ============================================
  goBack() {
    this.router.navigate(['/user-dashboard']);
  }
}