import { IsUUID } from "class-validator";



export class CreateSolicitudEnvioDto {

    @IsUUID()
    solicitanteId: string;  // Usuario que crea la solicitud desde la app móvil

}
