import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/v1/clientes'; // Asegúrate de que la URL sea correcta

  constructor(private http: HttpClient) {}

  // Crear cliente
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // Listar todos los clientes
  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  obtenerClientePorId(id: number): Observable<Cliente> {  // Cambié a 'number'
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Eliminar cliente
  eliminarCliente(id: number): Observable<void> {  // Cambié a 'number'
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Actualizar cliente
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {  // Cambié a 'number'
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  verificarCedulaExistente(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar-cedula/${cedula}`);
  }
}
