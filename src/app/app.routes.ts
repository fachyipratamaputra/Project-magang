import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ===== REDIRECT =====
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // ===== AUTH (tanpa guard) =====
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) 
  },

  // ===== ADMIN DASHBOARD =====
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },

  // ===== USERS DASHBOARD =====
  { 
    path: 'user-dashboard', 
    loadComponent: () => import('./Users/dashboard/dashboard.page').then(m => m.UserDashboardPage),
    canActivate: [AuthGuard]
  },

  // ===== USERS PROFIL =====
  { 
    path: 'user-profil', 
    loadComponent: () => import('./Users/profil/profil.page').then(m => m.ProfilUsersPage),
    canActivate: [AuthGuard]
  },

  // ===== USERS ABSENSI =====
  { 
    path: 'user-absensi', 
    loadComponent: () => import('./Users/absen/absen.page').then(m => m.AbsensiUsersPage),
    canActivate: [AuthGuard]
  },

  // ===== USERS GAJI =====
  { 
    path: 'user-gaji', 
    loadComponent: () => import('./Users/gaji/gaji.page').then(m => m.GajiUsersPage),
    canActivate: [AuthGuard]
  },

  // ===== USERS LAHAN =====
  { 
    path: 'user-lahan', 
    loadComponent: () => import('./Users/lahan/lahan.page').then(m => m.LahanUsersPage),
    canActivate: [AuthGuard]
  },

  // ==========================================
  // 🔥 USERS BERITA
  // ==========================================
  { 
    path: 'user-berita', 
    loadComponent: () => import('./Users/berita/berita.page').then(m => m.BeritaUsersPage),
    canActivate: [AuthGuard]
  },


  // ==========================================
  // 🔥 USERS NOTIFIKASI
  // ==========================================
  { 
    path: 'user-notifikasi', 
    loadComponent: () => import('./Users/notifikasi/notifikasi.page').then(m => m.NotifikasiUsersPage),
    canActivate: [AuthGuard]
  },

  // ==========================================
  // 🔥 ADMIN BERITA
  // ==========================================
  { 
    path: 'admin-berita', 
    loadComponent: () => import('./berita/berita.page').then(m => m.BeritaAdminPage),
    canActivate: [AuthGuard]
  },

  // ==========================================
  // 🔥 ADMIN NOTIFIKASI
  // ==========================================
  { 
    path: 'admin-notifikasi', 
    loadComponent: () => import('./notifikasi/notifikasi.page').then(m => m.NotifikasiAdminPage),
    canActivate: [AuthGuard]
  },

  // ==========================================
  // 🔥 FITUR ADMIN LAINNYA
  // ==========================================
  { 
    path: 'profile', 
    loadComponent: () => import('./profil/profil.page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'kehadiran', 
    loadComponent: () => import('./kehadiran/kehadiran.page').then(m => m.KehadiranPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pekerja', 
    loadComponent: () => import('./pekerja/pekerja.page').then(m => m.PekerjaPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pembayaran', 
    loadComponent: () => import('./pembayaran/pembayaran.page').then(m => m.PembayaranPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'tanaman', 
    loadComponent: () => import('./tanaman/tanaman.page').then(m => m.TanamanPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'panen', 
    loadComponent: () => import('./panen/panen.page').then(m => m.PanenPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'lahan', 
    loadComponent: () => import('./lahan/lahan.page').then(m => m.LahanPage),
    canActivate: [AuthGuard]
  },

  // ===== WILDCARD (404) =====
  { path: '**', redirectTo: 'login' }
];