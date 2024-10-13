import { Body, Controller, Post } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from '../dto/create_movimiento.dto';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @Post('/')
  createMovimiento(@Body() createMovimientoDto: CreateMovimientoDto) {
    console.log({ createMovimientoDto });
    return this.movimientosService.createMovimiento(createMovimientoDto);
  }
}
