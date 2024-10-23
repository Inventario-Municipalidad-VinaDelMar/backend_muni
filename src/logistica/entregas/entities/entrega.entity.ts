import { User } from "src/auth/entities/user.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ComedorSolidario } from "./comedor-solidario.entity";
import { EntregaDetalle } from "./entrega-detalle.entity";


@Entity()
export class Entrega {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    hora: string;

    @Column({ nullable: true })
    url_acta_legal?: string;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => ComedorSolidario, (comedorSolidario) => comedorSolidario.entregas, { eager: true, })
    comedorSolidario: ComedorSolidario;

    @ManyToOne(() => Envio, (envio) => envio.entregas, { eager: true, })
    envio: Envio;

    @ManyToOne(() => User, (user) => user.entregasRealizadas, { eager: true, })
    copiloto: User;

    @OneToMany(() => EntregaDetalle, (detalleEntrega) => detalleEntrega.entrega)
    detallesEntrega: EntregaDetalle[];

}
