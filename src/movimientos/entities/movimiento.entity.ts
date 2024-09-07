import { Tanda } from "src/inventario/entities/tanda.entity";
import { EnvioCategoria } from "src/logistica/envios/entities/envio-categoria.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @ManyToOne(() => Tanda, (tanda) => tanda.movimientos)
    tanda: Tanda;


    //Relacion obligatoria con EnvioCategoria
    @OneToOne(() => EnvioCategoria, (envio) => envio.movimiento, { nullable: false })
    @JoinColumn()
    envioCategoria: EnvioCategoria;
}