import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { MovimientosService } from '../rest/movimientos.service';
import { InventarioSocketService } from 'src/inventario/socket/inventario.socket.service';
import { TandaResponse } from 'src/inventario/interfaces/tanda-response.interface';
import { MovimientoResponse } from '../interfaces/movimiento_response.interface';
@Injectable()
export class MovimientosSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }

    constructor(
        private readonly inventarioSocketService: InventarioSocketService,

        @Inject(forwardRef(() => MovimientosService))
        private readonly movimientosService: MovimientosService,
    ) { }

    async notifyMovimientoCreated(movimiento: MovimientoResponse, idEnvio: string) {
        if (this.wss) {
            //?Emision de cambios
            const room = `${idEnvio}-movimientos`;
            this.wss.to(room).emit('newMovimientoOnEnvio', movimiento);
        } else {
            console.error('WebSocket server not initialized - To notify movimiento has been created');
            throw new BadRequestException();
        }
    }
    async getMovimientosByEnvio(idEnvio: string) {
        if (this.wss) {
            const movimientos = await this.movimientosService.getMovimientoByIdEnvio(idEnvio);
            return movimientos;
        } else {
            console.error('WebSocket server not initialized - To emit movimientos by id envio');
            throw new BadRequestException();
        }
    }
    async notifyTandaDiscount(tanda: TandaResponse) {
        await this.inventarioSocketService.notifyTandaUpdate(tanda);
    }
}

