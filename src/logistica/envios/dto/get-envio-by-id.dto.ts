import { IsUUID } from "class-validator";

export class GetEnvioByIdDto {
    @IsUUID()
    idEnvio: string;

    // @ValidateNested({ each: true })
    // @Type(() => CreateEnviosCategoriaDto)
    // detalles: CreateEnviosCategoriaDto[];

}
