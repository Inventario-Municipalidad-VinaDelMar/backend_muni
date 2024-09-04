import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InventarioService } from "./rest/inventario.service";
import { InventarioController } from "./rest/inventario.controller";
import { InventarioSocketService } from "./socket/inventario.socket.service";
import { InventarioSocketGateway } from "./socket/inventario.socket.gateway";

import { MovimientosModule } from "src/movimientos/movimientos.module";
import { Bodega, Categoria, Producto, Tanda, Ubicacion } from "./entities";
import { BodegasService, CategoriasService, ProductosService, TandasService, UbicacionesService } from "./rest/servicios-especificos";
import { LogisticaModule } from "src/logistica/logistica.module";


@Module({
    imports: [
        LogisticaModule,

        TypeOrmModule.forFeature([Bodega, Categoria, Ubicacion, Producto, Tanda,]),

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
        CategoriasService,
        BodegasService,
        TandasService,
        UbicacionesService,
    ],
    exports: [
        TypeOrmModule,

        //Services
        ProductosService,
        CategoriasService,
        BodegasService,
        TandasService,
        UbicacionesService,
        InventarioSocketService,
    ],
})
export class InventarioModule { }