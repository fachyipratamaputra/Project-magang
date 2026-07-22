import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  private token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
  }

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
    localStorage.removeItem('user');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  // ==========================================
  // TEST
  // ==========================================
  testConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`);
  }

  // ==========================================
  // AUTH
  // ==========================================
  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  checkUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/check-username?username=${username}`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // ==========================================
  // USERS
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
  // PEKERJA
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
  // KEHADIRAN
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
  // PEMBAYARAN
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
  // 📰 BERITA (UNIVERSAL)
  // ==========================================
  getBerita(kategori?: string, status?: string): Observable<any> {
    let url = `${this.baseUrl}/berita`;
    const params = [];
    if (kategori && kategori !== 'semua' && kategori !== '') {
      params.push(`kategori=${encodeURIComponent(kategori)}`);
    }
    if (status && status !== 'semua' && status !== '') {
      params.push(`status=${encodeURIComponent(status)}`);
    }
    if (params.length) {
      url += `?${params.join('&')}`;
    }
    return this.http.get(url, { headers: this.getHeaders() });
  }

  createBerita(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.baseUrl}/berita`, data, { headers });
  }

  updateBerita(id: number, data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.baseUrl}/berita/${id}`, data, { headers });
  }

  deleteBerita(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/berita/${id}`, { headers: this.getHeaders() });
  }

  getKategoriBerita(): Observable<any> {
    return this.http.get(`${this.baseUrl}/berita/kategori/list`, { headers: this.getHeaders() });
  }

  getBeritaPublic(kategori?: string, limit?: number): Observable<any> {
    let url = `${this.baseUrl}/berita/public`;
    const params = [];
    if (kategori && kategori !== 'semua' && kategori !== '') {
      params.push(`kategori=${encodeURIComponent(kategori)}`);
    }
    if (limit) {
      params.push(`limit=${limit}`);
    }
    if (params.length) {
      url += `?${params.join('&')}`;
    }
    return this.http.get(url);
  }

  // ==========================================
  // 🔔 NOTIFIKASI
  // ==========================================
  getNotifikasi(status?: string): Observable<any> {
    const url = status ? `${this.baseUrl}/notifikasi?status=${status}` : `${this.baseUrl}/notifikasi`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getNotifikasiByUser(user_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifikasi/user/${user_id}`, { headers: this.getHeaders() });
  }

  getNotifikasiById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifikasi/${id}`, { headers: this.getHeaders() });
  }

  createNotifikasi(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.baseUrl}/notifikasi`, data, { headers });
  }

  approveNotifikasi(id: number, pesan_admin?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifikasi/${id}/approve`, { pesan_admin }, { headers: this.getHeaders() });
  }

  rejectNotifikasi(id: number, pesan_admin?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifikasi/${id}/reject`, { pesan_admin }, { headers: this.getHeaders() });
  }

  deleteNotifikasi(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifikasi/${id}`, { headers: this.getHeaders() });
  }

  getCountNotifikasiPending(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifikasi/count/pending`, { headers: this.getHeaders() });
  }

  markNotifikasiRead(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifikasi/${id}/read`, {}, { headers: this.getHeaders() });
  }

  markAllNotifikasiRead(ids: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifikasi/mark-all-read`, { ids }, { headers: this.getHeaders() });
  }

  // ==========================================
  // LAHAN
  // ==========================================
  getLahan(): Observable<any> {
    return this.http.get(`${this.baseUrl}/lahan`, { headers: this.getHeaders() });
  }

  getLahanById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lahan/${id}`, { headers: this.getHeaders() });
  }

  getLahanByPekerja(pekerja_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lahan/pekerja/${pekerja_id}`, { headers: this.getHeaders() });
  }

  createLahan(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/lahan`, data, { headers: this.getHeaders() });
  }

  updateLahan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/lahan/${id}`, data, { headers: this.getHeaders() });
  }

  deleteLahan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lahan/${id}`, { headers: this.getHeaders() });
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }
}