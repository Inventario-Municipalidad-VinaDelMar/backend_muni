import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";


class DetalleEntregaDto {
    @IsUUID()
    @IsNotEmpty()
    productoId: string;  // El ID del producto asociado

    @IsInt()
    @IsNotEmpty()
    cantidadEntregada: number;
}


export class CreateEntregaDto {

    @IsUUID()
    idEnvio: string;

    @IsInt()
    idComedor: number;
    // @IsUUID()
    // idComedor: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleEntregaDto)
    detalles: DetalleEntregaDto[];
}
