import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../Models/user-dto.model';

export interface User {
  id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  createUser(username: string, email: string): Observable<User> {
    return this.http.post<User>(this.baseUrl, { username, email });
  }

  getAllUsers(page: number, size: number): Observable<{ content: UserDto[], totalPages: number, totalElements: number }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<{ content: UserDto[], totalPages: number, totalElements: number }>(this.baseUrl, { params });
  }


  getUsername(userId: string): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.baseUrl}/${userId}/username`);
  }

  searchUsersByEmail(email: string, page: number, size: number): Observable<{ content: UserDto[], totalPages: number, totalElements: number }> {
  const params = { email, page: page.toString(), size: size.toString() };
  return this.http.get<{ content: UserDto[], totalPages: number, totalElements: number }>(`${this.baseUrl}/search`, { params });
}

  getUsersByMaxAmount(max: number, page: number, size: number) {
  const params = {
    maxAmount: max.toString(),
    page: page.toString(),
    size: size.toString()
  };
  return this.http.get<{ content: UserDto[], totalPages: number, totalElements: number }>(
    `${this.baseUrl}/search-by-amount`,
    { params }
  );
}
  searchUsersCombined(email: string, max: number, page: number, size: number) {
  const params = {
    email,
    maxAmount: max.toString(),
    page: page.toString(),
    size: size.toString()
  };
  return this.http.get<{ content: UserDto[], totalPages: number, totalElements: number }>(
    `${this.baseUrl}/search-combined`,
    { params }
  );
}

}
