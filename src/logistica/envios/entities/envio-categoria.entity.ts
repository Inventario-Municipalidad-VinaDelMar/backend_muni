import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Envio } from "./envio.entity";
import { Categoria } from "src/inventario/entities";

@Entity()
export class EnvioCategoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: false })
    isComplete: boolean;

    @Column()
    cantidadPlanificada: number;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Envio, (envio) => envio.categoriasPlanificadas)
    envio: Envio;

    @ManyToOne(() => Categoria, (categoria) => categoria.envios, { eager: true })
    categoria: Categoria;
}
