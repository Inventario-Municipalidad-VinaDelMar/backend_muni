import { BadRequestException, Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { TandaCreateSchema } from 'src/inventario/interfaces/tanda-create.interface';
import { TandaResponse } from 'src/inventario/interfaces/tanda-response.interface';
import { Tanda } from 'src/inventario/entities';

@Injectable()
export class TandasService extends BaseService<Tanda> {
    constructor(
        @InjectRepository(Tanda)
        private readonly tandaRepository: Repository<Tanda>,

    ) {

        super(tandaRepository, 'TandasService');
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
    async substractAmountToTanda(queryRunner: QueryRunner, idTanda: string, amount: number) {
        try {
            const tandaToUpdate = await this.findOne(idTanda);

            if (tandaToUpdate.cantidadActual < amount) {
                throw new BadRequestException('Cantidad a retirar no permitida');
            }
            tandaToUpdate.cantidadActual -= amount;//Restar cantidad

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
