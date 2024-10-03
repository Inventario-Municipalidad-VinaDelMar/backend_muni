import { forwardRef, Module } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { EnviosController } from './envios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envio } from './entities/envio.entity';
import { EnvioProducto } from './entities/envio-producto.entity';
import { InventarioModule } from 'src/inventario/inventario.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';
import { MovimientosModule } from 'src/movimientos/movimientos.module';

@Module({
  imports: [
    forwardRef(() => MovimientosModule),
    PlanificacionModule,
    forwardRef(() => InventarioModule),
    TypeOrmModule.forFeature([Envio, EnvioProducto]),
  ],
  controllers: [EnviosController],
  providers: [EnviosService],
  exports: [
    TypeOrmModule,
    EnviosService,
  ]
})
export class EnviosModule { }
