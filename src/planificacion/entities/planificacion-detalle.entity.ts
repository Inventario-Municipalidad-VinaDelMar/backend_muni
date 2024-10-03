import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Planificacion } from "./planificacion.entity";
import { Producto } from "src/inventario/entities";

@Entity()
export class PlanificacionDetalle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cantidadPlanificada: number;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Planificacion, (planificacion) => planificacion.detalles)
    planificacionDiaria: Planificacion

    @ManyToOne(() => Producto, (producto) => producto.planificacionDetalles, { eager: true })
    producto: Producto;

}
