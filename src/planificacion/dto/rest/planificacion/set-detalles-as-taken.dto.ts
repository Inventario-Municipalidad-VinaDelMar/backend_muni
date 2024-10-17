import { IsDateString, IsUUID } from "class-validator";


export class SetDetalleAsTaken {

    @IsUUID()
    idDetalle: string;

    @IsDateString()
    fecha: string;
}