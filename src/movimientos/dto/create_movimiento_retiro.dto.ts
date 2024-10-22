import { IsNumber, IsUUID } from "class-validator";

export class CreateMovimientoRetiroDto {

    @IsNumber()
    cantidadRetirada: number;

    @IsUUID()
    idTanda: string;

    @IsUUID()
    idEnvioProducto: string;

}
