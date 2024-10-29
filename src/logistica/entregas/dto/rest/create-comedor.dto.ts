import { IsNotEmpty, IsString } from "class-validator";


export class CreateComedorDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;
}
