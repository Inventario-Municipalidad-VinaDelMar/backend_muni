import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { InventarioModule } from 'src/inventario/inventario.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';
import { LogisticaModule } from 'src/logistica/logistica.module';
import { MovimientosModule } from 'src/movimientos/movimientos.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    InventarioModule,
    PlanificacionModule,
    LogisticaModule,
    MovimientosModule,
    AuthModule,
    HttpModule,
  ]
})
export class SeedModule { }
