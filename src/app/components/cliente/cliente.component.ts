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
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.clienteId;

    if (this.isEditMode) {
      this.loadCliente();
    }
  }

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
    }
  }

  // Verifica si la cédula ya está registrada en la base de datos
  async verificarCedula(): Promise<boolean> {
    const cedula = this.servicioForm.get('numeroIdentificacion')?.value;
    if (cedula) {
      try {
        const existe: boolean = (await this.clienteService.verificarCedulaExistente(cedula).toPromise()) ?? false;
        return existe;  // Si es undefined, se asigna false como valor por defecto
      } catch (error) {
        console.error('Error al verificar cédula', error);
        return false;  // Si hay un error, asumimos que la cédula no existe
      }
    }
    return false;  // Si no hay cédula, retornamos false
  }

  async onSubmit(): Promise<void> {
    if (this.servicioForm.valid) {
      // Primero verificamos si la cédula ya está registrada
      const cedulaExistente = await this.verificarCedula();

      if (cedulaExistente) {
        alert('Ya existe un cliente con esta cédula. Por favor, verifique los datos.');
        return;  // Evitamos que el cliente sea creado o actualizado
      }

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
  
            // ✅ Limpiar formulario
            this.servicioForm.reset();
  
            // ✅ Restablecer valores por defecto
            this.servicioForm.patchValue({
              estado: true,
              fechaRegistro: this.today
            });
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
}
