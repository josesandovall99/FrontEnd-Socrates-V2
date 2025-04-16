import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Tecnico } from "src/app/models/tecnico.model";

@Component({
  selector: "app-empleado-tecnico",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tecnico-management">
      <div class="header">
        <h1>Gestionar Técnicos</h1>
        <button class="btn-add" (click)="showAddForm()">
          <i class="fas fa-plus"></i> Agregar Técnico
        </button>
      </div>

      <div *ngIf="showForm" class="tecnico-form">
        <h2>{{ editingTecnico ? "Editar" : "Agregar" }} Técnico</h2>

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

          <!-- Tipo de identificación -->
          <div class="form-group">
            <label for="tipoDocumento">Tipo identificación:</label>
            <select id="tipoDocumento" formControlName="tipoDocumento" required class="form-control">
              <option value="">Seleccione una opción</option>
              <option *ngFor="let tipo of tiposDocumento" [value]="tipo.valor" [selected]="form.get('tipoDocumento')?.value === tipo.valor">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <!-- Género -->
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

          <div class="form-group">
            <label for="especialidad">Especialidad:</label>
            <input id="especialidad" type="text" formControlName="especialidad" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="tecnico-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo documento</th>
              <th>Número documento</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tecnico of tecnicos">
              <td>{{ tecnico.nombre }}</td>
              <td>{{ getTipoDocumentoNombre(tecnico.tipoDocumento) }}</td>
              <td>{{ tecnico.numeroDocumento }}</td>
              <td>{{ tecnico.telefono }}</td>
              <td>{{ tecnico.correo }}</td>
              <td>{{ tecnico.especialidad }}</td>
              <td class="actions">
                <button (click)="editTecnico(tecnico)" class="btn-edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button (click)="deleteTecnico(tecnico.id)" class="btn-delete">
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
    .tecnico-management {
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

    .tecnico-form {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
    }

    .tecnico-form h2 {
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

    .tecnico-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .tecnico-table th, .tecnico-table td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    .tecnico-table th {
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
export class EmpleadoTecnicoComponent implements OnInit {
  tecnicos: Tecnico[] = [];
  showForm = false;
  editingTecnico: Tecnico | null = null;
  form: FormGroup;

  tiposDocumento = [
    { valor: 'CC', nombre: 'Cédula de ciudadanía' },
    { valor: 'PP', nombre: 'Pasaporte' }
  ];

  generos = [
    { valor: 'M', nombre: 'Masculino' },
    { valor: 'F', nombre: 'Femenino' }
  ];

  private tecnicoService = inject(TecnicoService);
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
      especialidad: ["", Validators.required],
      cargo: ["TECNICO"],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadTecnicos();
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }

  loadTecnicos() {
    this.tecnicoService.list().subscribe({
      next: (tecnicos) => (this.tecnicos = tecnicos),
      error: (err) => console.error("Error al cargar técnicos:", err),
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingTecnico = null;
    this.form.reset({ 
      estado: true,
      cargo: 'TECNICO'
    });
  }

  create() {
    if (this.form.valid) {
      const tecnicoData = this.form.value;

      if (this.editingTecnico?.id) {
        this.tecnicoService.update(this.editingTecnico.id, tecnicoData).subscribe({
          next: () => {
            alert("Técnico actualizado con éxito");
            this.loadTecnicos();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert("Hubo un error al actualizar el técnico");
          },
        });
      } else {
        this.tecnicoService.create(tecnicoData).subscribe({
          next: () => {
            alert("Técnico creado con éxito");
            this.loadTecnicos();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert("Hubo un error al crear el técnico");
          },
        });
      }
    }
  }

  editTecnico(tecnico: Tecnico) {
    this.showForm = true;
    this.editingTecnico = tecnico;
    
    // Asegurarse de que todos los campos se establezcan correctamente
    this.form.patchValue({
      ...tecnico,
      tipoDocumento: tecnico.tipoDocumento,
      sexo: tecnico.sexo,
      cargo: 'TECNICO'
    });

    // Forzar la actualización de los controles del formulario
    this.form.updateValueAndValidity();
  }

  deleteTecnico(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este técnico?')) {
      this.tecnicoService.delete(id).subscribe({
        next: () => {
          alert("Técnico eliminado con éxito");
          this.loadTecnicos();
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Hubo un error al eliminar el técnico");
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingTecnico = null;
    this.form.reset({ 
      estado: true,
      cargo: 'TECNICO'
    });
  }
}