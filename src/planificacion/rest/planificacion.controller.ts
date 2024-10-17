import { Controller, Post, Body } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { AutorizeSolicitudEnvioDto, SetPlanificacionSemanalDto } from '../dto/rest';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('planificacion')
@Auth()
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

  @Post('sendSolicitudEnvioPlanificacion')
  @Auth(ValidRoles.bodeguero, ValidRoles.cargador, ValidRoles.admin)
  sendSolicitudEnvioPlanificacion(@GetUser() user: User) {
    return this.planificacionService.sendSolicitudEnvio(user);
  }

  @Post('autorizeSolicitudEnvioPlanificacion')
  @Auth(ValidRoles.admin)
  autorizeSolicitudEnvioPlanificacion(@Body() autorizeSolicitudEnvioDto: AutorizeSolicitudEnvioDto, @GetUser() user: User) {
    return this.planificacionService.autorizeSolicitudEnvio(autorizeSolicitudEnvioDto, user);
  }

}
