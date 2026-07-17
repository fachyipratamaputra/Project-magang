import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'profile', loadComponent: () => import('./profil/profil.page').then(m => m.ProfilePage) },
  { path: 'kehadiran', loadComponent: () => import('./kehadiran/kehadiran.page').then(m => m.KehadiranPage) },
  { path: 'pekerja', loadComponent: () => import('./pekerja/pekerja.page').then(m => m.PekerjaPage) },
  { path: 'pembayaran', loadComponent: () => import('./pembayaran/pembayaran.page').then(m => m.PembayaranPage) },
  { path: 'tanaman', loadComponent: () => import('./tanaman/tanaman.page').then(m => m.TanamanPage) },
  { path: 'panen', loadComponent: () => import('./panen/panen.page').then(m => m.PanenPage) },
  { path: 'lahan', loadComponent: () => import('./lahan/lahan.page').then(m => m.LahanPage) },
];