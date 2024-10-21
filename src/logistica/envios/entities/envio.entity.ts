import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EnvioProducto } from "./envio-producto.entity";
import { SolicitudEnvio } from "src/planificacion/entities/solicitud-envio.entity";

export enum EnvioStatus {
    SIN_CARGAR = 'Sin Cargar',
    CARGANDO = 'Cargando',
    EN_ENVIO = 'En envio',
    FINALIZADO = 'Finalizado',
}


@Entity()
export class Envio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    // @Column({ type: 'time', default: normalizeDates.getHoraInicioChile() })
    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    horaInicio: string;

    @Column({ type: 'time', nullable: true })
    horaFinalizacion?: string;

    @Column({ type: 'enum', enum: EnvioStatus, default: EnvioStatus.SIN_CARGAR, })
    status: EnvioStatus;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => EnvioProducto, (envioProducto) => envioProducto.envio, { eager: true, })
    productosPlanificados: EnvioProducto[]

    @OneToOne(() => SolicitudEnvio, (solicitud) => solicitud.envioAsociado, { cascade: ['remove'] })
    @JoinColumn()
    solicitud: SolicitudEnvio;
}
