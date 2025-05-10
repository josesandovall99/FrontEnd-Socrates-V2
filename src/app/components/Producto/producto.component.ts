import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProductoComponent implements OnInit {
  productoForm: FormGroup;
  productos: Producto[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    const fechaActual = new Date().toISOString().substring(0, 10);
    this.productoForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      fechaIngreso: [{ value: fechaActual, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.isLoading = true;
    this.productoService.getAllProductos().subscribe(
      (productos) => {
        this.productos = productos;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar productos', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.productoForm.invalid) return;

    const producto: Producto = this.productoForm.getRawValue();
    this.isLoading = true;

    if (producto.id) {
      this.productoService.updateProducto(producto.id, producto).subscribe(
        () => {
          this.isLoading = false;
          this.loadProductos();
          this.resetForm();
        },
        (error) => {
          console.error('Error al actualizar producto', error);
          this.isLoading = false;
        }
      );
    } else {
      this.productoService.createProducto(producto).subscribe(
        () => {
          this.isLoading = false;
          this.loadProductos();
          this.resetForm();
        },
        (error) => {
          console.error('Error al crear producto', error);
          this.isLoading = false;
        }
      );
    }
  }

  editarProducto(producto: Producto): void {
    this.productoForm.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      precio: producto.precio,
      fechaIngreso: producto.fechaIngreso
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.isLoading = true;
      this.productoService.deleteProducto(id).subscribe(
        () => {
          this.isLoading = false;
          this.loadProductos();
        },
        (error) => {
          console.error('Error al eliminar producto', error);
          this.isLoading = false;
        }
      );
    }
  }

  resetForm(): void {
    const fechaActual = new Date().toISOString().substring(0, 10);
    this.productoForm.reset({
      id: null,
      nombre: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      fechaIngreso: { value: fechaActual, disabled: true }
    });
  }
}
