export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  fechaIngreso: string; // En formato string debido a la conversión de LocalDate a string
}
