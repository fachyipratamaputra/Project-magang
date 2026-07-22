import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token) {
      // Cek role untuk redirect yang tepat
      const role = user?.role || 'user';
      
      // Jika di admin route tapi user bukan admin
      const currentUrl = this.router.url;
      if (currentUrl.includes('/dashboard') && role !== 'admin') {
        this.router.navigate(['/user-dashboard'], { replaceUrl: true });
        return false;
      }
      if (currentUrl.includes('/user-dashboard') && role === 'admin') {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        return false;
      }
      
      return true;
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}