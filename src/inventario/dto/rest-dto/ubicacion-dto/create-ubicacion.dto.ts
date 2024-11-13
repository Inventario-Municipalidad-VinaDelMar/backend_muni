import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsUUID } from "class-validator";

export class BaseUbicacionDto {

    @IsString()
    descripcion: string;

}
export class CreateUbicacionDto extends PartialType(BaseUbicacionDto) {

    @IsUUID()
    idBodega: string;

}
