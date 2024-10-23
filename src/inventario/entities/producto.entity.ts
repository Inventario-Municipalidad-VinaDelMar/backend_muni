import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tanda } from "./tanda.entity";
import { PlanificacionDetalle } from "src/planificacion/entities/planificacion-detalle.entity";
import { EnvioProducto } from "src/logistica/envios/entities/envio-producto.entity";
import { Entrega } from "src/logistica/entregas/entities/entrega.entity";
import { EntregaDetalle } from "src/logistica/entregas/entities/entrega-detalle.entity";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ nullable: true })
    barcode?: string;

    @Column({ nullable: true })
    descripcion?: string;

    @Column({ nullable: true })
    urlImagen?: string;

    //This is soft delete
    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Tanda, (tanda) => tanda.producto)
    tandas: Tanda[];

    //Relacion con la seccion de "planificacion"
    @OneToMany(() => PlanificacionDetalle, (planificacionDetalle) => planificacionDetalle.producto)
    planificacionDetalles: PlanificacionDetalle[];

    //Relacion con la seccion de "logistica"
    @OneToMany(() => EnvioProducto, (envioProducto) => envioProducto.producto)
    envios: EnvioProducto[]

    @OneToMany(() => EntregaDetalle, (detalleEntrega) => detalleEntrega.producto,)
    entregas: EntregaDetalle;
}