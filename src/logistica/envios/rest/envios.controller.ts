import { Body, Controller, Get, Post, } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { GetEnviosDto } from '../dto/get-envios.dto';

// @Auth()
@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) { }

  // @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  // @Post('newEnvio')
  // createNewEnvio(@GetUser() user: User) {
  //   // console.log({ user });
  //   return this.enviosService.create();
  // }
  // @Auth()
  @Post('completeNewEnvio')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  completeNewEnvio() {
    return this.enviosService.completeNewEnvio();
  }
  @Get('')
  // @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  getEnvios(@Body() getEnviosDto: GetEnviosDto) {
    const { fecha } = getEnviosDto;
    return this.enviosService.getEnviosByFecha(fecha);
  }

}
