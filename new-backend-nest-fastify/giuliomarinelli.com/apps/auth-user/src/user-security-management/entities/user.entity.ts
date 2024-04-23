import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./gender.enum";


@Entity({ name: 'users' })
export class User {

    constructor(firstName: string, lastName: string, email: string,
        hashedPassword: string, gender: Gender, hashedActivationCode: string) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.hashedPassword = hashedPassword
        this.gender = gender
        this.hashedActivationCode = hashedActivationCode
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

    @Column()
    hashedActivationCode: string

    @Column({ type: 'bigint' })
    createdAt: number

}