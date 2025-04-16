import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { persona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class personaService {
   private apiUrl = 'https://backendsocrates.onrender.com/api/v1/clientes'; // URL de la API

  constructor(private http: HttpClient) {}

  list(): Observable<persona[]> {
    return this.http.get<persona[]>(this.apiUrl);
  }

  create(servicio: persona): Observable<persona> {
    return this.http.post<persona>(this.apiUrl, servicio);
  }

  update(id: number, servicio: persona): Observable<persona> {
    return this.http.put<persona>(`${this.apiUrl}/${id}`, servicio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}