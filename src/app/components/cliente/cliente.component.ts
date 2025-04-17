import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [ReactiveFormsModule]
})
export class ClienteComponent {
  servicioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.servicioForm = this.fb.group({
      fechaServicio: ['', Validators.required],
      descripcion: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      horaServicio: ['', Validators.required],
      estado: ['', Validators.required],
      tipoIdentificacion: ['', Validators.required],
      numeroIdentificacion: ['', Validators.required],
      sexo: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarResidencia: ['', Validators.required],
      direccionCasa: ['', Validators.required],
      barrio: ['', Validators.required],
      tipoCliente: ['', Validators.required],
      fechaRegistro: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.servicioForm.valid) {
      console.log('Cliente registrado:', this.servicioForm.value);
    } else {
      console.warn('Formulario inválido. Por favor completa todos los campos requeridos.');
    }
  }
}
