import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoRetiroDto } from '../dto/create_movimiento_retiro.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { CreateMovimientoMermaDto } from '../dto/create_movimiento_merma.dto';

@Controller('movimientos')
@Auth()
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @Post('/')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  createMovimientoAsRetiro(@Body() createMovimientoRetiroDto: CreateMovimientoRetiroDto, @GetUser() user: User) {
    return this.movimientosService.createMovimientoAsRetiro(createMovimientoRetiroDto, user);
  }
  @Post('/merma')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  createMovimientoAsMerma(@Body() createMovimientoMermaDto: CreateMovimientoMermaDto, @GetUser() user: User) {
    return this.movimientosService.createMovimientoAsMerma(createMovimientoMermaDto, user);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  getMovimientosByPlanificacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.movimientosService.getMovimientoByIdEnvio(id);
  }

}
