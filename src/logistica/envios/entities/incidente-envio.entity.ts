import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IncidenteProducto } from "./incidente-producto.entity";
import { Envio } from "./envio.entity";

export enum IncidenteType {
    CHOQUE = 'Choque',
    ROBO = 'Robo',
    EXTRAVIO = 'Extravio',
    DANIO = 'Daño',
    CONTAMINACION = 'Contaminacion',
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

    @Column({ nullable: true })
    evidenciaFotograficaUrl?: string;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => IncidenteProducto, (incidenteProducto) => incidenteProducto.incidente)
    productosAfectados: IncidenteProducto[]

    @ManyToOne(() => Envio, (envio) => envio.incidentes, { eager: true, onDelete: 'CASCADE' })
    envio: Envio;

}
