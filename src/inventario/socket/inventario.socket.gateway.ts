import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InventarioSocketService } from './inventario.socket.service';
import { Server, Socket } from 'socket.io';
import { GetTandaDto } from '../dto/socket-dto';
import { GetUbicacionByBodegaDto, } from '../dto/rest-dto';

@WebSocketGateway({ cors: true, namespace: 'inventario' })
export class InventarioSocketGateway {
  constructor(private readonly inventarioSocketService: InventarioSocketService) { }

  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.inventarioSocketService.setServer(server);
  }

  @SubscribeMessage('getAllProductos')
  async findAllProductos(client: Socket,) {
    const data =
      await this.inventarioSocketService.getInventarioProductos();

    client.emit('loadAllProductos', data);
  }

  @SubscribeMessage('getUbicacionesByBodega',)
  async findUbicacionesByBodega(client: Socket, payload: GetUbicacionByBodegaDto) {
    const data =
      await this.inventarioSocketService.getInventarioUbicacionByBodega(payload);

    client.emit('loadUbicacionesByBodega', data);
  }

  @SubscribeMessage('getAllBodegas',)
  async findAllBodegas(client: Socket,) {
    const data =
      await this.inventarioSocketService.getInventarioBodegas();

    client.emit('loadAllBodegas', data);
  }

  @SubscribeMessage('getTandasByIdProducto')
  async findAllTandasOfProducto(client: Socket, payload: GetTandaDto) {
    const { idProducto } = payload;


    if (!idProducto) return;

    const tandasPorProducto =
      await this.inventarioSocketService.getInventarioTandasByProducto(idProducto);
    client.emit(`${idProducto}-tanda`, tandasPorProducto);
  }

  // @SubscribeMessage('getAllProducts')
  // async findManyProductsByName(client: Socket) {
  //   // async findManyProductsByName(client: Socket, payload: GetProductosDto) {
  //   const data =
  //     await this.inventarioSocketService.getAllProductos();

  //   client.emit('loadProducts', data);
  // }
}

