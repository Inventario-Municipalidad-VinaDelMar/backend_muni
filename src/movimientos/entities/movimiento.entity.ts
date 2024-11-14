import { User } from "src/auth/entities/user.entity";
import { Tanda } from "src/inventario/entities/tanda.entity";
import { EnvioProducto } from "src/logistica/envios/entities/envio-producto.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum MovimientoType {
    MERMA = 'Merma',
    RETIRO = 'Retiro',
    INGRESO = 'Ingreso',
    DEVOLUCION = 'Devolucion',
}


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

    @Column({ type: 'enum', enum: MovimientoType, default: MovimientoType.RETIRO, })
    type: MovimientoType;

    @Column({ nullable: true })
    comentario?: string;

    //This is soft delete
    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => User, (user) => user.movimientos, { eager: true, onDelete: 'CASCADE' })
    realizador: User;

    //* MERMA --> Se necesita registrar en que tanda hubo merma
    //* INGRESO --> Se registra la tanda que se creará con este movimiento
    //* RETIRO --> Se registra de que tanda se descuenta stock
    //* DEVOLUCION --> Se registra a que tanda se suma stock
    @ManyToOne(() => Tanda, (tanda) => tanda.movimientos, { eager: true, onDelete: 'CASCADE', })
    tanda: Tanda;

    //! MERMA --> Como es merma, no se envia producto vencido, envio = null
    //! INGRESO --> Si es ingreso, significa que no hay relacion con un envio = null
    //* RETIRO --> Si hay retiro, se debe registrar a que envio pertenece ya QUE esta planificado 
    //* DEVOLUCION --> Si hay devolcuion, se debe registrar a que envio pertenecen los productos devueltos
    @OneToOne(() => EnvioProducto, (envio) => envio.movimiento, { nullable: true, onDelete: 'CASCADE' })
    // @OneToOne(() => EnvioProducto, (envio) => envio.movimiento, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    envioProducto?: EnvioProducto;
    // envioProducto: EnvioProducto;

    //! Solo si el movimientos es una devolucion, tendra asociado de que envio es
    @ManyToOne(() => Envio, (envio) => envio.devoluciones, { onDelete: 'CASCADE', })
    devolucionFromEnvio?: Envio;
}
