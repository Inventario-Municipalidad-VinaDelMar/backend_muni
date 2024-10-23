

import { User } from "src/auth/entities/user.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entrega } from "./entrega.entity";


@Entity()
export class ComedorSolidario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Entrega, (entrega) => entrega.comedorSolidario)
    entregas: Entrega[];

}
