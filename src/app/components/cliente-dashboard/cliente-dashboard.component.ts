import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente.model";

@Component({
  selector: "app-empleado-cliente",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="secretaria-management">
      <div class="header">
        <h1>Gestionar Clientes</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Cliente
        </button>
      </div>

      <div *ngIf="showForm" class="secretaria-form">
        <h2>{{ editingCliente ? "Editar" : "Agregar" }} Cliente</h2>

        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input id="nombre" type="text" formControlName="nombre" required />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input id="telefono" type="text" formControlName="telefono" required />
          </div>

          <div class="form-group">
            <label for="correo">Correo:</label>
            <input id="correo" type="email" formControlName="correo" required />
          </div>

          <div class="form-group">
            <label for="numeroDocumento">Número de Documento:</label>
            <input id="numeroDocumento" type="text" formControlName="numeroDocumento" required />
          </div>

          <div class="form-group">
            <label for="tipoDocumento">Tipo identificación:</label>
            <select id="tipoDocumento" formControlName="tipoDocumento" required>
              <option value="">Seleccione una opción</option>
              <option *ngFor="let tipo of tiposDocumento" [value]="tipo.valor">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="sexo">Género:</label>
            <select id="sexo" formControlName="sexo" required>
              <option value="">Seleccione una opción</option>
              <option *ngFor="let gen of generos" [value]="gen.valor">
                {{ gen.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input id="direccion" type="text" formControlName="direccion" required />
          </div>

          <div class="form-group">
            <label for="tipoServicio">Tipo servicio:</label>
            <input id="tipoServicio" type="text" formControlName="tipoServicio" required />
          </div>

          <div class="form-group">
            <label for="fechaRegistro">Fecha registro:</label>
            <input id="fechaRegistro" type="text" formControlName="fechaRegistro" readonly />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="secretaria-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo documento</th>
              <th>Número documento</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Tipo servicio</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes">
              <td>{{ cliente.nombre }}</td>
              <td>{{ getTipoDocumentoNombre(cliente.tipoDocumento) }}</td>
              <td>{{ cliente.numeroDocumento }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.correo }}</td>
              <td>{{ cliente.tipoServicio }}</td>
              <td>{{ cliente.fechaRegistro }}</td>
              <td class="actions">
                <button (click)="editCliente(cliente)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteCliente(cliente.id)" class="btn-delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .secretaria-management {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-add {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .secretaria-form {
      margin-top: 20px;
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .btn-save {
      padding: 8px 16px;
      background-color: #28a745;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .btn-cancel {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .secretaria-table {
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #dee2e6;
      padding: 10px;
      text-align: left;
    }

    .actions button {
      margin-right: 5px;
      background: none;
      border: none;
      cursor: pointer;
    }

    .btn-edit i {
      color: #ffc107;
    }

    .btn-delete i {
      color: #dc3545;
    }
  `]
})
export class clienteComponent implements OnInit {
  clientes: Cliente[] = [];
  showForm = false;
  editingCliente: Cliente | null = null;
  form: FormGroup;

  tiposDocumento = [
    { valor: 'CC', nombre: 'Cédula de ciudadanía' },
    { valor: 'PP', nombre: 'Pasaporte' }
  ];

  generos = [
    { valor: 'M', nombre: 'Masculino' },
    { valor: 'F', nombre: 'Femenino' }
  ];

  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nombre: ["", Validators.required],
      telefono: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      numeroDocumento: ["", Validators.required],
      tipoDocumento: ["", Validators.required],
      sexo: ["", Validators.required],
      direccion: ["", Validators.required],
      tipoServicio: ["", Validators.required],
      fechaRegistro: [{ value: "", disabled: true }],
      cargo: ["CLIENTE"],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }

  loadClientes() {
    this.clienteService.list().subscribe({
      next: (clientes) => {
        this.clientes = clientes.filter(cliente => cliente.cargo === 'CLIENTE');
      },
      error: (err) => console.error("Error al cargar clientes:", err),
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingCliente = null;
    this.form.reset();
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`; // formato: dd/mm/yyyy
  
    this.form.patchValue({
      cargo: 'CLIENTE',
      estado: true,
      fechaRegistro: fechaFormateada
    });
  }
  

  create() {
    if (this.form.valid) {
      const clienteData = {
        ...this.form.getRawValue(), // incluye los campos deshabilitados como fechaRegistro
        cargo: 'CLIENTE'
      };

      if (this.editingCliente?.id) {
        this.clienteService.update(this.editingCliente.id, clienteData).subscribe({
          next: () => {
            alert("Cliente actualizado con éxito");
            this.loadClientes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el cliente");
          },
        });
      } else {
        this.clienteService.create(clienteData).subscribe({
          next: () => {
            alert("Cliente creado con éxito");
            this.loadClientes();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el cliente");
          },
        });
      }
    }
  }

  editCliente(cliente: Cliente) {
    this.showForm = true;
    this.editingCliente = cliente;
    this.form.patchValue(cliente);
  }

  deleteCliente(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          alert("Cliente eliminado con éxito");
          this.loadClientes();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el cliente");
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingCliente = null;
    this.form.reset();
  }
}
