import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { EnviosService } from "../rest/envios.service";
import { User } from "src/auth/entities/user.entity";
import { normalizeDates } from "src/utils";

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

    async notifyListEnviosUpdate(onlyAdmin: boolean = false) {
        if (this.wss) {
            const fecha = normalizeDates.currentFecha();
            const roomAdmin = `envios-${fecha}-all`;
            const enviosAdmin = await this.enviosService.getEnviosByFecha(fecha, true);
            this.wss.to(roomAdmin).emit('loadEnviosByFecha', enviosAdmin);
            if (onlyAdmin) {
                return;
            }
            const roomCommom = `envios-${fecha}-partial`;
            const enviosCommom = await this.enviosService.getEnviosByFecha(fecha, false);
            this.wss.to(roomCommom).emit('loadEnviosByFecha', enviosCommom);
        } else {
            console.error('WebSocket server not initialized - To notify envios list by fecha changed');
            throw new BadRequestException();
        }
    }

    async getEnviosByFecha(fecha: string, adminView: boolean) {
        if (this.wss) {
            const envios = await this.enviosService.getEnviosByFecha(fecha, adminView);
            return envios;
        } else {
            console.error('WebSocket server not initialized - To emit envios by fecha');
            throw new BadRequestException();
        }
    }
}