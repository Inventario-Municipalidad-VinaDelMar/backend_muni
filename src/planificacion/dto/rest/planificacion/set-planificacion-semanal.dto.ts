import { IsArray, IsDateString, IsNotEmpty, ValidateNested, IsUUID, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PlanificacionDetalleDiaDto {
    @IsUUID()
    @IsNotEmpty()
    productoId: string;  // El ID del producto asociado

    @IsInt()
    @IsNotEmpty()
    cantidadPlanificada: number;
}

class PlanificacionDiaDto {
    @IsUUID()
    @IsOptional()  // Opcional porque puede que aún no exista una planificación para ese día
    id?: string;  // ID de la planificación diaria existente

    @IsDateString()
    @IsNotEmpty()
    fecha: string;  // Fecha del día específico

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlanificacionDetalleDiaDto)
    detalles: PlanificacionDetalleDiaDto[];  // Productos planificados para este día
}

export class SetPlanificacionSemanalDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlanificacionDiaDto)
    dias: PlanificacionDiaDto[];  // Lista de los 5 días de planificación para la semana
}
