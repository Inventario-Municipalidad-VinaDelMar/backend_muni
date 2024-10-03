import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateTandaDto {

    @IsNumber()
    cantidadIngresada: number;

    @IsDateString()
    fechaVencimiento: string;

    @IsUUID()
    idProducto: string;

    @IsUUID()
    idBodega: string;

    @IsUUID()
    idUbicacion: string;
}
