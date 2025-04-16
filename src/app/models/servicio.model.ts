import { TipoPlan } from './TipoPlan';
import { Tecnico } from './tecnico.model';
import { Cliente } from './cliente.model'; // Comentado porque aún no existe

export interface Servicio {
  id: number;
  fechaServicio: Date;
  descripcion: string;
  horaServicio: string; // Usaremos string para simplificar
  estado: string;
  tipoPlan: TipoPlan;
  tecnico: Tecnico;
  cliente: Cliente; // Comentado porque aún no existe
}