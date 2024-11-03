import { AfterUpdate, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EnvioProducto } from "./envio-producto.entity";
import { SolicitudEnvio } from "src/planificacion/entities/solicitud-envio.entity";
import { Entrega } from "src/logistica/entregas/entities/entrega.entity";
import { normalizeDates } from "src/utils";

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

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    horaCreacion: string;

    @Column({ type: 'time', nullable: true })
    horaInicioEnvio?: string;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    ultimaActualizacion: string;

    @Column({ type: 'time', nullable: true })
    horaFinalizacion?: string;

    @Column({ type: 'enum', enum: EnvioStatus, default: EnvioStatus.SIN_CARGAR, })
    status: EnvioStatus;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => EnvioProducto, (envioProducto) => envioProducto.envio, { eager: true, })
    productosPlanificados: EnvioProducto[]

    @OneToMany(() => Entrega, (entrega) => entrega.envio)
    entregas: Entrega[];

    @OneToOne(() => SolicitudEnvio, (solicitud) => solicitud.envioAsociado, { cascade: ['remove'] })
    @JoinColumn()
    solicitud: SolicitudEnvio;

    // Guardar hora de inicio del envío cuando cambia a EN_ENVIO
    // @AfterUpdate()
    @BeforeUpdate()
    setHoraInicioEnvio() {
        if (this.status === EnvioStatus.EN_ENVIO && !this.horaInicioEnvio) {
            this.horaInicioEnvio = normalizeDates.getCurrentTime();  // Asignar hora actual
        }
    }
    @BeforeUpdate()
    setUltimaActualizacion() {
        this.ultimaActualizacion = normalizeDates.getCurrentTime();  // Asignar hora actual
    }
}
