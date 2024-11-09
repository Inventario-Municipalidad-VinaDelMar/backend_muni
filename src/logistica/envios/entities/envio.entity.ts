import { AfterUpdate, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EnvioProducto } from "./envio-producto.entity";
import { SolicitudEnvio } from "src/planificacion/entities/solicitud-envio.entity";
import { Entrega } from "src/logistica/entregas/entities/entrega.entity";
import { normalizeDates } from "src/utils";
import { IncidenteEnvio } from "./incidente-envio.entity";

export enum EnvioStatus {
    SIN_CARGAR = 'Sin cargar',
    CARGANDO = 'Cargando',
    CARGA_COMPLETA = 'Carga completa',
    EN_ENVIO = 'En envio',
    FINALIZADO = 'Finalizado',
}


@Entity()
export class Envio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    horaCreacion: Date;

    @Column({ type: 'timestamp', nullable: true })
    horaInicioEnvio?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    ultimaActualizacion: Date;

    @Column({ type: 'timestamp', nullable: true })
    horaFinalizacion?: Date;

    @Column({ type: 'enum', enum: EnvioStatus, default: EnvioStatus.SIN_CARGAR, })
    status: EnvioStatus;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => EnvioProducto, (envioProducto) => envioProducto.envio, { eager: true, })
    productosPlanificados: EnvioProducto[]

    @OneToMany(() => Entrega, (entrega) => entrega.envio)
    entregas: Entrega[];

    @OneToMany(() => IncidenteEnvio, (incidenteEnvio) => incidenteEnvio.envio, { cascade: ['remove'] })
    incidentes: IncidenteEnvio[];

    @OneToOne(() => SolicitudEnvio, (solicitud) => solicitud.envioAsociado, { cascade: ['remove'] })
    @JoinColumn()
    solicitud: SolicitudEnvio;

    // Guardar hora de inicio del envío cuando cambia a EN_ENVIO
    // @AfterUpdate()
    @BeforeUpdate()
    setHoraInicioEnvio() {
        if (this.status === EnvioStatus.EN_ENVIO && !this.horaInicioEnvio) {
            this.horaInicioEnvio = normalizeDates.getCurrentTimestamp();  // Asignar hora actual
            // this.horaInicioEnvio = normalizeDates.getCurrentTime();  // Asignar hora actual
        }
    }
    @BeforeUpdate()
    setHoraFinalizacionEnvio() {
        if (this.status === EnvioStatus.FINALIZADO && !this.horaFinalizacion) {
            this.horaFinalizacion = normalizeDates.getCurrentTimestamp();  // Asignar hora actual
        }
    }
    @BeforeUpdate()
    setUltimaActualizacion() {
        this.ultimaActualizacion = normalizeDates.getCurrentTimestamp();  // Asignar hora actual
    }
}
