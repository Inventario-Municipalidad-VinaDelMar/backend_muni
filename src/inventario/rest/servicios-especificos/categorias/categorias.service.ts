import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { Categoria } from 'src/inventario/entities';
import { CreateCategoriaDto } from 'src/inventario/dto/rest-dto';

@Injectable()
export class CategoriasService extends BaseService<Categoria> {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {
        super(categoriaRepository, 'CategoriasService');
    }


    async createCategoria(createCategoriaDto: CreateCategoriaDto) {
        try {
            const categoriaCreated = this.categoriaRepository.create({
                ...createCategoriaDto,
            });
            const categoria = await this.categoriaRepository.save(categoriaCreated);
            return categoria;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findOneById(id: string) {
        try {
            const categoria = await this.categoriaRepository.findOne({ where: { id }, });
            if (!categoria) {
                throw new NotFoundException(`Categoria with ID ${id} not found`);
            }
            return categoria;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }






}
