import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PlanificacionSocketService } from './planificacion.socket.service';
import { Server, Socket } from 'socket.io';
import { GetPlanificacionDto } from '../dto/rest';

@WebSocketGateway({ cors: true, namespace: 'planificacion' })
export class PlanificacionSocketGateway {
  constructor(private readonly planificacionSocketService: PlanificacionSocketService) { }

  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.planificacionSocketService.setServer(server);
  }

  @SubscribeMessage('getPlanificacion')
  async findPlanificacionByFecha(client: Socket, payload: GetPlanificacionDto) {
    const data =
      await this.planificacionSocketService.getPlanificacionByFecha(payload);

    client.emit('loadPlanificacion', data);
  }
}
