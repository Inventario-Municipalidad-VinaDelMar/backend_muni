import { Controller, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ValidationPipe, UsePipes, Get, } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregaDto } from '../dto/rest/create-entregas.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateEntregaDto } from '../dto/rest/update-entrega.dto';

@Controller('entregas')
// @Auth()
export class EntregasController {
  constructor(private readonly entregasService: EntregasService,

  ) { }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.bodeguero)
  createNewEntrega(@Body() createEntregaDto: CreateEntregaDto, @GetUser() user: User) {
    return this.entregasService.createNewEntrega(createEntregaDto, user);
  }
  @Get('comedores')
  findlAllComedores() {
    return this.entregasService.findAllComedores();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      //2MB
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
      //Archivos word = doc,docx no permitidos
      new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' })
    ],
  })) file: Express.Multer.File, @Body() updateEntregaDto: UpdateEntregaDto,) {
    return await this.entregasService.updateEntregaFile(file, updateEntregaDto);

  }
}
