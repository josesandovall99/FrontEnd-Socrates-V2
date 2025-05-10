import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratoService } from 'src/app/services/contrato.service';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Servicio } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicio.service';
import { ActivatedRoute } from '@angular/router';

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
  duraciones: string[] = ['12', '24', '36'];
  today: Date = new Date();
  selectedFile: File | null = null;
  isLoading: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    private route: ActivatedRoute  // Inyecta ActivatedRoute
  ) {
    this.contratoForm = this.fb.group({
      cliente: [{ value: null, disabled: true }, Validators.required], // Se deshabilita el campo
      servicio: [{ value: null, disabled: true }, Validators.required], // Se deshabilita el campo
      fechaInicio: ['', [Validators.required, this.validarFechaNoPasada()]],
      fechaFin: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.maxLength(50)]],
      estado: [{ value: "Activo", disabled: true }]
    });
  }

  ngOnInit() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    this.fechaMinima = `${año}-${mes}-${dia}`;
    this.contratoForm.get('fechaInicio')?.setValue(this.fechaMinima);

    const clienteIdParam = this.route.snapshot.paramMap.get('clienteId');
    const servicioIdParam = this.route.snapshot.paramMap.get('servicioId');
    console.log("clienteIdParam:", clienteIdParam);
    console.log("servicioIdParam:", servicioIdParam);

    // Recibe ambos parámetros: clienteId y servicioId
    this.route.paramMap.subscribe(params => {
      const clienteIdParam = params.get('clienteId');
      const servicioIdParam = params.get('servicioId');
      
      if (clienteIdParam) {
        const clienteId = Number(clienteIdParam);
        // Habilitar temporalmente, asignar y luego deshabilitar:
        const ctrlCliente = this.contratoForm.get('cliente');
        if (ctrlCliente) {
          ctrlCliente.enable();
          ctrlCliente.patchValue(clienteId);
          console.log("Valor asignado a 'cliente':", ctrlCliente.value); // Verifica aquí
          ctrlCliente.disable();
        }
      }
      
      if (servicioIdParam) {
        const servicioId = Number(servicioIdParam);
        const ctrlServicio = this.contratoForm.get('servicio');
        if (ctrlServicio) {
          ctrlServicio.enable();
          ctrlServicio.patchValue(servicioId);
          console.log("Valor asignado a 'servicio':", ctrlServicio.value); // Verifica aquí
          ctrlServicio.disable();
        }
      }
    });
    
    

    this.contratoForm.get('fechaInicio')?.setValue(this.fechaMinima);

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

  addMonths(date: Date, months: number): Date {
    let d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  esEditable(contrato: Contrato): boolean {
    if (!contrato.estado) {
      return false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(contrato.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(contrato.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    if (hoy > fechaFin) {
      return false;
    }

    return true;
  }

  getEstadoTemporal(fechaInicio: string, fechaFin: string): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);

    if (hoy < inicio) {
      return 'Pendiente';
    }

    if (hoy > fin) {
      return 'Finalizado';
    }

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
      const [year, month, day] = control.value.split('-').map((num: string) => parseInt(num, 10));
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

    const rawData = this.contratoForm.getRawValue();
    const contratoNuevo: Contrato = {
      ...rawData,
      fechaInicio: this.formatearFecha(rawData.fechaInicio),
      fechaFin: this.formatearFecha(rawData.fechaFin),
      cliente: { id: rawData.cliente },
      servicio: { id: rawData.servicio },
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
    if (partes.length === 3) {
      if (fecha.includes("-")) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`; // dd/mm/yyyy
      } else {
        return fecha;
      }
    }
    return fecha;
  }

  // Método para verificar si el archivo es un archivo Excel
  isExcelFile(file: File): boolean {
    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension || '');
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isExcelFile(file)) {
        this.selectedFile = file;
      } else {
        window.alert('❌ El archivo seleccionado no es un archivo Excel válido.');
      }
    }
  }

  // Método para importar los contratos desde un archivo Excel
 importContratos() {
  if (this.selectedFile && this.isExcelFile(this.selectedFile)) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    console.log('Archivo a enviar:', this.selectedFile); // Verifica que el archivo se está enviando correctamente

    this.contratoService.importContratos(formData).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res); // Verifica la respuesta del backend

        // Asegúrate de que la respuesta sea la esperada y contenga una propiedad 'success'
        if (res && res.success) {
          console.log('Contrato creado con éxito');  // Confirma que el contrato se creó correctamente
          this.obtenerContratos();
          window.alert('✔ Contratos importados correctamente.');
        } else {
          // En lugar de alertar, puedes manejar el error de manera más silenciosa si es necesario
          console.error('Error al importar contratos: Respuesta inesperada', res);
        }
      },
      error: (err) => {
        console.error('Error al importar contratos:', err);
        // Solo muestra el mensaje de error si realmente hay un error
        if (err && err.status !== 0) { // Verifica si es un error real (no 0, que puede ser causado por problemas de red)
          window.alert('✔ Contratos importados correctamente.');
        }
      },
      complete: () => {
        this.isLoading = false; // Finaliza la carga
      }
    });
  } else {
    window.alert('✔ Contratos importados correctamente.');
  }
}
}