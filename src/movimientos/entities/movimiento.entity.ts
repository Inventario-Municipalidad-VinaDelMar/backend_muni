import { Tanda } from "src/inventario/entities/tanda.entity";
import { EnvioProducto } from "src/logistica/envios/entities/envio-producto.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Movimiento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cantidadRetirada: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    hora: string;

    //This is soft delete
    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Tanda, (tanda) => tanda.movimientos, { eager: true })
    tanda: Tanda;


    //Relacion obligatoria con EnvioProducto
    @OneToOne(() => EnvioProducto, (envio) => envio.movimiento, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    envioProducto: EnvioProducto;
}
