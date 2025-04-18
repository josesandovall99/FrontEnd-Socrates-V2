import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioService } from 'src/app/services/servicio.service';
import { Servicio } from 'src/app/models/servicio.model';
import { TipoPlan } from 'src/app/models/tipo-plan.model';
import { TipoPlanService } from 'src/app/services/tipo-plan.service';

@Component({
  selector: 'app-servicio',
  standalone: true,
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ServicioComponent implements OnInit {
  servicioForm: FormGroup;
  listaServicios: Servicio[] = [];
  listaTipoPlanes: TipoPlan[] = [];
  // listaTecnicos: Empleado[] = []; // Comentado temporalmente
  servicioSeleccionado: Servicio | null = null;

  constructor(private fb: FormBuilder, private servicioService: ServicioService, private tipoPlanService: TipoPlanService /* , private empleadoService: EmpleadoService */) {
    this.servicioForm = this.fb.group({
      fechaServicio: ['', [Validators.required, this.validarFechaServicio()]], // 🔥 Se agrega la validación
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      horaServicio: ['', Validators.required],
      estado: [{ value: 'Activo', disabled: true }],
      tipoPlan: [null, Validators.required],
      fechaRegistro: [{ value: this.getFechaActual(), disabled: true }]
    });
  }

  ngOnInit() {
    this.obtenerServicios();
    this.obtenerTipoPlanes();
    // this.obtenerTecnicos(); // Comentado temporalmente
  }

  obtenerServicios() {
    this.servicioService.getServicios().subscribe(
      response => this.listaServicios = response,
      error => window.alert('❌ Error al obtener la lista de servicios.')
    );
  }

  obtenerTipoPlanes() {
    this.tipoPlanService.getTipoPlanes().subscribe(
      response => this.listaTipoPlanes = response,
      error => window.alert('❌ Error al obtener los tipos de planes.')
    );
  }

  // obtenerTecnicos() {
  //   this.empleadoService.getTecnicos().subscribe(
  //     response => this.listaTecnicos = response,
  //     error => window.alert('❌ Error al obtener los técnicos.')
  //   );
  // }

  getFechaActual(): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ajustamos la hora para evitar cambios de día inesperados
    return hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
  
  validarFechaServicio() {
    return (control: any) => {
      if (!control.value) return null; // Si no hay fecha, no validamos
      
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Asegurar que solo compare la fecha sin hora
  
      return fechaSeleccionada < hoy ? { fechaInvalida: true } : null;
    };
  }

  onSubmit() {
    if (this.servicioForm.invalid) {
      window.alert('❌ No se pudo registrar el servicio. Verifica las validaciones.');
      return;
    }

    const nuevoServicio: Servicio = { ...this.servicioForm.value };

    this.servicioService.createServicio(nuevoServicio).subscribe(
      response => {
        window.alert('✔ Servicio registrado correctamente.');
        this.obtenerServicios();
        this.servicioForm.reset(); // Limpia el formulario después de registrar
      },
      error => window.alert('❌ Error al registrar el servicio.')
    );
  }

  editarServicio(servicio: Servicio) {
    this.servicioForm.patchValue({ ...servicio });
    this.servicioSeleccionado = servicio;
  }

  guardarEdicion() {
    if (this.servicioSeleccionado) {
      this.servicioService.updateServicio(this.servicioSeleccionado.id, this.servicioForm.value).subscribe(
        response => {
          window.alert('✔ Servicio actualizado.');
          this.obtenerServicios();
          this.servicioSeleccionado = null;
          this.servicioForm.reset();
        },
        error => window.alert('❌ Error al actualizar el servicio.')
      );
    }
  }

  cambiarEstado(servicio: Servicio, estado: string) {
    this.servicioService.cambiarEstadoServicio(servicio.id, estado).subscribe(
      response => {
        window.alert(`✔ Estado cambiado a "${estado}".`);
        this.obtenerServicios();
      },
      error => window.alert('❌ Error al cambiar el estado del servicio.')
    );
  }
}
