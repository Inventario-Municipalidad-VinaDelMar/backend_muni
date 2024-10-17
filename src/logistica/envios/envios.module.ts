import { forwardRef, Module } from '@nestjs/common';
import { EnviosService } from './rest/envios.service';
import { EnviosController } from './rest/envios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envio } from './entities/envio.entity';
import { EnvioProducto } from './entities/envio-producto.entity';
import { InventarioModule } from 'src/inventario/inventario.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';
import { MovimientosModule } from 'src/movimientos/movimientos.module';
import { AuthModule } from 'src/auth/auth.module';
import { EnviosSocketService } from './socket/envios.socket.service';
import { EnviosSocketGateway } from './socket/envios.socket.gateway';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => MovimientosModule),
    PlanificacionModule,
    forwardRef(() => InventarioModule),
    TypeOrmModule.forFeature([Envio, EnvioProducto]),

    //to allow circular import between socket and rest in this module
    forwardRef(() => EnviosModule),
  ],
  controllers: [EnviosController],
  providers: [
    EnviosService,
    EnviosSocketService,
    EnviosSocketGateway,
  ],
  exports: [
    TypeOrmModule,
    EnviosService,

  ]
})
export class EnviosModule { }
