import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-servicio',
  standalone: true,  // <-- Importante para componentes independientes
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css'],
  imports: [ReactiveFormsModule] // <-- ¡Importa ReactiveFormsModule aquí!
})
export class ServicioComponent {
  servicioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.servicioForm = this.fb.group({
      fechaServicio: ['', Validators.required],
      descripcion: ['', Validators.required],
      horaServicio: ['', Validators.required],
      estado: ['', Validators.required],
      tipoPlan: ['', Validators.required],
      tecnico: [''],
      fechaRegistro: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.servicioForm.valid) {
      console.log('Servicio registrado:', this.servicioForm.value);
    }
  }
}
