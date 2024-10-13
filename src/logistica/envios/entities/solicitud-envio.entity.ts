import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Envio } from './envio.entity';

export enum SolicitudEnvioStatus {
    PENDIENTE = 'Pendiente',
    ACEPTADA = 'Aceptada',
    RECHAZADA = 'Rechazada',
    EXPIRADA = 'Expirada'
}

@Entity()
export class SolicitudEnvio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fechaSolicitud: Date;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    horaSolicitud: string;

    @Column({ type: 'time', nullable: true })
    horaAutorizacion?: string;

    @Column({ type: 'enum', enum: SolicitudEnvioStatus, default: SolicitudEnvioStatus.PENDIENTE })
    status: SolicitudEnvioStatus;

    //TODO: Habilitar cuando se empieza a usar la autenticacion

    // @ManyToOne(() => User, (user) => user.solicitudesRealizadas, { eager: true })
    // solicitante: User;  // Usuario que crea la solicitud desde la app móvil

    // @ManyToOne(() => User, (user) => user.solicitudesAutorizadas, { eager: true, nullable: true })
    // administrador?: User;  // Administrador que autoriza o rechaza la solicitud

    @ManyToOne(() => Envio, { nullable: true })
    envioAsociado?: Envio;  // Referencia al envío que se crea si se acepta la solicitud

    @Column({ default: false })
    isDeleted: boolean;
}
