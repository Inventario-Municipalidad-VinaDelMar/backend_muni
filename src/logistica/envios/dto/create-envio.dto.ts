import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

export class CreateEnviosCategoriaDto {
    @IsInt()
    cantidadPlanificada: number;

    @IsNotEmpty()
    @IsUUID()
    categoria: string;
}


export class CreateEnvioDto {
    @IsDateString()
    fecha: string;

    @ValidateNested({ each: true })
    @Type(() => CreateEnviosCategoriaDto)
    detalles: CreateEnviosCategoriaDto[];

}
