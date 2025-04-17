import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPlanService {
    private apiUrl = 'http://localhost:8080/api/v1/tipos_planes'; // <-- Corrección aquí


  constructor(private http: HttpClient) {}

  // Obtener todos los tipos de planes
  getTipoPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo tipo de plan
  createTipoPlan(tipoPlan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tipoPlan);
  }
}
