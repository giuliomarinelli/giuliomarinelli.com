import { UserRes } from 'apps/auth-user/src/user-security-management/interfaces/user-res-dto.interface';
import { UserReqDTO } from './../../../auth-user/src/user-security-management/interfaces/user-req-dto.interface';
import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, } from 'rxjs';

@Controller('auth')
export class AuthUserController {

    constructor(@Inject('AUTH_USER') private readonly authUser: ClientProxy) { }

    @Post()
    public async register(userReqDTO: UserReqDTO): Promise<UserRes> {
        return await lastValueFrom(this.authUser.send(
            { cmd: 'register_user' },
            userReqDTO
        ))
    }

}
