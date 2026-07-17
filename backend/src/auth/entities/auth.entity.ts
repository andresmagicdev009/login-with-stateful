import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    nombre!: string;

    @Column({unique: true}) // constraint a nivel de BD, no solo aplicacion
    email!: string;

    @Column({select: false}) // no se va a seleccionar por defecto en las consultas
    passwordHash!: string;

    @CreateDateColumn()
    createdAt!: Date;

}