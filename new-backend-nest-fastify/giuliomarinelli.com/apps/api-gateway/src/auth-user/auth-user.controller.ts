import { UserRes } from 'apps/auth-user/src/user-security-management/interfaces/user-res-dto.interface';
import { UserReqDTO } from './../../../auth-user/src/user-security-management/interfaces/user-req-dto.interface';
import { Body, Controller, Get, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfirmRes } from 'apps/api-gateway/interfaces/confirm-res.interface';
import { LoginReqDTO } from 'apps/auth-user/src/user-security-management/interfaces/login-req-dto.interface';
import { ConfigService } from '@nestjs/config';
import { TokenPairType } from 'apps/auth-user/src/user-security-management/enums/token-pair-type.enum';
import { TokenPair } from 'apps/auth-user/src/user-security-management/interfaces/token-pair.interface';
import { MapToJson } from './interfaces/map-to-object.interface';

@Controller('auth')
export class AuthUserController {

    constructor(@Inject('AUTH_USER') private readonly authUser: ClientProxy, private readonly configSvc: ConfigService) { }

    @Post('/register')
    public async register(@Body() userReqDTO: UserReqDTO): Promise<UserRes> {
        return await lastValueFrom(this.authUser.send(
            { cmd: 'register_user' },
            userReqDTO
        ))
    }


    @Post('/login')
    public async login(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply): Promise<ConfirmRes> {
        const loginDTO = <LoginReqDTO>req.body
        const tokenMap: MapToJson<TokenPairType, TokenPair> = await lastValueFrom(this.authUser.send({ cmd: 'login_user' }, loginDTO))
        res.statusCode = HttpStatus.OK
        let accessToken: string
        let refreshToken: string
        let wsAccessToken: string
        let wsRefreshToken: string
        tokenMap.map.forEach(el => {
            switch (el.key) {
                case TokenPairType.HTTP:
                    accessToken = el.value.accessToken
                    refreshToken = el.value.refreshToken
                    break
                case TokenPairType.WS:
                    wsAccessToken = el.value.accessToken
                    wsRefreshToken = el.value.refreshToken
            }
        })
        if (loginDTO.restore) {
            res.setCookie('__access_tkn', accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__refresh_tkn', refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__ws_access_tkn', wsAccessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
            res.setCookie('__ws_refresh_tkn', wsRefreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: this.configSvc.get('EXP.refreshTokenExp')
            })
        } else {
            res.setCookie('__access_tkn', accessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__refresh_tkn', refreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__ws_access_tkn', wsAccessToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
            res.setCookie('__ws_refresh_tkn', wsRefreshToken, {
                domain: this.configSvc.get('COOKIE.domain'),
                sameSite: this.configSvc.get('COOKIE.sameSite'),
                httpOnly: true,
                path: '/',
                secure: true
            })
        }
        return {
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime(),
            message: "Authenticated successfully"
        }
    }


}


