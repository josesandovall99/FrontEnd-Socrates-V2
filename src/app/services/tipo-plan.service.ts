import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoPlan } from '../models/tipo-plan.model'; 

@Injectable({
  providedIn: 'root'
})
export class TipoPlanService {
  private apiUrl = 'http://localhost:8080/api/v1/tipos_planes';

  constructor(private http: HttpClient) {}

  // Obtener todos los tipos de planes
  getTipoPlanes(): Observable<TipoPlan[]> {
    return this.http.get<TipoPlan[]>(this.apiUrl);
  }

  // Crear un nuevo tipo de plan
  createTipoPlan(tipoPlan: TipoPlan): Observable<TipoPlan> {
    return this.http.post<TipoPlan>(this.apiUrl, tipoPlan);
  }

  // Actualizar un tipo de plan
  updateTipoPlan(id: number, tipoPlan: TipoPlan): Observable<TipoPlan> {
    return this.http.put<TipoPlan>(`${this.apiUrl}/${id}`, tipoPlan); // 🔧 Usamos `PUT`
  }

  // Eliminar (desactivar) un tipo de plan cambiando el estado a `false`
  eliminarTipoPlan(id: number): Observable<TipoPlan> {
    return this.http.patch<TipoPlan>(`${this.apiUrl}/${id}`, { estado: false }); // 🔧 Usamos `PATCH`
  }
}
