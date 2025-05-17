import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { Mantenimiento } from 'src/app/models/mantenimiento.model';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Producto } from 'src/app/models/producto.model';
import { Soporte } from 'src/app/models/soporte.model';
import { SoporteService } from 'src/app/services/soporte.service';
import { ProductoService } from 'src/app/services/producto.service'; 

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class MantenimientoComponent implements OnInit {
  mantenimientoForm: FormGroup;
  listaMantenimientos: Mantenimiento[] = [];
  listaTecnicos: Empleado[] = [];
  listaSoportes: Soporte[] = [];
  listaProductos: Producto[] = [];
  mantenimientoSeleccionado: Mantenimiento | null = null;

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService,
    private empleadoService: EmpleadoService,
    private soporteService: SoporteService,
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {
    this.mantenimientoForm = this.fb.group({
      soporte: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      fechaProgramada: ['', [Validators.required, this.validarFechaMantenimiento()]],
      estado: [{ value: 'Pendiente', disabled: true }],
      tecnico: [null, Validators.required],
      productos: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerMantenimientos();
    this.obtenerTecnicos();
    this.obtenerSoportes();
    this.obtenerProductos();
  }

  obtenerMantenimientos(): void {
    this.mantenimientoService.list().subscribe(
      response => this.listaMantenimientos = response,
      error => window.alert('❌ Error al obtener la lista de mantenimientos.')
    );
  }

  obtenerTecnicos(): void {
    this.empleadoService.getTecnicos().subscribe(
      response => this.listaTecnicos = response.filter(emp => emp.cargo === 'Tecnico'),
      error => window.alert('❌ Error al obtener los técnicos.')
    );
  }

  obtenerSoportes(): void {
    this.soporteService.getSoportes().subscribe(
      response => this.listaSoportes = response,
      error => window.alert('❌ Error al obtener los soportes.')
    );
  }

  obtenerProductos(): void {
  this.productoService.getAllProductos().subscribe(
    response => this.listaProductos = response,
    error => window.alert('❌ Error al obtener la lista de productos.')
  );
}

  validarFechaMantenimiento() {
    return (control: any) => {
      if (!control.value) return null;
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy ? { fechaInvalida: true } : null;
    };
  }

  onSubmit(): void {
    if (this.mantenimientoForm.invalid) {
      window.alert('❌ No se pudo registrar el mantenimiento. Verifica las validaciones.');
      return;
    }

    const nuevoMantenimiento: Mantenimiento = {
  ...this.mantenimientoForm.value,
  fechaProgramada: this.formatearFecha(new Date(this.mantenimientoForm.value.fechaProgramada)),
  estado: 'Pendiente',
  soporte: { id: this.mantenimientoForm.value.soporte }, // ✅ Enviar un objeto con el ID del soporte
  tecnico: { id: this.mantenimientoForm.value.tecnico }, // ✅ Enviar técnico como objeto
  productos: this.mantenimientoForm.value.productos.map((id: number) => ({ id })) // ✅ Asegurar que los productos sean objetos con ID
};


    console.log("JSON enviado al backend:", nuevoMantenimiento);

    this.mantenimientoService.create(nuevoMantenimiento).subscribe(
      response => {
        window.alert('✔ Mantenimiento registrado correctamente.');
        this.obtenerMantenimientos();
        this.mantenimientoForm.reset();
      },
      error => {
        console.error('❌ Error al registrar el mantenimiento:', error);
        window.alert('❌ Hubo un problema al registrar el mantenimiento. Revisa la consola para más detalles.');
      }
    );
  }

  editarMantenimiento(mantenimiento: Mantenimiento): void {
    this.mantenimientoSeleccionado = mantenimiento;
    this.mantenimientoForm.patchValue({
      ...mantenimiento,
      fechaProgramada: this.formatearFecha(new Date(mantenimiento.fechaProgramada))
    });
  }

  guardarEdicion(): void {
    if (this.mantenimientoSeleccionado) {
      const mantenimientoActualizado: Mantenimiento = {
        ...this.mantenimientoSeleccionado,
        ...this.mantenimientoForm.value,
        fechaProgramada: this.formatearFecha(new Date(this.mantenimientoForm.value.fechaProgramada))
      };

      console.log("JSON enviado al backend:", mantenimientoActualizado);

      this.mantenimientoService.update(mantenimientoActualizado.id, mantenimientoActualizado).subscribe(
        response => {
          window.alert('✔ Mantenimiento actualizado correctamente.');
          this.obtenerMantenimientos();
          this.mantenimientoSeleccionado = null;
          this.mantenimientoForm.reset();
        },
        error => {
          console.error('❌ Error al actualizar el mantenimiento:', error);
          window.alert('❌ Hubo un problema al actualizar el mantenimiento. Revisa la consola para más detalles.');
        }
      );
    }
  }

  cambiarEstado(mantenimiento: Mantenimiento, estado: string): void {
    const mantenimientoActualizado: Mantenimiento = { ...mantenimiento, estado };
    this.mantenimientoService.update(mantenimiento.id, mantenimientoActualizado).subscribe(
      response => {
        window.alert(`✔ Estado cambiado a "${estado}".`);
        this.obtenerMantenimientos();
      },
      error => window.alert('❌ Error al cambiar el estado del mantenimiento.')
    );
  }

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}
