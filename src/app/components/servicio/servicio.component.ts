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
    return `${dia}/${mes}/${año}`; // ✅ Mantener formato dd/MM/yyyy
  }



  ngOnInit() {
    this.obtenerServicios();
    this.obtenerTipoPlanes();
    this.obtenerTecnicos(); // 🔥 Ahora activamos la carga de técnicos

    // 🔥 Convertir la fecha de registro a formato dd/MM/yyyy antes de mostrarla
    this.servicioForm.patchValue({
      fechaRegistro: this.getFechaActual()
    });
  }

  obtenerServicios() {
    this.servicioService.getServicios().subscribe(
      response => {
        this.listaServicios = response.map(servicio => ({
          ...servicio,
          tipoPlan: servicio.tipoPlan && typeof servicio.tipoPlan === 'object'
            ? servicio.tipoPlan // ✅ Ya es un objeto, no necesita conversión
            : this.listaTipoPlanes.find(plan => plan.id === (typeof servicio.tipoPlan === 'number' ? servicio.tipoPlan : 0)) || 
              { id: 0, nombre: 'No asignado', descripcion: '', precio: 0, estado: false },
  
          tecnico: servicio.tecnico && typeof servicio.tecnico === 'object'
            ? servicio.tecnico // ✅ Ya es un objeto, no necesita conversión
            : this.listaTecnicos.find(tecnico => tecnico.id === (typeof servicio.tecnico === 'number' ? servicio.tecnico : 0)) || 
              { id: 0, primerNombre: 'No asignado', segundoNombre: '', primerApellido: '', segundoApellido: '', 
                tipoIdentificacion: '', numeroIdentificacion: 'N/A', sexo: '', correoElectronico: '', telefono: '', 
                fechaNacimiento: '', lugarResidencia: '', direccionCasa: '', barrio: '', estado: false, 
                codigoEmpleado: '', cargo: '', tipoContrato: '', hojaDeVida: '', referenciaLaboral: '', 
                contactoEmergenciaNombre: '', contactoEmergenciaParentesco: '', contactoEmergenciaTelefono: '' }
        }));
      },
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

    const formatoFechaDDMMYYYY = (fecha: string) => {
      if (!fecha) return ''; // Asegurar que la fecha no sea indefinida o nula
      const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/"); // Manejar ambos formatos
      return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : ''; // Mantener formato dd/MM/yyyy
    };

    const nuevoServicio: Servicio = {
      ...this.servicioForm.value,
      fechaServicio: formatoFechaDDMMYYYY(this.servicioForm.value.fechaServicio), // ✅ Mantener formato dd/MM/yyyy
      fechaRegistro: this.getFechaActual(), // ✅ Tomar la fecha actual sin modificar
      tipoPlan: { id: this.servicioForm.value.tipoPlan },
      tecnico: this.servicioForm.value.tecnico ? { id: this.servicioForm.value.tecnico } : null,
      estado: 'Activo'
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
    const formatoFechaDDMMYYYY = (fecha: string) => {
      if (!fecha) return ''; // Asegurar que la fecha no sea indefinida o nula
      const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/"); // Manejar ambos formatos posibles
      return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : ''; // Convertir a dd/MM/yyyy
    };
  
    this.servicioSeleccionado = servicio;
    this.servicioForm.patchValue({
      ...servicio,
      fechaServicio: formatoFechaDDMMYYYY(servicio.fechaServicio) // ✅ Convertir antes de cargar al formulario
    });
  }

  guardarEdicion() {
    if (this.servicioSeleccionado) {
      const formatoFechaDDMMYYYY = (fecha: string) => {
        if (!fecha) return ''; // Asegurar que la fecha no sea indefinida o nula
        const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/"); // Manejar ambos formatos posibles
        return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : ''; // Convertir y mantener dd/MM/yyyy
      };

      const servicioActualizado: Servicio = {
        ...this.servicioSeleccionado,
        ...this.servicioForm.value,
        fechaServicio: formatoFechaDDMMYYYY(this.servicioForm.value.fechaServicio), // ✅ Mantener formato dd/MM/yyyy
        fechaRegistro: this.servicioSeleccionado.fechaRegistro, // ✅ No cambia
        tipoPlan: { id: this.servicioForm.value.tipoPlan },
        tecnico: this.servicioForm.value.tecnico ? { id: this.servicioForm.value.tecnico } : null
      };

      console.log("JSON enviado al backend:", servicioActualizado); // 👀 Verifica en consola

      this.servicioService.updateServicio(servicioActualizado.id, servicioActualizado).subscribe(
        response => {
          window.alert('✔ Servicio actualizado correctamente.');
          this.obtenerServicios();
          this.servicioSeleccionado = null;
          this.servicioForm.reset();
        },
        error => {
          console.error('❌ Error al actualizar el servicio:', error);
          window.alert('❌ Hubo un problema al actualizar el servicio. Revisa la consola para más detalles.');
        }
      );
    }
  }





  cambiarEstado(servicio: Servicio, estado: string) {
    const servicioActualizado: Servicio = { ...servicio, estado };

    this.servicioService.updateServicio(servicio.id, servicioActualizado).subscribe(
      response => {
        window.alert(`✔ Estado cambiado a "${estado}".`);
        this.obtenerServicios();
      },
      error => window.alert('❌ Error al cambiar el estado del servicio.')
    );
  }

}
