import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'https://backendsocrates.onrender.com/api/v1/clientes'; // URL completa de la API

  constructor(private http: HttpClient) {}

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  create(tipoPlan: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, tipoPlan);
  }

  update(id: number, tipoPlan: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, tipoPlan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
