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

  async completeNewEnvio() {
    try {
      const fechaActual = normalizeDates.currentFecha();
      const envios = await this.envioRepository.find({
        where: {
          fecha: normalizeDates.normalize(fechaActual),
          isDeleted: false,
        },
      })

      let envioEnCurso: Envio;
      envios.map(e => {
        if (e.status === EnvioStatus.CARGANDO) {
          envioEnCurso = e;
        }
      })

      if (!envioEnCurso) {
        throw new BadRequestException('No hay ningun envio en curso');
      }

      let completeAllProducto = true;

      envioEnCurso.productosPlanificados.map(p => {
        if (p.movimiento !== null) return;
        completeAllProducto = false;
      })

      if (!completeAllProducto) {
        throw new BadRequestException('Aun no se han cargado todos los productos planificados');
      }

      envioEnCurso.status = EnvioStatus.EN_ENVIO;
      delete envioEnCurso.productosPlanificados;
      const envioUpdated = await this.envioRepository.save(envioEnCurso);

      //*Notificar por sockets a planificacion que un envio termino de cargar en bodega
      await this.planificacionSocketService.notifyEnvioUpdate();

      return envioUpdated;

    } catch (error) {
      throw error;
    }
  }

  async autorizeNewEnvioToClient() { }

  async verifyEnvioByEnvioProducto(idEnvioProducto: string) {
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
        throw new BadRequestException('Ya se ha realizo un movimiento para este producto.')
      }
      const fechaActual = normalizeDates.normalize(normalizeDates.currentFecha()) // La fecha actual como Date
      const fechaEnvioString = envioProducto.envio.fecha as unknown as string;  // Aseguramos que es un string
      const fechaEnvio = normalizeDates.normalize(fechaEnvioString);


      // console.log({ fechaEnvio })
      // console.log({ fechaActual })
      // console.log({ fechaEnvioString })

      if (fechaEnvio < fechaActual || fechaEnvio > fechaActual) {
        throw new BadRequestException('Este envio no es de hoy')
      }
      return {
        fechaEnvio: fechaEnvioString,
        idEnvio: envioProducto.envio.id,
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
      const envioProducto = await this.envioProductoRepository.findOne(
        {
          where: {
            id,
            isDeleted: false,
          },
          relations: ['envio'],
        }
      )
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

      //Actualizar el estado del envio
      const envio = envioProducto.envio;
      if (envio.status !== EnvioStatus.SIN_CARGAR) return;

      envio.status = EnvioStatus.CARGANDO;
      delete envio.productosPlanificados
      await queryRunner.manager.save(envio);
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

}
