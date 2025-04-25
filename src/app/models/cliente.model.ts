export interface Cliente {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  sexo: string;
  correoElectronico: string;
  telefono: string;
  lugarResidencia: string;
  direccionCasa: string;
  barrio: string;
  tipoCliente: string;
  estado: boolean; // Cambiar de string a boolean
  fechaRegistro: string; // Formato de fecha: yyyy-MM-dd
  descripcion: Text;
}
