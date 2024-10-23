import { forwardRef, Module } from '@nestjs/common';
import { EnviosModule } from './envios/envios.module';
import { EntregasModule } from './entregas/entregas.module';

@Module({
    imports: [

        //Del scope
        EnviosModule,
        EntregasModule,
    ],
    controllers: [],
    providers: [],
    exports: [
        EnviosModule,
        EntregasModule,
    ],
})
export class LogisticaModule { }
