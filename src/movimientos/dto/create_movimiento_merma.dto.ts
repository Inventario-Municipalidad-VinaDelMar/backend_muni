import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateMovimientoMermaDto {

    @IsUUID()
    idTanda: string;

    @IsUUID()
    idProducto: string;

    @IsNumber()
    cantidadMerma: number;

    @IsString()
    comentario: string;
}