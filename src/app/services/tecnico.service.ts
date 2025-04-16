import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../models/tecnico.model';

@Injectable({
  providedIn: 'root',
})
export class TecnicoService {
  private apiUrl = 'https://backendsocrates.onrender.com/api/v1/tecnicos';

  constructor(private http: HttpClient) {}

  list(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.apiUrl);
  }

  create(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.post<Tecnico>(this.apiUrl, tecnico);
  }

  update(id: number, tecnico: Tecnico): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${this.apiUrl}/${id}`, tecnico);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
