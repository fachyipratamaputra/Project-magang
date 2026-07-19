import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState;
  }

  // 🔥 LOGIN DENGAN GOOGLE
  async loginWithGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.afAuth.auth, provider);
      
      // Dapatkan data user
      const user = result.user;
      
      // Simpan data user
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        token: await user.getIdToken()
      };
      
      // Simpan ke localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      return {
        success: true,
        data: userData
      };
    } catch (error: any) {
      console.error('Google Login Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔥 LOGOUT
  async logoutGoogle(): Promise<void> {
    try {
      await signOut(this.afAuth.auth);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // 🔥 CEK STATUS LOGIN
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}