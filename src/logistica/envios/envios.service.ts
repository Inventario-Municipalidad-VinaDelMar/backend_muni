import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { Envio, EnvioStatus } from './entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeDates } from 'src/utils';
import { CategoriasService } from 'src/inventario/rest/servicios-especificos';
import { EnvioCategoria } from './entities/envio-categoria.entity';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';

@Injectable()
export class EnviosService {
  constructor(
    private readonly categoriaService: CategoriasService,
    private readonly planificacionSocketService: PlanificacionSocketService,
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,

    @InjectRepository(EnvioCategoria)
    private readonly envioCategoriaRepository: Repository<EnvioCategoria>,
  ) { }
  async create(createEnvioDto: CreateEnvioDto) {
    try {
      const { fecha, detalles } = createEnvioDto;
      const envioCreated = this.envioRepository.create({
        fecha,
      })

      const envio = await this.envioRepository.save(envioCreated);
      const detallesData = detalles.map(d => {
        return this.envioCategoriaRepository.create({
          cantidadPlanificada: d.cantidadPlanificada,
          categoria: this.categoriaService.generateClass(d.categoria),
          envio,
        })
      })
      await this.envioCategoriaRepository.save(detallesData);
      //*Notificar por sockets a planificacion
      await this.planificacionSocketService.notifyStartedNewEnvio(fecha);

      return envio;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllEnvioCategoriasByFecha(fecha: string) {
    try {
      const envios = await this.envioRepository.find({
        where: {
          isDeleted: false,
          fecha: normalizeDates.normalize(fecha),
        }
      })
      //No hay envios creados en la fecha designada
      if (envios.length == 0) {
        throw new NotFoundException();
      }
      let enviosCategorias = [];

      envios.map(envio => {
        if ([EnvioStatus.EN_ENVIO, EnvioStatus.FINALIZADO].includes(envio.status)) {
          return;
        }
        enviosCategorias = envio.categoriasPlanificadas.map(ec => {
          delete ec.isDeleted;
          const newDetalle = {
            ...ec,
            categoria: ec.categoria.nombre,
            categoriaId: ec.categoria.id,
            urlImagen: ec.categoria.urlImagen,
          };
          return newDetalle;
        });
      });
      return enviosCategorias;
    } catch (error) {
      return [];
    }
  }

  // findAll() {
  //   return `This action returns all envios`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} envio`;
  // }

  // update(id: number, updateEnvioDto: UpdateEnvioDto) {
  //   return `This action updates a #${id} envio`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} envio`;
  // }
}
