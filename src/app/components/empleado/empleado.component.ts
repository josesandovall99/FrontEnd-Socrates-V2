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
  /*pdfSrc: string = '';
    selectedFile: File | null = null;
    selectedFileName: string = '';*/
    archivoSeleccionado: File | null = null;
    nombreArchivo: string = '';

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const soloNumeros = /^[0-9]+$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

this.servicioForm = this.fb.group({
  primerNombre: ['', [Validators.required, Validators.pattern(soloLetras)]],
  segundoNombre: ['', [Validators.pattern(soloLetras)]],
  primerApellido: ['', [Validators.required, Validators.pattern(soloLetras)]],
  segundoApellido: ['', [Validators.pattern(soloLetras)]],
  tipoIdentificacion: ['', Validators.required],
  numeroIdentificacion: ['', [Validators.required, Validators.pattern(soloNumeros), Validators.minLength(5), Validators.maxLength(15)]],
  sexo: ['', Validators.required],
  correoElectronico: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
  telefono: ['', [Validators.required, Validators.pattern(soloNumeros), Validators.minLength(10), Validators.maxLength(10)]],
  fechaNacimiento: ['', Validators.required],
  lugarResidencia: ['', Validators.required],
  direccionCasa: ['', Validators.required],
  barrio: ['', Validators.required],
  estado: [{ value: true, disabled: true }],
  codigoEmpleado: ['', [Validators.required, Validators.minLength(3)]],
  cargo: ['', Validators.required],
  tipoContrato: ['', Validators.required],
  hojaDeVida: [''],
  referenciaLaboral: ['', Validators.required],
  contactoEmergenciaNombre: ['', [Validators.required, Validators.pattern(soloLetras)]],
  contactoEmergenciaParentesco: ['', [Validators.required, Validators.pattern(soloLetras)]],
  contactoEmergenciaTelefono: ['', [Validators.required, Validators.pattern(soloNumeros), Validators.minLength(10), Validators.maxLength(10)]]
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
            // Se pasan manualmente los campos que sí quieres actualizar
            primerNombre: empleado.primerNombre,
            segundoNombre: empleado.segundoNombre,
            primerApellido: empleado.primerApellido,
            segundoApellido: empleado.segundoApellido,
            tipoIdentificacion: empleado.tipoIdentificacion,
            numeroIdentificacion: empleado.numeroIdentificacion,
            sexo: empleado.sexo,
            correoElectronico: empleado.correoElectronico,
            telefono: empleado.telefono,
            fechaNacimiento: fechaFormateada,
            lugarResidencia: empleado.lugarResidencia,
            direccionCasa: empleado.direccionCasa,
            barrio: empleado.barrio,
            estado: empleado.estado,
            codigoEmpleado: empleado.codigoEmpleado,
            cargo: empleado.cargo,
            tipoContrato: empleado.tipoContrato,
            referenciaLaboral: empleado.referenciaLaboral,
            contactoEmergenciaNombre: empleado.contactoEmergenciaNombre,
            contactoEmergenciaParentesco: empleado.contactoEmergenciaParentesco,
            contactoEmergenciaTelefono: empleado.contactoEmergenciaTelefono,
            // hojaDeVida NO se pone aquí
          });
  
          console.log(empleado.hojaDeVida);
          this.nombreArchivo = empleado.hojaDeVida?.split('fakepath/').pop() || '';
          console.log("nombre de archivo: "+ this.nombreArchivo);
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
        if (this.archivoSeleccionado) {
          this.empleadoService.subirArchivo(this.archivoSeleccionado)
            .subscribe(response => {
              console.log('Archivo subido exitosamente', response);
            }, error => {
              console.error('Error al subir archivo', error);
            });
        }
        this.empleadoService.actualizarEmpleado(this.empleadoId, formData).subscribe(
          () => {
            alert('Empleado actualizado exitosamente.');
            this.router.navigate(['/empleados']);
          },
          (error) => {
            console.error('Error al actualizar empleado', error);
            alert('Error al actualizar empleado.');
          }
        );
      } else {
        if (this.archivoSeleccionado) {
          this.empleadoService.subirArchivo(this.archivoSeleccionado)
            .subscribe(response => {
              console.log('Archivo subido exitosamente', response);
            }, error => {
              console.error('Error al subir archivo', error);
            });
        }
        this.empleadoService.crearEmpleado(formData).subscribe(
          () => {
            alert('Empleado registrado exitosamente.');
            this.servicioForm.reset();
            /*this.selectedFile = null;
            this.selectedFileName = '';*/
            this.loadEmpleados();
          },
          (error) => {
            console.error('Error al crear empleado', error);
            alert('Error al crear empleado.');
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

  eliminarEmpleado(empleado: Empleado) {
    const empleadoInactivo: Empleado = { ...empleado, estado: false };
  
    this.empleadoService.actualizarEmpleado(empleado.id, empleadoInactivo).subscribe(
      response => {
        window.alert('✔ Empleado marcado como inactivo.');
        this.loadEmpleados(); // Método que recarga la lista
      },
      error => {
        window.alert('❌ Error al inhabilitar el empleado.');
        console.error('Error al inhabilitar empleado:', error);
      }
    );
  }
  
  reactivarEmpleado(empleado: Empleado) {
    const empleadoActivo: Empleado = { ...empleado, estado: true };
  
    this.empleadoService.actualizarEmpleado(empleado.id, empleadoActivo).subscribe(
      response => {
        window.alert('✔ Empleado reactivado correctamente.');
        this.loadEmpleados();
      },
      error => {
        window.alert('❌ Error al reactivar el empleado.');
        console.error('Error al reactivar empleado:', error);
      }
    );
  }

  
  
 // empleadoSeleccionado: Empleado | null = null;
/*
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Ya NO hagas patchValue aquí
  
      // Si quieres mostrar el nombre en pantalla, puedes guardarlo en otra variable
      
    }
      
  }
  
  */
  subirArchivo() {
    if (this.archivoSeleccionado) {
      this.empleadoService.subirArchivo(this.archivoSeleccionado)
        .subscribe(response => {
          console.log('Archivo subido exitosamente', response);
        }, error => {
          console.error('Error al subir archivo', error);
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;
    } else {
      alert('Solo se permite archivos PDF.');
    }
  }

  verPDF(nombreArchivo: string) {
    
    nombreArchivo = nombreArchivo.replace("C:\\fakepath\\", "");
    const url = `http://localhost:8080/api/v1/ver-pdf/${encodeURIComponent(nombreArchivo)}`;
    console.log("URL QUE SE ENVIA: "+url)
    if (!nombreArchivo) {
      alert('No hay archivo para visualizar.');
      return;
    }
    window.open(url, '_blank');
  }
  
  
  
}
