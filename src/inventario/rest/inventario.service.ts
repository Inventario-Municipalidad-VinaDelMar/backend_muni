import { BadRequestException, forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InventarioSocketService } from '../socket/inventario.socket.service';
import { CreateBodegaDto, CreateCategoriaDto, CreateProductoDto, CreateTandaDto, CreateUbicacionDto } from '../dto/rest-dto';
import { BodegasService, CategoriasService, ProductosService, TandasService, UbicacionesService } from './servicios-especificos';



@Injectable()
export class InventarioService {

  constructor(
    private readonly productoService: ProductosService,
    private readonly categoriaService: CategoriasService,
    private readonly bodegasService: BodegasService,
    private readonly ubicacionesService: UbicacionesService,
    private readonly tandasService: TandasService,


    @Inject(forwardRef(() => InventarioSocketService))
    private readonly inventarioSocketService: InventarioSocketService,
  ) { }

  async createProducto(createProductoDto: CreateProductoDto) {
    const producto = await this.productoService.createProducto(createProductoDto);
    //TODO: notificar por sockets
    return producto;
  }
  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    const categoria = await this.categoriaService.createCategoria(createCategoriaDto);
    //TODO: notificar por sockets
    return categoria;
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
  async createTanda(createTandaDto: CreateTandaDto) {
    try {
      const { idBodega, idCategoria, idProducto, idUbicacion } = createTandaDto;
      const bodega = await this.bodegasService.generateClass(idBodega);
      const categoria = await this.categoriaService.generateClass(idCategoria);
      const producto = await this.productoService.generateClass(idProducto);
      const ubicacion = await this.ubicacionesService.generateClass(idUbicacion);

      const { cantidadIngresada, fechaVencimiento } = createTandaDto;

      const tanda = await this.tandasService.createTanda({
        cantidadIngresada,
        cantidadActual: cantidadIngresada,
        fechaVencimiento,
        bodega,
        categoria,
        producto,
        ubicacion,
      });

      //*Se notifica a los clientes por socket
      await this.inventarioSocketService.notifyTandaCreated(tanda);
      return tanda;
    } catch (error) {
      console.log({ error })
      throw new BadRequestException(error.message);
    }
  }

  async findAllTandasByCategoria(idCategoria: string) {
    const tandas = await this.tandasService.findAllBy(idCategoria);
    return tandas;
  }

  async findManyProductosByName(nameSuggested: string) {
    const productos = await this.productoService.findManyByName(nameSuggested);

    return productos;
  }

  async findAllCategorias() {
    try {
      // Categorias sin su cantidad total de stock
      const categoriasData = await this.categoriaService.findAll();
      // const tandas = await this.tandasService.findAll();
      // console.log({ tandas })

      //Mapear cada categoría para calcular su stock total
      const categorias = categoriasData.map(c => {
        // const stock = tandas.reduce((accum, tanda) => {
        //   if (tanda.categoria.id === c.id) {
        //     return accum + tanda.cantidadActual;
        //   }
        //   return accum;
        // }, 0);

        delete c.isDeleted;

        // Retornar la categoría con su stock total
        // return {
        //   ...c,
        //   stock
        // };
        return c;
      });

      return categorias;
    } catch (error) {
      console.log({ error })
    }
  }




}
