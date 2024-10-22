import { BadRequestException, forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InventarioSocketService } from '../socket/inventario.socket.service';
import { CreateBodegaDto, CreateProductoDto, CreateTandaDto, CreateUbicacionDto } from '../dto/rest-dto';
import { BodegasService, ProductosService, TandasService, UbicacionesService } from './servicios-especificos';
import { MovimientosService } from 'src/movimientos/rest/movimientos.service';
import { User } from 'src/auth/entities/user.entity';



@Injectable()
export class InventarioService {

  constructor(
    private readonly productoService: ProductosService,
    // private readonly categoriaService: CategoriasService,
    private readonly bodegasService: BodegasService,
    private readonly ubicacionesService: UbicacionesService,
    private readonly tandasService: TandasService,
    private readonly movimientosService: MovimientosService,


    @Inject(forwardRef(() => InventarioSocketService))
    private readonly inventarioSocketService: InventarioSocketService,
  ) { }

  async createProducto(createProductoDto: CreateProductoDto) {
    const producto = await this.productoService.createProducto(createProductoDto);
    //TODO: notificar por sockets
    return producto;
  }

  async createBodega(createBodegaDto: CreateBodegaDto) {
    const bodega = await this.bodegasService.createBodega(createBodegaDto);
    //TODO: notificar por sockets
    return bodega;
  }
  async createUbicacion(createUbicacionDto: CreateUbicacionDto) {
    const ubicacion = await this.ubicacionesService.createUbicacion(createUbicacionDto);
    //TODO: notificar por sockets
    return ubicacion;
  }

  //!Proceso que requiere mucha carga, será lento.
  async createTanda(createTandaDto: CreateTandaDto, user: User) {
    try {
      const { idBodega, idProducto, idUbicacion } = createTandaDto;
      const bodega = this.bodegasService.generateClass(idBodega);
      const producto = this.productoService.generateClass(idProducto);
      const ubicacion = this.ubicacionesService.generateClass(idUbicacion);

      const { cantidadIngresada, fechaVencimiento } = createTandaDto;

      const tanda = await this.tandasService.createTanda({
        cantidadIngresada,
        cantidadActual: cantidadIngresada,
        fechaVencimiento,
        bodega,
        producto,
        ubicacion,
      });

      //*Se notifica a los clientes una tanda de productos nueva
      await this.inventarioSocketService.notifyTandaCreated(tanda);
      //*Se registra esta tanda como un movimiento tipo ingreso
      await this.movimientosService.createMovimientoAsIngreso({
        cantidadRetirada: tanda.cantidadIngresada,
        idTanda: tanda.id,
      }, user)
      return tanda;

    } catch (error) {
      console.log({ error })
      throw new BadRequestException(error.message);
    }
  }

  async findAllBodegas() {
    const bodegas = await this.bodegasService.findAll();
    return bodegas;
  }

  async findUbicacionesByBodega(idBodega: string) {
    const ubicaciones = await this.ubicacionesService.findAllByBodega(idBodega);
    return ubicaciones;
  }

  async findAllTandasByProducto(idProducto: string) {
    const tandas = await this.tandasService.findAllBy(idProducto);
    return tandas;
  }

  async findManyProductos() {
    const productos = await this.productoService.findMany();

    return productos;
  }

  async findOneProducto(idProducto: string) {
    try {
      const producto = await this.productoService.findOneById(idProducto);
      const tandas = await this.tandasService.findAll();
      const stock = tandas.reduce((accum, tanda) => {
        if (tanda.producto.id === producto.id) {
          return accum + tanda.cantidadActual;
        }
        return accum;
      }, 0);

      delete producto.isDeleted;

      return {
        ...producto,
        stock,
      }

    } catch (error) {
      throw error;
    }
  }

  async findAllProductos() {
    try {
      // Productos sin su cantidad total de stock
      const productosData = await this.productoService.findAll();
      const tandas = await this.tandasService.findAll();

      //Mapear cada producto para calcular su stock total
      const productos = productosData.map(p => {
        const stock = tandas.reduce((accum, tanda) => {
          if (tanda.producto.id === p.id) {
            return accum + tanda.cantidadActual;
          }
          return accum;
        }, 0);

        delete p.isDeleted;

        // Retornar el producto con su stock total
        return {
          ...p,
          stock
        };
      });

      return productos;
    } catch (error) {
      throw error;
    }
  }




}
