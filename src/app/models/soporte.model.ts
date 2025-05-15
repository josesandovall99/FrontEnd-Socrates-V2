import { Empleado } from "./empleado.model";

export interface Soporte {
  id?: number;
  fechaSolicitud: string;
  descripcion: string;
  estado: string;
  tecnico: Empleado;
  fechaRegistro: string;
}
