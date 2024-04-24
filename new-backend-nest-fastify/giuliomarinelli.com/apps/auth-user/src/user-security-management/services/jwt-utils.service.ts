import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { User } from '../entities/user.entity';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenType } from '../enums/token-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { uuid } from 'uuidv4'
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilsService {

    
    constructor(private jwtSvc: JwtService, private configSvc: ConfigService, private dataSource: DataSource) { }

    private async getUserById(id: UUID): Promise<User> {
        const user: User | null | undefined = await this.dataSource.getRepository(User).findOneBy({ id })
        if (!user) throw new RpcException('Unauthorized')
        return user
    }

    public async generateToken(user: User, type: TokenType, restore: boolean): Promise<string> {

        let secret: string
        let exp: number

        switch (type) {
            case TokenType.ACCESS_TOKEN:
                secret = this.configSvc.get('KEYS.accessTokenSecret')
                exp = this.configSvc.get('EXP.accessTokenExp')
                break
            case TokenType.REFRESH_TOKEN:
                secret = this.configSvc.get('KEYS.refreshTokenSecret')
                exp = this.configSvc.get('EXP.refreshTokenExp')
                break
            case TokenType.WS_ACCESS_TOKEN:
                secret = this.configSvc.get('KEYS.wsAccessTokenSecret')
                exp = this.configSvc.get('EXP.wsAccessTokenExp')
                break
            case TokenType.WS_REFRESH_TOKEN:
                secret = this.configSvc.get('KEYS.wsRefreshTokenSecret')
                exp = this.configSvc.get('EXP.wsRefreshTokenExp')
                break
            default: throw new RpcException('Unauthorized')
        }

        return await this.jwtSvc.signAsync({
            sub: user.id, restore, iss: 'MyPizza',
            typ: `JWT ${type}`, exp, iat: new Date().getTime(), jti: uuid()
        }, { secret })

    }

    public async generateTokenPair(refreshToken: string, type: TokenPairType, restore: boolean): Promise<TokenPair> {
        let secret: string
        switch (type) {
            case TokenPairType.HTTP:
                secret = this.configSvc.get('KEYS.refreshTokenSecret')
                break
            case TokenPairType.WS:
                secret = this.configSvc.get('KEYS.wsRefreshTokenSecret')
                break
            default: throw new RpcException('Unauthorized')
        }
        try {
            await this.jwtSvc.verifyAsync(refreshToken, { secret })
            const userId: UUID = this.jwtSvc.decode(refreshToken).sub as UUID
            const user = await this.getUserById(userId)
            if (type === TokenPairType.HTTP) {
                return {
                    accessToken: await this.generateToken(user, TokenType.ACCESS_TOKEN, restore),
                    refreshToken: await this.generateToken(user, TokenType.REFRESH_TOKEN, restore),
                    type
                }
            }
            return {
                accessToken: await this.generateToken(user, TokenType.WS_ACCESS_TOKEN, restore),
                refreshToken: await this.generateToken(user, TokenType.WS_REFRESH_TOKEN, restore),
                type
            }

        } catch {
            let tokenPrefix: string = ''
            if (type === TokenPairType.WS) tokenPrefix = 'ws_'
            throw new RpcException(`Invalid ${tokenPrefix}refresh_token`)
        }

    }

    public async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            await this.jwtSvc.verifyAsync(accessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.accessTokenSecret') })
            // console.log(this.jwtSvc.decode(accessToken), new Date().getTime(), new Date().getTime() + this.jwtSvc.decode(accessToken).exp)
            return new Date().getTime() <= (this.jwtSvc.decode(accessToken).exp as number) + (this.jwtSvc.decode(accessToken).iat)
        } catch {
            throw new RpcException(`Invalid access_token`)
        }
    }

    public async verifyWsAccessToken(wsAccessToken: string): Promise<void> {
        try {
            await this.jwtSvc.verifyAsync(wsAccessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.wsAccessTokenSecret') })
            if (new Date().getTime() > (this.jwtSvc.decode(wsAccessToken).exp as number) + (this.jwtSvc.decode(wsAccessToken).iat))
                throw new RpcException({ error: 'Unauthorized', message: 'ws_access_token is expired' })
        } catch {
            throw new RpcException({ error: 'Unauthorized', message: 'invalid ws_access_token' })
        }
    }

    public async verifyWsRefreshToken(wsRefreshToken: string): Promise<void> {
        try {
            await this.jwtSvc.verifyAsync(wsRefreshToken, { secret: this.configSvc.get('KEYS.wsRefreshTokenSecret') })
        } catch {
            throw new RpcException({ error: 'Unauthorized', message: 'invalid ws_refresh_token' })
        }
    }


    public async extractUserFromAccessToken(accessToken: string): Promise<User> {
        const userId = await this.extractUserIdFromAccessToken(accessToken)
        return await this.getUserById(userId)
    }

    public async extractUserIdFromWsAccessToken(wsAccessToken: string): Promise<UUID> {
        await this.verifyWsAccessToken(wsAccessToken)
        return this.jwtSvc.decode(wsAccessToken).sub
    }

    public async extractUserFromWsRefreshToken(wsRefreshToken: string): Promise<User> {
        return await this.getUserById(await this.extractUserIdFromWsRefreshToken(wsRefreshToken))
    }

    public async extractUserIdFromWsRefreshToken(wsRefreshToken: string): Promise<UUID> {
        await this.verifyWsRefreshToken(wsRefreshToken)
        return this.jwtSvc.decode(wsRefreshToken).sub
    }

    public async extractUserFromWsAccessToken(wsAccessToken: string): Promise<User> {
        return await this.getUserById(await this.extractUserIdFromWsAccessToken(wsAccessToken))
    }

    public async extractUserIdFromAccessToken(accessToken: string): Promise<UUID> {
        try {
            await this.jwtSvc.verifyAsync(accessToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.accessTokenSecret') })
            return this.jwtSvc.decode(accessToken).sub
        } catch {
            throw new RpcException(`Invalid access_token`)
        }
    }

    public async getRestoreFromRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            await this.jwtSvc.verifyAsync(refreshToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.refreshTokenSecret') })
            return this.jwtSvc.decode(refreshToken).restore as boolean
        } catch {
            throw new RpcException(`Invalid refresh_token`)
        }

    }
    public async getRestoreFromWsRefreshToken(wsRefreshToken: string): Promise<boolean> {
        try {
            await this.jwtSvc.verifyAsync(wsRefreshToken, { ignoreExpiration: true, secret: this.configSvc.get('KEYS.wsRefreshTokenSecret') })
            return this.jwtSvc.decode(wsRefreshToken).restore as boolean
        } catch {
            throw new RpcException(`Invalid ws_refresh_token`)
        }
    }

    

}
