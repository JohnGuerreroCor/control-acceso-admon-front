import { PuestoVigilancia } from "./puesto-vigilancia";
import { Vigilante } from "./vigilante";

export class Asignacion {

  codigo!: number;
  puesto!: PuestoVigilancia;
  vigilante!: Vigilante;
	observacion!: String;
	fechaCreacion!: Date;
	fechaRetiro!: Date;
	estado!: number;
  
}
