import { IsUUID } from "class-validator";

export class GetUbicacionByBodegaDto {

    @IsUUID()
    idBodega: string;

}
