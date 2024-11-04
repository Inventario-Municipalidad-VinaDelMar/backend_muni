import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnvioProducto } from "./envio-producto.entity";
import { IncidenteEnvio } from "./incidente-envio.entity";
import { Producto } from "src/inventario/entities";

export enum IncidenteType {
    CHOQUE = 'Choque',
    ROBO = 'Robo',
    EXTRAVIO = 'Extravio',
}


@Entity()
export class IncidenteProducto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cantidadAfectada: number;

    @ManyToOne(() => Producto, (producto) => producto.incidentes, { eager: true })
    producto: Producto;

    @ManyToOne(() => IncidenteEnvio, (incidenteEnvio) => incidenteEnvio.productosAfectados, { eager: true })
    incidente: IncidenteEnvio;

}
