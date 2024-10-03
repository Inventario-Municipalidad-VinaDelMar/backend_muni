import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Envio } from "./envio.entity";
// import { Categoria } from "src/inventario/entities";
import { Movimiento } from "src/movimientos/entities/movimiento.entity";
import { Producto } from "src/inventario/entities";

@Entity()
export class EnvioProducto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //? se reemplaza por verificar si se tiene un movimiento o no
    // @Column({ default: false })
    // isComplete: boolean; 

    @Column()
    cantidadPlanificada: number;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Envio, (envio) => envio.productosPlanificados)
    envio: Envio;

    @ManyToOne(() => Producto, (producto) => producto.envios, { eager: true })
    producto: Producto;

    // Relación opcional con Movimiento
    @OneToOne(() => Movimiento, (movimiento) => movimiento.envioProducto, { nullable: true, eager: true, cascade: ['remove'] })
    @JoinColumn()
    movimiento?: Movimiento;
}
