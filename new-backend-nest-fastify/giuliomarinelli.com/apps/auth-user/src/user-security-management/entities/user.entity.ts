import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/gender.enum";


@Entity({ name: 'users' })
export class User {

    constructor(firstName: string, lastName: string, email: string,
        hashedPassword: string, gender: Gender) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.hashedPassword = hashedPassword
        this.gender = gender
        this.createdAt = new Date().getTime()
    }

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column()
    hashedPassword: string

    @Column({ type: 'varchar' })
    gender: Gender

    @Column()
    active: boolean = false

    @Column({ default: null })
    hashedActivationCode: string | null

    @Column({ type: 'bigint' })
    createdAt: number

}