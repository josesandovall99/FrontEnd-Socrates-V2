import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { CommonModule } from '@angular/common';

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
  today: string = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
  cedulaExistente: boolean = false;  // Variable para controlar el estado de la cédula existente
  clientes: Cliente[] = [];  // Lista de clientes
  displayedColumns: string[] = [
    'primerNombre',
    'segundoNombre',
    'primerApellido',
    'segundoApellido',
    'tipoIdentificacion',
    'numeroIdentificacion',
    'sexo',
    'correoElectronico',
    'telefono',
    'lugarResidencia',
    'direccionCasa',
    'barrio',
    'tipoCliente',
    'estado',
    'fechaRegistro',
    'descripcion',
    'acciones'
  ];  // Columnas a mostrar en la tabla

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Expresión regular para validar un correo electrónico más estricto
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
        [Validators.required, Validators.email, Validators.pattern(emailPattern)] // Validación con regex
      ],
      telefono: ['', Validators.required],
      lugarResidencia: ['', Validators.required],
      direccionCasa: ['', Validators.required],
      barrio: ['', Validators.required],
      tipoCliente: ['', Validators.required],
      estado: [true, Validators.required],
      fechaRegistro: [this.today, Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aseguramos que clienteId sea un número o null
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.clienteId = idFromRoute ? Number(idFromRoute) : null;
    this.isEditMode = !!this.clienteId;

    // Si estamos en modo edición, cargamos el cliente
    if (this.isEditMode && this.clienteId !== null) {
      this.loadCliente();
    } else {
      this.loadClientes();  // Cargar la lista de clientes al inicializar el componente
    }
  }

  // Método para cargar los clientes desde la base de datos
  loadClientes(): void {
    this.clienteService.listarClientes().subscribe(
      (clientes: Cliente[]) => {
        this.clientes = clientes;
      },
      (error) => {
        console.error('Error al cargar los clientes', error);
        alert('Error al cargar los clientes');
      }
    );
  }

  // Método para cargar el cliente por su ID
  loadCliente(): void {
    if (this.clienteId !== null) {
      this.clienteService.obtenerClientePorId(this.clienteId).subscribe(
        (cliente: Cliente) => {
          const fechaFormateada = cliente.fechaRegistro?.split('T')[0];
          this.servicioForm.patchValue({
            ...cliente,
            fechaRegistro: fechaFormateada
          });
        },
        (error) => {
          console.error('Error al cargar cliente', error);
          alert('No se pudo cargar el cliente.');
          this.router.navigate(['/clientes']);
        }
      );
    } else {
      alert('ID de cliente no válido');
      this.router.navigate(['/clientes']);
    }
  }

  // Validar si la cédula ya existe
  verificarCedulaExistente(): void {
    const numeroIdentificacion = this.servicioForm.get('numeroIdentificacion')?.value;
    if (numeroIdentificacion) {
      // Verificamos si la cédula ya está en la lista de clientes
      const clienteExistente = this.clientes.find(cliente => cliente.numeroIdentificacion === numeroIdentificacion);
      this.cedulaExistente = !!clienteExistente;
      if (this.cedulaExistente) {
        this.servicioForm.get('numeroIdentificacion')?.setErrors({ cedulaExistente: true });
      } else {
        this.servicioForm.get('numeroIdentificacion')?.setErrors(null);
      }
    }
  }

  // Llamada al servicio para crear o actualizar cliente
  async onSubmit(): Promise<void> {
    // Validamos la cédula antes de proceder con el envío del formulario
    this.verificarCedulaExistente();

    if (this.servicioForm.valid && !this.cedulaExistente) {
      const formData = this.servicioForm.getRawValue();

      // Asegurar el formato de fecha
      formData.fechaRegistro = formData.fechaRegistro?.split('T')[0] || this.today;

      if (this.isEditMode && this.clienteId !== null) {
        this.clienteService.actualizarCliente(this.clienteId, formData).subscribe(
          () => {
            alert('Cliente actualizado exitosamente');
            this.router.navigate(['/clientes']);
          },
          (error) => {
            console.error('Error al actualizar cliente', error);
            alert('Error al actualizar cliente');
          }
        );
      } else {
        this.clienteService.crearCliente(formData).subscribe(
          () => {
            alert('Cliente creado exitosamente');
            // Limpiar formulario y restablecer valores
            this.servicioForm.reset();
            this.loadClientes();  // Recargar la lista después de crear
          },
          (error) => {
            console.error('Error al crear cliente', error);
            alert('Error al crear cliente');
          }
        );
      }
    } else {
      alert('Formulario inválido. Revisa los campos requeridos.');
    }
  }

  // Método para editar un cliente
  editarCliente(clienteId: number): void {
    if (clienteId != null) {
      this.router.navigate([`/clientes/editar/${clienteId}`]);
    } else {
      alert('ID de cliente no válido');
    }
  }

  // Método para eliminar un cliente
  eliminarCliente(clienteId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(clienteId).subscribe(
        () => {
          alert('Cliente eliminado exitosamente');
          this.loadClientes();  // Recargar la lista después de eliminar
        },
        (error) => {
          console.error('Error al eliminar cliente', error);
          alert('Error al eliminar cliente');
        }
      );
    }
  }
}
