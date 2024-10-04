import { Controller, Post, Body } from '@nestjs/common';
import { CreatePlanificacionDto } from '../dto/rest/planificacion/create-planificacion.dto';
import { PlanificacionService } from './planificacion.service';

@Controller('planificacion')
export class PlanificacionController {
  constructor(private readonly planificacionService: PlanificacionService) { }

  @Post()
  create(@Body() createPlanificacionDto: CreatePlanificacionDto) {
    return this.planificacionService.create(createPlanificacionDto);
  }

}
