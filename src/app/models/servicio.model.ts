export interface Servicio {
    id: number;
    fechaServicio: string; // Formato "dd/MM/yyyy"
    descripcion: string;
    horaServicio: string; // Formato "HH:mm:ss"
    estado: string;
    tipoPlan: number; // ID del TipoPlan
    tecnico: number | null; // ID del Técnico (puede ser opcional)
    fechaRegistro: string; // Formato "dd/MM/yyyy"
  }
  