

import { User } from "src/auth/entities/user.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ComedorSolidario } from "./comedor-solidario.entity";
import { Entrega } from "./entrega.entity";
import { Producto } from "src/inventario/entities";


@Entity()
export class EntregaDetalle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    cantidadEntregada: number;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Entrega, (entrega) => entrega.detallesEntrega, { eager: true, })
    entrega: Entrega;

    @ManyToOne(() => Producto, (producto) => producto.entregas, { eager: true, })
    producto: Producto;

}
