import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Envio, EnvioStatus } from './entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { normalizeDates } from 'src/utils';
import { CategoriasService } from 'src/inventario/rest/servicios-especificos';
import { EnvioCategoria } from './entities/envio-categoria.entity';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';
import { PlanificacionService } from 'src/planificacion/rest/planificacion.service';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Injectable()
export class EnviosService {
  constructor(
    private readonly categoriaService: CategoriasService,
    private readonly planificacionSocketService: PlanificacionSocketService,
    @Inject(forwardRef(() => PlanificacionService))
    private readonly planificacionService: PlanificacionService,
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,

    @InjectRepository(EnvioCategoria)
    private readonly envioCategoriaRepository: Repository<EnvioCategoria>,
  ) { }
  async create() {
    try {
      const fechaActual = normalizeDates.currentFecha();
      const envios = await this.envioRepository.find({
        where: {
          fecha: normalizeDates.normalize(fechaActual),
          isDeleted: false,
        },
      })

      envios.map(e => {
        if ([EnvioStatus.SIN_CARGAR, EnvioStatus.CARGANDO].includes(e.status)) {
          throw new BadRequestException('Ya hay un envio en proceso')
        }
      })

      const envioCreated = this.envioRepository.create({
        fecha: fechaActual,
      })

      //TODO: Transformar este proceso a una transaction
      const envio = await this.envioRepository.save(envioCreated);
      const { detalles } = await this.planificacionService.findPlanificacionByFecha(fechaActual)

      const detallesData = detalles.map(d => {
        return this.envioCategoriaRepository.create({
          cantidadPlanificada: d.cantidadPlanificada,
          categoria: this.categoriaService.generateClass(d.categoria.id),
          envio,
        })
      })
      await this.envioCategoriaRepository.save(detallesData);
      //*Notificar por sockets a planificacion que un envio se inicio
      await this.planificacionSocketService.notifyEnvioUpdate();

      return envio;
    } catch (error) {
      throw error;
    }
  }

  async verifyEnvioByEnvioCategoria(idEnvioCategoria: string): Promise<void> {
    try {
      const envioCategoria = await this.envioCategoriaRepository.findOne({
        where: {
          isDeleted: false,
          id: idEnvioCategoria,
        },
        relations: ['envio']
      })

      if (!envioCategoria) {
        throw new NotFoundException(`No hay envio categoria with id ${idEnvioCategoria}`);
      }
      const fechaActual = normalizeDates.normalize(normalizeDates.currentFecha());
      if (envioCategoria.envio.fecha !== fechaActual) {
        throw new BadRequestException('Este envio no es uno actual')
      }
    } catch (error) {
      throw error;
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

      //?Hay certeza de que no hay envios simultaneos en creacion(de momento)
      let envioEnProceso = null;

      envios.map(envio => {
        if ([EnvioStatus.EN_ENVIO, EnvioStatus.FINALIZADO].includes(envio.status)) {
          return;
        }
        envioEnProceso = envio;
        //Todo: Hacer un type para el envio en proceso
        envioEnProceso.categoriasPlanificadas = envio.categoriasPlanificadas.map(ec => {
          delete ec.isDeleted;
          const newDetalle = {
            ...ec,
            isComplete: ec.movimiento != null,
            categoria: ec.categoria.nombre,
            categoriaId: ec.categoria.id,
            urlImagen: ec.categoria.urlImagen,
          };
          delete newDetalle?.movimiento;
          return newDetalle;
        });
      });

      return envioEnProceso;
    } catch (error) {
      return null;
    }
  }

  instanceEnvioCategoria(idEnvioCategoria: string) {
    return this.envioCategoriaRepository.create({
      id: idEnvioCategoria,
    })
  }
  async findOneEnvioCategoria(id: string) {
    try {
      const envioCategoria = await this.envioCategoriaRepository.findOne({ where: { id, isDeleted: false, } })
      if (!envioCategoria) {
        throw new NotFoundException(`Envio categoria with id ${id} not exists.`)
      }
      return envioCategoria;
    } catch (error) {
      console.log({ error })
    }
  }

  async updateEnvioCategoria(queryRunner: QueryRunner, movimiento: Movimiento) {
    try {
      const envioCategoria = await this.findOneEnvioCategoria(movimiento.envioCategoria.id);
      delete movimiento.envioCategoria;
      envioCategoria.movimiento = movimiento;
      await queryRunner.manager.save(envioCategoria);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteAll() {
    const query1 = this.envioCategoriaRepository.createQueryBuilder('enviosCategorias');
    const query2 = this.envioRepository.createQueryBuilder('envios');
    try {
      await query1.delete().where({}).execute();
      await query2.delete().where({}).execute();
      return;
    } catch (error) {
      throw error;
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
