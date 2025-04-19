import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioService } from 'src/app/services/servicio.service';
import { Servicio } from 'src/app/models/servicio.model';
import { TipoPlan } from 'src/app/models/tipo-plan.model';
import { TipoPlanService } from 'src/app/services/tipo-plan.service';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

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
  listaTecnicos: Empleado[] = []; // 🔥 Ahora activamos los técnicos
  servicioSeleccionado: Servicio | null = null;

  constructor(private fb: FormBuilder, private servicioService: ServicioService, private tipoPlanService: TipoPlanService, private empleadoService: EmpleadoService) {
    this.servicioForm = this.fb.group({
      fechaServicio: ['', [Validators.required, this.validarFechaServicio()]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      horaServicio: ['', Validators.required],
      estado: [{ value: 'Activo', disabled: true }],
      tipoPlan: [null, Validators.required],
      tecnico: [null, Validators.required],
      fechaRegistro: [{ value: this.getFechaActual(), disabled: true }]
    });
  }
  
  getFechaActual(): string {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const año = hoy.getFullYear();
    return `${dia}/${mes}/${año}`; // Formato dd/MM/yyyy
  }
  
  

  ngOnInit() {
    this.obtenerServicios();
    this.obtenerTipoPlanes();
    this.obtenerTecnicos(); // 🔥 Ahora activamos la carga de técnicos
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

  obtenerTecnicos() {
    this.empleadoService.getTecnicos().subscribe(
      response => this.listaTecnicos = response.filter(emp => emp.cargo === 'Tecnico'), // 🔥 Filtrar solo técnicos
      error => window.alert('❌ Error al obtener los técnicos.')
    );
  }

  

  validarFechaServicio() {
    return (control: any) => {
      if (!control.value) return null;
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy ? { fechaInvalida: true } : null;
    };
  }


  onSubmit() {
    if (this.servicioForm.invalid) {
      window.alert('❌ No se pudo registrar el servicio. Verifica las validaciones.');
      return;
    }
  
    const formatoFecha = (fecha: string) => {
      if (!fecha) return ''; // Asegúrate de que la fecha no sea indefinida o nula
      const partes = fecha.split("-");
      return `${partes[2]}/${partes[1]}/${partes[0]}`; // Convertir de "yyyy-MM-dd" → "dd/MM/yyyy"
    };
  
    const fechaServicio = this.servicioForm.value.fechaServicio;
    const fechaRegistro = this.getFechaActual(); // Usar el método ajustado para obtener la fecha actual
  
    const nuevoServicio: Servicio = {
      ...this.servicioForm.value,
      fechaServicio: formatoFecha(fechaServicio),
      fechaRegistro: fechaRegistro, // Usar la fecha actual en el formato correcto
      tipoPlan: { id: this.servicioForm.value.tipoPlan },
      tecnico: this.servicioForm.value.tecnico ? { id: this.servicioForm.value.tecnico } : null,
      estado: 'Activo' // Asegurarse de que el estado se incluya
    };
  
    console.log("JSON enviado al backend:", nuevoServicio); // 👀 Verifica en consola
  
    this.servicioService.createServicio(nuevoServicio).subscribe(
      response => {
        window.alert('✔ Servicio registrado correctamente.');
        this.obtenerServicios();
        this.servicioForm.reset();
      },
      error => {
        console.error('❌ Error al registrar el servicio:', error);
        window.alert('❌ Hubo un problema al registrar el servicio. Revisa la consola para más detalles.');
      }
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
