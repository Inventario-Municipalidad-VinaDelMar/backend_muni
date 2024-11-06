
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IncidenteType } from '../entities/incidente-envio.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateIncidenteProductoDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return Number.parseInt(value)
            } catch {
                throw new BadRequestException('El campo cantidadAfectada debe ser un numero valido.');
            }
        }
        return value;
    })
    cantidadAfectada: number;

    @IsNotEmpty()
    @IsUUID()
    productoId: string;

}


export class CreateIncidenteDto {
    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    closeEnvio: boolean;

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
