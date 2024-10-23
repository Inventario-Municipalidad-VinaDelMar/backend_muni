import { forwardRef, Module } from '@nestjs/common';
import { EntregasService } from './rest/entregas.service';
import { EntregasController } from './rest/entregas.controller';
import { EntregasSocketService } from './socket/entregas.socket.service';
import { EntregasSocketGateway } from './socket/entregas.socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrega } from './entities/entrega.entity';
import { EntregaDetalle } from './entities/entrega-detalle.entity';
import { ComedorSolidario } from './entities/comedor-solidario.entity';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Entrega, EntregaDetalle, ComedorSolidario]),
    // forwardRef(() => EnviosModule),
    //to allow circular import between socket and rest in this module
    forwardRef(() => EntregasModule),
  ],
  controllers: [EntregasController],
  providers: [
    EntregasService,
    EntregasSocketService,
    EntregasSocketGateway,
  ],
  exports: [
    TypeOrmModule,
    EntregasService,

  ]
})
export class EntregasModule { }
