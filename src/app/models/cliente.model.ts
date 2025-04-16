import { persona } from "./persona.model";


export interface Cliente extends persona {

    tipoServicio: string,
    fechaRegistro: Date

}