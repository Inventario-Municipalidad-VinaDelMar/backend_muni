import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { EntregasSocketService } from "./entregas.socket.service";


@WebSocketGateway({ cors: true, namespace: 'logistica/entregas' })
export class EntregasSocketGateway {
    constructor(private readonly entregasSocketService: EntregasSocketService) { }

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.entregasSocketService.setServer(server);
    }
}