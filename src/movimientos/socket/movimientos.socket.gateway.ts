import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MovimientosSocketService } from './movimientos.socket.service';
import { Server, Socket } from 'socket.io';
import { GetMovimientosByEnvioDto } from '../dto/get-movimientos-by-envio.dto';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: 'movimientos' })
export class MovimientosSocketGateway {
  constructor(private readonly movimientosSocketService: MovimientosSocketService) { }

  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.movimientosSocketService.setServer(server);
  }

  @SubscribeMessage('getMovimientosByEnvio')
  async findAllProductos(client: Socket, getMovimientosByEnvioDto: GetMovimientosByEnvioDto) {
    const { idEnvio } = getMovimientosByEnvioDto;
    if (!idEnvio) {
      throw new BadRequestException('Id del envio inexistente.')
    }
    const room = `${idEnvio}-movimientos`;
    client.join(room);
    const data =
      await this.movimientosSocketService.getMovimientosByEnvio(idEnvio);
    const loadEvent = `${idEnvio}-loadMovimientos`;
    client.emit(loadEvent, data);
  }
}
