import { Injectable } from '@nestjs/common';
import { BodegasService } from 'src/inventario/rest/servicios-especificos/bodegas/bodegas.service';
import { CategoriasService } from 'src/inventario/rest/servicios-especificos/categorias/categorias.service';
import { ProductosService } from 'src/inventario/rest/servicios-especificos/productos/productos.service';
import { TandasService } from 'src/inventario/rest/servicios-especificos/tandas/tandas.service';
import { UbicacionesService } from 'src/inventario/rest/servicios-especificos/ubicaciones/ubicaciones.service';
import { initialData } from './data/seed-data';
import { PlanificacionService } from 'src/planificacion/rest/planificacion.service';
import { EnviosService } from 'src/logistica/envios/envios.service';
import { MovimientosService } from 'src/movimientos/rest/movimientos.service';

@Injectable()
export class SeedService {
    constructor(
        private readonly enviosService: EnviosService,
        private readonly movimientoService: MovimientosService,
        private readonly planificacionService: PlanificacionService,
        private readonly productoService: ProductosService,
        private readonly categoriaService: CategoriasService,
        private readonly bodegasService: BodegasService,
        private readonly ubicacionesService: UbicacionesService,
        private readonly tandasService: TandasService,

    ) { }
    async runSeed() {
        await this.deleteTables();
        const bodega = await this.insertNewBodegas();
        await this.insertNewCategorias();
        await this.insertNewProductos();
        await this.insertNewUbicaciones(bodega.id);
        await this.insertNewTandas();
        await this.insetNewPlanificaciones();
        return 'Seed Executed';
    }

    private async deleteTables() {
        await this.movimientoService.deleteAll();
        await this.enviosService.deleteAll();
        await this.planificacionService.deleteAll();
        await this.tandasService.deleteAll();
        await this.ubicacionesService.deleteAll();
        await this.productoService.deleteAll();
        await this.categoriaService.deleteAll();
        await this.bodegasService.deleteAll();

    }
    private async insetNewPlanificaciones() {
        const seedPlanificacion = initialData.planificaciones;
        // Obtener todas las categorías creadas
        const categorias = await this.categoriaService.findAll();

        // Mapeo de nombre de categoría a ID de categoría
        const categoriaMap = new Map(categorias.map(cat => [cat.nombre.toLowerCase(), cat.id]));
        const planificacionPromises = seedPlanificacion.map(async (p) => {
            p.detalles = p.detalles.map(d => {
                return {
                    ...d,
                    categoria: categoriaMap.get(d.categoria.toLowerCase()),
                }
            });
            return await this.planificacionService.create(p);
        });

        await Promise.all(planificacionPromises);
    }

    private async insertNewBodegas() {
        const seedBodega = initialData.bodegas;

        const bodegaPromises = seedBodega.map((bodega) =>
            this.bodegasService.createBodega({
                ...bodega,
            })
        );

        const bodegas = await Promise.all(bodegaPromises);
        const primeraBodega = bodegas[0];
        return primeraBodega;
    }
    private async insertNewCategorias() {
        const seedCategoria = initialData.categorias;

        const categoriaPromises = seedCategoria.map((categoria) =>
            this.categoriaService.createCategoria({
                ...categoria,
            })
        );

        await Promise.all(categoriaPromises);
    }
    private async insertNewProductos() {
        const seedProductos = initialData.productos;

        // Obtener todas las categorías creadas
        const categorias = await this.categoriaService.findAll();

        // Mapeo de nombre de categoría a ID de categoría
        const categoriaMap = new Map(categorias.map(cat => [cat.nombre.toLowerCase(), cat.id]));

        // Creación de productos con la categoría correcta
        const productoPromises = seedProductos.map(async (producto) => {
            const categoriaId = categoriaMap.get(producto.categoriaNombre.toLowerCase());

            if (!categoriaId) {
                throw new Error(`Categoría no encontrada para el producto: ${producto.nombre}`);
            }

            await this.productoService.createProducto({
                ...producto,
                idCategoria: categoriaId,
            });
        });

        await Promise.all(productoPromises);
    }

    private async insertNewUbicaciones(idBodega: string) {
        const seedUbicaciones = initialData.ubicaciones;

        const ubicacionPromises = seedUbicaciones.map((ubicacion) =>
            this.ubicacionesService.createUbicacion({
                ...ubicacion,
                idBodega,
            })
        );
        await Promise.all(ubicacionPromises);
    }

    private async insertNewTandas() {
        const seedTandas = initialData.tandas;

        const productos = await this.productoService.findAll();
        const categorias = await this.categoriaService.findAll();
        const bodegas = await this.bodegasService.findAll();
        const ubicaciones = await this.ubicacionesService.findAll();

        const tandaPromises = seedTandas.map(async (seedTanda) => {
            const producto = productos.find(p => p.nombre === seedTanda.productoNombre);
            const categoria = categorias.find(c => c.nombre === seedTanda.categoriaNombre);
            const bodega = bodegas.find(b => b.nombre === seedTanda.bodegaNombre);
            const ubicacion = ubicaciones.find(u => u.descripcion === seedTanda.ubicacionNombre);

            if (!producto || !categoria || !bodega || !ubicacion) {
                console.error(`No se encontró alguna entidad para la tanda: ${JSON.stringify(seedTanda)}`);
                return;
            }

            await this.tandasService.createTanda({
                cantidadIngresada: seedTanda.cantidadIngresada,
                fechaVencimiento: seedTanda.fechaVencimiento,
                cantidadActual: seedTanda.cantidadIngresada,
                producto,
                categoria,
                bodega,
                ubicacion,
            });
        });

        await Promise.all(tandaPromises);
    }


}
