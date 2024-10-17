import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PlanificacionSocketService } from './planificacion.socket.service';
import { Server, Socket } from 'socket.io';
import { GetPlanificacionDto } from '../dto/rest';
import { PlanificacionSemanaDto } from '../dto/socket';
import { AuthSocket, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { SetDetalleAsTaken } from '../dto/rest/planificacion/set-detalles-as-taken.dto';
import { User } from 'src/auth/entities/user.entity';
import { middleWareSocketAuth } from 'src/auth/guards/socket/middleware-socket.guard';
import { JwtService } from '@nestjs/jwt';
import { GetUserWs } from 'src/auth/decorators/get-user-ws.decorator';
import { DetalleTaken } from '../interface/detalleTaken.interface';

@WebSocketGateway({ cors: true, namespace: 'planificacion' })
@AuthSocket()
export class PlanificacionSocketGateway {

  detallesTaken: DetalleTaken[] = [];
  constructor(private readonly planificacionSocketService: PlanificacionSocketService,
    private readonly jwtService: JwtService,

  ) { }

  @WebSocketServer()
  wss: Server;
  afterInit(server: Server) {
    this.planificacionSocketService.setServer(server);
    server.use((socket: Socket, next) => middleWareSocketAuth(socket, next, this.jwtService));
  }


  @AuthSocket(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.bodeguero)
  @SubscribeMessage('setDetalleAsTaken')
  async setDetalleAsTaken(@GetUserWs() user: User, @MessageBody() payload: SetDetalleAsTaken, @ConnectedSocket() client: Socket) {
    const { fecha, idDetalle } = payload;
    const room = `planificacion-${fecha}`;
    client.join(room);

    if (!idDetalle) {
      client.emit('loadDetallesTaken', this.detallesTaken);
      return;
    }
    console.log({ payload })

    // Buscar si existe un detalle con el mismo idDetalle y el mismo usuario
    const index = this.detallesTaken.findIndex(
      (detalle) => detalle.idDetalle === idDetalle && detalle.user.id === user.id
    );

    if (index !== -1) {
      // Si lo encuentra, lo elimina del array
      this.detallesTaken.splice(index, 1);
    } else {
      // Si no lo encuentra, lo añade al array
      this.detallesTaken = [...this.detallesTaken, { idDetalle, user }];
    }



    // Emitir la lista actualizada
    this.wss.to(room).emit('loadDetallesTaken', this.detallesTaken)
    // client.emit('loadDetallesTaken', this.detallesTaken);
  }
  @SubscribeMessage('getPlanificacion')
  async findPlanificacionByFecha(client: Socket, payload: GetPlanificacionDto) {
    const { fecha } = payload;
    const data =
      await this.planificacionSocketService.getPlanificacionByFecha(payload);
    const solicitud = await this.planificacionSocketService.getSolicitudEnCurso();
    const room = `planificacion-${fecha}`;
    client.join(room);
    client.emit('loadSolicitud', solicitud);
    client.emit('loadPlanificacion', data);
  }

  @SubscribeMessage('adminPlanificacionManage')
  async planificacionBySemana(client: Socket, planificacionSemanaDto: PlanificacionSemanaDto) {
    try {
      const data =
        await this.planificacionSocketService.getPlanificacionBySemana(planificacionSemanaDto);

      const room = `planificacion-${planificacionSemanaDto.inicio}-${planificacionSemanaDto.fin}`;
      client.join(room);
      client.emit('loadAdminPlanificacionManage', data);
    } catch (error) {
      // Emitir el error en el mismo evento
      client.emit('loadAdminPlanificacionManage', `Error: '${error.message}'`);
    }
  }
}
