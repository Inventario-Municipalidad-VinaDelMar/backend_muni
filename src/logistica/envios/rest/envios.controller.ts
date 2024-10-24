import { Controller, Post, } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Auth()
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

}
