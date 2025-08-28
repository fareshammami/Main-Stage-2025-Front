import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InduError } from '../Models/indu-error.model';
import { Compensation } from '../Models/compensation.model';

@Injectable({
  providedIn: 'root'
})
export class InduErrorService {

  private baseUrl = 'http://localhost:8080/indu-errors';

  constructor(private http: HttpClient) { }

  initializeGroup(userId: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/init`, { userId }, { responseType: 'text' });
  }

  addInduError(userId: string, amount: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/add`, { userId, amount }, { responseType: 'text' });
  }

  addCompensation(userId: string, amount: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/compensation`, { userId, amount }, { responseType: 'text' });
  }

  processErrors(userId: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/process`, { userId }, { responseType: 'text' });
  }

  getEventStream(
  userId: string,
  filter: string = 'ALL',
  page: number = 0,
  size: number = 10,
  eventType: string = '',
  fromDate: string = '',
  toDate: string = ''
): Observable<any[]> {
  let url = `${this.baseUrl}/stream/${userId}?filter=${filter}&page=${page}&size=${size}`;
  if (eventType) url += `&eventType=${eventType}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;
  return this.http.get<any[]>(url);
}
}