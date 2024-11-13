import { PartialType } from '@nestjs/mapped-types';
import { BaseUbicacionDto } from './create-ubicacion.dto';

export class UpdateUbicacionDto extends PartialType(BaseUbicacionDto) { }
