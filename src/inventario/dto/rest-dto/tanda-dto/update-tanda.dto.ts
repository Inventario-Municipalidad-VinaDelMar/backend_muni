import { PartialType } from '@nestjs/mapped-types';
import { CreateTandaDto } from './create-tanda.dto';
import { IsDateString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateTandaDto extends PartialType(CreateTandaDto) {
    @IsNumber()
    @IsOptional()
    cantidadIngresada?: number;

    @IsDateString()
    @IsOptional()
    fechaVencimiento?: string;

    @IsUUID()
    @IsOptional()
    idProducto?: string;

    @IsUUID()
    @IsOptional()
    idBodega?: string;

    @IsUUID()
    @IsOptional()
    idUbicacion?: string;
}
