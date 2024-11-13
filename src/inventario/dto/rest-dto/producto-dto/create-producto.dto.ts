import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString, IsUUID } from "class-validator";


export class BaseProductoDto {
    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    barcode?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

}



export class CreateProductoDto extends PartialType(BaseProductoDto) {

    @IsString()
    @IsOptional()
    urlImagen?: string;


}
