import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InventarioService } from "./rest/inventario.service";
import { InventarioController } from "./rest/inventario.controller";
import { InventarioSocketService } from "./socket/inventario.socket.service";
import { InventarioSocketGateway } from "./socket/inventario.socket.gateway";

import { MovimientosModule } from "src/movimientos/movimientos.module";
import { Bodega, Producto, Tanda, Ubicacion } from "./entities";
import { BodegasService, ProductosService, TandasService, UbicacionesService } from "./rest/servicios-especificos";
import { LogisticaModule } from "src/logistica/logistica.module";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [
        AuthModule,
        LogisticaModule,

        TypeOrmModule.forFeature([Bodega, Ubicacion, Producto, Tanda,]),

        //to allow circular import between "InventarioModule" and "MovimientoModule"
        forwardRef(() => MovimientosModule),

        //to allow circular import between socket and rest in this module
        forwardRef(() => InventarioModule),
    ],
    controllers: [InventarioController],
    providers: [
        InventarioService,
        InventarioSocketService,
        InventarioSocketGateway,

        ProductosService,
        BodegasService,
        TandasService,
        UbicacionesService,
    ],
    exports: [
        TypeOrmModule,

        //Services
        ProductosService,
        BodegasService,
        TandasService,
        UbicacionesService,
        InventarioSocketService,
    ],
})
export class InventarioModule { }