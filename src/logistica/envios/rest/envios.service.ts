import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Envio, EnvioStatus } from '../entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, Not, In, FindOptions, FindOptionsWhere } from 'typeorm';
import { normalizeDates } from 'src/utils';
// import { CategoriasService } from 'src/inventario/rest/servicios-especificos';
import { EnvioProducto } from '../entities/envio-producto.entity';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';
import { PlanificacionService } from 'src/planificacion/rest/planificacion.service';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { ProductosService } from 'src/inventario/rest/servicios-especificos';
import { EnviosSocketService } from '../socket/envios.socket.service';
import { SolicitudEnvio } from 'src/planificacion/entities/solicitud-envio.entity';
import { User } from 'src/auth/entities/user.entity';
import { EnvioResponseUnique, ProductoOnEnvio } from '../interfaces/envio-response-unique.interface';
import { IncidenteEnvio } from '../entities/incidente-envio.entity';
import { IncidenteProducto } from '../entities/incidente-producto.entity';
import { CreateIncidenteDto } from '../dto/create-incidente.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Entrega } from 'src/logistica/entregas/entities/entrega.entity';
import { DevolucionEnvioDto } from '../dto/devolucion-envio.dto';
import { MovimientosService } from 'src/movimientos/rest/movimientos.service';

@Injectable()
export class EnviosService {
  constructor(
    //Incidentes
    @InjectRepository(IncidenteEnvio)
    private readonly incidenteEnvioRepository: Repository<IncidenteEnvio>,
    @InjectRepository(IncidenteProducto)
    private readonly incidenteProductoRepository: Repository<IncidenteProducto>,

    //Envios
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,
    @InjectRepository(EnvioProducto)
    private readonly envioProductoRepository: Repository<EnvioProducto>,

    //Servicios externos
    @Inject(forwardRef(() => PlanificacionService))
    private readonly planificacionService: PlanificacionService,

    @Inject(forwardRef(() => EnviosSocketService))
    private readonly enviosSocketService: EnviosSocketService,
    @Inject(forwardRef(() => MovimientosService))
    private readonly movimientosService: MovimientosService,

    private readonly productosService: ProductosService,
    private readonly planificacionSocketService: PlanificacionSocketService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async processDevolucionEnvio(idEnvio: string, devolucionEnvioDto: DevolucionEnvioDto, user: User) {
    try {
      const { comentario, } = devolucionEnvioDto;
      const envio = await this.envioRepository.findOne({
        where: {
          isDeleted: false,
          id: idEnvio,
        },
        relations: ['devoluciones.tanda.producto', 'devoluciones', 'entregas', 'entregas.detallesEntrega', 'incidentes', 'incidentes.productosAfectados']
      });

      if (!envio) {
        throw new NotFoundException(`El envio con id ${idEnvio} no existe.`);
      }
      //Solo envio finalziados, pueden procesar devolciones
      if (envio.status !== EnvioStatus.FINALIZADO) {
        throw new BadRequestException(`El envio ${idEnvio} aun no esta finalizado.`)
      }

      const productosData = this.calculateCargaActual(envio, envio.productosPlanificados);
      const productos = productosData.map(productoCalculado => {
        const productoOriginal = envio.productosPlanificados.find(p => p.producto.id === productoCalculado.productoId);
        return {
          ...productoCalculado,
          tandaId: productoOriginal.movimiento.tanda.id,
        };
      });

      const movimientosPromises = productos.map(p => {
        return () => this.movimientosService.createMovimientoAsDevolucion({
          cantidadDevuelta: p.cantidad,
          comentario,
          idEnvio,
          idTanda: p.tandaId,
        }, user);
      });
      const movimientos = await Promise.all(movimientosPromises.map(fn => fn()));
      return movimientos;
    } catch (error) {
      throw error;
    }
  }

  async selectEnvioByNeorute(idEnvio: string) {
    try {
      const envio = await this.envioRepository.findOneBy({ id: idEnvio });
      if (envio.status !== EnvioStatus.CARGA_COMPLETA) {
        throw new BadRequestException(`Este envio no seleccionable, porque su status es: '${envio.status.toString()}' `);
      }
      envio.status = EnvioStatus.EN_ENVIO;
      const envioUpdated = await this.envioRepository.save(envio);
      delete envioUpdated.entregas;
      delete envioUpdated.incidentes;
      delete envioUpdated.productosPlanificados;
      delete envioUpdated.isDeleted;
      //*Notificar cambio en un envio de la lista de envios del administrador
      await this.enviosSocketService.notifyListEnviosUpdate();
      //*Notificar por sockcet que un envio ha cambiado
      await this.enviosSocketService.notifyEnvioUpdate(idEnvio);
      return envioUpdated;
    } catch (error) {
      throw error;
    }
  }
  async finishEnvioByNeorute(idEnvio: string) {
    try {
      const envio = await this.envioRepository.findOneBy({ id: idEnvio });
      if (envio.status !== EnvioStatus.EN_ENVIO) {
        throw new BadRequestException(`Este envio no finalizable, porque su status es: '${envio.status.toString()}' `);
      }
      envio.status = EnvioStatus.FINALIZADO;
      const envioUpdated = await this.envioRepository.save(envio);
      delete envioUpdated.entregas;
      delete envioUpdated.incidentes;
      delete envioUpdated.productosPlanificados;
      delete envioUpdated.isDeleted;
      //*Notificar cambio en un envio de la lista de envios del administrador
      await this.enviosSocketService.notifyListEnviosUpdate();
      //*Notificar por sockcet que un envio ha cambiado
      await this.enviosSocketService.notifyEnvioUpdate(idEnvio);
      return envioUpdated;
    } catch (error) {
      throw error;
    }
  }
  async createNewIncidente(file: Express.Multer.File | null, createIncidenteDto: CreateIncidenteDto, user: User) {

    try {
      const { idEnvio, productosAfectados, closeEnvio, ...rest } = createIncidenteDto;
      const envio = await this.envioRepository.findOne({
        where: {
          id: idEnvio,
        },
      })

      if (!envio) {
        throw new NotFoundException(`El envio con id ${idEnvio} no existe.`);
      }
      if (envio.status == EnvioStatus.FINALIZADO) {
        throw new BadRequestException('Este envio ya ha finalizado.');
      }
      const incidenteData = this.incidenteEnvioRepository.create({
        ...rest,
        envio: envio,

        causeCloseEnvio: closeEnvio,//default false si es null


      })
      const incidente = await this.incidenteEnvioRepository.save(incidenteData);
      const productosPromises = productosAfectados.map(p => {
        const productoData = this.incidenteProductoRepository.create({
          cantidadAfectada: p.cantidadAfectada,
          producto: this.productosService.generateClass(p.productoId),
          incidente,
        });
        return this.incidenteProductoRepository.save(productoData);
      })

      const productos = await Promise.all(productosPromises);
      let incidenteWithEvidencia = incidente;
      if (file) {
        const result = await this.cloudinaryService.uploadFile(file, 'imagenes_incidentes');
        incidente.evidenciaFotograficaUrl = result.secure_url;
        incidenteWithEvidencia = await this.incidenteEnvioRepository.save(incidenteWithEvidencia);
      }

      if (closeEnvio) {
        console.log(`El envio ${idEnvio} se va a cerrar?: ${closeEnvio}`)
        envio.status = EnvioStatus.FINALIZADO;
        await this.envioRepository.save(envio)
      }
      //*Notificar cambio en un envio de la lista de envios del administrador
      await this.enviosSocketService.notifyListEnviosUpdate();
      //*Notificar por sockcet que un envio ha cambiado
      await this.enviosSocketService.notifyEnvioUpdate(idEnvio);
      return {
        ...incidenteWithEvidencia,
        productosAfectados: productos,
      }
    } catch (error) {
      throw error;
    }
  }

  async createNewEnvio(solicitud: SolicitudEnvio, user: User) {
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
        solicitud,
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
      //*Notificar cambio en un envio de la lista de envios del administrador
      await this.enviosSocketService.notifyListEnviosUpdate(true);
      return envio;
    } catch (error) {
      throw error;
    }
  }
  async getEnviosByFecha(fecha: string, adminView: boolean = false) {
    try {
      const enviosData = await this.loadEnvioRelations(undefined, fecha, adminView);
      return enviosData.map(envio => this.buildEnvioResponse(envio));
    } catch (error) {
      throw error;
    }
  }

  async getEnvioById(idEnvio: string, isAdmin: boolean = false): Promise<EnvioResponseUnique> {
    try {
      const enviosData = await this.loadEnvioRelations(idEnvio, null, isAdmin);
      if (!enviosData.length) {
        throw new BadRequestException(`El envio con id ${idEnvio} no existe`);
      }
      return this.buildEnvioResponse(enviosData[0], true);
    } catch (error) {
      throw error;
    }
  }

  async getEnviosToNeorute(fecha: string): Promise<EnvioResponseList[]> {
    try {
      const enviosData = await this.loadEnvioRelations(undefined, fecha, false, true);
      return enviosData.map(envio => this.buildEnvioResponse(envio));
    } catch (error) {
      throw error;
    }
  }




  async completeNewEnvio() {
    try {
      // const fechaActual = '2024-11-01';
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
      if (envioEnCurso.status == EnvioStatus.FINALIZADO) {
        throw new BadRequestException('Este envio ya ha finalizado.');
      }
      let completeAllProducto = true;

      envioEnCurso.productosPlanificados.map(p => {
        if (p.movimiento !== null) return;
        completeAllProducto = false;
      })

      if (!completeAllProducto) {
        throw new BadRequestException('Aun no se han cargado todos los productos planificados');
      }
      //?Todabia no hay sido tomada para salir a repartir
      envioEnCurso.status = EnvioStatus.CARGA_COMPLETA;
      // envioEnCurso.status = EnvioStatus.EN_ENVIO;
      delete envioEnCurso.productosPlanificados;
      const envioUpdated = await this.envioRepository.save(envioEnCurso);

      //*Notificar por sockets a planificacion que un envio termino de cargar en bodega
      await this.planificacionSocketService.notifyEnvioUpdate();

      //*Notificar cambio en un envio de la lista de envios para todos los usuarios
      await this.enviosSocketService.notifyListEnviosUpdate();

      //*Notificar que ha cambiado un envio en especifico
      await this.enviosSocketService.notifyEnvioUpdate(envioEnCurso.id)

      return envioUpdated;

    } catch (error) {
      throw error;
    }
  }

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

        if ([EnvioStatus.CARGA_COMPLETA, EnvioStatus.EN_ENVIO, EnvioStatus.FINALIZADO].includes(envio.status)) {
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
      console.log({ envioEnProceso })
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
  instanceEnvio(idEnvio: string) {
    return this.envioRepository.create({
      id: idEnvio,
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
      const envio = await this.envioRepository.findOneBy({ id: envioProducto.envio.id });
      delete movimiento.envioProducto;
      envioProducto.movimiento = movimiento;

      await queryRunner.manager.save(envioProducto);

      //Actualizar el estado del envio
      if (!envio) {
        throw new NotFoundException(`El envio ${envioProducto.id} no existe para realizar el movimiento`)
      }
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
    const query3 = this.incidenteEnvioRepository.createQueryBuilder('incidenteEnvios');
    const query4 = this.incidenteProductoRepository.createQueryBuilder('incidenteProducto');
    try {
      await query4.delete().where({}).execute();
      await query3.delete().where({}).execute();
      await query1.delete().where({}).execute();
      await query2.delete().where({}).execute();
      return;
    } catch (error) {
      throw error;
    }
  }

  private calculateCargaActual(envio: Envio, productos: EnvioProducto[]) {
    if (!envio.entregas) {
      throw new InternalServerErrorException('El envio no tiene las entregas');
    }
    if (!envio.incidentes) {
      throw new InternalServerErrorException('El envio no tiene los incidentes');
    }
    if (!envio.devoluciones) {
      throw new InternalServerErrorException('El envio no tiene las devoluciones');
    }
    return productos
      .filter(pp => pp.movimiento)
      .map(p => {
        const carga: ProductoOnEnvio = {
          cantidad: p.movimiento.cantidadRetirada,
          producto: p.producto.nombre,
          productoId: p.producto.id,
          urlImagen: p.producto.urlImagen,
        }
        //Restar carga inicial con productos entregados
        envio.entregas.map(e => {
          e.detallesEntrega.map(detalle => {
            if (detalle.producto.id === carga.productoId) {
              carga.cantidad -= detalle.cantidadEntregada;
              if (carga.cantidad < 0) {
                throw new BadRequestException(`El producto ${carga.producto} a quedado con carga negativa: ${carga.cantidad}`);
              }
            }
          })
        });
        //Restar carga inicial con productos afectados en incidente
        envio.incidentes.map(i => {
          i.productosAfectados.map(pi => {
            if (pi.producto.id === carga.productoId) {
              carga.cantidad -= pi.cantidadAfectada;
              if (carga.cantidad < 0) {
                throw new BadRequestException(`El producto ${carga.producto} a quedado con carga negativa: ${carga.cantidad}`);
              }
            }
          })
        });
        //Restar carga inicial con devoluciones asociadas
        envio.devoluciones.map(dm => {
          if (dm.tanda.producto.id === carga.productoId) {
            carga.cantidad -= dm.cantidadRetirada;
            if (carga.cantidad < 0) {
              throw new BadRequestException(`El producto ${carga.producto} a quedado con carga negativa: ${carga.cantidad}`);
            }
          }
        });
        return {
          ...carga,
        }
      }).sort((a, b) => b.cantidad - a.cantidad);

  }

  private async loadEnvioRelations(
    idEnvio?: string,
    fecha?: string,
    adminView: boolean = false,
    neorute: boolean = false,
  ): Promise<Envio[]> {
    const statusAvailables = [EnvioStatus.SIN_CARGAR, EnvioStatus.CARGANDO];

    if (adminView) {
      statusAvailables.length = 0; // Limpiar restricciones si es admin
    }
    if (neorute) {
      statusAvailables.length = 0;
      statusAvailables.push(EnvioStatus.SIN_CARGAR)
      statusAvailables.push(EnvioStatus.CARGANDO)
      statusAvailables.push(EnvioStatus.FINALIZADO)
      statusAvailables.push(EnvioStatus.EN_ENVIO)
    }
    const condiciones: FindOptionsWhere<Envio> = idEnvio
      ? { id: idEnvio, isDeleted: false, status: Not(In(statusAvailables)), }
      : { fecha: normalizeDates.normalize(fecha), isDeleted: false, status: Not(In(statusAvailables)) };
    return await this.envioRepository.find({
      where: condiciones,
      relations: [
        'devoluciones.tanda.producto',
        'solicitud',
        'entregas',
        'entregas.detallesEntrega',
        'incidentes',
        'incidentes.productosAfectados',
      ],
      order: idEnvio ? undefined : { horaCreacion: 'DESC' },
    });
  }

  private sortEnvioData(envio: Envio): void {
    envio.entregas.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
      const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
      return timeA - timeB;
    });
    envio.incidentes.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
      const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
      return timeB - timeA;
    });
  }

  private buildEnvioResponse(envio: Envio, listDetail: boolean = false): any {
    this.sortEnvioData(envio);

    const cargaActual = this.calculateCargaActual(envio, envio.productosPlanificados);
    const cargaInicial = envio.productosPlanificados
      .filter(pp => pp.movimiento).map(p => ({
        cantidad: p.movimiento.cantidadRetirada,

        producto: p.producto.nombre,
        productoId: p.producto.id,
        urlImagen: p.producto.urlImagen,
      }));
    const movimientos = envio.productosPlanificados
      .filter(pp => pp.movimiento) // Filtrar los que tienen movimiento
      .map(pp => ({
        id: pp.movimiento.id,
        cantidadRetirada: pp.movimiento.cantidadRetirada,
        producto: pp.producto.nombre,
        productoId: pp.producto.id,
        fecha: pp.movimiento.fecha,
        hora: pp.movimiento.hora,
        user: `${pp.movimiento.realizador.nombre} ${pp.movimiento.realizador.apellidoPaterno} ${pp.movimiento.realizador.apellidoMaterno}`
      }));
    const solicitud = envio.solicitud;

    const entregas = envio.entregas.map(e => {
      const copiloto = e.copiloto;
      const comedor = e.comedorSolidario;
      const numProductos = e.detallesEntrega.length;
      delete e.copiloto;
      delete e.comedorSolidario;
      delete e.isDeleted;
      delete e.detallesEntrega;
      delete e.envio;
      // delete e.id;
      return {
        ...e,
        comedorSolidario: comedor.nombre,
        comedorDireccion: comedor.direccion,
        realizador: `${copiloto.nombre} ${copiloto.apellidoPaterno} ${copiloto.apellidoMaterno}`,
        realizadorId: copiloto.id,
        productosEntregados: numProductos,
      };
    });

    const incidentes = envio.incidentes.map(i => {
      const productos = i.productosAfectados;
      delete i.isDeleted;
      delete i.envio;
      return {
        ...i,
        productosAfectados: productos.map(p => {
          delete p.incidente;
          return {
            cantidad: p.cantidadAfectada,
            producto: p.producto.nombre,
            productoId: p.producto.id,
            urlImagen: p.producto.urlImagen,
          }
        })
      };
    });
    delete envio.isDeleted;
    delete envio.entregas;
    delete envio.incidentes;
    delete envio.productosPlanificados;
    delete envio.solicitud;
    delete envio.devoluciones;
    return {
      ...envio,
      autorizante: `${solicitud.administrador.nombre} ${solicitud.administrador.apellidoPaterno} ${solicitud.administrador.apellidoMaterno}`,
      solicitante: `${solicitud.solicitante.nombre} ${solicitud.solicitante.apellidoPaterno} ${solicitud.solicitante.apellidoMaterno}`,
      entregas,
      incidentes,
      ...(listDetail ? { cargaInicial, cargaActual, movimientos } : { productos: cargaActual }),
    };
  }



}
