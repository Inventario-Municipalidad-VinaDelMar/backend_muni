import { forwardRef, Module } from '@nestjs/common';
import { MovimientosService } from './rest/movimientos.service';
import { MovimientosController } from './rest/movimientos.controller';
import { MovimientosSocketGateway } from './socket/movimientos.socket.gateway';
import { MovimientosSocketService } from './socket/movimientos.socket.service';
import { Movimiento } from './entities/movimiento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from 'src/inventario/inventario.module';
import { LogisticaModule } from 'src/logistica/logistica.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';

@Module({
  imports: [
    PlanificacionModule,
    forwardRef(() => LogisticaModule),
    TypeOrmModule.forFeature([Movimiento]),

    //to allow circular import between "MovimientoModule" and "InventarioModule"
    forwardRef(() => InventarioModule),

    //to allow circular import between socket and rest in this module
    forwardRef(() => MovimientosModule),
  ],
  controllers: [MovimientosController],
  providers: [
    MovimientosService,
    MovimientosSocketGateway,
    MovimientosSocketService,
  ],
  exports: [TypeOrmModule],
})
export class MovimientosModule { }
