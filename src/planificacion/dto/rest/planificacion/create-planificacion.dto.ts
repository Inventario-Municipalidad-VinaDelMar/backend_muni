import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";


export class CreatePlanificacionDetalleDto {
    @IsInt()
    cantidadPlanificada: number;

    @IsNotEmpty()
    @IsUUID()
    producto: string;
}

export class CreatePlanificacionDto {
    @IsDateString()
    fecha: string;

    @ValidateNested({ each: true })
    @Type(() => CreatePlanificacionDetalleDto)
    detalles: CreatePlanificacionDetalleDto[];
}