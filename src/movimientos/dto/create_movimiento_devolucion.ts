import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateMovimientoDevolucionDto {

    @IsNumber()
    cantidadDevuelta: number;

    @IsUUID()
    idTanda: string;

    @IsUUID()
    idEnvio: string;

    @IsString()
    comentario: string;

}
