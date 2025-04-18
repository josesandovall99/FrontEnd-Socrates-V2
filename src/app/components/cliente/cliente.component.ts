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
  today: string = new Date().toISOString().split('T')[0];
  cedulaExistente: boolean = false;
  clientes: Cliente[] = [];
  displayedColumns: string[] = [
    'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'tipoIdentificacion',
    'numeroIdentificacion', 'sexo', 'correoElectronico', 'telefono', 'lugarResidencia', 'direccionCasa',
    'barrio', 'tipoCliente', 'estado', 'fechaRegistro', 'descripcion', 'acciones'
  ];
  isLoading: boolean = false;

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
      estado: [true, Validators.required],
      fechaRegistro: [this.today, Validators.required],
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
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.handleError(error, 'No se pudo cargar el cliente');
          this.router.navigate(['/clientes']);
        }
      );
    } else {
      alert('ID de cliente no válido');
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
        console.log("Cliente ID para edición:", this.clienteId);
        console.log("Datos del formulario:", formData);

        this.clienteService.actualizarCliente(this.clienteId, formData).subscribe(
          (clienteActualizado) => {
            this.isLoading = false;
            alert('Cliente actualizado exitosamente');
            this.router.navigate(['/clientes']);
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error, 'Error al actualizar cliente');
          }
        );
      } else {
        console.log("Creando nuevo cliente");

        this.clienteService.crearCliente(formData).subscribe(
          (nuevoCliente) => {
            this.isLoading = false;
            alert('Cliente creado exitosamente');
            this.servicioForm.reset();
            this.loadClientes();
            this.router.navigate(['/clientes']);
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error, 'Error al crear cliente');
          }
        );
      }
    } else {
      alert('Formulario inválido. Revisa los campos requeridos.');
    }
  }

   editarCliente(clienteId: number): void {
    if (clienteId != null) {
      // Redirigir a la página de edición del cliente con el ID correspondiente
      this.router.navigate([`/clientes/editar/${clienteId}`]);
    } else {
      alert('ID de cliente no válido');
    }
  }

  eliminarCliente(clienteId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(clienteId).subscribe(
        () => {
          alert('Cliente eliminado exitosamente');
          this.loadClientes();
        },
        (error) => {
          this.handleError(error, 'Error al eliminar cliente');
        }
      );
    }
  }

  handleError(error: any, message: string): void {
    console.error(message, error);
    alert(message);
  }
}
