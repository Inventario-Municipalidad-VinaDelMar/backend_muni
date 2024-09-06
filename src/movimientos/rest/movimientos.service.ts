import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimiento } from '../entities/movimiento.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateMovimientoDto } from '../dto/create_movimiento.dto';
import { TandasService } from 'src/inventario/rest/servicios-especificos';
import { MovimientosSocketService } from '../socket/movimientos.socket.service';
import { EnviosService } from 'src/logistica/envios/envios.service';
import { PlanificacionSocketService } from 'src/planificacion/socket/planificacion.socket.service';

@Injectable()
export class MovimientosService {

    constructor(
        private readonly enviosService: EnviosService,
        private readonly tandasService: TandasService,
        private readonly planificacionSocketService: PlanificacionSocketService,
        @InjectRepository(Movimiento)
        private readonly movimientoRepository: Repository<Movimiento>,

        private readonly dataSource: DataSource, // Inyección de DataSource para transaccion

        @Inject(forwardRef(() => MovimientosSocketService))
        private readonly movimientosSocketService: MovimientosSocketService,
    ) {
    }

    async createMovimiento(createMovimientoDto: CreateMovimientoDto) {
        const { idEnvioCategoria, idTanda, cantidadRetirada } = createMovimientoDto;

        //Verificar si el movimiento tiene vinculo con un envio actual
        await this.enviosService.verifyEnvioByEnvioCategoria(idEnvioCategoria);

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
                envioCategoria: this.enviosService.instanceEnvioCategoria(idEnvioCategoria)
            });

            // Guardar el movimiento dentro de la transacción
            const movimiento = await queryRunner.manager.save(movimientoCreated);

            // Descontar la cantidad del movimiento a la tanda
            const tanda = await this.tandasService.substractAmountToTanda(queryRunner, idTanda, cantidadRetirada);

            // Asignar el nuevo movimiento al EnvioCategoria;
            await this.enviosService.updateEnvioCategoria(queryRunner, movimiento)
            // throw new InternalServerErrorException();
            // Confirmar la transacción
            await queryRunner.commitTransaction();

            //* Notificar por socket movimiento nuevo
            await this.movimientosSocketService.notifyMovimientoCreated(movimiento)
            //* Notificar por socket actualización de la tanda
            await this.movimientosSocketService.notifyTandaDiscount(tanda)
            //* Notificar por socket movimiento asignado a EnvioCategoria
            await this.planificacionSocketService.notifyEnvioUpdate()

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
}
