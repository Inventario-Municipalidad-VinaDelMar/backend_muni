import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PlanificacionSocketService } from '../socket/planificacion.socket.service';
import { Between, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from '../entities/planificacion.entity';
import { normalizeDates } from 'src/utils';
import { AutorizeSolicitudEnvioDto, CreatePlanificacionDto, GetPlanificacionDto, SetPlanificacionSemanalDto } from '../dto/rest';
import { PlanificacionDetalle } from '../entities/planificacion-detalle.entity';
import { ProductosService } from 'src/inventario/rest/servicios-especificos';
import { EnviosService } from 'src/logistica/envios/envios.service';
import { isMonday, isFriday, differenceInCalendarDays } from 'date-fns';
import { IPlanificacionSemanal } from '../interface/planificacion-semanal.interface';
import { SolicitudEnvio, SolicitudEnvioStatus } from '../entities/solicitud-envio.entity';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class PlanificacionService {
  protected readonly logger = new Logger('PlanificacionService');;
  constructor(
    private readonly productosService: ProductosService,
    @Inject(forwardRef(() => EnviosService))
    private readonly enviosService: EnviosService,
    @InjectRepository(Planificacion)
    private readonly planificacionRepository: Repository<Planificacion>,
    @InjectRepository(PlanificacionDetalle)
    private readonly planificacionDetalleRepository: Repository<PlanificacionDetalle>,
    @InjectRepository(SolicitudEnvio)
    private readonly solicitudEnvioRepository: Repository<SolicitudEnvio>,



    @Inject(forwardRef(() => PlanificacionSocketService))
    private readonly planificacionSocketService: PlanificacionSocketService,

    private readonly dataSource: DataSource,
  ) { }
  async autorizeSolicitudEnvio(autorizeSolicitudEnvioDto: AutorizeSolicitudEnvioDto, user: User) {
    try {
      const { idSolicitud, aceptada } = autorizeSolicitudEnvioDto;
      const solicitud = await this.solicitudEnvioRepository.findOneBy({ id: idSolicitud });
      if (!solicitud) {
        throw new BadRequestException(`La solicitud ${idSolicitud} no existe.`)
      }
      if (solicitud.horaResolucion) {
        throw new BadRequestException(`La solicitud ya se resolvio.`)

      }

      solicitud.status = aceptada ? SolicitudEnvioStatus.ACEPTADA : SolicitudEnvioStatus.RECHAZADA;
      solicitud.administrador = user;

      if (aceptada) {
        //*Notificar por socket envio autorizado en planificacion actual
        const envio = await this.enviosService.create();
        solicitud.envioAsociado = envio;
        await this.planificacionSocketService.notifyEnvioUpdate();
      }

      const solicitudUpdated = await this.solicitudEnvioRepository.save(solicitud);
      delete solicitudUpdated.isDeleted;

      //*Notificar por socket solicitud actualizada
      await this.planificacionSocketService.notifySolicitudEnvio(solicitudUpdated)

      //*Notificar por socket cierre de solicitud en pagina web

      return solicitudUpdated;
    } catch (error) {
      throw error;
    }
  }
  async sendSolicitudEnvio(user: User) {
    try {
      const fechaActual = normalizeDates.currentFecha();
      const solicitudes = await this.solicitudEnvioRepository.find({
        where: {
          fechaSolicitud: normalizeDates.normalize(fechaActual),
          status: SolicitudEnvioStatus.PENDIENTE,
        }
      })
      if (solicitudes.length !== 0) {
        throw new BadRequestException('Hay una solicitud en curso.')
      }
      const solicitudData = this.solicitudEnvioRepository.create({
        solicitante: user,
      })
      const solicitud = await this.solicitudEnvioRepository.save(solicitudData);
      delete solicitud.isDeleted;
      solicitud.administrador = null;
      solicitud.envioAsociado = null;
      //*Notificar via socekt solicitud creada
      await this.planificacionSocketService.notifySolicitudEnvio(solicitud);
      return solicitud;
    } catch (error) {
      throw error;
    }

  }

  async getSolicitudEnCurso() {
    try {
      const fechaActual = normalizeDates.currentFecha();
      const solicitudes = await this.solicitudEnvioRepository.find({
        where: {
          isDeleted: false,
          fechaSolicitud: normalizeDates.normalize(fechaActual),
          status: SolicitudEnvioStatus.PENDIENTE,
        },
      });
      if (solicitudes.length > 1) {
        throw new InternalServerErrorException(`Hay ${solicitudes.length} solicitudes en simultaneo`);
      }
      if (solicitudes.length == 0) {
        return null;
      }
      return solicitudes[0];
    } catch (error) {
      throw error;
    }
  }

  //?Solo utilizado por el seed
  async create(createPlanificacionDto: CreatePlanificacionDto) {
    try {
      const { fecha, detalles } = createPlanificacionDto;

      //Crear la planificacion
      const planificacionCreated = this.planificacionRepository.create({
        fecha,
      });
      const planificacion = await this.planificacionRepository.save(planificacionCreated);

      //Crear el detalle de la planificacion
      const detallesCreated = detalles.map((d) => {
        const producto = this.productosService.generateClass(d.producto);
        return this.planificacionDetalleRepository.create({
          producto,
          planificacionDiaria: planificacion,
          cantidadPlanificada: d.cantidadPlanificada,
        })
      });

      await this.planificacionDetalleRepository.save(detallesCreated);
      return planificacion;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  //?Utilizado por el socket service
  async getPlanificacionBySemana(fechaInicio: Date, fechaFin: Date) {
    try {

      // Validar que la fecha de inicio sea un lunes y la fecha de fin sea un viernes
      if (!isMonday(fechaInicio) || !isFriday(fechaFin)) {
        throw new Error('La fecha de inicio debe ser un lunes y la fecha de fin un viernes.');
      }

      // Verificar que haya exactamente 5 días entre inicio y fin
      const diff = differenceInCalendarDays(fechaFin, fechaInicio) + 1;
      if (diff !== 5) {
        throw new Error('Debe haber exactamente 5 días entre las fechas de inicio y fin.');
      }

      const planificacionSemanalData = await this.planificacionRepository.find({
        where: {
          fecha: Between(fechaInicio, fechaFin),
        },
      });
      const planificacionSemanal = planificacionSemanalData.map(planificacion => {
        delete planificacion.isDeleted;
        planificacion.detalles = planificacion.detalles.map(d => {
          const productoInfo = d.producto;
          delete d.isDeleted;
          delete d.producto;
          return {
            id: d.id,
            producto: productoInfo.nombre,
            productoId: productoInfo.id,
            urlImagen: productoInfo.urlImagen,
            // productoImgUrl: productoInfo.urlImagen,
            ...d
          };
        });
        return {
          ...planificacion,
        };
      });
      return planificacionSemanal;
    } catch (error) {
      throw error;
    }
  }

  async updatePlanificacionSemanal(setPlanificacionSemanalDto: SetPlanificacionSemanalDto): Promise<IPlanificacionSemanal[]> {
    // Iniciar la transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.validarPlanificacionSemanal(setPlanificacionSemanalDto);

      const planificacionesActualizadas = [];  // Lista para acumular las planificaciones actualizadas

      for (const diaDto of setPlanificacionSemanalDto.dias) {
        const fechaDia = normalizeDates.normalize(diaDto.fecha);

        // Buscar o crear la planificación diaria
        let planificacion = await queryRunner.manager.findOne(Planificacion, { where: { fecha: fechaDia }, relations: ['detalles'] });

        if (!planificacion) {
          // Crear una nueva planificación diaria si no existe
          planificacion = this.planificacionRepository.create({ fecha: diaDto.fecha });
          planificacion.detalles = [];  // Inicializar detalles como un array vacío
        }

        // Limpiar los detalles anteriores (si existen) si ya no se envían productos para ese día
        // if (planificacion.detalles.length > 0 && diaDto.detalles.length === 0) {
        await queryRunner.manager.delete(PlanificacionDetalle, { planificacionDiaria: planificacion });
        // }

        // Crear los nuevos detalles
        const detallesPromises = diaDto.detalles.map(async (detalleDto) => {
          const producto = await this.productosService.findOneById(detalleDto.productoId);
          return this.planificacionDetalleRepository.create({
            producto,  // Solo pasas el id del producto
            cantidadPlanificada: detalleDto.cantidadPlanificada,
            planificacionDiaria: planificacion
          });
        });

        const detallesCreated = await Promise.all(detallesPromises);

        // Guardar los detalles nuevos en la base de datos
        const detallesGuardados = await queryRunner.manager.save(PlanificacionDetalle, detallesCreated);

        const detalles = detallesGuardados.map(d => {
          const productoInfo = d.producto;
          delete d.planificacionDiaria;
          delete d.isDeleted;
          delete d.producto;
          return {
            id: d.id,
            producto: productoInfo.nombre,
            productoId: productoInfo.id,
            ...d
          };
        })
        // Asignar los detalles guardados a la planificación
        planificacion.detalles = detalles;
        delete planificacion.isDeleted;
        // Guardar la planificación con los detalles
        const planificacionGuardada = await queryRunner.manager.save(planificacion);

        // Añadir la planificación guardada a la lista
        planificacionesActualizadas.push(planificacionGuardada);
      }

      //TODO:Notificar por sockets.
      await this.planificacionSocketService.notifyPlanificacionSemanalUpdate(planificacionesActualizadas)
      // Commit de la transacción si todo fue exitoso
      await queryRunner.commitTransaction();

      // Devolver la lista de planificaciones actualizadas
      return planificacionesActualizadas;

    } catch (error) {
      // Revertir los cambios en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }




  async findPlanificacionByFecha(fecha: string) {
    try {
      const planificacion = await this.planificacionRepository.findOne({
        where: {
          isDeleted: false,
          fecha: normalizeDates.normalize(fecha),
        }
      })

      if (!planificacion) {
        throw new NotFoundException(`No hay planificacion para la fecha ${fecha}`)
      }
      delete planificacion.isDeleted;
      return planificacion;
    } catch (error) {
      throw error;
    }
  }

  async findByFecha(getPlanificacionDto: GetPlanificacionDto) {
    const { fecha } = getPlanificacionDto;
    try {

      const planificacion = await this.findPlanificacionByFecha(fecha);

      //Verificamos si hay un envio en proceso
      const envio = await this.enviosService.findAllEnvioCategoriasByFecha(fecha);
      const envioEnProceso = envio != null;


      if (envioEnProceso) {
        const detalles = envio.productosPlanificados;
        //Todo: utilizar el type correspondiente para "envio"
        delete envio.isDeleted;
        delete envio.productosPlanificados;
        return {
          envioIniciado: envio,
          ...planificacion,
          detalles,
        }
      }

      const detalles = planificacion.detalles.map(d => {
        delete d.isDeleted;
        delete d.producto.isDeleted;
        d.id = null;//Significa que no hay id de "envio producto" asociado aún
        const newDetalle = {
          ...d,
          isComplete: false,
          producto: d.producto.nombre,
          productoId: d.producto.id,
          urlImagen: d.producto.urlImagen,
        };
        return newDetalle;
      });
      return {
        envioIniciado: null,
        ...planificacion,
        detalles,
      }
    } catch (error) {
      // console.log('Ocurrio un error')
      this.handleDbExceptions(error);
    }
  }
  async deleteAll() {
    const query1 = this.planificacionRepository.createQueryBuilder('planificacion');
    const query2 = this.planificacionDetalleRepository.createQueryBuilder('planificacionDetalle');
    try {
      await query2.delete().where({}).execute();
      await query1.delete().where({}).execute();
      return;
    } catch (error) {
      throw error;
    }
  }

  // Función privada que valida que los días sean de lunes a viernes y que haya exactamente 5 días
  private validarPlanificacionSemanal(setPlanificacionSemanalDto: SetPlanificacionSemanalDto) {
    const { dias } = setPlanificacionSemanalDto;
    // Validar que siempre vengan exactamente 5 días
    if (dias.length !== 5) {
      throw new BadRequestException('Deben enviarse exactamente 5 días de lunes a viernes.');
    }

    // Obtener los días de la semana a partir de las fechas enviadas
    const diasSemana = dias.map(dia => new Date(dia.fecha).getUTCDay()); // Usar getUTCDay para evitar posibles problemas con zonas horarias

    // Validar que el primer día sea lunes (1) y que los demás sigan de martes a viernes
    const diasValidos = [1, 2, 3, 4, 5];  // Lunes = 1, Martes = 2, etc.
    const sonDiasConsecutivos = diasSemana.every((dia, index) => dia === diasValidos[index]);

    if (!sonDiasConsecutivos) {
      throw new BadRequestException('Los días deben corresponder a lunes a viernes consecutivos.');
    }
  }

  protected handleDbExceptions(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, check logs del server.',
    );
  }

}
