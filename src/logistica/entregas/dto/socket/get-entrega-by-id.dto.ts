import { IsUUID } from "class-validator";



export class GetEntregaByIdDto {
    @IsUUID()
    idEntrega: string;

}
