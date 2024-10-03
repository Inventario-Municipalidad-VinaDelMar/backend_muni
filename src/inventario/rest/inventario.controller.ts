import { Controller, Post, Body } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateBodegaDto, CreateProductoDto, CreateTandaDto, CreateUbicacionDto } from '../dto/rest-dto';



@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) { }

  @Post('productos')
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.inventarioService.createProducto(createProductoDto);
  }
  // @Post('categorias')
  // createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
  //   return this.inventarioService.createCategoria(createCategoriaDto);
  // }
  @Post('ubicaciones')
  createUbicacion(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.inventarioService.createUbicacion(createUbicacionDto);
  }
  @Post('bodegas')
  createBodega(@Body() createBodegaDto: CreateBodegaDto) {
    return this.inventarioService.createBodega(createBodegaDto);
  }
  @Post('tandas')
  createTanda(@Body() createTandaDto: CreateTandaDto) {
    return this.inventarioService.createTanda(createTandaDto);
  }

  // @Get()
  // findAll() {
  //   return this.inventarioService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inventarioService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRestDto: UpdateRestDto) {
  //   return this.inventarioService.update(+id, updateRestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.inventarioService.remove(+id);
  // }
}
