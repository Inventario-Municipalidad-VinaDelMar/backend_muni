import { forwardRef, Module } from '@nestjs/common';
import { EnviosModule } from './envios/envios.module';
import { EntregasModule } from './entregas/entregas.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';

@Module({
    imports: [

        //Del scope
        EnviosModule,
        EntregasModule,
    ],
    controllers: [],
    providers: [],
    exports: [EnviosModule,],
})
export class LogisticaModule { }
