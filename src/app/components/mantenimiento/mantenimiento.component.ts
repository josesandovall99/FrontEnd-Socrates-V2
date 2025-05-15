import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mantenimiento } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {
  mantenimientoForm: FormGroup;
  mantenimientos: Mantenimiento[] = [];
  editingMantenimiento: Mantenimiento | null = null;

  constructor(private fb: FormBuilder, private mantenimientoService: MantenimientoService) {
    this.mantenimientoForm = this.fb.group({
      soporte: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaProgramada: ['', Validators.required],
      estado: ['', Validators.required],
      tecnico: ['', Validators.required],
      productos: ['']
    });
  }

  ngOnInit(): void {
    this.loadMantenimientos();
  }

  loadMantenimientos() {
    this.mantenimientoService.list().subscribe({
      next: (data) => (this.mantenimientos = data),
      error: (err) => console.error("Error al cargar mantenimientos:", err)
    });
  }

  saveMantenimiento() {
    if (this.mantenimientoForm.valid) {
      const mantenimientoData = this.mantenimientoForm.value;

      if (this.editingMantenimiento) {
        this.mantenimientoService.update(this.editingMantenimiento.id, mantenimientoData).subscribe({
          next: () => {
            alert("Mantenimiento actualizado con éxito");
            this.loadMantenimientos();
            this.mantenimientoForm.reset();
            this.editingMantenimiento = null;
          },
          error: (err) => console.error("Error al actualizar:", err)
        });
      } else {
        this.mantenimientoService.create(mantenimientoData).subscribe({
          next: () => {
            alert("Mantenimiento registrado con éxito");
            this.loadMantenimientos();
            this.mantenimientoForm.reset();
          },
          error: (err) => console.error("Error al crear:", err)
        });
      }
    }
  }

  editMantenimiento(mantenimiento: Mantenimiento) {
    this.editingMantenimiento = mantenimiento;
    this.mantenimientoForm.patchValue(mantenimiento);
  }

  deleteMantenimiento(id: number) {
    if (confirm("¿Deseas eliminar este mantenimiento?")) {
      this.mantenimientoService.delete(id).subscribe({
        next: () => {
          alert("Mantenimiento eliminado");
          this.loadMantenimientos();
        },
        error: (err) => console.error("Error al eliminar:", err)
      });
    }
  }
}
