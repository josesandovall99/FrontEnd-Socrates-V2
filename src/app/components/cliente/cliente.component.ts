import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { CommonModule } from '@angular/common';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ClienteComponent implements OnInit {
  servicioForm: FormGroup;
  clienteId: number | null = null;
  isEditMode: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  cedulaExistente: boolean = false;
  clientes: Cliente[] = [];
  displayedColumns: string[] = [
    'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'tipoIdentificacion',
    'numeroIdentificacion', 'sexo', 'correoElectronico', 'telefono', 'lugarResidencia', 'direccionCasa',
    'barrio', 'tipoCliente', 'estado', 'fechaRegistro', 'descripcion', 'acciones'
  ];
  isLoading: boolean = false;
  notification: Notification | null = null;

  // Variables para la importación de Excel
  selectedFile: File | null = null;
  isExcelFile: boolean = false;

  @ViewChild('primerNombreInput') primerNombreInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.servicioForm = this.fb.group({
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      tipoIdentificacion: ['', Validators.required],
      numeroIdentificacion: ['', [Validators.required]],
      sexo: ['', Validators.required],
      correoElectronico: [
        '',
        [Validators.required, Validators.email, Validators.pattern(emailPattern)]
      ],
      telefono: ['', Validators.required],
      lugarResidencia: ['', Validators.required],
      direccionCasa: ['', Validators.required],
      barrio: ['', Validators.required],
      tipoCliente: ['', Validators.required],
      estado: [{ value: true, disabled: true }, Validators.required],
      fechaRegistro: [{ value: this.today, disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.clienteId = idFromRoute ? Number(idFromRoute) : null;
    this.isEditMode = !!this.clienteId;

    if (this.isEditMode && this.clienteId !== null) {
      this.loadCliente();
    } else {
      this.loadClientes();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      this.isExcelFile = isExcel;
      
      if (isExcel) {
        this.showNotification('Archivo Excel seleccionado correctamente', 'info');
      } else {
        this.showNotification('Por favor, seleccione un archivo Excel válido (.xlsx, .xls)', 'error');
        this.selectedFile = null;
        event.target.value = '';
      }
    } else {
      this.selectedFile = null;
      this.isExcelFile = false;
    }
  }

  importClientes(): void {
    if (!this.selectedFile || !this.isExcelFile) {
      this.showNotification('Por favor, seleccione un archivo Excel válido', 'error');
      return;
    }
  
    this.isLoading = true;
    this.clienteService.importarClientesDesdeExcel(this.selectedFile).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotification('Clientes importados correctamente', 'success');
        this.loadClientes();
        
        // Limpiar el input de archivo y las variables relacionadas
        this.selectedFile = null;
        this.isExcelFile = false;
        const fileInput = document.getElementById('importarArchivo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al importar el archivo:', error);
        
        // Mostrar detalles del error en la notificación
        if (error?.status === 400) {
          this.showNotification('Archivo no válido o error en el formato de datos', 'error');
        } else {
          this.showNotification('Error al importar clientes: ' + (error?.message || 'Desconocido'), 'error');
        }
      }
    );
  }
  
  

  loadClientes(): void {
    this.isLoading = true;
    this.clienteService.listarClientes().subscribe(
      (clientes: Cliente[]) => {
        this.clientes = clientes;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error, 'Error al cargar los clientes');
      }
    );
  }

  loadCliente(): void {
    if (this.clienteId !== null) {
      this.isLoading = true;
      this.clienteService.obtenerClientePorId(this.clienteId).subscribe(
        (cliente: Cliente) => {
          const fechaFormateada = cliente.fechaRegistro?.split('T')[0];
          this.servicioForm.patchValue({
            primerNombre: cliente.primerNombre,
            segundoNombre: cliente.segundoNombre,
            primerApellido: cliente.primerApellido,
            segundoApellido: cliente.segundoApellido,
            tipoIdentificacion: cliente.tipoIdentificacion,
            numeroIdentificacion: cliente.numeroIdentificacion,
            sexo: cliente.sexo,
            correoElectronico: cliente.correoElectronico,
            telefono: cliente.telefono,
            lugarResidencia: cliente.lugarResidencia,
            direccionCasa: cliente.direccionCasa,
            barrio: cliente.barrio,
            tipoCliente: cliente.tipoCliente,
            estado: cliente.estado,
            fechaRegistro: fechaFormateada,
          });

          this.servicioForm.get('primerNombre')?.disable();
          this.servicioForm.get('segundoNombre')?.disable();
          this.servicioForm.get('primerApellido')?.disable();
          this.servicioForm.get('segundoApellido')?.disable();
          this.servicioForm.get('tipoIdentificacion')?.disable();
          this.servicioForm.get('numeroIdentificacion')?.disable();
          this.servicioForm.get('sexo')?.disable();
          this.servicioForm.get('estado')?.disable();
          this.servicioForm.get('fechaRegistro')?.disable();

          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.handleError(error, 'No se pudo cargar el cliente');
          this.router.navigate(['/clientes']);
        }
      );
    } else {
      this.showNotification('ID de cliente no válido', 'error');
      this.router.navigate(['/clientes']);
    }
  }

  verificarCedulaExistente(): void {
    const numeroIdentificacion = this.servicioForm.get('numeroIdentificacion')?.value;
    if (numeroIdentificacion) {
      const clienteExistente = this.clientes.find(cliente => cliente.numeroIdentificacion === numeroIdentificacion);
      this.cedulaExistente = !!clienteExistente;
      if (this.cedulaExistente) {
        this.servicioForm.get('numeroIdentificacion')?.setErrors({ cedulaExistente: true });
      } else {
        this.servicioForm.get('numeroIdentificacion')?.setErrors(null);
      }
    }
  }

  async onSubmit(): Promise<void> {
    this.verificarCedulaExistente();
  
    if (this.servicioForm.valid && !this.cedulaExistente) {
      const formData = this.servicioForm.getRawValue();
      formData.fechaRegistro = formData.fechaRegistro?.split('T')[0] || this.today;
  
      this.isLoading = true;
  
      if (this.isEditMode && this.clienteId !== null) {
        // Lógica de actualización.
        this.clienteService.actualizarCliente(this.clienteId, formData).subscribe(
          (clienteActualizado) => {
            this.isLoading = false;
            this.showNotification('Cliente actualizado exitosamente', 'success');
            this.router.navigate(['/clientes']);
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error, 'Error al actualizar cliente');
          }
        );
      } else {
        this.clienteService.crearCliente(formData).subscribe(
          (nuevoCliente) => {
            this.isLoading = false;
            this.showNotification('Cliente creado exitosamente', 'success');
            // Se asume que el objeto nuevoCliente tiene una propiedad id.
            const clienteId = nuevoCliente.id;
            // Redirige a la sección de servicio, pasando el clienteId como parámetro de ruta.
            this.router.navigate(['/solicitudservicio', clienteId]);
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error, 'Error al crear cliente');
          }
        );
      }
    } else {
      this.showNotification('Formulario inválido. Revisa los campos requeridos.', 'error');
    }
  }
  

  editarCliente(clienteId: number): void {
    if (clienteId != null) {
      this.router.navigate([`/clientes/editar/${clienteId}`]);
    } else {
      this.showNotification('ID de cliente no válido', 'error');
    }
  }

  cambiarEstadoCliente(cliente: Cliente): void {
    const clienteActualizado = { ...cliente, estado: !cliente.estado };
    const nuevoEstado = clienteActualizado.estado ? 'Activo' : 'Inactivo';
    
    if (confirm(`¿Estás seguro de que deseas cambiar el estado del cliente a ${nuevoEstado}?`)) {
      this.isLoading = true;
      
      this.clienteService.actualizarCliente(cliente.id!, clienteActualizado).subscribe(
        () => {
          this.isLoading = false;
          this.showNotification(`Cliente actualizado a estado: ${nuevoEstado}`, 'success');
          this.loadClientes();
        },
        (error) => {
          this.isLoading = false;
          this.handleError(error, 'Error al cambiar el estado del cliente');
        }
      );
    }
  }

  handleError(error: any, message: string): void {
    console.error(message, error);
    this.showNotification(message, 'error');
  }

  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notification = { message, type };
    setTimeout(() => {
      if (this.notification && this.notification.message === message) {
        this.notification = null;
      }
    }, 5000);
  }

  closeNotification(): void {
    this.notification = null;
  }
}
