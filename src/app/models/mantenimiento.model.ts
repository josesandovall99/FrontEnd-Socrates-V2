//import { Soporte } from './soporte.model';
import { Empleado } from './empleado.model';
import { Producto } from './producto.model';

export interface Mantenimiento {
  id: number;
  //soporte: Soporte;
  descripcion: string;
  fechaProgramada: Date;
  estado: string;
  tecnico: Empleado;
  productos: Producto[];
}
