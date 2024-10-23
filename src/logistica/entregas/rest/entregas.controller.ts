import { Controller, Post, Body, } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregasDto } from '../dto/create-entregas.dto';

@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) { }

  @Post()
  create(@Body() createEntregasDto: CreateEntregasDto) {
    return this.entregasService.create(createEntregasDto);
  }
}
