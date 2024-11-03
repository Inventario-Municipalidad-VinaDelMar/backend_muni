import { Injectable } from '@nestjs/common';
import { BodegasService } from 'src/inventario/rest/servicios-especificos/bodegas/bodegas.service';
// import { CategoriasService } from 'src/inventario/rest/servicios-especificos/categorias/categorias.service';
import { ProductosService } from 'src/inventario/rest/servicios-especificos/productos/productos.service';
import { TandasService } from 'src/inventario/rest/servicios-especificos/tandas/tandas.service';
import { UbicacionesService } from 'src/inventario/rest/servicios-especificos/ubicaciones/ubicaciones.service';
import { initialData, SeedPlanificacion } from './data/seed-data';
import { PlanificacionService } from 'src/planificacion/rest/planificacion.service';
import { EnviosService } from 'src/logistica/envios/rest/envios.service';
import { weekDates } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { EntregasService } from 'src/logistica/entregas/rest/entregas.service';
import { Envio, EnvioStatus } from 'src/logistica/envios/entities/envio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitudEnvio, SolicitudEnvioStatus } from 'src/planificacion/entities/solicitud-envio.entity';
import { Repository } from 'typeorm';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
// import { MovimientosService } from 'src/movimientos/rest/movimientos.service';
import { PlanificacionDetalle } from '../planificacion/entities/planificacion-detalle.entity';
import { EnvioProducto } from 'src/logistica/envios/entities/envio-producto.entity';
import { Movimiento, MovimientoType } from 'src/movimientos/entities/movimiento.entity';
import { Tanda } from 'src/inventario/entities';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Tanda)
        private readonly tandaRepository: Repository<Tanda>,
        @InjectRepository(Envio)
        private readonly envioRepository: Repository<Envio>,
        @InjectRepository(EnvioProducto)
        private readonly envioProductoRepository: Repository<EnvioProducto>,
        @InjectRepository(SolicitudEnvio)
        private readonly solicitudEnvioRepository: Repository<SolicitudEnvio>,
        @InjectRepository(PlanificacionDetalle)
        private readonly planificacionDetalleRepository: Repository<PlanificacionDetalle>,
        @InjectRepository(Movimiento)
        private readonly movimientoRepository: Repository<Movimiento>,

        private readonly entregasService: EntregasService,
        private readonly enviosService: EnviosService,
        // private readonly movimientoService: MovimientosService,
        private readonly planificacionService: PlanificacionService,
        private readonly productoService: ProductosService,
        // private readonly categoriaService: CategoriasService,
        private readonly bodegasService: BodegasService,
        private readonly ubicacionesService: UbicacionesService,
        private readonly tandasService: TandasService,
        private readonly authService: AuthService,

    ) { }
    async runSeed() {
        try {
            await this.deleteTables();
            const { user1, user2 } = await this.insertNewUsers();
            const bodega = await this.insertNewBodegas();
            // await this.insertNewCategorias();
            await this.insertNewProductos();
            await this.insertNewUbicaciones(bodega.id);
            await this.insertNewTandas();
            const planificaciones = await this.insertNewPlanificaciones();
            await this.insertNewEnvios(user1, user2, planificaciones);
            await this.insertNewComedores();
            return 'Seed Executed';
        } catch (error) {
            throw error;
        }
    }

    private async deleteTables() {
        // await this.movimientoService.deleteAll(); --> Se borra con cascade
        await this.entregasService.deleteAll();
        await this.enviosService.deleteAll();
        await this.planificacionService.deleteAll();
        await this.tandasService.deleteAll();
        await this.ubicacionesService.deleteAll();
        await this.productoService.deleteAll();
        // await this.categoriaService.deleteAll();
        await this.bodegasService.deleteAll();
        await this.authService.deleteAll();

    }
    private async insertNewEnvios(userNormal: User, userAdmin: User, planificaciones: Planificacion[]) {
        const datesSemana = weekDates.getCurrentWeekDates();

        datesSemana.forEach(async (fecha, i) => {
            const solicitudData = this.solicitudEnvioRepository.create({
                administrador: userAdmin,
                solicitante: userNormal,
                status: SolicitudEnvioStatus.ACEPTADA,
                fechaSolicitud: planificaciones[i].fecha,
            });
            const solicitud = await this.solicitudEnvioRepository.save(solicitudData)

            const envioData = this.envioRepository.create({
                fecha,
                solicitud,
            });

            const envio = await this.envioRepository.save(envioData);
            solicitud.envioAsociado = envio;
            await this.solicitudEnvioRepository.save(solicitud)
            const detalles = await this.planificacionDetalleRepository.find({
                where: {
                    planificacionDiaria: {
                        id: planificaciones[i].id,
                    }
                }
            })
            const detallesData = detalles.map(d => {
                return this.envioProductoRepository.create({
                    cantidadPlanificada: d.cantidadPlanificada,
                    producto: this.productoService.generateClass(d.producto.id),
                    envio,
                })
            })
            const productosPlanificados = await this.envioProductoRepository.save(detallesData);
            productosPlanificados.forEach(async (producto, i) => {
                const tandas = await this.tandaRepository.find({
                    where: {
                        producto: {
                            id: producto.producto.id,
                        },
                    }
                });
                const movimientoData = this.movimientoRepository.create({
                    cantidadRetirada: 10,
                    envioProducto: producto,
                    realizador: userNormal,
                    type: MovimientoType.RETIRO,
                    tanda: tandas[0],
                });

                const movimento = await this.movimientoRepository.save(movimientoData);
                producto.movimiento = movimento;
                await this.envioProductoRepository.save(producto);

            });
            envio.status = EnvioStatus.EN_ENVIO;
            await this.envioRepository.save(envio);
        });


    }

    private async insertNewUsers() {
        const seedUsers = initialData.users;
        const usersPromises = [];

        seedUsers.forEach((user) => {
            usersPromises.push(
                this.authService.create({
                    ...user as CreateUserDto,
                }),
            );
        });

        const users = await Promise.all(usersPromises);
        return {
            user1: users[1],
            user2: users[2],
        }
    }
    private async insertNewComedores() {
        const seedComedores = initialData.comedores;
        const comedoresPromises = [];
        seedComedores.map((comedor) => {
            comedoresPromises.push(this.entregasService.createNewComedor({
                ...comedor
            }))
        })
        await Promise.all(comedoresPromises);
    }
    private async insertNewPlanificaciones() {
        try {
            const datesSemana = weekDates.getCurrentWeekDates();
            const seedPlanificacion = JSON.parse(JSON.stringify(initialData.planificaciones)) as SeedPlanificacion[];
            seedPlanificacion.forEach((plan, index) => {
                if (datesSemana[index]) {
                    plan.fecha = datesSemana[index];  // Asigna la fecha de la semana actual
                }
            });
            const productos = await this.productoService.findAll();
            const productoMap = new Map(productos.map(prod => [prod.nombre.toLowerCase(), prod.id]));

            const planificacionPromises = seedPlanificacion.map(async (p) => {
                p.detalles = p.detalles.map(d => {
                    return {
                        ...d,
                        producto: productoMap.get(d.producto.toLowerCase()),
                    }
                });
                return await this.planificacionService.create(p);
            });

            return await Promise.all(planificacionPromises);
        } catch (error) {
            console.log({ error })
        }
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
    // private async insertNewCategorias() {
    //     const seedCategoria = initialData.categorias;

    //     const categoriaPromises = seedCategoria.map((categoria) =>
    //         this.categoriaService.createCategoria({
    //             ...categoria,
    //         })
    //     );

    //     await Promise.all(categoriaPromises);
    // }
    private async insertNewProductos() {
        const seedProductos = initialData.productos;

        // Obtener todas las categorías creadas
        // const categorias = await this.categoriaService.findAll();

        // Mapeo de nombre de categoría a ID de categoría
        // const categoriaMap = new Map(categorias.map(cat => [cat.nombre.toLowerCase(), cat.id]));

        // Creación de productos con la categoría correcta
        const productoPromises = seedProductos.map(async (producto) => {
            // const categoriaId = categoriaMap.get(producto.categoriaNombre.toLowerCase());

            // if (!categoriaId) {
            //     throw new Error(`Categoría no encontrada para el producto: ${producto.nombre}`);
            // }

            await this.productoService.createProducto({
                ...producto,
                // idCategoria: categoriaId,
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
        // const categorias = await this.categoriaService.findAll();
        const bodegas = await this.bodegasService.findAll();
        const ubicaciones = await this.ubicacionesService.findAll();

        const tandaPromises = seedTandas.map(async (seedTanda) => {
            const producto = productos.find(p => p.nombre === seedTanda.productoNombre);
            const bodega = bodegas.find(b => b.nombre === seedTanda.bodegaNombre);
            const ubicacion = ubicaciones.find(u => u.descripcion === seedTanda.ubicacionNombre);

            if (!producto || !bodega || !ubicacion) {
                console.error(`No se encontró alguna entidad para la tanda: ${JSON.stringify(seedTanda)}`);
                return;
            }

            await this.tandasService.createTanda({
                cantidadIngresada: seedTanda.cantidadIngresada,
                fechaVencimiento: seedTanda.fechaVencimiento,
                cantidadActual: seedTanda.cantidadIngresada,
                producto,
                // categoria,
                bodega,
                ubicacion,
            });
        });

        await Promise.all(tandaPromises);
    }


}
