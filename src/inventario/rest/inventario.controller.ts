import { Controller, Post, Body } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateBodegaDto, CreateProductoDto, CreateTandaDto, CreateUbicacionDto } from '../dto/rest-dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';



@Controller('inventario')
@Auth()
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) { }

  @Post('productos')
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.inventarioService.createProducto(createProductoDto);
  }
  @Post('ubicaciones')
  createUbicacion(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.inventarioService.createUbicacion(createUbicacionDto);
  }
  @Post('bodegas')
  createBodega(@Body() createBodegaDto: CreateBodegaDto) {
    return this.inventarioService.createBodega(createBodegaDto);
  }
  @Post('tandas')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  createTanda(@Body() createTandaDto: CreateTandaDto, @GetUser() user: User) {
    return this.inventarioService.createTanda(createTandaDto, user);
  }

}
