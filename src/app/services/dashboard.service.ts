import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // Asegúrate de no tener una barra adicional al final:
  private API_URL = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getTiposPlanesCount(): Observable<number> {
    return this.http
      .get(`${this.API_URL}/tipos_planes/count`, { responseType: 'text' })
      .pipe(map(response => Number(response)));
  }

  getClientesCount(): Observable<number> {
    return this.http
      .get(`${this.API_URL}/clientes/count`, { responseType: 'text' })
      .pipe(map(response => Number(response)));
  }

    getEmpleadosCount(): Observable<number> {
        return this.http
        .get(`${this.API_URL}/empleados/count`, { responseType: 'text' })
        .pipe(map(response => Number(response)));
    }
}
