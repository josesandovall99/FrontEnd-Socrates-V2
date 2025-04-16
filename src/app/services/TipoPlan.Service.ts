import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoPlan } from '../models/TipoPlan';

@Injectable({
  providedIn: 'root'
})
export class TipoPlanService {
  private apiUrl = 'https://backendsocrates.onrender.com/api/v1/tipos_planes'; // URL completa de la API

  constructor(private http: HttpClient) {}

  list(): Observable<TipoPlan[]> {
    return this.http.get<TipoPlan[]>(this.apiUrl);
  }

  create(tipoPlan: TipoPlan): Observable<TipoPlan> {
    return this.http.post<TipoPlan>(this.apiUrl, tipoPlan);
  }

  update(id: number, tipoPlan: TipoPlan): Observable<TipoPlan> {
    return this.http.put<TipoPlan>(`${this.apiUrl}/${id}`, tipoPlan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
