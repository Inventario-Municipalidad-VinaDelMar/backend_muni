import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryRunner, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { TandaCreateSchema } from 'src/inventario/interfaces/tanda-create.interface';
import { TandaResponse } from 'src/inventario/interfaces/tanda-response.interface';
import { Bodega, Producto, Tanda, Ubicacion } from 'src/inventario/entities';
import { normalizeDates } from 'src/utils';
import { UpdateTandaDto } from '../../../dto/rest-dto/tanda-dto/update-tanda.dto';

@Injectable()
export class TandasService extends BaseService<Tanda> {
    constructor(
        @InjectRepository(Tanda)
        private readonly tandaRepository: Repository<Tanda>,
        @InjectRepository(Bodega)
        private readonly bodegaRepository: Repository<Bodega>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Ubicacion)
        private readonly ubicacionRepository: Repository<Ubicacion>,

    ) {

        super(tandaRepository, 'TandasService');
    }

    async updateTanda(idTanda: string, updateTandaDto: UpdateTandaDto) {
        try {
            const tandaData = await this.tandaRepository.findOne({
                where: {
                    id: idTanda
                },
                relations: ['movimientos'],
            });
            if (!tandaData) {
                throw new NotFoundException(`La tanda con id ${idTanda} no existe.`);
            }
            if (tandaData.cantidadActual !== tandaData.cantidadIngresada) {
                throw new BadRequestException(`Esta tanda no se puede actualizar, porque tiene ${tandaData.movimientos.length} movimientos.`);
            }
            for (const [key, value] of Object.entries(updateTandaDto)) {
                if (value !== undefined) {
                    if (key === 'idProducto') {
                        tandaData.producto = this.productoRepository.create({
                            id: value,
                        })
                    } else if (key === 'idBodega') {
                        tandaData.bodega = this.bodegaRepository.create({
                            id: value,
                        })
                    } else if (key === 'idUbicacion') {
                        tandaData.ubicacion = this.ubicacionRepository.create({
                            id: value,
                        })
                    } else if (key === 'cantidadIngresada') {
                        tandaData.cantidadActual = value;
                        tandaData.cantidadIngresada = value;
                    } else {
                        tandaData[key] = value;
                    }

                }
            }

            const tanda = await this.tandaRepository.save(tandaData);
            return tanda;
        } catch (error) {
            throw error;
        }
    }

    async createTanda(tandaCreateSchema: TandaCreateSchema): Promise<TandaResponse> {
        try {
            const tandaCreated = this.tandaRepository.create({
                ...tandaCreateSchema,
            });
            const tanda = await this.tandaRepository.save(tandaCreated);

            // Cargar las relaciones necesarias después de la creación
            const tandaWithRelations = await this.tandaRepository.findOne({
                where: { id: tanda.id },
                relations: ['bodega', 'producto', 'ubicacion',], // Especifica las relaciones que deseas cargar
            });

            if (!tandaWithRelations) {
                throw new BadRequestException('La tanda no se pudo encontrar después de la creación');
            }

            delete tandaWithRelations.isDeleted;
            return {
                ...tandaWithRelations,
                bodega: tandaWithRelations.bodega.nombre,
                producto: tandaWithRelations.producto.nombre,
                ubicacion: tandaWithRelations.ubicacion.descripcion,
                productoId: tandaWithRelations.producto.id,
            };
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findAllByFechas(fechaInicio: string, fechaFin?: string) {
        try {
            const tandasData = await this.tandaRepository.find({
                where: {
                    isDeleted: false,
                    fechaLlegada: fechaFin
                        ? Between(normalizeDates.normalize(fechaInicio), normalizeDates.normalize(fechaFin))
                        : normalizeDates.normalize(fechaInicio),
                },

            })
            const tandas = tandasData.map(tanda => {
                delete tanda.isDeleted;
                const bodega = tanda.bodega;
                const producto = tanda.producto;
                const ubicacion = tanda.ubicacion;
                delete tanda.bodega;
                delete tanda.producto;
                delete tanda.ubicacion;
                return {
                    ...tanda,
                    producto: producto.nombre,
                    productoId: producto.id,
                    bodega: bodega.nombre,
                    ubicacion: ubicacion.descripcion,
                }
            });
            return tandas;
        } catch (error) {
            throw error;
        }
    }

    async findAllBy(idProducto: string): Promise<TandaResponse[]> {
        try {
            const tandasData = await this.tandaRepository.find({
                where: { isDeleted: false, producto: { id: idProducto } },
                relations: ['producto', 'bodega', 'ubicacion'],
                order: { fechaVencimiento: 'ASC' }
            });
            const tandas = tandasData.map(t => {
                delete t.isDeleted;
                return {
                    ...t,
                    bodega: t.bodega.nombre,
                    producto: t.producto.nombre,
                    ubicacion: t.ubicacion.descripcion,
                    productoId: t.producto.id,
                    //Categoria ya es conocida
                };
            })
            return tandas;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    //?@Update
    async substractAmountToTanda(queryRunner: QueryRunner, idTanda: string, amount: number): Promise<TandaResponse> {
        try {
            const tandaToUpdate = await this.findOne(idTanda);

            if (tandaToUpdate.cantidadActual < amount) {
                throw new BadRequestException('Cantidad a retirar no permitida');
            }
            tandaToUpdate.cantidadActual -= amount;//Restar cantidad

            //TODO: hacer algo cuando la cantidad de la tanda llega a cero.
            if (tandaToUpdate.cantidadActual == 0) {
                console.log(`Una tanda de "${tandaToUpdate.producto.nombre}" a llegado a ${tandaToUpdate.cantidadActual}`);
            }
            const tanda = await queryRunner.manager.save(tandaToUpdate);
            delete tanda.isDeleted;
            return {
                ...tanda,
                bodega: tanda.bodega.nombre,
                producto: tanda.producto.nombre,
                ubicacion: tanda.ubicacion.descripcion,
                productoId: tanda.producto.id,
            };

        } catch (error) {
            this.handleDbExceptions(error);
        }
    }


}
