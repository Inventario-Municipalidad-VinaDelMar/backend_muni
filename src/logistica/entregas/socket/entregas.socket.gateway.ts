import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { EntregasSocketService } from "./entregas.socket.service";
import { AuthSocket } from "src/auth/decorators";
import { ValidRoles } from "src/auth/interfaces";
import { BadRequestException } from "@nestjs/common";
import { GetUserWs } from "src/auth/decorators/get-user-ws.decorator";
import { User } from "src/auth/entities/user.entity";
import { MiddleWareWs } from "src/auth/guards/socket/middleware-socket.guard";
import { GetEntregasByEnvioDto } from "../dto/socket/get-entregas-by-envio.dto";
import { GetEnvioByIdDto } from "src/logistica/envios/dto/get-envio-by-id.dto";
import { GetEntregaByIdDto } from "../dto/socket/get-entrega-by-id.dto";


@WebSocketGateway({ cors: true, namespace: 'logistica/entregas' })
@AuthSocket()
export class EntregasSocketGateway {
    constructor(
        private readonly entregasSocketService: EntregasSocketService,
        private readonly middleWareWs: MiddleWareWs,
    ) { }

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.entregasSocketService.setServer(server);
        server.use((socket: Socket, next) => this.middleWareWs.socketAuth(socket, next));
    }

    @SubscribeMessage('getAllComedores')
    @AuthSocket(ValidRoles.admin, ValidRoles.bodeguero)
    async findAllComedores(client: Socket) {

        const data =
            await this.entregasSocketService.findAllComedores();
        client.emit('loadAllComedores', data);
    }
    @SubscribeMessage('getEntregasByEnvio')
    @AuthSocket(ValidRoles.admin, ValidRoles.bodeguero)
    async findEntregasByEnvio(@ConnectedSocket() client: Socket, @MessageBody() payload: GetEntregasByEnvioDto, @GetUserWs() user: User,) {
        const { idEnvio } = payload;

        const room = `${idEnvio}-entregas`;
        const data =
            await this.entregasSocketService.getEntregasByEnvio(idEnvio);
        client.join(room);
        client.emit('loadEntregasByEnvio', data);
    }

    @SubscribeMessage('getEntregaById')
    @AuthSocket(ValidRoles.admin)
    async findEntregasById(@ConnectedSocket() client: Socket, @MessageBody() payload: GetEntregaByIdDto, @GetUserWs() user: User,) {
        const { idEntrega } = payload;
        if (!idEntrega) {
            throw new BadRequestException('El id de la entrega es inexistente.')
        }
        try {
            const data =
                await this.entregasSocketService.getEntregaById(idEntrega);
            client.emit(`${idEntrega}-loadEntregaById`, data);
        } catch (error) {
            client.emit(`${idEntrega}-loadEntregaById`, error.response);

        }
    }
}