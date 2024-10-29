import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaDto } from './create-entregas.dto';

export class UpdateEntregasDto extends PartialType(CreateEntregaDto) { }
