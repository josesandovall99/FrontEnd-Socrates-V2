import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { TipoPlan } from '../models/TipoPlan';
import { Tecnico } from '../models/tecnico.model';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'https://backendsocrates.onrender.com/api/v1/servicios'; // URL de la API

  constructor(private http: HttpClient) {}

  list(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  listTipoPlanes(): Observable<TipoPlan[]> {
    return this.http.get<TipoPlan[]>('https://backendsocrates.onrender.com/api/v1/tipos-planes');
  }
  
  listTecnicos(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>('https://backendsocrates.onrender.com/api/v1/tecnicos');
  }
  
  listClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('https://backendsocrates.onrender.com/api/v1/clientes');
  }
  

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  update(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}