

import { User } from "src/auth/entities/user.entity";
import { Envio } from "src/logistica/envios/entities/envio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Entrega } from "./entrega.entity";


@Entity()
export class ComedorSolidario {
    // @PrimaryGeneratedColumn()

    // @PrimaryGeneratedColumn('uuid')
    // id: string;
    @PrimaryColumn()
    id: number;

    @Column()
    // @Column({ charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
    nombre: string;

    @Column()
    // @Column({ charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
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
