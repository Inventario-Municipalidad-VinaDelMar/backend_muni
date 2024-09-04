import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregasDto } from './create-entregas.dto';

export class UpdateEntregasDto extends PartialType(CreateEntregasDto) {}
