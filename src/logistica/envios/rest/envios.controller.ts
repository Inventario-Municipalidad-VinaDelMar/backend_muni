import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { GetEnviosDto } from '../dto/get-envios.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIncidenteDto } from '../dto/create-incidente.dto';
import { User } from 'src/auth/entities/user.entity';
import { IncidenteType } from '../entities/incidente-envio.entity';

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
    // @Body() createIncidenteDto: CreateIncidenteDto,
    @GetUser() user: User,
  ) {// Transformar productosAfectados a un array si viene como string
    if (typeof createIncidenteDto.productosAfectados === 'string') {
      try {
        createIncidenteDto.productosAfectados = JSON.parse(createIncidenteDto.productosAfectados);
      } catch (error) {
        throw new BadRequestException('El campo productosAfectados debe ser un array JSON válido.');
      }
    }

    // Ahora, puedes aplicar la validación con el DTO correcto
    const validatedData = new CreateIncidenteDto();
    Object.assign(validatedData, createIncidenteDto);
    const { type } = validatedData;

    // Validación condicional: si el tipo de incidente requiere evidencia y no se recibe, lanza un error.
    if ((type === IncidenteType.CHOQUE || type === IncidenteType.DANIO || type === IncidenteType.CONTAMINACION) && !evidenciaFotografica) {
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

    // return 'Exito';
    return this.enviosService.createNewIncidente(evidenciaFotografica, createIncidenteDto, user);
  }

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
