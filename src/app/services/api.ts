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

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return this.token || localStorage.getItem('token') || '';
  }

  // 🔥 CLEAR TOKEN - HAPUS SEMUA DATA SESSION
  clearToken(): void {
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

  // ===== TEST KONEKSI =====
  testConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`);
  }

  // ===== AUTH =====
  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: { nama: string, username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  checkUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/check-username?username=${username}`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // ===== USERS =====
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

  // ===== PEKERJA =====
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

  // ===== KEHADIRAN =====
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

  // ===== PEMBAYARAN =====
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

  // ===== DASHBOARD =====
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }

  // ===== LAHAN =====
  getLahan(): Observable<any> {
    return this.http.get(`${this.baseUrl}/lahan`, { headers: this.getHeaders() });
  }

  getLahanById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lahan/${id}`, { headers: this.getHeaders() });
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

  // ===== TANAMAN =====
  getTanaman(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tanaman`, { headers: this.getHeaders() });
  }

  getTanamanById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tanaman/${id}`, { headers: this.getHeaders() });
  }

  createTanaman(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tanaman`, data, { headers: this.getHeaders() });
  }

  updateTanaman(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tanaman/${id}`, data, { headers: this.getHeaders() });
  }

  deleteTanaman(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tanaman/${id}`, { headers: this.getHeaders() });
  }

  // ===== PANEN =====
  getPanen(): Observable<any> {
    return this.http.get(`${this.baseUrl}/panen`, { headers: this.getHeaders() });
  }

  getPanenById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/panen/${id}`, { headers: this.getHeaders() });
  }

  createPanen(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/panen`, data, { headers: this.getHeaders() });
  }

  updatePanen(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/panen/${id}`, data, { headers: this.getHeaders() });
  }

  deletePanen(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/panen/${id}`, { headers: this.getHeaders() });
  }
}