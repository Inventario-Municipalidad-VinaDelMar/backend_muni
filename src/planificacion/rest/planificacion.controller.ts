import { Controller, Post, Body } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { SetPlanificacionSemanalDto } from '../dto/rest';

@Controller('planificacion')
export class PlanificacionController {
  constructor(private readonly planificacionService: PlanificacionService) { }

  // @Post()
  // create(@Body() createPlanificacionDto: CreatePlanificacionDto) {
  //   return this.planificacionService.create(createPlanificacionDto);
  // }

  @Post('setPlanificacion')
  setPlanificacionSemanal(@Body() setPlanificacionSemanal: SetPlanificacionSemanalDto) {
    return this.planificacionService.updatePlanificacionSemanal(setPlanificacionSemanal);
  }

}
