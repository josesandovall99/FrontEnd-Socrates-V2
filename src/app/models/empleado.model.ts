export interface Empleado {
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
    fechaNacimiento: string; // usar `Date` si lo vas a manejar como objeto de fecha
    lugarResidencia: string;
    direccionCasa: string;
    barrio: string;
    estado: boolean;
  
    // Campos específicos de Empleado
    codigoEmpleado: string;
    cargo: string;
    tipoContrato: string;
    hojaDeVida: string | undefined;
    referenciaLaboral: string;
    contactoEmergenciaNombre: string;
    contactoEmergenciaParentesco: string;
    contactoEmergenciaTelefono: string;
    fechaIngreso: string; 
    fechaRetiro: string; 
    sueldo: number;
  }
  