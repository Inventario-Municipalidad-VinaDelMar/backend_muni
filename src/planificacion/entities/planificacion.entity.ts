import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanificacionDetalle } from "./planificacion-detalle.entity";

@Entity()
export class Planificacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => PlanificacionDetalle, (planificacionDetalle) => planificacionDetalle.planificacionDiaria, { eager: true })
    detalles: PlanificacionDetalle[];
}
