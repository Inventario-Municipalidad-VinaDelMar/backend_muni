import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimiento } from '../entities/movimiento.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateMovimientoDto } from '../dto/create_movimiento.dto';
import { TandasService } from 'src/inventario/rest/servicios-especificos';
import { MovimientosSocketService } from '../socket/movimientos.socket.service';
import { EnviosService } from 'src/logistica/envios/envios.service';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';
import { MovimientoResponse } from '../interfaces/movimiento_response.interface';
import { TandaResponse } from 'src/inventario/interfaces/tanda-response.interface';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MovimientosService {

    constructor(
        private readonly enviosService: EnviosService,
        private readonly tandasService: TandasService,
        private readonly planificacionSocketService: PlanificacionSocketService,

        private readonly dataSource: DataSource, // Inyección de DataSource para transaccion

        @InjectRepository(Movimiento)
        private readonly movimientoRepository: Repository<Movimiento>,
        @Inject(forwardRef(() => MovimientosSocketService))
        private readonly movimientosSocketService: MovimientosSocketService,
    ) {
    }

    async createMovimiento(createMovimientoDto: CreateMovimientoDto, user: User) {
        const { idEnvioProducto, idTanda, cantidadRetirada } = createMovimientoDto;

        //Verificar si el movimiento tiene vinculo con un envio actual
        const { fechaEnvio, idEnvio } = await this.enviosService.verifyEnvioByEnvioProducto(idEnvioProducto);

        // Iniciar la transacción
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();


        try {
            // Crear el movimiento
            const tandaInstance = this.tandasService.generateClass(idTanda);
            const movimientoCreated = this.movimientoRepository.create({
                cantidadRetirada,
                tanda: tandaInstance,
                envioProducto: this.enviosService.instanceEnvioProducto(idEnvioProducto),
                realizador: user,
            });

            // Guardar el movimiento dentro de la transacción
            const movimiento = await queryRunner.manager.save(movimientoCreated);

            // Descontar la cantidad del movimiento a la tanda
            const tanda: TandaResponse = await this.tandasService.substractAmountToTanda(queryRunner, idTanda, cantidadRetirada);

            // Asignar el nuevo movimiento al EnvioProducto;
            await this.enviosService.updateEnvioProducto(queryRunner, movimiento)
            // throw new InternalServerErrorException();
            // Confirmar la transacción
            const producto = tanda.producto;
            const productoId = tanda.productoId;
            delete movimiento.tanda
            delete movimiento.isDeleted;


            await queryRunner.commitTransaction();
            //* Notificar por socket movimiento nuevo
            await this.movimientosSocketService.notifyMovimientoCreated({
                ...movimiento,
                producto,
                productoId,
                envioId: idEnvio,
            }, idEnvio)
            //* Notificar por socket actualización de la tanda
            await this.movimientosSocketService.notifyTandaDiscount(tanda)
            //* Notificar por socket movimiento asignado a EnvioProducto
            await this.planificacionSocketService.notifyEnvioUpdate(fechaEnvio,)
            //Error de prueba
            return movimiento;
        } catch (error) {
            console.log({ error })
            // Revertir todos los cambios si ocurre un error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Liberar el queryRunner
            await queryRunner.release();
        }
    }

    async getMovimientoByIdEnvio(id: string): Promise<MovimientoResponse[]> {
        try {
            const movimientosList = await this.movimientoRepository.find({
                where: {
                    envioProducto: {
                        envio: {
                            id
                        }
                    }
                }
            })

            const movimientos = movimientosList.map(m => {
                const producto = m.tanda.producto.nombre;
                const productoId = m.tanda.producto.id;
                delete m.isDeleted
                delete m.tanda;
                return {
                    ...m,
                    producto,
                    productoId,
                    envioId: id,
                }
            })

            return movimientos;
        } catch (error) {
            throw error;
        }
    }


    async deleteAll() {
        const query = this.movimientoRepository.createQueryBuilder('movimientos');
        try {
            await query.delete().where({}).execute();
            return;
        } catch (error) {
            throw error;
        }
    }
}
