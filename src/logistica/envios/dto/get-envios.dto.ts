import { IsDateString } from "class-validator";

export class GetEnviosDto {
    @IsDateString()
    fecha: string;

    // @ValidateNested({ each: true })
    // @Type(() => CreateEnviosCategoriaDto)
    // detalles: CreateEnviosCategoriaDto[];

}
