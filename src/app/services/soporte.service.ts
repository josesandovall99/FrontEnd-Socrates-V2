import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Soporte } from '../models/soporte.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
  private baseUrl = 'http://localhost:8080/api/v1/soportes'; // Ajusta al endpoint real

  constructor(private http: HttpClient) {}

  getSoportes(): Observable<Soporte[]> {
    return this.http.get<Soporte[]>(`${this.baseUrl}`);
  }

  getSoporteById(id: number): Observable<Soporte> {
    return this.http.get<Soporte>(`${this.baseUrl}/${id}`);
  }

  createSoporte(soporte: Soporte): Observable<Soporte> {
    return this.http.post<Soporte>(`${this.baseUrl}`, soporte);
  }

  updateSoporte(id: number, soporte: Soporte): Observable<Soporte> {
    return this.http.put<Soporte>(`${this.baseUrl}/${id}`, soporte);
  }

  deleteSoporte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
