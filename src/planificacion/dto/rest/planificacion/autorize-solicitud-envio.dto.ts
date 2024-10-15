import { IsBoolean, IsUUID } from "class-validator";



export class AutorizeSolicitudEnvioDto {

    @IsBoolean()
    aceptada: boolean;

    @IsUUID()
    idSolicitud: string;

}
