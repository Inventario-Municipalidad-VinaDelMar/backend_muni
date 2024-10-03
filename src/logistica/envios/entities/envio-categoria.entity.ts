import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Envio } from "./envio.entity";
import { Categoria } from "src/inventario/entities";
import { Movimiento } from "src/movimientos/entities/movimiento.entity";

@Entity()
export class EnvioCategoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //? se reemplaza por verificar si se tiene un movimiento o no
    // @Column({ default: false })
    // isComplete: boolean; 

    @Column()
    cantidadPlanificada: number;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Envio, (envio) => envio.categoriasPlanificadas)
    envio: Envio;

    @ManyToOne(() => Categoria, (categoria) => categoria.envios, { eager: true })
    categoria: Categoria;

    // Relación opcional con Movimiento
    @OneToOne(() => Movimiento, (movimiento) => movimiento.envioCategoria, { nullable: true, eager: true, cascade: ['remove'] })
    @JoinColumn()
    movimiento?: Movimiento;
}
