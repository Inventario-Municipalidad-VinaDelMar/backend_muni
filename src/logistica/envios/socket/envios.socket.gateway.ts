import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { EnviosSocketService } from "./envios.socket.service";
import { GetEnviosDto } from "../dto/get-envios.dto";
import { BadRequestException } from "@nestjs/common";

@WebSocketGateway({ cors: true, namespace: 'logistica/envios' })
export class EnviosSocketGateway {
    constructor(private readonly enviosSocketService: EnviosSocketService) { }

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.enviosSocketService.setServer(server);
    }

    @SubscribeMessage('getEnviosByFecha')
    async findEnviosByFecha(client: Socket, getEnviosDto: GetEnviosDto) {
        const { fecha } = getEnviosDto;
        if (!fecha) {
            throw new BadRequestException('Fecha de envios inexistente.')
        }

        const data =
            await this.enviosSocketService.getEnviosByFecha(fecha);
        client.emit('loadEnviosByFecha', data);
    }
}