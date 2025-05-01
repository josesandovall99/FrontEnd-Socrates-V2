import { Cliente } from "./cliente.model";
import { Servicio } from "./servicio.model";

export interface Contrato {
    id: number;
    cliente: Cliente;    // O puedes crear una interfaz Cliente si lo deseas
    servicio: Servicio;   // Igual para Servicio
    fechaInicio: string; // en formato "dd/MM/yyyy"
    fechaFin: string;    // en formato "dd/MM/yyyy"
    estado: boolean;
    duracion: string;
  }
  