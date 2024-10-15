import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from '../dto/create_movimiento.dto';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @Post('/')
  createMovimiento(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.createMovimiento(createMovimientoDto);
  }
  @Get(':id')
  getMovimientosByPlanificacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.movimientosService.getMovimientoByIdEnvio(id);
  }

}
