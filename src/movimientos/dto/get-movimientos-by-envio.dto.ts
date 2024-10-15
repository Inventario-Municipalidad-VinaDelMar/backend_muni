import { IsUUID } from "class-validator";

export class GetMovimientosByEnvioDto {

    @IsUUID()
    idEnvio: string;

}
