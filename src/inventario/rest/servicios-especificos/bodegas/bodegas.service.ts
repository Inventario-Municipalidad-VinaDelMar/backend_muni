import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { Bodega } from 'src/inventario/entities';
import { CreateBodegaDto } from 'src/inventario/dto/rest-dto';
import { UpdateBodegaDto } from '../../../dto/rest-dto/bodega-dto/update-bodega.dto';

@Injectable()
export class BodegasService extends BaseService<Bodega> {
    constructor(
        @InjectRepository(Bodega)
        private readonly bodegaRepository: Repository<Bodega>,

    ) {
        super(bodegaRepository, 'BodegasService');
    }
    async createBodega(createBodegaDto: CreateBodegaDto) {
        try {
            const bodegaCreated = this.bodegaRepository.create({
                ...createBodegaDto,
            });
            const bodega = await this.bodegaRepository.save(bodegaCreated);
            return bodega;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async updateBodega(idBodega: string, updateBodegaDto: UpdateBodegaDto) {
        try {
            const bodegaData = await this.findOneById(idBodega);
            for (const [key, value] of Object.entries(updateBodegaDto)) {
                if (value !== undefined) {

                    bodegaData[key] = value;

                }
            }
            const bodega = await this.bodegaRepository.save(bodegaData);
            return bodega;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async deleteBodega(idBodega: string,) {
        try {
            const bodega = await this.findOneById(idBodega);
            bodega.isDeleted = true;
            return await this.bodegaRepository.save(bodega);
            // return bodega;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findOneById(id: string) {
        try {
            const bodega = await this.bodegaRepository.findOne({ where: { id }, });
            if (!bodega) {
                throw new NotFoundException(`Bodega with ID ${id} not found`);
            }
            return bodega;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }


}
