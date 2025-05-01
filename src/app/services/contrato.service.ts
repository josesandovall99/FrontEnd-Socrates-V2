import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrato } from '../models/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private apiUrl = 'http://localhost:8080/api/v1/contratos';

  constructor(private http: HttpClient) {}

  // Obtener todos los contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  // Crear un nuevo contrato
  createContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.apiUrl, contrato);
  }

  // Actualizar un contrato
  updateContrato(id: number, contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.apiUrl}/${id}`, contrato);
  }

  // Eliminar (desactivar) un contrato cambiando su estado a false
  eliminarContrato(id: number): Observable<Contrato> {
    return this.http.patch<Contrato>(`${this.apiUrl}/${id}`, { estado: false });
  }
}

  