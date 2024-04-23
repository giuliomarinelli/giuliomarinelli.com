import { registerAs } from '@nestjs/config';
import { User } from 'apps/auth-user/src/user-security-management/entities/user.entity';


export enum ConfigKey {
    DB = 'DB',
    KEYS = 'KEYS',
    EXP = 'EXP',
    COOKIE = 'COOKIE'
}

export enum Environment {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    Production = 'production',
    Testing = 'testing',
}



const DBConfig = registerAs(
    ConfigKey.DB, () => ({
        host: process.env.AUTH_USER_DATABASE_HOST,
        port: Number(process.env.AUTH_USER_DATABASE_PORT),
        username: process.env.AUTH_USER_DATABASE_USERNAME,
        password: process.env.AUTH_USER_DATABASE_PASSWORD,
        database: process.env.AUTH_USER_DATABASE,
        type: process.env.AUTH_USER_DATABASE_TYPE,
        retryAttempts: 10,
        entities: [
            User
        ],
        synchronize: true
    }),
)

const KEYSConfig = registerAs(
    ConfigKey.KEYS, () => ({
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        wsAccessTokenSecret: process.env.WS_ACCESS_TOKEN_SECRET,
        wsRefreshTokenSecret: process.env.WS_REFRESH_TOKEN_SECRET,
        cookieSignSecret: process.env.COOKIE_SIGN_SECRET
    })
)

const EXPConfig = registerAs(
    ConfigKey.EXP, () => ({
        accessTokenExp: Number(process.env.ACCESS_TOKEN_EXP),
        refreshTokenExp: Number(process.env.REFRESH_TOKEN_EXP),
        wsAccessTokenExp: Number(process.env.WS_ACCESS_TOKEN_EXP),
        wsRefreshTokenExp: Number(process.env.WS_REFRESH_TOKEN_EXP),
    })
)

const COOKIEConfig = registerAs(
    ConfigKey.COOKIE, () => ({
        domain: process.env.DOMAIN,
        sameSite: process.env.SAME_SITE
    })
)

export const configurations = [DBConfig, KEYSConfig, EXPConfig, COOKIEConfig]