import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./gender.enum";


@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    hashedPassword: string

    @Column({ type: 'varchar' })
    gender: Gender

}