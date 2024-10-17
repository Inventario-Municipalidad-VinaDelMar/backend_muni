import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { EnviosService } from "../rest/envios.service";

@Injectable()
export class EnviosSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }

    constructor(
        @Inject(forwardRef(() => EnviosService))
        private readonly enviosService: EnviosService,
    ) { }

    async getEnviosByFecha(fecha: string) {
        if (this.wss) {
            const envios = await this.enviosService.getEnviosByFecha(fecha);
            return envios;
        } else {
            console.error('WebSocket server not initialized - To emit envios by fecha');
            throw new BadRequestException();
        }
    }
}