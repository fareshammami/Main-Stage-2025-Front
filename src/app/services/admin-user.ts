import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUser {

  private baseUrl = 'http://localhost:8080/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-keycloak`, { headers: this.getAuthHeaders() });
  }

  validateUser(userId: string): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.baseUrl}/validate/${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  changeRole(userId: string, role: 'admin' | 'user') {
    return this.http.post<{ status: string; message: string }>(
      `${this.baseUrl}/${userId}/role`,
      { role },
      { headers: this.getAuthHeaders() }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
