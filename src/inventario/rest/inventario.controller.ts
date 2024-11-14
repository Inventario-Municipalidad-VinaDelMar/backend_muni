import { Controller, Post, Body, Get, Patch, Delete, Param, ParseUUIDPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateBodegaDto, CreateProductoDto, CreateTandaDto, CreateUbicacionDto, UpdateBodegaDto, UpdateTandaDto, UpdateUbicacionDto } from '../dto/rest-dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { GetInfoCharts } from '../dto/socket-dto/inventario/get-info-charts.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseProductoDto } from '../dto/rest-dto/producto-dto/create-producto.dto';



@Controller('inventario')
// @Auth()
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) { }

  //?Crud producto
  @Post('productos')
  @UseInterceptors(FileInterceptor('productImage'))
  createProducto(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), //10MB
      new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
    ],
  })) productImage: Express.Multer.File, @Body() baseProductoDto: BaseProductoDto) {
    return this.inventarioService.createProducto(productImage, baseProductoDto);
  }
  @Delete('productos/:id/delete')
  deleteProducto(@Param('id', ParseUUIDPipe) idProducto: string) {
    return this.inventarioService.deleteProducto(idProducto);
  }

  @Patch('productos/:id/update')
  @UseInterceptors(FileInterceptor('newProductImage'))
  updateProducto(
    @Param('id', ParseUUIDPipe) idProducto: string,
    @Body() baseProductoDto: BaseProductoDto,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), //10MB
        new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
      ],
      fileIsRequired: false,
    })) newProductImage?: Express.Multer.File | undefined | null,


  ) {
    return this.inventarioService.updateProducto(idProducto, baseProductoDto, newProductImage);
  }

  //?Crud ubicacion
  @Post('ubicaciones')
  createUbicacion(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.inventarioService.createUbicacion(createUbicacionDto);
  }
  @Patch('ubicaciones/:id/update')
  updateUbicacion(@Param('id', ParseUUIDPipe) idUbicacion: string, @Body() updateUbicacionDto: UpdateUbicacionDto) {
    return this.inventarioService.updateUbicacion(idUbicacion, updateUbicacionDto);
  }
  @Delete('ubicaciones/:id/delete')
  deleteUbicacion(@Param('id', ParseUUIDPipe) idUbicacion: string) {
    return this.inventarioService.deleteUbicacion(idUbicacion);
  }
  //?Crud bodegas
  @Post('bodegas')
  createBodega(@Body() createBodegaDto: CreateBodegaDto) {
    return this.inventarioService.createBodega(createBodegaDto);
  }
  @Patch('bodegas/:id/update')
  updateBodega(@Param('id', ParseUUIDPipe) idBodega: string, @Body() updateBodegaDto: UpdateBodegaDto) {
    return this.inventarioService.updateBodega(idBodega, updateBodegaDto);
  }
  @Delete('bodegas/:id/delete')
  deleteBodega(@Param('id', ParseUUIDPipe) idBodega: string) {
    return this.inventarioService.deleteBodega(idBodega);
  }
  //?Crud tandas
  @Post('tandas')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  createTanda(@Body() createTandaDto: CreateTandaDto, @GetUser() user: User) {
    return this.inventarioService.createTanda(createTandaDto, user);
  }
  @Patch('tandas/:id/update')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  updateTanda(@Param('id', ParseUUIDPipe) idTanda: string, @Body() updateTandaDto: UpdateTandaDto) {
    return this.inventarioService.updateTanda(idTanda, updateTandaDto);
  }

  //?Informacion para graficos
  @Get('infoCharts')
  getInfoCharts(@Query() getInfoCharts: GetInfoCharts,) {
    return this.inventarioService.getInfoCharts(getInfoCharts);
  }
}
