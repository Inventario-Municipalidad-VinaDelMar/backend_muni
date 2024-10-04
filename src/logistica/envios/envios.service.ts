import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Envio, EnvioStatus } from './entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { normalizeDates } from 'src/utils';
// import { CategoriasService } from 'src/inventario/rest/servicios-especificos';
import { EnvioProducto } from './entities/envio-producto.entity';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';
import { PlanificacionService } from 'src/planificacion/rest/planificacion.service';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { ProductosService } from 'src/inventario/rest/servicios-especificos';

@Injectable()
export class EnviosService {
  constructor(
    private readonly productosService: ProductosService,
    private readonly planificacionSocketService: PlanificacionSocketService,
    @Inject(forwardRef(() => PlanificacionService))
    private readonly planificacionService: PlanificacionService,
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,

    @InjectRepository(EnvioProducto)
    private readonly envioProductoRepository: Repository<EnvioProducto>,
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
        return this.envioProductoRepository.create({
          cantidadPlanificada: d.cantidadPlanificada,
          producto: this.productosService.generateClass(d.producto.id),
          envio,
        })
      })
      await this.envioProductoRepository.save(detallesData);
      //*Notificar por sockets a planificacion que un envio se inicio
      await this.planificacionSocketService.notifyEnvioUpdate();

      return envio;
    } catch (error) {
      throw error;
    }
  }


  async verifyEnvioByEnvioProducto(idEnvioProducto: string): Promise<void> {
    try {
      const envioProducto = await this.envioProductoRepository.findOne({
        where: {
          isDeleted: false,
          id: idEnvioProducto,
        },
        relations: ['envio']
      })

      if (!envioProducto) {
        throw new NotFoundException(`No hay envio producto with id ${idEnvioProducto}`);
      }
      if (envioProducto.movimiento) {
        throw new BadRequestException('Ya se ha realizo un movimiento en esta categoria.')
      }
      const fechaActual = normalizeDates.normalize(normalizeDates.currentFecha());
      const fechaEnvio = envioProducto.envio.fecha;
      // console.log({ fechaActual })
      // console.log(fechaEnvio);
      // console.log(fechaEnvio !== fechaActual)
      if (fechaEnvio < fechaActual || fechaEnvio > fechaActual) {
        throw new BadRequestException('Este envio no es de hoy')
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
        envioEnProceso.productosPlanificados = envio.productosPlanificados.map(ec => {
          delete ec.isDeleted;
          const newDetalle = {
            ...ec,
            isComplete: ec.movimiento != null,
            producto: ec.producto.nombre,
            productoId: ec.producto.id,
            urlImagen: ec.producto.urlImagen,
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

  instanceEnvioProducto(idEnvioProducto: string) {
    return this.envioProductoRepository.create({
      id: idEnvioProducto,
    })
  }
  async findOneEnvioProducto(id: string) {
    try {
      const envioProducto = await this.envioProductoRepository.findOne({ where: { id, isDeleted: false, } })
      if (!envioProducto) {
        throw new NotFoundException(`Envio producto with id ${id} not exists.`)
      }
      return envioProducto;
    } catch (error) {
      console.log({ error })
    }
  }

  async updateEnvioProducto(queryRunner: QueryRunner, movimiento: Movimiento) {
    try {
      const envioProducto = await this.findOneEnvioProducto(movimiento.envioProducto.id);
      delete movimiento.envioProducto;
      envioProducto.movimiento = movimiento;
      await queryRunner.manager.save(envioProducto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteAll() {
    const query1 = this.envioProductoRepository.createQueryBuilder('enviosProductos');
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
