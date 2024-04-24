import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRes } from '../interfaces/user-res-dto.interface';
import * as bcrypt from 'bcrypt'
import { UserReqDTO } from '../interfaces/user-req-dto.interface';
import { RpcException } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { LoginReqDTO } from '../interfaces/login-req-dto.interface';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { JwtUtilsService } from './jwt-utils.service';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRp: Repository<User>,
        private jwtUtils: JwtUtilsService
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

    private async generateActivationCodeAndHash(userId: UUID): Promise<string> {
        const generateRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
        let code: string = ''
        for (let i: number = 0; i < 6; i++) {
            code += String(generateRandomInt(0, 9))
        }
        const user = await this.userRp.findOneBy({ id: userId })
        user.hashedActivationCode = await this.passwordEncoder(code)
        await this.userRp.save(user)
        return code
    }

    public async register(userDTO: UserReqDTO): Promise<UserRes> {
        const { firstName, lastName, email, password, gender } = userDTO
        const user = new User(firstName, lastName, email, await this.passwordEncoder(password), gender)
        try {
            await this.userRp.save(user)
        } catch (e) {
            if (e.message) {
                if (typeof e.message === 'string') {
                    if (e.message.includes('Duplicate entry'))
                        throw new RpcException('email already exists, cannot create')
                }
            } throw new RpcException('Database error')
        }

        return this.generateUserResModel(user)

    }

    public async login(loginDTO: LoginReqDTO): Promise<Map<TokenPairType, TokenPair>> {
        const user = await this.getUserByEmail(loginDTO.email)
        if (!user)
            throw new RpcException('email and/or password are not correct')
        if (!await this.passwordMatcher(loginDTO.password, user.hashedPassword))
            throw new RpcException('email and/or password are not correct')
        const httpTokenPair: TokenPair = {
            accessToken: await this.jwtUtils.generateToken(user, TokenType.ACCESS_TOKEN, loginDTO.restore),
            refreshToken: await this.jwtUtils.generateToken(user, TokenType.REFRESH_TOKEN, loginDTO.restore),
            type: TokenPairType.HTTP
        }
        const wsTokenPair: TokenPair = {
            accessToken: await this.jwtUtils.generateToken(user, TokenType.WS_ACCESS_TOKEN, loginDTO.restore),
            refreshToken: await this.jwtUtils.generateToken(user, TokenType.WS_REFRESH_TOKEN, loginDTO.restore),
            type: TokenPairType.WS
        }
        const tokenMap = new Map<TokenPairType, TokenPair>
        tokenMap.set(TokenPairType.HTTP, httpTokenPair)
        tokenMap.set(TokenPairType.WS, wsTokenPair)
        return tokenMap
    }

}
