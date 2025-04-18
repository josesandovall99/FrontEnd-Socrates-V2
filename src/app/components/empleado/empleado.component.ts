import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-empleado',
  standalone: true,
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EmpleadoComponent implements OnInit {

  servicioForm: FormGroup;
  empleadoId: number | null = null;
  isEditMode: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  cedulaExistente: boolean = false;
  empleados: Empleado[] = [];

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
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
      numeroIdentificacion: ['', Validators.required],
      sexo: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarResidencia: ['', Validators.required],
      direccionCasa: ['', Validators.required],
      barrio: ['', Validators.required],
      estado: [true, Validators.required],
      codigoEmpleado: ['', Validators.required],
      cargo: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      hojaDeVida: ['', Validators.required],
      referenciaLaboral: ['', Validators.required],
      contactoEmergenciaNombre: ['', Validators.required],
      contactoEmergenciaParentesco: ['', Validators.required],
      contactoEmergenciaTelefono: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.empleadoId = idFromRoute ? Number(idFromRoute) : null;
    this.isEditMode = !!this.empleadoId;

    if (this.isEditMode && this.empleadoId !== null) {
      this.loadEmpleado();
    } else {
      this.loadEmpleados();
    }
  }

  loadEmpleados(): void {
    this.empleadoService.obtenerEmpleados().subscribe(
      (empleados: Empleado[]) => {
        this.empleados = empleados;
      },
      (error) => {
        console.error('Error al cargar los empleados', error);
        alert('Error al cargar los empleados');
      }
    );
  }

  loadEmpleado(): void {
    if (this.empleadoId !== null) {
      this.empleadoService.obtenerEmpleadoPorId(this.empleadoId).subscribe(
        (empleado: Empleado) => {
          const fechaFormateada = empleado.fechaNacimiento?.split('T')[0];
          this.servicioForm.patchValue({
            ...empleado,
            fechaNacimiento: fechaFormateada
          });
        },
        (error) => {
          console.error('Error al cargar el empleado', error);
          alert('No se pudo cargar el empleado.');
          this.router.navigate(['/empleados']);
        }
      );
    }
  }

  verificarCedulaExistente(): void {
    const numeroIdentificacion = this.servicioForm.get('numeroIdentificacion')?.value;
    if (numeroIdentificacion) {
      const empleadoExistente = this.empleados.find(e => e.numeroIdentificacion === numeroIdentificacion);
      this.cedulaExistente = !!empleadoExistente;
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
      const formData: Empleado = this.servicioForm.getRawValue();
      formData.fechaNacimiento = formData.fechaNacimiento?.split('T')[0] || this.today;

      if (this.isEditMode && this.empleadoId !== null) {
        this.empleadoService.actualizarEmpleado(this.empleadoId, formData).subscribe(
          () => {
            alert('Empleado actualizado exitosamente.');
            this.router.navigate(['/empleados']);
          },
          (error) => {
            console.error('Error al actualizar empleado', error);
            alert('Error al actualizar empleado');
          }
        );
      } else {
        this.empleadoService.crearEmpleado(formData).subscribe(
          () => {
            alert('Empleado registrado exitosamente.');
            this.servicioForm.reset();
            this.loadEmpleados();
          },
          (error) => {
            console.error('Error al crear empleado', error);
            alert('Error al crear empleado');
          }
        );
      }
    } else {
      alert('Formulario inválido. Revisa los campos requeridos.');
    }
  }

  editarEmpleado(empleadoId: number): void {
    if (empleadoId != null) {
      this.router.navigate([`/empleados/editar/${empleadoId}`]);
    } else {
      alert('ID de empleado no válido');
    }
  }

  eliminarEmpleado(empleadoId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(empleadoId).subscribe(
        () => {
          alert('Empleado eliminado exitosamente');
          this.loadEmpleados();
        },
        (error) => {
          console.error('Error al eliminar empleado', error);
          alert('Error al eliminar empleado');
        }
      );
    }
  }
}
