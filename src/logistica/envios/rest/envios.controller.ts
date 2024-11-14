import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { GetEnviosDto } from '../dto/get-envios.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIncidenteDto } from '../dto/create-incidente.dto';
import { User } from 'src/auth/entities/user.entity';
import { IncidenteType } from '../entities/incidente-envio.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DevolucionEnvioDto } from '../dto/devolucion-envio.dto';

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

  @Post('newIncidente')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  @UseInterceptors(FileInterceptor('evidenciaFotografica'))
  async createNewIncidente(
    @UploadedFile() evidenciaFotografica: Express.Multer.File | null,
    @Body() createIncidenteDto: any,
    @GetUser() user: User,
  ) {
    // Convierte `createIncidenteDto` en una instancia de `CreateIncidenteDto`
    const validatedData = plainToInstance(CreateIncidenteDto, createIncidenteDto);

    // Ejecuta la validación de manera explícita
    const errors = await validate(validatedData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Validación condicional: si el tipo de incidente requiere evidencia y no se recibe, lanza un error.
    if ((validatedData.type === IncidenteType.CHOQUE || validatedData.type === IncidenteType.DANIO || validatedData.type === IncidenteType.CONTAMINACION) && !evidenciaFotografica) {
      throw new BadRequestException('Se requiere evidencia fotográfica para incidentes de tipo Choque, Daño o Contaminación.');
    }

    // Validación del archivo solo si está presente.
    if (evidenciaFotografica) {
      const maxSizeValidator = new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }); // 10MB
      const fileTypeValidator = new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' });

      try {
        maxSizeValidator.isValid(evidenciaFotografica);
        fileTypeValidator.isValid(evidenciaFotografica);
      } catch (error) {
        throw new BadRequestException('El archivo debe ser una imagen (png, jpg, jpeg) y no superar los 10MB.');
      }
    }

    // Llama al servicio con los datos validados
    return this.enviosService.createNewIncidente(evidenciaFotografica, validatedData, user);
  }

  @Post('completeNewEnvio')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  completeNewEnvio() {
    return this.enviosService.completeNewEnvio();
  }
  @Post(':id/devolucion')
  @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  devolucionProductos(@Param('id', ParseUUIDPipe) idEnvio: string, @Body() devolucionEnvioDto: DevolucionEnvioDto, @GetUser() user: User) {
    return this.enviosService.processDevolucionEnvio(idEnvio, devolucionEnvioDto, user);
  }

  @Post(':id/select')
  selectEnvioByNeorute(@Param('id', ParseUUIDPipe) idEnvio: string) {
    return this.enviosService.selectEnvioByNeorute(idEnvio);
  }
  @Post(':id/finish')
  finishEnvioByNeorute(@Param('id', ParseUUIDPipe) idEnvio: string) {
    return this.enviosService.finishEnvioByNeorute(idEnvio);
  }

  @Post('')
  // @Auth(ValidRoles.admin, ValidRoles.bodeguero, ValidRoles.cargador)
  getEnvios(@Body() getEnviosDto: GetEnviosDto) {
    const { fecha } = getEnviosDto;
    return this.enviosService.getEnviosToNeorute(fecha);
    // return this.enviosService.getEnviosByFecha(fecha);
  }

}
