import { BadRequestException, forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InventarioSocketService } from '../socket/inventario.socket.service';
import { CreateBodegaDto, CreateTandaDto, CreateUbicacionDto, UpdateBodegaDto, UpdateTandaDto, UpdateUbicacionDto } from '../dto/rest-dto';
import { BodegasService, ProductosService, TandasService, UbicacionesService } from './servicios-especificos';
import { MovimientosService } from 'src/movimientos/rest/movimientos.service';
import { User } from 'src/auth/entities/user.entity';
import { GetInfoCharts } from '../dto/socket-dto/inventario/get-info-charts.dto';
import { EntregasService } from '../../logistica/entregas/rest/entregas.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BaseProductoDto } from '../dto/rest-dto/producto-dto/create-producto.dto';



@Injectable()
export class InventarioService {

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly entregasService: EntregasService,
    private readonly productoService: ProductosService,
    // private readonly categoriaService: CategoriasService,
    private readonly bodegasService: BodegasService,
    private readonly ubicacionesService: UbicacionesService,
    private readonly tandasService: TandasService,
    private readonly movimientosService: MovimientosService,


    @Inject(forwardRef(() => InventarioSocketService))
    private readonly inventarioSocketService: InventarioSocketService,
  ) { }
  //?CRUD DE PRODUCTOS

  async deleteProducto(idProducto: string) {
    try {
      const producto = await this.productoService.deleteProducto(idProducto);
      await this.inventarioSocketService.notifyProductoUpdate()
      return producto;
    } catch (error) {
      throw error;
    }
  }
  async createProducto(productImage: Express.Multer.File, baseProductoDto: BaseProductoDto) {
    let imageUrl: string | undefined;

    try {
      // Sube la imagen y obtiene la URL segura
      imageUrl = await this.cloudinaryService.uploadFile(productImage, 'productos').then(data => data.secure_url);

      // Crea el producto con la URL de imagen obtenida
      const producto = await this.productoService.createProducto({
        urlImagen: imageUrl,
        ...baseProductoDto,
      });
      await this.inventarioSocketService.notifyProductoUpdate()
      return producto;

    } catch (error) {
      // Si hubo un error después de subir la imagen, la elimina
      if (imageUrl) {
        const imageId = imageUrl.split('/').pop()?.split('.')[0];
        await this.cloudinaryService.deleteFile(imageId, 'productos');
      }
      throw error;
    }
  }
  async updateProducto(idProducto: string, baseProductoDto: BaseProductoDto, newProductImage?: Express.Multer.File,) {
    // Subir la imagen solo si `newProductImage` está presente
    let imageUrl: string | undefined;
    try {
      imageUrl = newProductImage
        ? await this.cloudinaryService.uploadFile(newProductImage, 'productos').then((data) => data.secure_url)
        : undefined;
      const updateData = {
        ...baseProductoDto,
        ...(imageUrl && { urlImagen: imageUrl }), // Solo añade `urlImagen` si `imageUrl` está definido
      };
      const previousImageUrl = (await this.productoService.findOneById(idProducto)).urlImagen;
      if (previousImageUrl && newProductImage) {
        const imageId = previousImageUrl.split('/').pop()?.split('.')[0];
        if (imageId) {
          await this.cloudinaryService.deleteFile(imageId, 'productos');
        }
      }
      const producto = await this.productoService.updateProducto(idProducto, updateData);
      await this.inventarioSocketService.notifyProductoUpdate()
      return producto;

    } catch (error) {
      if (imageUrl) {
        const imageId = imageUrl.split('/').pop()?.split('.')[0];
        await this.cloudinaryService.deleteFile(imageId, 'productos');
      }
      throw error;
    }
  }
  //?CRUD DE BODEGAS
  async createBodega(createBodegaDto: CreateBodegaDto) {
    const bodega = await this.bodegasService.createBodega(createBodegaDto);
    //*Notificar por socket que hay una nueva bodega en la lista
    await this.inventarioSocketService.notifyBodegasUpdate()
    return bodega;
  }
  async updateBodega(idBodega: string, updateBodegaDto: UpdateBodegaDto) {
    const bodega = await this.bodegasService.updateBodega(idBodega, updateBodegaDto);
    //*Notificar por socket que hay una actualizacion de una bodega de la lista
    await this.inventarioSocketService.notifyBodegasUpdate()
    return bodega;
  }
  async deleteBodega(idBodega: string) {
    const bodega = await this.bodegasService.deleteBodega(idBodega);
    //*Notificar por socket que se elimino una bodega de la lista
    await this.inventarioSocketService.notifyBodegasUpdate()
    return bodega;
  }

  //?CRUD DE UBICACIONES
  async createUbicacion(createUbicacionDto: CreateUbicacionDto) {
    const { idBodega } = createUbicacionDto;
    const ubicacion = await this.ubicacionesService.createUbicacion(createUbicacionDto);
    await this.inventarioSocketService.notifyUbicacionUpdate(idBodega)
    return ubicacion;
  }
  async updateUbicacion(idUbicacion: string, updateUbicacionDto: UpdateUbicacionDto) {
    const ubicacion = await this.ubicacionesService.updateUbicacion(idUbicacion, updateUbicacionDto);
    await this.inventarioSocketService.notifyUbicacionUpdate(ubicacion.bodega.id)
    return ubicacion;
  }
  async deleteUbicacion(idUbicacion: string) {
    const ubicacion = await this.ubicacionesService.deleteUbicacion(idUbicacion);
    await this.inventarioSocketService.notifyUbicacionUpdate(ubicacion.bodega.id)
    return ubicacion;
  }

  //?CRUD DE TANDAS
  async updateTanda(idTanda: string, updateTandaDto: UpdateTandaDto) {
    try {
      const tanda = await this.tandasService.updateTanda(idTanda, updateTandaDto);
      //*Se notifica a los clientes una tanda actualizada
      await this.inventarioSocketService.notifyTandaCreated({
        id: tanda.id,
        cantidadActual: tanda.cantidadActual,
        cantidadIngresada: tanda.cantidadActual,
        bodega: tanda.bodega.nombre,
        ubicacion: tanda.ubicacion.descripcion,
        fechaLlegada: tanda.fechaLlegada,
        fechaVencimiento: tanda.fechaVencimiento,
        producto: tanda.producto.nombre,
        productoId: tanda.producto.id,
      });
      return tanda;
    } catch (error) {
      throw error;
    }
    // await this.inventarioSocketService.notifyUbicacionUpdate(ubicacion.bodega.id)
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

  async getInfoCharts(getInfoCharts: GetInfoCharts) {
    try {
      const { fechaInicio, fechaFin } = getInfoCharts;
      const entregas = await this.entregasService.provideInfoToCharts(fechaInicio, fechaFin);
      const tandas = await this.tandasService.findAllByFechas(fechaInicio, fechaFin);
      const mermas = await this.movimientosService.providerInfoToCharts(fechaInicio, fechaFin);
      return {
        entregas,
        tandas,
        mermas,
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
