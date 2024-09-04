import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { InventarioModule } from 'src/inventario/inventario.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [InventarioModule, PlanificacionModule,]
})
export class SeedModule { }
