import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bodega } from "./bodega.entity";
import { Tanda } from "./tanda.entity";

@Entity()
export class Ubicacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    descripcion: string;

    //This is soft delete
    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Bodega, (bodega) => bodega.ubicaciones, { eager: true })
    bodega: Bodega;

    @OneToMany(() => Tanda, (tanda) => tanda.ubicacion)
    tandas: Tanda[];
}