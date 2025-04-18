import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/v1/servicios'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  // Crear un nuevo servicio
  createServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  // Actualizar un servicio
  updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  // Cambiar estado de servicio (Desactivar o Reactivar)
  cambiarEstadoServicio(id: number, estado: string): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}`, { estado });
  }
}
