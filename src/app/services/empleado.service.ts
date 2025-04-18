import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../models/empleado.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private baseUrl = 'http://localhost:8080/api/v1/empleados'; // Ajusta si tu backend usa otro path

  constructor(private http: HttpClient) {}

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.baseUrl);
  }

  obtenerEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${id}`);
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, empleado);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.baseUrl}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  verificarCedula(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verificar-cedula/${cedula}`);
  }

  getTecnicos(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`http://localhost:8080/api/v1/empleados?cargo=Tecnico`);
  }
}
