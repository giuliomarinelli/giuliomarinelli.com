import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRes } from '../../interfaces/user-res.interface';
import * as bcrypt from 'bcrypt'
import { UserReqDTO } from '../../interfaces/user-req-dto.interface';

@Injectable()
export class AuthService { 

    constructor(
        @InjectRepository(User) private userRp: Repository<User>
    ) { }

    private async passwordEncoder(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }

    private async passwordMatcher(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    private async getUserByEmail(email: string): Promise<User | null | undefined> {
        return await this.userRp.findOneBy({ email })
    }

    private async generateUserResModel(user: User): Promise<UserRes> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashedPassword, ...userRes } = user
        return userRes
    }

    public async register(userDTO: UserReqDTO): Promise<UserRes> {
        const {firstName, lastName, } = userDTO
    }

}
