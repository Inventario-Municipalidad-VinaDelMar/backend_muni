import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InventarioService } from '../rest/inventario.service';
import { Server } from 'socket.io';
import { TandaResponse } from '../interfaces/tanda-response.interface';
import { GetUbicacionByBodegaDto } from '../dto/rest-dto';

@Injectable()
export class InventarioSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }
    constructor(
        @Inject(forwardRef(() => InventarioService))
        private readonly inventarioService: InventarioService,
    ) { }

    async notifyProductoUpdate() {
        if (this.wss) {
            const productos = await this.inventarioService.findAllProductos();
            this.wss.emit('loadAllProductos', productos);
        } else {
            console.error('WebSocket server not initialized - To notify productos list has been updated');
            throw new BadRequestException();
        }
    }
    async notifyBodegasUpdate() {
        if (this.wss) {
            const bodegas = await this.inventarioService.findAllBodegas();
            this.wss.emit('loadAllBodegas', bodegas);
        } else {
            console.error('WebSocket server not initialized - To notify bodegas list has been updated');
            throw new BadRequestException();
        }
    }
    async notifyUbicacionUpdate(idBodega: string) {
        if (this.wss) {
            const ubicaciones = await this.inventarioService.findUbicacionesByBodega(idBodega);
            this.wss.emit(`${idBodega}-ubicaciones`, ubicaciones);
        } else {
            console.error('WebSocket server not initialized - To notify ubicaciones list has been updated');
            throw new BadRequestException();
        }
    }

    async notifyTandaCreated(tanda: TandaResponse) {
        if (this.wss) {
            const producto = await this.inventarioService.findOneProducto(tanda.productoId);
            //?Emision de cambios
            this.wss.emit('newTandaCreated', tanda);
            //?Re-emitir producto de la tanda.
            this.wss.emit('stockProductoChange', producto);

        } else {
            console.error('WebSocket server not initialized - To notify tanda has been created');
            throw new BadRequestException();
        }
    }
    async notifyTandaUpdate(tanda: TandaResponse) {
        if (this.wss) {
            const producto = await this.inventarioService.findOneProducto(tanda.productoId);
            //?Emision de cambios
            this.wss.emit('newTandaUpdate', tanda);
            //?Re-emitir categoria de la tanda.
            this.wss.emit('stockProductoChange', producto);
        } else {
            console.error('WebSocket server not initialized - To notify tanda has been updated');
            throw new BadRequestException();
        }
    }

    async getInventarioBodegas() {
        if (this.wss) {
            const bodegas = await this.inventarioService.findAllBodegas();
            return bodegas;
        } else {
            console.error('WebSocket server not initialized - To get bodegas');
            throw new BadRequestException();
        }
    }


    async getInventarioUbicacionByBodega(getUbicacionByBodegaDto: GetUbicacionByBodegaDto) {
        if (this.wss) {
            const { idBodega } = getUbicacionByBodegaDto;
            const ubicaciones = await this.inventarioService.findUbicacionesByBodega(idBodega);
            return ubicaciones;
        } else {
            console.error('WebSocket server not initialized - To get ubicaciones by bodega');
            throw new BadRequestException();
        }
    }

    async getInventarioTandasByProducto(idProducto: string) {
        if (this.wss) {
            const tandas = await this.inventarioService.findAllTandasByProducto(idProducto);
            return tandas;
        } else {
            console.error('WebSocket server not initialized - To get tandas by producto');
            throw new BadRequestException();
        }
    }
    async getInventarioProductos() {
        if (this.wss) {
            const productos = await this.inventarioService.findAllProductos();
            return productos;
        } else {
            console.error('WebSocket server not initialized - To get productos');
            throw new BadRequestException();
        }
    }

    // async getAllProductos() {
    //     // async getProductosByName(getProductosDto: GetProductosDto) {
    //     // const { nameSuggest } = getProductosDto;
    //     if (this.wss) {
    //         const productos = await this.inventarioService.findManyProductos();
    //         return productos;
    //     } else {
    //         console.error(`WebSocket server not initialized - To get all productos`);
    //         throw new BadRequestException();
    //     }
    // }


}
