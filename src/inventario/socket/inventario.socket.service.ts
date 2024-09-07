import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InventarioService } from '../rest/inventario.service';
import { Server } from 'socket.io';
import { TandaResponse } from '../interfaces/tanda-response.interface';
import { GetProductosDto } from '../dto/socket-dto/productos/get-productos.dto';
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

    async notifyTandaCreated(tanda: TandaResponse) {
        if (this.wss) {
            // const room = `${idCategoria}-categoria`;
            //?Emision de cambios
            this.wss.emit('newTandaCreated', tanda);
        } else {
            console.error('WebSocket server not initialized - To notify tanda has been created');
            throw new BadRequestException();
        }
    }
    async notifyTandaUpdate(tanda: TandaResponse) {
        if (this.wss) {
            // const room = `${idCategoria}-categoria`;
            //?Emision de cambios
            //TODO:Re-emitir categoria de la tanda.
            this.wss.emit('newTandaUpdate', tanda);
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
            const ubicaciones = await this.inventarioService.findUbicacionesByCategoria(idBodega);
            return ubicaciones;
        } else {
            console.error('WebSocket server not initialized - To get ubicaciones by bodega');
            throw new BadRequestException();
        }
    }

    async getInventarioTandasByCategoria(idCategoria: string) {
        if (this.wss) {
            const tandas = await this.inventarioService.findAllTandasByCategoria(idCategoria);
            return tandas;
        } else {
            console.error('WebSocket server not initialized - To get tandas by categoria');
            throw new BadRequestException();
        }
    }
    async getInventarioCategorias() {
        if (this.wss) {
            const categorias = await this.inventarioService.findAllCategorias();
            return categorias;
        } else {
            console.error('WebSocket server not initialized - To get categorias');
            throw new BadRequestException();
        }
    }

    async getAllProductos() {
        // async getProductosByName(getProductosDto: GetProductosDto) {
        // const { nameSuggest } = getProductosDto;
        if (this.wss) {
            const productos = await this.inventarioService.findManyProductos();
            return productos;
        } else {
            console.error(`WebSocket server not initialized - To get all productos`);
            throw new BadRequestException();
        }
    }


}
