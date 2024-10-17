import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PlanificacionSocketService } from './planificacion.socket.service';
import { Server, Socket } from 'socket.io';
import { GetPlanificacionDto } from '../dto/rest';
import { PlanificacionSemanaDto } from '../dto/socket';

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
