import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PlanificacionSocketService } from '../socket/planificacion.socket.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from '../entities/planificacion.entity';
import { normalizeDates } from 'src/utils';
import { CreatePlanificacionDto, GetPlanificacionDto } from '../dto/rest';
import { PlanificacionDetalle } from '../entities/planificacion-detalle.entity';
import { ProductosService } from 'src/inventario/rest/servicios-especificos';
import { EnviosService } from 'src/logistica/envios/envios.service';



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

    @Inject(forwardRef(() => PlanificacionSocketService))
    private readonly planificacionSocketService: PlanificacionSocketService,
  ) { }

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
        const detalles = envio.categoriasPlanificadas;
        //Todo: utilizar el type correspondiente para "envio"
        delete envio.isDeleted;
        delete envio.categoriasPlanificadas;
        return {
          envioIniciado: envio,
          ...planificacion,
          detalles,
        }
      }

      const detalles = planificacion.detalles.map(d => {
        delete d.isDeleted;
        delete d.producto.isDeleted;
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
