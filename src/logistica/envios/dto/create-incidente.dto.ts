
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IncidenteType } from '../entities/incidente-envio.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateIncidenteProductoDto {
    @IsNotEmpty()
    @IsNumber()
    cantidadAfectada: number;

    @IsNotEmpty()
    @IsUUID()
    productoId: string;

}


export class CreateIncidenteDto {
    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsEnum(IncidenteType)
    type: IncidenteType;

    @IsNotEmpty()
    @IsUUID()
    idEnvio: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateIncidenteProductoDto)
    @Transform(({ value }) => {
        // Intenta parsear el valor como JSON si es un string
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                throw new BadRequestException('El campo productosAfectados debe ser un array JSON válido.');
            }
        }
        return value;
    })
    productosAfectados: CreateIncidenteProductoDto[];
}
