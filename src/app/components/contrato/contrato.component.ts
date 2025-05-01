import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratoService } from 'src/app/services/contrato.service';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Servicio } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-contrato',
  standalone: true,
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ContratoComponent implements OnInit {
  contratoForm: FormGroup;
  listaContratos: Contrato[] = [];
  listaClientes: Cliente[] = [];
  listaServicios: Servicio[] = [];
  contratoSeleccionado: Contrato | null = null;
  fechaMinima: string = '';
  // Duraciones en meses: 12, 24 o 36 meses.
  duraciones: string[] = ['12', '24', '36'];
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private clienteService: ClienteService,
    private servicioService: ServicioService
  ) {
    this.contratoForm = this.fb.group({
      cliente: [null, Validators.required],
      servicio: [null, Validators.required],
      fechaInicio: ['', [Validators.required, this.validarFechaNoPasada()]],
      fechaFin: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.maxLength(50)]],
      estado: [{ value: "Activo", disabled: true }]
    });
  }

  ngOnInit() {
    // Se calcula la fecha mínima (hoy) para el input.
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    this.fechaMinima = `${año}-${mes}-${dia}`;
    
    // Por defecto, se setea la fecha de inicio a hoy.
    this.contratoForm.get('fechaInicio')?.setValue(this.fechaMinima);

    // Si se cambia la duración, se recalcula la fecha fin.
    this.contratoForm.get('duracion')?.valueChanges.subscribe((value) => {
      if (value) {
        const meses = parseInt(value);
        const fechaInicioStr = this.contratoForm.get('fechaInicio')?.value;
        const fechaInicioDate = new Date(fechaInicioStr);
        const nuevaFechaFin = this.addMonths(fechaInicioDate, meses);
        const nuevaFechaFinStr = this.formatDateToInput(nuevaFechaFin);
        this.contratoForm.get('fechaFin')?.setValue(nuevaFechaFinStr);
      }
    });

    // Si se cambia la fecha de inicio, también se recalcula la fecha fin según la duración seleccionada.
    this.contratoForm.get('fechaInicio')?.valueChanges.subscribe((value) => {
      const duracionValue = this.contratoForm.get('duracion')?.value;
      if (duracionValue) {
        const meses = parseInt(duracionValue);
        const fechaInicioDate = new Date(value);
        const nuevaFechaFin = this.addMonths(fechaInicioDate, meses);
        const nuevaFechaFinStr = this.formatDateToInput(nuevaFechaFin);
        this.contratoForm.get('fechaFin')?.setValue(nuevaFechaFinStr);
      }
    });

    this.obtenerContratos();
    this.obtenerClientes();
    this.obtenerServicios();
  }

  /**
   * Suma la cantidad de meses a una fecha dada.
   */
  addMonths(date: Date, months: number): Date {
    let d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  /**
   * Formatea una fecha al formato YYYY-MM-DD, ideal para los inputs de tipo date.
   */
  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  esEditable(contrato: Contrato): boolean {
    // Primero se comprueba el estado del contrato
    if (!contrato.estado) {
      return false;
    }

    // Se normalizan las fechas a medianoche para evitar discrepancias con las horas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(contrato.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(contrato.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    // Si la fecha de hoy supera la fecha final, consideramos que el contrato ya finalizó.
    if (hoy > fechaFin) {
      return false;
    }

    // En caso contrario (activo y no finalizado) se permite la edición.
    return true;
  }
  
  getEstadoTemporal(fechaInicio: string, fechaFin: string): string {
    // Crear la fecha actual y normalizarla a medianoche
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    // Convertir las fechas de inicio y fin y normalizarlas a medianoche
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
  
    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);
  
    // Si la fecha de hoy es anterior a la fecha de inicio, el contrato aún no ha comenzado.
    if (hoy < inicio) {
      return 'Pendiente';
    }
    
    // Si la fecha de hoy es posterior a la fecha de fin, el contrato ya ha finalizado.
    if (hoy > fin) {
      return 'Finalizado';
    }
    
    // En caso contrario, el contrato se encuentra vigente.
    return 'Vigente';
  }
  
  
  obtenerContratos() {
    this.contratoService.getContratos().subscribe(
      response => this.listaContratos = response,
      error => window.alert('❌ Error al obtener los contratos.')
    );
  }

  obtenerClientes() {
    this.clienteService.listarClientes().subscribe(
      response => this.listaClientes = response,
      error => window.alert('❌ Error al obtener los clientes.')
    );
  }

  obtenerServicios() {
    this.servicioService.getServicios().subscribe(
      response => this.listaServicios = response,
      error => window.alert('❌ Error al obtener los servicios.')
    );
  }

  validarFechaNoPasada() {
    return (control: any) => {
      if (!control.value) return null;
      // Se separa la fecha en año, mes y día
      const [year, month, day] = control.value.split('-').map((num: string) => parseInt(num, 10));
      // Se crea la fecha usando el constructor que espera: año, mes (0-indexado) y día
      const fechaSeleccionada = new Date(year, month - 1, day);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy ? { fechaInvalida: true } : null;
    };
  }
  

  onSubmit() {
    if (this.contratoForm.invalid) {
      window.alert('❌ Verifica los datos del formulario.');
      return;
    }

    const contratoNuevo: Contrato = {
      ...this.contratoForm.value,
      fechaInicio: this.formatearFecha(this.contratoForm.value.fechaInicio),
      fechaFin: this.formatearFecha(this.contratoForm.value.fechaFin),
      cliente: { id: this.contratoForm.value.cliente },
      servicio: { id: this.contratoForm.value.servicio },
      estado: true
    };

    console.log("JSON enviado al backend:", contratoNuevo);

    this.contratoService.createContrato(contratoNuevo).subscribe(
      () => {
        window.alert('✔ Contrato registrado correctamente.');
        this.obtenerContratos();
        this.contratoForm.reset();
      },
      error => {
        console.error('❌ Error al registrar contrato:', error);
        window.alert('❌ Error al registrar contrato.');
      }
    );
  }

  editarContrato(contrato: Contrato) {
    if (!this.esEditable(contrato)) {
      window.alert('❌ Este contrato no se puede editar, ya que está desactivado o finalizado.');
      return;
    }
    this.contratoSeleccionado = contrato;
    this.contratoForm.patchValue({
      cliente: contrato.cliente.id,
      servicio: contrato.servicio.id,
      fechaInicio: this.formatearFecha(contrato.fechaInicio),
      fechaFin: this.formatearFecha(contrato.fechaFin),
      duracion: contrato.duracion
    });
  }

  guardarEdicion() {
    if (!this.contratoSeleccionado) return;

    const contratoActualizado: Contrato = {
      ...this.contratoSeleccionado,
      ...this.contratoForm.value,
      fechaInicio: this.formatearFecha(this.contratoForm.value.fechaInicio),
      fechaFin: this.formatearFecha(this.contratoForm.value.fechaFin),
      cliente: { id: this.contratoForm.value.cliente },
      servicio: { id: this.contratoForm.value.servicio }
    };

    console.log("JSON actualizado:", contratoActualizado);

    this.contratoService.updateContrato(contratoActualizado.id, contratoActualizado).subscribe(
      () => {
        window.alert('✔ Contrato actualizado correctamente.');
        this.obtenerContratos();
        this.contratoSeleccionado = null;
        this.contratoForm.reset();
      },
      error => {
        console.error('❌ Error al actualizar contrato:', error);
        window.alert('❌ Error al actualizar contrato.');
      }
    );
  }

  cambiarEstado(contrato: Contrato, estado: boolean) {
    const contratoActualizado: Contrato = { ...contrato, estado };

    this.contratoService.updateContrato(contrato.id, contratoActualizado).subscribe(
      () => {
        window.alert(`✔ Estado cambiado a "${estado ? 'Activo' : 'Inactivo'}".`);
        this.obtenerContratos();
      },
      error => window.alert('❌ Error al cambiar el estado del contrato.')
    );
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '';
  }
}
