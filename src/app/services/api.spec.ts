import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // ==========================================
  // 🔥 INI PENGHUBUNGNYA - URL BACKEND
  // ==========================================
  private baseUrl = 'http://localhost:3000/api';
  private token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
  }

  // ==========================================
  // TOKEN MANAGEMENT
  // ==========================================
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return this.token || localStorage.getItem('token') || '';
  }

  clearToken() {
    this.token = '';
    localStorage.removeItem('token');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  // ==========================================
  // 🔥 TEST KONEKSI KE BACKEND
  // ==========================================
  testConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`);
  }

  // ==========================================
  // 🔐 AUTH - Login, Register, Logout
  // ==========================================
  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // ==========================================
  // 👥 USERS
  // ==========================================
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data, { headers: this.getHeaders() });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  // ==========================================
  // 👨‍🌾 PEKERJA
  // ==========================================
  getPekerja(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pekerja`, { headers: this.getHeaders() });
  }

  getPekerjaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pekerja/${id}`, { headers: this.getHeaders() });
  }

  createPekerja(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pekerja`, data, { headers: this.getHeaders() });
  }

  updatePekerja(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/pekerja/${id}`, data, { headers: this.getHeaders() });
  }

  deletePekerja(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/pekerja/${id}`, { headers: this.getHeaders() });
  }

  // ==========================================
  // 📋 KEHADIRAN
  // ==========================================
  getKehadiran(tanggal?: string): Observable<any> {
    const url = tanggal ? `${this.baseUrl}/kehadiran?tanggal=${tanggal}` : `${this.baseUrl}/kehadiran`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getKehadiranByPekerja(pekerja_id: number, tanggal?: string): Observable<any> {
    const url = tanggal 
      ? `${this.baseUrl}/kehadiran?pekerja_id=${pekerja_id}&tanggal=${tanggal}`
      : `${this.baseUrl}/kehadiran?pekerja_id=${pekerja_id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  saveKehadiran(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/kehadiran`, data, { headers: this.getHeaders() });
  }

  absen(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/kehadiran/absen`, data, { headers: this.getHeaders() });
  }

  deleteKehadiran(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/kehadiran/${id}`, { headers: this.getHeaders() });
  }

  getKehadiranStats(tanggal?: string): Observable<any> {
    const url = tanggal ? `${this.baseUrl}/kehadiran/stats?tanggal=${tanggal}` : `${this.baseUrl}/kehadiran/stats`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==========================================
  // 💰 PEMBAYARAN
  // ==========================================
  getPembayaran(periode?: string): Observable<any> {
    const url = periode ? `${this.baseUrl}/pembayaran?periode=${periode}` : `${this.baseUrl}/pembayaran`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getPembayaranByPekerja(pekerja_id: number, periode?: string): Observable<any> {
    const url = periode 
      ? `${this.baseUrl}/pembayaran?pekerja_id=${pekerja_id}&periode=${periode}`
      : `${this.baseUrl}/pembayaran?pekerja_id=${pekerja_id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  savePembayaran(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pembayaran`, data, { headers: this.getHeaders() });
  }

  kirimGaji(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/pembayaran/${id}`, { status }, { headers: this.getHeaders() });
  }

  kirimSemuaGaji(periode?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pembayaran/kirim-semua`, { periode }, { headers: this.getHeaders() });
  }

  deletePembayaran(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/pembayaran/${id}`, { headers: this.getHeaders() });
  }

  getPembayaranStats(periode?: string): Observable<any> {
    const url = periode ? `${this.baseUrl}/pembayaran/stats?periode=${periode}` : `${this.baseUrl}/pembayaran/stats`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==========================================
// 📰 BERITA
// ==========================================
getBerita(kategori?: string, status?: string): Observable<any> {
    let url = `${this.baseUrl}/berita`;
    const params = [];
    if (kategori && kategori !== 'semua') params.push(`kategori=${kategori}`);
    if (status && status !== 'semua') params.push(`status=${status}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get(url, { headers: this.getHeaders() });
}

getBeritaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/berita/${id}`, { headers: this.getHeaders() });
}

createBerita(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/berita`, data, { 
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        })
    });
}

updateBerita(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/berita/${id}`, data, {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        })
    });
}

deleteBerita(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/berita/${id}`, { headers: this.getHeaders() });
}

getKategoriBerita(): Observable<any> {
    return this.http.get(`${this.baseUrl}/berita/kategori/list`, { headers: this.getHeaders() });
}

  // ==========================================
  // 📊 DASHBOARD
  // ==========================================
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }
}