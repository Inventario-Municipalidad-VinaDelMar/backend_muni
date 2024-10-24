import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { EnviosSocketService } from "./envios.socket.service";
import { GetEnviosDto } from "../dto/get-envios.dto";
import { BadRequestException } from "@nestjs/common";
import { AuthSocket } from "src/auth/decorators";
import { ValidRoles } from "src/auth/interfaces";
import { GetUserWs } from "src/auth/decorators/get-user-ws.decorator";
import { User } from "src/auth/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { middleWareSocketAuth } from "src/auth/guards/socket/middleware-socket.guard";
import { GetEnvioByIdDto } from "../dto/get-envio-by-id.dto";

@WebSocketGateway({ cors: true, namespace: 'logistica/envios' })
@AuthSocket()
export class EnviosSocketGateway {
    constructor(private readonly enviosSocketService: EnviosSocketService, private readonly jwtService: JwtService,) { }

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.enviosSocketService.setServer(server);
        server.use((socket: Socket, next) => middleWareSocketAuth(socket, next, this.jwtService));
    }

    @SubscribeMessage('getEnviosByFecha')
    @AuthSocket(ValidRoles.admin, ValidRoles.bodeguero)
    async findEnviosByFecha(@ConnectedSocket() client: Socket, @MessageBody() payload: GetEnviosDto, @GetUserWs() user: User,) {
        const { fecha } = payload;
        if (!fecha) {
            throw new BadRequestException('Fecha de envios inexistente.')
        }
        const adminView = user.roles.includes('administrador');
        const room = `envios-${fecha}-${adminView ? 'all' : 'partial'}`;
        const data =
            await this.enviosSocketService.getEnviosByFecha(fecha, adminView);
        //Example room expected: 'envios-2024-10-23-all' o 'envios-2024-10-23-partial'
        client.join(room);
        client.emit('loadEnviosByFecha', data);
    }
    @SubscribeMessage('getEnvioById')
    @AuthSocket(ValidRoles.admin)
    async findEnvioById(@ConnectedSocket() client: Socket, @MessageBody() payload: GetEnvioByIdDto, @GetUserWs() user: User,) {
        const { idEnvio } = payload;
        if (!idEnvio) {
            throw new BadRequestException('El id del envio es inexistente.')
        }
        const data =
            await this.enviosSocketService.getEnvioById(idEnvio);
        client.emit(`${idEnvio}-loadEnvioById`, data);
    }
}