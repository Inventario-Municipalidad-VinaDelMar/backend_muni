import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnvioCategoria } from "./envio-categoria.entity";
import { normalizeDates } from "src/utils";

export enum EnvioStatus {
    SIN_CARGAR = 'Sin Cargar',
    CARGANDO = 'Cargando',
    EN_ENVIO = 'En envío',
    FINALIZADO = 'Finalizado',
}


@Entity()
export class Envio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column({ type: 'time', default: normalizeDates.getHoraInicioChile() })
    // @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    horaInicio: string;

    @Column({ type: 'time', nullable: true })
    horaFinalizacion?: string;

    @Column({ type: 'enum', enum: EnvioStatus, default: EnvioStatus.SIN_CARGAR, })
    status: EnvioStatus;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => EnvioCategoria, (envioCategoria) => envioCategoria.envio, { eager: true, })
    categoriasPlanificadas: EnvioCategoria[]
}
