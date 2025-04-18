export interface Cliente {
    id: number; // El ID es opcional, ya que no lo necesitamos al crear un nuevo cliente.
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
    estado: string;
    fechaRegistro: string; // Formato de fecha: yyyy-MM-dd
    descripcion: Text;
  }
  