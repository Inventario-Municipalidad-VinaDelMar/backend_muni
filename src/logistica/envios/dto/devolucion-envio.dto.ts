import { IsNotEmpty, IsString } from "class-validator";

export class DevolucionEnvioDto {

    @IsString()
    @IsNotEmpty()
    comentario: string;
}