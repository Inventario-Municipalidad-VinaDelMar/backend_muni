import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { Producto } from 'src/inventario/entities';
import { CreateProductoDto } from 'src/inventario/dto/rest-dto';
import { CategoriasService } from '../categorias/categorias.service';

@Injectable()
export class ProductosService extends BaseService<Producto> {
    constructor(
        private readonly categoriaService: CategoriasService,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) {
        super(productoRepository, 'ProductosService');
    }
    async createProducto(createProductoDto: CreateProductoDto) {
        try {
            const { idCategoria } = createProductoDto;
            const categoria = await this.categoriaService.findOneById(idCategoria);
            const productoCreated = this.productoRepository.create({
                ...createProductoDto,
                categoria
            });
            const producto = await this.productoRepository.save(productoCreated);
            return producto;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findOneById(id: string) {
        try {
            const producto = await this.productoRepository.findOne({ where: { id }, });
            if (!producto) {
                throw new NotFoundException(`Producto with ID ${id} not found`);
            }
            return producto;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }

    async findMany() {
        try {
            const productosData = await this.productoRepository.find({
                where: {
                    isDeleted: false,
                },
                relations: ['categoria']
            })

            // if (productosData.length === 0) {
            // return [];
            // //throw new NotFoundException(`No products found matching "${nameSuggest}"`);
            // }
            const productos = productosData.map(p => {
                delete p.barcode;
                delete p.descripcion;
                delete p.isDeleted;
                delete p.urlImagen;

                return {
                    ...p,
                    categoria: {
                        id: p.categoria.id,
                        nombre: p.categoria.nombre,
                        urlImagen: p.categoria.urlImagen,
                    }
                };
            })
            return productos;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }






}
