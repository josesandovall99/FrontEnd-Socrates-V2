import { Empleado } from './empleado.model';
import { Producto } from './producto.model';
import { Soporte } from './soporte.model';

export interface Mantenimiento {
  id: number;
  soporte: Soporte;
  descripcion: string;
  fechaProgramada: Date;
  estado: string;
  tecnico: Empleado;
  productos: Producto[];
}
