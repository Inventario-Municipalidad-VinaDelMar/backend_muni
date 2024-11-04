import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnvioProducto } from "./envio-producto.entity";
import { IncidenteProducto } from "./incidente-producto.entity";
import { Envio } from "./envio.entity";

export enum IncidenteType {
    CHOQUE = 'Choque',
    ROBO = 'Robo',
    EXTRAVIO = 'Extravio',
}


@Entity()
export class IncidenteEnvio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    hora: string;

    @Column()
    descripcion: string;

    @Column({ type: 'enum', enum: IncidenteType })
    type: IncidenteType;

    @Column()
    evidenciaFotograficaUrl: string;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => IncidenteProducto, (incidenteProducto) => incidenteProducto.incidente)
    productosAfectados: IncidenteProducto[]

    @ManyToOne(() => Envio, (envio) => envio.incidentes, { eager: true, onDelete: 'CASCADE' })
    envio: Envio;

}
