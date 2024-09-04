import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tanda } from "./tanda.entity";
import { Producto } from "./producto.entity";
import { PlanificacionDetalle } from "src/planificacion/entities/planificacion-detalle.entity";
import { EnvioCategoria } from "src/logistica/envios/entities/envio-categoria.entity";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    urlImagen: string;

    //This is soft delete
    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Tanda, (tanda) => tanda.categoria)
    tandas: Tanda[];

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];


    //Relacion con la seccion de "planificacion"
    @OneToMany(() => PlanificacionDetalle, (planificacionDetalle) => planificacionDetalle.categoria)
    planificacionDetalles: PlanificacionDetalle[];

    //Relacion con la seccion de "logistica"
    @OneToMany(() => EnvioCategoria, (envioCategoria) => envioCategoria.categoria)
    envios: EnvioCategoria[]
}