import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from './inventario/inventario.module';
import { SeedModule } from './seed/seed.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { LogisticaModule } from './logistica/logistica.module';
import { PlanificacionModule } from './planificacion/planificacion.module';



@Module({
  controllers: [],
  providers: [],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DATABASE,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: !(process.env.STAGE === 'prod'), // in prod should in false
      autoLoadEntities: true,
    }),
    InventarioModule,
    SeedModule,
    MovimientosModule,
    LogisticaModule,
    PlanificacionModule,
  ],
})
export class AppModule { }
