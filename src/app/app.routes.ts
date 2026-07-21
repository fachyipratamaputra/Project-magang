import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },
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
  { path: '**', redirectTo: 'login' },
  {
    path: 'berita',
    loadComponent: () => import('./berita/berita.page').then( m => m.BeritaPage)
  }
];