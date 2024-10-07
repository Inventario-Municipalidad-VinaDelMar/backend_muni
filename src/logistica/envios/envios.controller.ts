import { Controller, Post, } from '@nestjs/common';
import { EnviosService } from './envios.service';

@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) { }

  @Post('newEnvio')
  createNewEnvio() {
    return this.enviosService.create();
  }
  @Post('completeNewEnvio')
  completeNewEnvio() {
    return this.enviosService.completeNewEnvio();
  }
  // @Post(':id/load',)
  // updateProductLoaded(@Param('id', ParseUUIDPipe) id: string) {
  //   return id;
  // }

  // @Get()
  // findAll() {
  //   return this.enviosService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.enviosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEnvioDto: UpdateEnvioDto) {
  //   return this.enviosService.update(+id, updateEnvioDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.enviosService.remove(+id);
  // }
}
