import { Controller, Post, Body, } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregaDto } from '../dto/rest/create-entregas.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('entregas')
@Auth()
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) { }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  createNewEntrega(@Body() createEntregaDto: CreateEntregaDto, @GetUser() user: User) {
    return this.entregasService.createNewEntrega(createEntregaDto, user);
  }
}
