import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/login';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  // Método para realizar el login y guardar usuario en localStorage
  login(numeroDocumento: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('numeroDocumento', numeroDocumento);
    body.set('password', password);

    return this.http.post(this.apiUrl, body.toString(), { headers }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario)); // Guardamos datos del usuario
          this.authStatus.next(true);
        }
      })
    );
  }

  // Método para cerrar sesión y limpiar almacenamiento
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario'); // Eliminamos también los datos del usuario
    this.authStatus.next(false); // Cambia el estado de autenticación
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Obtiene el estado de autenticación como un Observable
  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  // Actualiza el estado de autenticación manualmente si es necesario
  updateAuthStatus(status: boolean) {
    this.authStatus.next(status);
  }

  // Método para obtener los datos del usuario logueado desde localStorage
  getUsuario(): any {
    return JSON.parse(localStorage.getItem('usuario') || '{}'); // Si no hay datos, devuelve un objeto vacío
  }
}
