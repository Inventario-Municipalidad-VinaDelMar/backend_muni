import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntregasSocketService } from '../socket/entregas.socket.service';
import { User } from 'src/auth/entities/user.entity';
import { CreateEntregaDto } from '../dto/rest/create-entregas.dto';
import { Entrega } from '../entities/entrega.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntregaDetalle } from '../entities/entrega-detalle.entity';
import { ComedorSolidario } from '../entities/comedor-solidario.entity';
import { EnviosSocketService } from 'src/logistica/envios/socket/envios.socket.service';
import { EnviosService } from 'src/logistica/envios/rest/envios.service';
import { ProductosService } from 'src/inventario/rest/servicios-especificos';
import { CreateComedorDto } from '../dto/rest/create-comedor.dto';
import e from 'express';
import { UpdateEntregaDto } from '../dto/rest/update-entrega.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class EntregasService {

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productoService: ProductosService,
    private readonly envioSocketService: EnviosSocketService,
    private readonly envioService: EnviosService,

    @Inject(forwardRef(() => EntregasSocketService))
    private readonly entregasSocketService: EntregasSocketService,

    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,

    @InjectRepository(EntregaDetalle)
    private readonly entregaDetalleRepository: Repository<EntregaDetalle>,

    @InjectRepository(ComedorSolidario)
    private readonly comedorSolidarioRepository: Repository<ComedorSolidario>,
  ) { }

  async updateEntregaFile(file: Express.Multer.File, updateEntregaDto: UpdateEntregaDto) {
    try {
      const { idEntrega } = updateEntregaDto;
      const entregaData = await this.entregaRepository.findOneBy({ id: idEntrega })
      if (!entregaData) {
        throw new NotFoundException(`La entrega con id ${idEntrega} no existe.`);
      }
      const previousFileUrl = entregaData.url_acta_legal;
      if (previousFileUrl) {
        // 2. Extraer el ID del archivo de la URL
        const fileId = previousFileUrl.split('/').pop()?.split('.')[0];
        if (fileId) {
          await this.cloudinaryService.deleteFile(fileId);
        }
      }
      const result = await this.cloudinaryService.uploadFile(file);
      entregaData.url_acta_legal = result.secure_url;
      const entrega = await this.entregaRepository.save(entregaData);
      delete entrega.envio;
      delete entrega.isDeleted;
      //TODO: Notificar por sockets
      return entrega;
    } catch (error) {
      throw error;
    }
  }

  async createNewEntrega(createEntregaDto: CreateEntregaDto, user: User) {
    try {
      const { detalles, ...rest } = createEntregaDto;
      const entregaData = this.entregaRepository.create({
        comedorSolidario: this.instanceComedorSolidario(rest.idComedor),
        envio: this.envioService.instanceEnvio(rest.idEnvio),
        copiloto: user,
      });

      const entrega = await this.entregaRepository.save(entregaData);
      const productosEntregadosData = detalles.map(d => {
        const producto = this.entregaDetalleRepository.create({
          cantidadEntregada: d.cantidadEntregada,
          producto: this.productoService.generateClass(d.productoId),
          entrega,
        });
        return producto;
      })

      const productosEntregados = await this.entregaDetalleRepository.save(productosEntregadosData);
      entrega.detallesEntrega = productosEntregados;

      const entregaWithProductos = await this.entregaRepository.save(entrega);

      //*Notificar por sockcet que un envio ha cambiado
      await this.envioSocketService.notifyEnvioUpdate(rest.idEnvio);
      //*Notificar por sockcet que un envio de la lista ha cambiado
      await this.envioSocketService.notifyListEnviosUpdate();
      return entregaWithProductos;
    } catch (error) {
      throw error;
    }
  }

  async findAllComedores() {
    try {
      const comedoresData = await this.comedorSolidarioRepository.find({
        where: {
          isDeleted: false,
        },
        order: {
          nombre: 'ASC',
        }
      });
      const comedores = comedoresData.map(c => {
        delete c.isDeleted;
        return { ...c };
      })
      return comedores;
    } catch (error) {
      throw error;
    }
  }
  instanceComedorSolidario(idComedor: string) {
    return this.comedorSolidarioRepository.create({
      id: idComedor,
    })
  }

  async createNewComedor(createComedorDto: CreateComedorDto) {
    try {
      const comedorData = this.comedorSolidarioRepository.create({
        ...createComedorDto,
      });
      const comedor = await this.comedorSolidarioRepository.save(comedorData)
      return comedor;
    } catch (error) {
      throw error;
    }
  }

  async getEntregasByEnvio(idEnvio: string) {
    try {
      const entregasData = await this.entregaRepository.find({
        where: {
          envio: {
            id: idEnvio
          }
        },
        relations: ['detallesEntrega'],
      })
      const entregas = entregasData.map(e => {
        const detalles = e.detallesEntrega;
        delete e.envio;
        delete e.isDeleted;
        delete e.comedorSolidario.isDeleted
        delete e.detallesEntrega;
        const productosEntregados = detalles.map(ed => {
          const producto = ed.producto;
          delete ed.entrega;
          delete ed.isDeleted;
          delete ed.producto;
          //No es necesario que el frontend sepa el id de un "detalleEntrega"
          delete ed.id;
          return {
            ...ed,
            producto: producto.nombre,
            productoId: producto.id,
            urlImage: producto.urlImagen,
          };
        })
        return {
          ...e,
          detallesEntrega: productosEntregados,
        };
      })
      return entregas;
    } catch (error) {
      throw error;
    }
  }
  async getEntregaById(idEntrega: string) {
    try {
      const entrega = await this.entregaRepository.findOne({
        where: {
          id: idEntrega
        },
        relations: ['detallesEntrega'],
      })
      if (!entrega) {
        throw new NotFoundException(`La entrega con id ${idEntrega} no existe.`)
      }
      const detalles = entrega.detallesEntrega;
      delete entrega.isDeleted;
      delete entrega.comedorSolidario.isDeleted;
      delete entrega.envio;
      delete entrega.detallesEntrega;
      // delete entrega.envio.productosPlanificados;
      // delete entrega.envio.isDeleted;
      const productosEntregados = detalles.map(ed => {
        const producto = ed.producto;
        delete ed.entrega;
        delete ed.isDeleted;
        delete ed.producto;
        //No es necesario que el frontend sepa el id de un "detalleEntrega"
        delete ed.id;
        return {
          ...ed,
          producto: producto.nombre,
          productoId: producto.id,
          urlImage: producto.urlImagen,
        };
      })


      return {
        ...entrega,
        detallesEntrega: productosEntregados,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    const query1 = this.entregaRepository.createQueryBuilder('entregas');
    const query2 = this.entregaDetalleRepository.createQueryBuilder('entregasDetalles');
    const query3 = this.comedorSolidarioRepository.createQueryBuilder('comedores');
    try {
      await query2.delete().where({}).execute();
      await query1.delete().where({}).execute();
      await query3.delete().where({}).execute();
      return;
    } catch (error) {
      throw error;
    }
  }


}
