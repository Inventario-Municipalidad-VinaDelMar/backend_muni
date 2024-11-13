import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { Producto } from 'src/inventario/entities';
import { CreateProductoDto, UpdateProductoDto } from 'src/inventario/dto/rest-dto';

@Injectable()
export class ProductosService extends BaseService<Producto> {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) {
        super(productoRepository, 'ProductosService');
    }
    async createProducto(createProductoDto: CreateProductoDto) {
        try {
            const productoCreated = this.productoRepository.create({
                ...createProductoDto,
            });
            const producto = await this.productoRepository.save(productoCreated);
            return producto;
        } catch (error) {
            console.log({ createProductoDto })
            this.handleDbExceptions(error);
        }
    }
    async updateProducto(idProducto: string, updateProductoDto: UpdateProductoDto) {
        try {
            const productoData = await this.findOneById(idProducto)
            for (const [key, value] of Object.entries(updateProductoDto)) {
                if (value !== undefined) {

                    productoData[key] = value;


                }
            }
            const producto = await this.productoRepository.save(productoData);
            return producto;
        } catch (error) {
            // console.log({ createProductoDto })
            this.handleDbExceptions(error);
        }
    }
    async deleteProducto(idProducto: string) {
        try {
            const productoData = await this.findOneById(idProducto);
            productoData.isDeleted = true;
            const producto = await this.productoRepository.save(productoData);
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
            throw error;
            // this.handleDbExceptions(error);
        }
    }

    async findMany() {
        try {
            const productosData = await this.productoRepository.find({
                where: {
                    isDeleted: false,
                },
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
                };
            })
            return productos;
        } catch (error) {
            this.handleDbExceptions(error);
        }
    }






}
