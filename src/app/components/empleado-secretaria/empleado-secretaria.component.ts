import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { personaService } from "src/app/services/persona.service";
import { persona } from "src/app/models/persona.model";

@Component({
  selector: "app-empleado-secretaria",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="secretaria-management">
      <div class="header">
        <h1>Gestionar Secretarias</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Secretaria
        </button>
      </div>

      <div *ngIf="showForm" class="secretaria-form">
        <h2>{{ editingSecretaria ? "Editar" : "Agregar" }} Secretaria</h2>

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
            <select id="tipoDocumento" formControlName="tipoDocumento" required class="form-control">
              <option value="">Seleccione una opción</option>
              <option *ngFor="let tipo of tiposDocumento" [value]="tipo.valor" [selected]="form.get('tipoDocumento')?.value === tipo.valor">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="sexo">Género:</label>
            <select id="sexo" formControlName="sexo" required class="form-control">
              <option value="">Seleccione una opción</option>
              <option *ngFor="let gen of generos" [value]="gen.valor" [selected]="form.get('sexo')?.value === gen.valor">
                {{ gen.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input id="direccion" type="text" formControlName="direccion" required />
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let secretaria of secretarias">
              <td>{{ secretaria.nombre }}</td>
              <td>{{ getTipoDocumentoNombre(secretaria.tipoDocumento) }}</td>
              <td>{{ secretaria.numeroDocumento }}</td>
              <td>{{ secretaria.telefono }}</td>
              <td>{{ secretaria.correo }}</td>
              <td class="actions">
                <button (click)="editSecretaria(secretaria)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteSecretaria(secretaria.id)" class="btn-delete">
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
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }

    .btn-add {
      background-color: #3498db;
      color: white;
      padding: 0.5rem 1.2rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .btn-add i {
      margin-right: 0.5rem;
    }

    .secretaria-form {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
    }

    .secretaria-form h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.3rem;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.3rem;
    }

    .form-actions {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }

    .btn-save {
      background-color: #27ae60;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .btn-cancel {
      background-color: #e74c3c;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
    }

    .secretaria-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .secretaria-table th, .secretaria-table td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    .secretaria-table th {
      background-color: #ecf0f1;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .btn-edit i {
      color: #f39c12;
    }

    .btn-delete i {
      color: #c0392b;
    }
  `]
})
export class EmpleadoSecretariaComponent implements OnInit {
  secretarias: persona[] = [];
  showForm = false;
  editingSecretaria: persona | null = null;
  form: FormGroup;

  tiposDocumento = [
    { valor: 'CC', nombre: 'Cédula de ciudadanía' },
    { valor: 'PP', nombre: 'Pasaporte' }
  ];

  generos = [
    { valor: 'M', nombre: 'Masculino' },
    { valor: 'F', nombre: 'Femenino' }
  ];

  private secretariaService = inject(personaService);
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
      cargo: ["SECRETARIA"],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadSecretarias();
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }

  loadSecretarias() {
    this.secretariaService.list().subscribe({
      next: (secretarias) => {
        this.secretarias = secretarias.filter(secretaria => secretaria.cargo === 'SECRETARIA');
      },
      error: (err) => console.error("Error al cargar secretarias:", err),
    });
  }
  
  

  showAddForm() {
    this.showForm = true;
    this.editingSecretaria = null;
    this.form.reset({ 
      estado: true,
      cargo: 'SECRETARIA'
    });
  }

  create() {
    if (this.form.valid) {
      const secretariaData = this.form.value;

      if (this.editingSecretaria?.id) {
        this.secretariaService.update(this.editingSecretaria.id, secretariaData).subscribe({
          next: () => {
            alert("Secretaria actualizada con éxito");
            this.loadSecretarias();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar la secretaria");
          },
        });
      } else {
        this.secretariaService.create(secretariaData).subscribe({
          next: () => {
            alert("Secretaria creada con éxito");
            this.loadSecretarias();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear la secretaria");
          },
        });
      }
    }
  }

  editSecretaria(secretaria: persona) {
    this.showForm = true;
    this.editingSecretaria = secretaria;
    
    this.form.patchValue({
      ...secretaria,
      tipoDocumento: secretaria.tipoDocumento,
      sexo: secretaria.sexo,
      cargo: 'SECRETARIA'
    });

    this.form.updateValueAndValidity();
  }

  deleteSecretaria(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar esta secretaria?')) {
      this.secretariaService.delete(id).subscribe({
        next: () => {
          alert("Secretaria eliminada con éxito");
          this.loadSecretarias();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar la secretaria");
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingSecretaria = null;
    this.form.reset({ 
      estado: true,
      cargo: 'SECRETARIA'
    });
  }
}