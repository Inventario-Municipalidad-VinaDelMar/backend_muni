import { IsUUID } from 'class-validator';

export class UpdateEntregaDto {
    @IsUUID()
    idEntrega: string;
}
