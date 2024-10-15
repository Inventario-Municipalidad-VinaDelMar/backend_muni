import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate } from 'typeorm';
import { Envio } from '../../logistica/envios/entities/envio.entity';
import { User } from 'src/auth/entities/user.entity';

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
    horaResolucion?: string;

    @Column({ type: 'enum', enum: SolicitudEnvioStatus, default: SolicitudEnvioStatus.PENDIENTE })
    status: SolicitudEnvioStatus;

    //TODO: Habilitar cuando se empieza a usar la autenticacion

    @ManyToOne(() => User, (user) => user.solicitudesRealizadas, { eager: true })
    solicitante: User;  // Usuario que crea la solicitud desde la app móvil

    @ManyToOne(() => User, (user) => user.solicitudesAutorizadas, { eager: true, nullable: true })
    administrador?: User;  // Administrador que autoriza o rechaza la solicitud

    @ManyToOne(() => Envio, { nullable: true, })
    envioAsociado?: Envio;  // Referencia al envío que se crea si se acepta la solicitud

    @Column({ default: false })
    isDeleted: boolean;

    @BeforeUpdate()
    setHoraAutorizacion() {
        if (!this.horaResolucion) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

            this.horaResolucion = `${hours}:${minutes}:${seconds}.${milliseconds}000`;
        }
    }
}
