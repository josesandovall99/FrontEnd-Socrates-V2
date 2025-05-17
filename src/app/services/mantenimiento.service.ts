import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mantenimiento } from '../models/mantenimiento.model';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private apiUrl = 'http://localhost:8080/api/v1/mantenimientos'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener lista de mantenimientos
  list(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  // Crear un mantenimiento nuevo
  create(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(this.apiUrl, mantenimiento);
  }

  // Actualizar mantenimiento existente
  update(id: number, mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(`${this.apiUrl}/${id}`, mantenimiento);
  }

  // Eliminar mantenimiento
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
