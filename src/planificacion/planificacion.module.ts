import { forwardRef, Module } from '@nestjs/common';
import { PlanificacionService } from './rest/planificacion.service';
import { PlanificacionController } from './rest/planificacion.controller';
import { PlanificacionSocketGateway } from './socket/planificacion.socket.gateway';
import { PlanificacionSocketService } from './socket/planificacion.socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { PlanificacionDetalle } from './entities/planificacion-detalle.entity';
import { InventarioModule } from 'src/inventario/inventario.module';
import { LogisticaModule } from 'src/logistica/logistica.module';

@Module({
  imports: [
    forwardRef(() => LogisticaModule),
    forwardRef(() => InventarioModule),
    TypeOrmModule.forFeature([Planificacion, PlanificacionDetalle]),
    //to allow circular import between socket and rest in this module
    forwardRef(() => PlanificacionModule),
  ],
  controllers: [PlanificacionController],
  providers: [
    PlanificacionService,
    PlanificacionSocketGateway,
    PlanificacionSocketService,
  ],
  exports: [
    TypeOrmModule,
    //services
    PlanificacionService,
    PlanificacionSocketService,
  ]
})
export class PlanificacionModule { }