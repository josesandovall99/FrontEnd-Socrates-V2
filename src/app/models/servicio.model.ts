import { Empleado } from "./empleado.model";
import { TipoPlan } from "./tipo-plan.model";

export interface Servicio {
  id: number;
  fechaServicio: string; // Formato "dd/MM/yyyy"
  descripcion: string;
  horaServicio: string; // Formato "HH:mm:ss"
  estado: string;
  tipoPlan: TipoPlan;  // ✅ Ahora es un objeto, no un número
  tecnico: Empleado;   // ✅ Ahora es un objeto, no un número
  fechaRegistro: string; // Formato "dd/MM/yyyy"
}
