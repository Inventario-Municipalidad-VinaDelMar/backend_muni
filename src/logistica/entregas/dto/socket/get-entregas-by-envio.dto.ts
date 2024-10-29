import { IsUUID } from "class-validator";



export class GetEntregasByEnvioDto {
    @IsUUID()
    idEnvio: string;

}
