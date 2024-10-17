import { Controller, Post, } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

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
  completeNewEnvio() {
    return this.enviosService.completeNewEnvio();
  }

}
