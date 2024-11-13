import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {

    @IsString()
    nombre?: string;

    @IsString()
    @IsOptional()
    barcode?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    urlImagen?: string;
}
