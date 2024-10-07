import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//?Roles: Bodeguero, Administrador, Externo, Cargador


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    rut: string;

    @Column({ unique: true })
    email: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellidoPaterno: string;

    @Column('text')
    apellidoMaterno: string;

    @Column('text', { nullable: true })
    imageUrl: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['externo'],
    })
    roles: string[];




}
