import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 🔥 Importar CommonModule
import { TipoPlanService } from 'src/app/services/tipo-plan.service';
import { TipoPlan } from 'src/app/models/tipo-plan.model'; // Importamos el modelo

@Component({
  selector: 'app-tipo-plan',
  standalone: true,
  templateUrl: './tipo-plan.component.html',
  styleUrls: ['./tipo-plan.component.css'],
  imports: [ReactiveFormsModule, CommonModule] // 🔥 Agregar CommonModule aquí
})
export class TipoPlanComponent implements OnInit {
  tipoPlanForm: FormGroup;
  listaTipoPlanes: TipoPlan[] = [];
  tipoPlanSeleccionado: TipoPlan | null = null; // 🔥 Declaramos la variable aquí

  constructor(private fb: FormBuilder, private tipoPlanService: TipoPlanService) {
    this.tipoPlanForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      precio: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      estado: [{ value: true, disabled: true }]
    });
  }

  ngOnInit() {
    this.obtenerTiposPlanes();
  }

  obtenerTiposPlanes() {
    this.tipoPlanService.getTipoPlanes().subscribe(
      response => {
        console.log("Datos recibidos:", response);
        this.listaTipoPlanes = response;
      },
      error => console.error('Error al obtener lista de Tipos de Plan:', error)
    );
  }

  editarTipoPlan(tipoPlan: TipoPlan) {
    this.tipoPlanForm.patchValue({
      nombre: tipoPlan.nombre,
      descripcion: tipoPlan.descripcion,
      precio: tipoPlan.precio,
    });

    this.tipoPlanSeleccionado = tipoPlan; // 🔥 Ahora la variable existe, y esto no dará error
  }

  guardarEdicion() {
    if (this.tipoPlanSeleccionado) {
      // Validaciones antes de guardar
      if (this.tipoPlanForm.invalid) {
        window.alert('❌ No se puede guardar cambios. Revisa las validaciones:\n'
          + (this.tipoPlanForm.controls['nombre'].invalid ? '- El nombre debe tener entre 3 y 50 caracteres.\n' : '')
          + (this.tipoPlanForm.controls['descripcion'].invalid ? '- La descripción debe tener entre 10 y 200 caracteres.\n' : '')
          + (this.tipoPlanForm.controls['precio'].invalid ? '- El precio debe ser mayor a 0 y menor a 100,000.\n' : '')
        );
        return;
      }
  
      const tipoPlanActualizado: TipoPlan = {
        ...this.tipoPlanSeleccionado,
        ...this.tipoPlanForm.value
      };
  
      this.tipoPlanService.updateTipoPlan(tipoPlanActualizado.id, tipoPlanActualizado).subscribe(
        response => {
          window.alert('✔ Tipo de Plan actualizado correctamente.');
          this.tipoPlanSeleccionado = null;
          this.tipoPlanForm.reset();
          this.obtenerTiposPlanes();
        },
        error => {
          window.alert('❌ Error al actualizar el Tipo de Plan.');
          console.error('Error al actualizar Tipo de Plan:', error);
        }
      );
    }
  }
  

  
  eliminarTipoPlan(tipoPlan: TipoPlan) {
    const tipoPlanInactivo: TipoPlan = { ...tipoPlan, estado: false };
  
    this.tipoPlanService.updateTipoPlan(tipoPlan.id, tipoPlanInactivo).subscribe(
      response => {
        window.alert('✔ Tipo de Plan marcado como Inactivo.');
        this.obtenerTiposPlanes();
      },
      error => {
        window.alert('❌ Error al inhabilitar el Tipo de Plan.');
        console.error('Error al inhabilitar Tipo de Plan:', error);
      }
    );
  }
  
  reactivarTipoPlan(tipoPlan: TipoPlan) {
    const tipoPlanActivo: TipoPlan = { ...tipoPlan, estado: true };
  
    this.tipoPlanService.updateTipoPlan(tipoPlan.id, tipoPlanActivo).subscribe(
      response => {
        window.alert('✔ Tipo de Plan reactivado correctamente.');
        this.obtenerTiposPlanes();
      },
      error => {
        window.alert('❌ Error al reactivar el Tipo de Plan.');
        console.error('Error al reactivar Tipo de Plan:', error);
      }
    );
  }
  
  

  onSubmit() {
    if (this.tipoPlanForm.invalid) {
      window.alert('❌ No se pudo registrar el Tipo de Plan. Revisa las validaciones:\n'
        + (this.tipoPlanForm.controls['nombre'].invalid ? '- El nombre debe tener entre 3 y 50 caracteres.\n' : '')
        + (this.tipoPlanForm.controls['descripcion'].invalid ? '- La descripción debe tener entre 10 y 200 caracteres.\n' : '')
        + (this.tipoPlanForm.controls['precio'].invalid ? '- El precio debe ser mayor a 0 y menor a 100,000.\n' : '')
      );
      return;
    }
  
    const tipoPlanData: TipoPlan = {
      ...this.tipoPlanForm.value,
      estado: true
    };
  
    this.tipoPlanService.createTipoPlan(tipoPlanData).subscribe(
      response => {
        window.alert('✔ Tipo de Plan registrado correctamente.');
        this.obtenerTiposPlanes();
      },
      error => {
        window.alert('❌ Error al registrar el Tipo de Plan.');
        console.error('Error al registrar Tipo de Plan:', error);
      }
    );
  }
}
