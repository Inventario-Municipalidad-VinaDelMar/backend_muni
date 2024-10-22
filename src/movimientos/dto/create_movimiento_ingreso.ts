import { IsNumber, IsUUID } from "class-validator";

export class CreateMovimientoIngresoDto {

    @IsNumber()
    cantidadRetirada: number;

    @IsUUID()
    idTanda: string;

}
