import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'profile', loadComponent: () => import('./profil/profil.page').then(m => m.ProfilePage) },  // ✅ ProfilPage → ProfilePage
  { path: 'kehadiran', loadComponent: () => import('./kehadiran/kehadiran.page').then(m => m.KehadiranPage) },
  { path: 'pekerja', loadComponent: () => import('./pekerja/pekerja.page').then(m => m.PekerjaPage) },
  { path: 'pembayaran', loadComponent: () => import('./pembayaran/pembayaran.page').then(m => m.PembayaranPage) },
];