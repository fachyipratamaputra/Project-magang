import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-berita-admin',
  templateUrl: './berita.page.html',
  styleUrls: ['./berita.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class BeritaAdminPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  berita: any[] = [];
  kategoriList: string[] = [];
  isLoading: boolean = false;
  isLoadingModal: boolean = false;
  
  filterStatus: string = 'semua';
  filterKategori: string = 'semua';
  
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;
  
  formData: any = {
    judul: '',
    kategori: '',
    deskripsi: '',
    status: 'publish',
    gambar: null,
    gambarPreview: null,
    existingGambar: null
  };

  apiBaseUrl: string = 'http://localhost:3000';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadBerita();
    this.loadKategori();
  }

  loadBerita() {
    this.isLoading = true;
    let status = this.filterStatus !== 'semua' ? this.filterStatus : undefined;
    let kategori = this.filterKategori !== 'semua' ? this.filterKategori : undefined;

    this.apiService.getBerita(kategori, status).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.berita = res.data || [];
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Gagal memuat berita:', err);
        this.isLoading = false;
        this.setDummyData();
      }
    });
  }

  loadKategori() {
    this.apiService.getKategoriBerita().subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.kategoriList = res.data || [];
        }
      },
      error: (err: any) => {
        console.error('❌ Gagal memuat kategori:', err);
        this.kategoriList = ['Pertanian', 'Teknologi', 'Ekonomi', 'Sosial', 'Politik', 'Komunitas', 'Lainnya'];
      }
    });
  }

  getTotalByStatus(status: string): number {
    return this.berita.filter((item: any) => item.status === status).length;
  }

  openTambahModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = {
      judul: '',
      kategori: '',
      deskripsi: '',
      status: 'publish',
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
      status: item.status || 'publish',
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

  simpanBerita() {
    if (!this.formData.judul || !this.formData.deskripsi || !this.formData.kategori) {
      alert('⚠️ Harap isi semua field yang wajib!');
      return;
    }

    this.isLoadingModal = true;

    const formData = new FormData();
    formData.append('judul', this.formData.judul);
    formData.append('kategori', this.formData.kategori);
    formData.append('deskripsi', this.formData.deskripsi);
    formData.append('status', this.formData.status || 'publish');
    
    if (this.formData.gambar && typeof this.formData.gambar !== 'string') {
      formData.append('gambar', this.formData.gambar);
    }

    if (this.isEditing && this.editingId) {
      this.apiService.updateBerita(this.editingId, formData).subscribe({
        next: (res: any) => {
          this.isLoadingModal = false;
          if (res.status === 'success') {
            alert('✅ Berita berhasil diupdate!');
            this.closeModal();
            this.loadBerita();
          }
        },
        error: (err: any) => {
          this.isLoadingModal = false;
          console.error('❌ Error:', err);
          alert('⚠️ Gagal mengupdate berita!');
        }
      });
    } else {
      this.apiService.createBerita(formData).subscribe({
        next: (res: any) => {
          this.isLoadingModal = false;
          if (res.status === 'success') {
            alert('✅ Berita berhasil ditambahkan!');
            this.closeModal();
            this.loadBerita();
          }
        },
        error: (err: any) => {
          this.isLoadingModal = false;
          console.error('❌ Error:', err);
          alert('⚠️ Gagal menambahkan berita!');
        }
      });
    }
  }

  hapusBerita(item: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus berita "${item.judul}"?`)) {
      this.apiService.deleteBerita(item.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            alert('🗑️ Berita berhasil dihapus!');
            this.loadBerita();
          }
        },
        error: (err: any) => {
          console.error('❌ Error:', err);
          alert('⚠️ Gagal menghapus berita!');
        }
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-news.jpg';
  }

  setDummyData() {
    this.berita = [
      {
        id: 1,
        judul: 'Panen Raya Padi Berhasil',
        deskripsi: 'Petani di Desa Sukamaju berhasil melakukan panen raya dengan hasil 10 ton padi.',
        kategori: 'Pertanian',
        status: 'publish',
        created_at: new Date().toISOString(),
        gambar: null
      },
      {
        id: 2,
        judul: 'Teknologi Irigasi Tetes Modern',
        deskripsi: 'Sistem irigasi tetes mampu menghemat air hingga 60%.',
        kategori: 'Teknologi',
        status: 'draft',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        gambar: null
      }
    ];
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}