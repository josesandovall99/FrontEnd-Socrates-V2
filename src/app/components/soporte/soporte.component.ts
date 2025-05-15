import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SoporteService } from 'src/app/services/soporte.service';
import { Soporte } from 'src/app/models/soporte.model';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-soporte',
  standalone: true,
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class SoporteComponent implements OnInit {
  soporteForm: FormGroup;
  listaSoportes: Soporte[] = [];
  listaTecnicos: Empleado[] = [];
  soporteSeleccionado: Soporte | null = null;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private soporteService: SoporteService,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.soporteForm = this.fb.group({
      fechaSolicitud: ['', [Validators.required, this.validarFechaSolicitud()]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      estado: [{ value: 'Pendiente', disabled: true }],
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
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('clienteId');
      if (idParam) {
        this.clienteId = Number(idParam);
        console.log('Cliente ID recibido:', this.clienteId);
      }
    });

    this.obtenerSoportes();
    this.obtenerTecnicos();

    this.soporteForm.patchValue({
      fechaRegistro: this.getFechaActual()
    });
  }

  obtenerSoportes(): void {
    this.soporteService.getSoportes().subscribe(
      response => this.listaSoportes = response,
      error => window.alert('❌ Error al obtener la lista de soportes.')
    );
  }

  obtenerTecnicos(): void {
    this.empleadoService.getTecnicos().subscribe(
      response => this.listaTecnicos = response.filter(emp => emp.cargo === 'Tecnico'),
      error => window.alert('❌ Error al obtener los técnicos.')
    );
  }

  validarFechaSolicitud() {
    return (control: any) => {
      if (!control.value) return null;
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy ? { fechaInvalida: true } : null;
    };
  }

  
onSubmit(): void {
  if (this.soporteForm.invalid) {
    window.alert('❌ No se pudo registrar el soporte. Verifica las validaciones.');
    return;
  }

  const nuevoSoporte: Soporte = {
    ...this.soporteForm.value,
    fechaSolicitud: this.formatFecha(this.soporteForm.value.fechaSolicitud),
    fechaRegistro: this.getFechaActual(),
    tecnico: this.soporteForm.value.tecnico ? { id: this.soporteForm.value.tecnico } : null,
    estado: 'Pendiente'
  };

  console.log("JSON enviado al backend:", nuevoSoporte);

  this.soporteService.createSoporte(nuevoSoporte).subscribe(
    response => {
      window.alert('✔ Soporte registrado correctamente.');
      this.obtenerSoportes();
      this.soporteForm.reset();
    },
    error => {
      console.error('❌ Error al registrar el soporte:', error);
      window.alert('❌ Hubo un problema al registrar el soporte. Revisa la consola para más detalles.');
    }
  );
}

  editarSoporte(soporte: Soporte): void {
    this.soporteSeleccionado = soporte;
    this.soporteForm.patchValue({ ...soporte });
  }

  guardarEdicion(): void {
  if (this.soporteSeleccionado) {
    const soporteActualizado: Soporte = {
      ...this.soporteSeleccionado,
      ...this.soporteForm.value,
      fechaSolicitud: this.formatFecha(this.soporteForm.value.fechaSolicitud),
      fechaRegistro: this.soporteSeleccionado.fechaRegistro,
      tecnico: this.soporteForm.value.tecnico ? { id: this.soporteForm.value.tecnico } : null
    };

    console.log("JSON enviado al backend:", soporteActualizado);

    if (soporteActualizado.id !== undefined) {
      this.soporteService.updateSoporte(soporteActualizado.id, soporteActualizado).subscribe(
        response => {
          window.alert('✔ Soporte actualizado correctamente.');
          this.obtenerSoportes();
          this.soporteSeleccionado = null;
          this.soporteForm.reset();
        },
        error => {
          console.error('❌ Error al actualizar el soporte:', error);
          window.alert('❌ Hubo un problema al actualizar el soporte. Revisa la consola para más detalles.');
        }
      );
    } else {
      window.alert('❌ No se puede actualizar el soporte: ID no definido.');
    }
  }
}

  formatFecha(fecha: string | Date): string {
  if (!fecha) return '';
  const dateObj = new Date(fecha);
  const dia = dateObj.getDate().toString().padStart(2, '0');
  const mes = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const año = dateObj.getFullYear();
  return `${dia}/${mes}/${año}`;
}

    cambiarEstado(soporte: Soporte, estado: string): void {
    const soporteActualizado: Soporte = { ...soporte, estado };
    if (soporte.id !== undefined) {
      this.soporteService.updateSoporte(soporte.id, soporteActualizado).subscribe(
        response => {
          window.alert(`✔ Estado cambiado a "${estado}".`);
          this.obtenerSoportes();
        },
        error => window.alert('❌ Error al cambiar el estado del soporte.')
      );
    } else {
      window.alert('❌ Error: El ID del soporte no está definido.');
    }
  }
}
