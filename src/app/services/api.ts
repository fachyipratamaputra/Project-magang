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

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // ===== USERS =====
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  // ===== PEKERJA =====
  getPekerja(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pekerja`, { headers: this.getHeaders() });
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

  saveKehadiran(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/kehadiran`, data, { headers: this.getHeaders() });
  }

  deleteKehadiran(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/kehadiran/${id}`, { headers: this.getHeaders() });
  }

  // ===== PEMBAYARAN =====
  getPembayaran(periode?: string): Observable<any> {
    const url = periode ? `${this.baseUrl}/pembayaran?periode=${periode}` : `${this.baseUrl}/pembayaran`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  savePembayaran(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pembayaran`, data, { headers: this.getHeaders() });
  }

  kirimGaji(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/pembayaran/${id}`, { status }, { headers: this.getHeaders() });
  }

  deletePembayaran(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/pembayaran/${id}`, { headers: this.getHeaders() });
  }

  // ===== DASHBOARD =====
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }
}