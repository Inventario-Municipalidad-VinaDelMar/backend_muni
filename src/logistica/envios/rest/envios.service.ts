import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Envio, EnvioStatus } from '../entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, Not, In } from 'typeorm';
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

    private readonly productosService: ProductosService,
    private readonly planificacionSocketService: PlanificacionSocketService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
        envio: this.envioRepository.create({ id: idEnvio }),


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
      const fechaFormatted = normalizeDates.normalize(fecha);
      const statusAvailables = [EnvioStatus.SIN_CARGAR, EnvioStatus.CARGANDO];

      //El administrador puede ver todos los envios sin importar el status
      if (adminView) {
        //Se espera que la lista quede vacia
        statusAvailables.splice(0, statusAvailables.length);
      }
      const enviosData = await this.envioRepository.find({
        where: {
          isDeleted: false,
          fecha: fechaFormatted,
          status: Not(In(statusAvailables)),

        },
        order: {
          horaCreacion: 'DESC',
        },
        relations: ['solicitud', 'entregas', 'entregas.detallesEntrega', 'incidentes', 'incidentes.productosAfectados'],
        //?Activar si es necesaria
      });
      enviosData.forEach(envio => {
        envio.entregas = envio.entregas.sort((a, b) => {
          // Extrae horas, minutos y segundos como números
          const [hoursA, minutesA, secondsA] = a.hora.split(':').map(Number);
          const [hoursB, minutesB, secondsB] = b.hora.split(':').map(Number);

          // Crea un timestamp solo con horas, minutos y segundos
          const timeA = new Date(1970, 0, 1, hoursA, minutesA, secondsA).getTime();
          const timeB = new Date(1970, 0, 1, hoursB, minutesB, secondsB).getTime();
          return timeA - timeB;
        });
      });



      const envios = enviosData.map(e => {
        delete e.isDeleted;
        const productosData = e.productosPlanificados;
        const productos = productosData
          .filter(pp => pp.movimiento)
          .map(p => {
            const carga: ProductoOnEnvio = {
              cantidad: p.movimiento.cantidadRetirada,
              producto: p.producto.nombre,
              productoId: p.producto.id,
              urlImagen: p.producto.urlImagen,
            }
            //Restar carga inicial con productos entregados
            e.entregas.map(e => {
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
            e.incidentes.map(i => {
              i.productosAfectados.map(pi => {
                if (pi.producto.id === carga.productoId) {
                  carga.cantidad -= pi.cantidadAfectada;
                  if (carga.cantidad < 0) {
                    throw new BadRequestException(`El producto ${carga.producto} a quedado con carga negativa: ${carga.cantidad}`);
                  }
                }
              })
            });
            return {
              ...carga,
            }
          })

        delete e.productosPlanificados;
        const solicitud = e.solicitud;
        delete e.solicitud;
        //Modifica la respuesta de entregas
        const entregas = e.entregas.map(e => {
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
        delete e.entregas;
        const incidentes = e.incidentes.map(i => {
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
        delete e.incidentes;

        //TODO: Modificar la respuesta para incidentes
        return {
          ...e,
          autorizante: `${solicitud.administrador.nombre} ${solicitud.administrador.apellidoPaterno} ${solicitud.administrador.apellidoMaterno}`,
          solicitante: `${solicitud.solicitante.nombre} ${solicitud.solicitante.apellidoPaterno} ${solicitud.solicitante.apellidoMaterno}`,
          productos,
          entregas,
          incidentes,
        };
      });
      return envios;

    } catch (error) {
      throw error;
    }
  }
  async getEnvioById(idEnvio: string): Promise<EnvioResponseUnique> {
    try {

      const envioData = await this.envioRepository.findOne({
        where: {
          isDeleted: false,
          id: idEnvio,
        },
        relations: ['entregas', 'entregas.detallesEntrega', 'solicitud']
      })
      if (!envioData) {
        throw new BadRequestException(`El envio con id ${idEnvio} no existe`)
      }
      const envio: EnvioResponseUnique = {
        id: envioData.id,
        fecha: envioData.fecha,
        horaCreacion: envioData.horaInicioEnvio,
        horaInicioEnvio: envioData.horaInicioEnvio,
        horaFinalizacion: envioData.horaFinalizacion,
        status: envioData.status,
        administrador: envioData.solicitud.administrador,
        solicitante: envioData.solicitud.solicitante,
        movimientos: [],
        entregas: [],
        cargaInicial: [],
        cargaActual: [],
      };

      envio.movimientos = envioData.productosPlanificados
        .filter(pp => pp.movimiento) // Filtrar los que tienen movimiento
        .map(pp => ({
          id: pp.movimiento.id,
          cantidadRetirada: pp.movimiento.cantidadRetirada,
          producto: pp.producto.nombre,
          productoId: pp.producto.id,
          fecha: pp.movimiento.fecha,
          hora: pp.movimiento.hora,
        }));

      envio.entregas = envioData.entregas.map(e => ({
        id: e.id,
        comedorSolidario: e.comedorSolidario.nombre,
        comedorSolidarioId: e.comedorSolidario.id,
        copiloto: e.copiloto,
        fecha: e.fecha as unknown as string,
        // fecha: normalizeDates.normalize(e.fecha as unknown as string),
        hora: e.hora,
        urlActaLegal: e.url_acta_legal,
        productosEntregados: e.detallesEntrega.map(ed => ({
          producto: ed.producto.nombre,
          productoId: ed.producto.id,
          cantidad: ed.cantidadEntregada,
          urlImagen: ed.producto.urlImagen,
        })),
      }));

      if (![EnvioStatus.EN_ENVIO, EnvioStatus.FINALIZADO].includes(envioData.status)) {
        return envio;
      }

      envio.cargaInicial = envioData.productosPlanificados
        .filter(pp => pp.movimiento).map(p => ({
          cantidad: p.movimiento.cantidadRetirada,

          producto: p.producto.nombre,
          productoId: p.producto.id,
          urlImagen: p.producto.urlImagen,
        }));

      envio.cargaActual = envioData.productosPlanificados
        .filter(pp => pp.movimiento)
        .map(p => {
          const carga: ProductoOnEnvio = {
            cantidad: p.movimiento.cantidadRetirada,
            producto: p.producto.nombre,
            productoId: p.producto.id,
            urlImagen: p.producto.urlImagen,
          }
          //Restar carga inicial con productos entregados
          envioData.entregas.map(e => {
            e.detallesEntrega.map(detalle => {
              if (detalle.producto.id === carga.productoId) {
                carga.cantidad -= detalle.cantidadEntregada;
                if (carga.cantidad < 0) {
                  throw new BadRequestException(`El producto ${carga.producto} a quedado con carga negativa: ${carga.cantidad}`);
                }
              }
            })
          });
          //TODO: añadir la resta de incidente envio
          return {
            ...carga,
          }
        });


      return envio;

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

      envioEnCurso.status = EnvioStatus.EN_ENVIO;
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



}
