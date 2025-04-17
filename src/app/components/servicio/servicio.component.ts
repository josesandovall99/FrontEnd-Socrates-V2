import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioService } from 'src/app/services/servicio.service';


@Component({
  selector: 'app-servicio',
  standalone: true,
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css'],
  imports: [ReactiveFormsModule]
})
export class ServicioComponent {
  servicioForm: FormGroup;

  constructor(private fb: FormBuilder, private servicioService: ServicioService) {
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
      this.servicioService.createServicio(this.servicioForm.value).subscribe(
        response => console.log('Servicio registrado:', response),
        error => console.error('Error al registrar el servicio:', error)
      );
    }
  }
}
