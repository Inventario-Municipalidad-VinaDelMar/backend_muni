

import { User } from "src/auth/entities/user.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entrega } from "./entrega.entity";


@Entity()
export class ComedorSolidario {
    @PrimaryGeneratedColumn()
    // @PrimaryGeneratedColumn('uuid')
    // id: string;
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    latitud: string;

    @Column()
    longitud: string;

    @Column()
    sector: string;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Entrega, (entrega) => entrega.comedorSolidario)
    entregas: Entrega[];

}
