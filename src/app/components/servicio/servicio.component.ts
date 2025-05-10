import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  listaTecnicos: Empleado[] = [];
  servicioSeleccionado: Servicio | null = null;
  
  // Propiedad para almacenar el ID del cliente recibido
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private tipoPlanService: TipoPlanService,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const año = hoy.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  ngOnInit(): void {
    // Recibir el parámetro clienteId desde la URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('clienteId');
      if (idParam) {
        this.clienteId = Number(idParam);
        console.log('Cliente ID recibido:', this.clienteId);
      }
    });
    
    this.obtenerServicios();
    this.obtenerTipoPlanes();
    this.obtenerTecnicos();

    this.servicioForm.patchValue({
      fechaRegistro: this.getFechaActual()
    });
  }

  obtenerServicios(): void {
    this.servicioService.getServicios().subscribe(
      response => {
        this.listaServicios = response.map(servicio => ({
          ...servicio,
          tipoPlan: servicio.tipoPlan && typeof servicio.tipoPlan === 'object'
            ? servicio.tipoPlan
            : this.listaTipoPlanes.find(plan => plan.id === (typeof servicio.tipoPlan === 'number' ? servicio.tipoPlan : 0)) ||
              { id: 0, nombre: 'No asignado', descripcion: '', precio: 0, estado: false },
          tecnico: servicio.tecnico && typeof servicio.tecnico === 'object'
            ? servicio.tecnico
            : this.listaTecnicos.find(tecnico => tecnico.id === (typeof servicio.tecnico === 'number' ? servicio.tecnico : 0)) ||
              { 
                id: 0, primerNombre: 'No asignado', segundoNombre: '', primerApellido: '', segundoApellido: '', 
                tipoIdentificacion: '', numeroIdentificacion: 'N/A', sexo: '', correoElectronico: '', telefono: '', 
                fechaNacimiento: '', lugarResidencia: '', direccionCasa: '', barrio: '', estado: false, 
                codigoEmpleado: '', cargo: '', tipoContrato: '', hojaDeVida: '', referenciaLaboral: '', 
                contactoEmergenciaNombre: '', contactoEmergenciaParentesco: '', contactoEmergenciaTelefono: '' 
              }
        }));
      },
      error => window.alert('❌ Error al obtener la lista de servicios.')
    );
  }

  obtenerTipoPlanes(): void {
    this.tipoPlanService.getTipoPlanes().subscribe(
      response => this.listaTipoPlanes = response,
      error => window.alert('❌ Error al obtener los tipos de planes.')
    );
  }

  obtenerTecnicos(): void {
    this.empleadoService.getTecnicos().subscribe(
      response => this.listaTecnicos = response.filter(emp => emp.cargo === 'Tecnico'),
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

  onSubmit(): void {
    if (this.servicioForm.invalid) {
      window.alert('❌ No se pudo registrar el servicio. Verifica las validaciones.');
      return;
    }
  
    const formatoFechaDDMMYYYY = (fecha: string) => {
      if (!fecha) return '';
      const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/");
      return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '';
    };
  
    const nuevoServicio: Servicio = {
      ...this.servicioForm.value,
      fechaServicio: formatoFechaDDMMYYYY(this.servicioForm.value.fechaServicio),
      fechaRegistro: this.getFechaActual(),
      tipoPlan: { id: this.servicioForm.value.tipoPlan },
      tecnico: this.servicioForm.value.tecnico ? { id: this.servicioForm.value.tecnico } : null,
      estado: 'Activo'
    };
  
    console.log("JSON enviado al backend:", nuevoServicio);
  
    this.servicioService.createServicio(nuevoServicio).subscribe(
      response => {
        window.alert('✔ Servicio registrado correctamente.');
        this.obtenerServicios();
        this.servicioForm.reset();
  
        // Se asume que this.clienteId ya fue recibido de la URL en este componente
        // y que la respuesta incluye el ID del servicio creado.
        if (this.clienteId && response.id) {
          // Navegar a la ruta de contratos pasando ambos parámetros:
          this.router.navigate(['/contratos', this.clienteId, response.id]);
        } else {
          // En caso de no tener alguno de los valores, navega de forma predeterminada:
          this.router.navigate(['/contratos']);
        }
        alert('Por favor, registre el contrato del nuevo servicio');
      },
      error => {
        console.error('❌ Error al registrar el servicio:', error);
        window.alert('❌ Hubo un problema al registrar el servicio. Revisa la consola para más detalles.');
      }
    );
  }

  editarServicio(servicio: Servicio): void {
    const formatoFechaDDMMYYYY = (fecha: string) => {
      if (!fecha) return '';
      const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/");
      return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '';
    };
  
    this.servicioSeleccionado = servicio;
    this.servicioForm.patchValue({
      ...servicio,
      fechaServicio: formatoFechaDDMMYYYY(servicio.fechaServicio)
    });
  }

  guardarEdicion(): void {
    if (this.servicioSeleccionado) {
      const formatoFechaDDMMYYYY = (fecha: string) => {
        if (!fecha) return '';
        const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/");
        return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '';
      };

      const servicioActualizado: Servicio = {
        ...this.servicioSeleccionado,
        ...this.servicioForm.value,
        fechaServicio: formatoFechaDDMMYYYY(this.servicioForm.value.fechaServicio),
        fechaRegistro: this.servicioSeleccionado.fechaRegistro,
        tipoPlan: { id: this.servicioForm.value.tipoPlan },
        tecnico: this.servicioForm.value.tecnico ? { id: this.servicioForm.value.tecnico } : null
      };

      console.log("JSON enviado al backend:", servicioActualizado);

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

  cambiarEstado(servicio: Servicio, estado: string): void {
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
