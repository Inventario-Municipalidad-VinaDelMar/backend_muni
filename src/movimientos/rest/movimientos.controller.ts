import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoRetiroDto } from '../dto/create_movimiento_retiro.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('movimientos')
@Auth()
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @Post('/')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  createMovimiento(@Body() createMovimientoRetiroDto: CreateMovimientoRetiroDto, @GetUser() user: User) {
    return this.movimientosService.createMovimientoAsRetiro(createMovimientoRetiroDto, user);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  getMovimientosByPlanificacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.movimientosService.getMovimientoByIdEnvio(id);
  }

}
