import { IsNumber, IsUUID } from "class-validator";

export class CreateMovimientoDto {

    @IsNumber()
    cantidadRetirada: number;

    @IsUUID()
    idTanda: string;

    @IsUUID()
    idEnvioCategoria: string;

}
