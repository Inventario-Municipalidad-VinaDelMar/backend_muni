import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { Ubicacion } from 'src/inventario/entities';
import { CreateUbicacionDto } from 'src/inventario/dto/rest-dto';
import { BodegasService } from '../bodegas/bodegas.service';

@Injectable()
export class UbicacionesService extends BaseService<Ubicacion> {
    constructor(

        private readonly bodegasService: BodegasService,

        @InjectRepository(Ubicacion)
        private readonly ubicacionRepository: Repository<Ubicacion>,

    ) {

        super(ubicacionRepository, 'UbicacionesService');
    }

    async createUbicacion(createUbicacionDto: CreateUbicacionDto) {
        try {
            const { idBodega } = createUbicacionDto;
            const ubicacionCreated = this.ubicacionRepository.create({
                ...createUbicacionDto,
                bodega: this.bodegasService.generateClass(idBodega),
            });
            const ubicacion = await this.ubicacionRepository.save(ubicacionCreated);
            return ubicacion;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findOneById(id: string) {
        try {
            const ubicacion = await this.ubicacionRepository.findOne({ where: { id }, });
            if (!ubicacion) {
                throw new NotFoundException(`Ubicacion with ID ${id} not found`);
            }
            return ubicacion;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findAllByBodega(id: string) {
        try {
            const ubicaciones = await this.ubicacionRepository.find({
                where: {
                    isDeleted: false,
                    bodega: {
                        id,
                    }
                }
            });

            return ubicaciones.map(u => {
                delete u.isDeleted;
                return u;
            });
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }




}
