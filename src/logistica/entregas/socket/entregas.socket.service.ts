import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { EntregasService } from "../rest/entregas.service";


@Injectable()
export class EntregasSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }

    constructor(
        @Inject(forwardRef(() => EntregasService))
        private readonly entregasService: EntregasService,
    ) { }

    async notifyNewEntrega(idEnvio: string) {
        if (this.wss) {
            const room = `${idEnvio}-entregas`;
            const data =
                await this.entregasService.getEntregasByEnvio(idEnvio);

            this.wss.to(room).emit('loadEntregasByEnvio', data);

        } else {
            console.error('WebSocket server not initialized - To notify entregas by envio');
            throw new BadRequestException();
        }
    }
    async getEntregasByEnvio(idEnvio: string) {
        if (this.wss) {
            const entregas = await this.entregasService.getEntregasByEnvio(idEnvio);
            return entregas;
        } else {
            console.error('WebSocket server not initialized - To emit entregas by envio');
            throw new BadRequestException();
        }
    }
    async findAllComedores() {
        if (this.wss) {
            const comedores = await this.entregasService.findAllComedores();
            return comedores;
        } else {
            console.error('WebSocket server not initialized - To emit all comedores');
            throw new BadRequestException();
        }
    }
    async getEntregaById(idEntrega: string) {
        if (this.wss) {
            const entrega = await this.entregasService.getEntregaById(idEntrega);
            return entrega;
        } else {
            console.error('WebSocket server not initialized - To emit entrega by id');
            throw new BadRequestException();
        }
    }
}