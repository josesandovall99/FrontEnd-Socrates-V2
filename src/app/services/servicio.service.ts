import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/v1/servicios'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo servicio
  createServicio(servicio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, servicio);
  }
}
