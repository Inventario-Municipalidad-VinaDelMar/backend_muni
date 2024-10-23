import { Entrega } from 'src/logistica/entregas/entities/entrega.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { SolicitudEnvio } from 'src/planificacion/entities/solicitud-envio.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

//?Roles: Bodeguero, Administrador, Externo, Cargador


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    rut: string;

    @Column({ unique: true })
    email: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellidoPaterno: string;

    @Column('text')
    apellidoMaterno: string;

    @Column('text', { nullable: true })
    imageUrl: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['externo'],
    })
    roles: string[];

    @OneToMany(() => SolicitudEnvio, (solicitudEnvio) => solicitudEnvio.solicitante, { cascade: ['remove'] })
    solicitudesRealizadas: SolicitudEnvio;  // Usuario que crea la solicitud desde la app móvil

    @OneToMany(() => SolicitudEnvio, (solicitudEnvio) => solicitudEnvio.administrador, { cascade: ['remove'] })
    solicitudesAutorizadas: SolicitudEnvio;  // Administrador que autoriza o rechaza la solicitud

    @OneToMany(() => Movimiento, (movimiento) => movimiento.realizador, { cascade: ['remove'] })
    movimientos: Movimiento[];  // Administrador que autoriza o rechaza la solicitud

    @OneToMany(() => Entrega, (entrega) => entrega.copiloto, { cascade: ['remove'] })
    entregasRealizadas: Entrega[]; //Entregas que realizo un usuario a comedores solidarios

}
