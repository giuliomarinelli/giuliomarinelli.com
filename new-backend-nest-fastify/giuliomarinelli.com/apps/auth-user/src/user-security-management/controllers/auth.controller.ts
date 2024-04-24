import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserReqDTO } from '../interfaces/user-req-dto.interface';
import { LoginReqDTO } from '../interfaces/login-req-dto.interface';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { MapAdapterService } from '../services/map-adapter.service';
import { MapToJson } from 'apps/api-gateway/src/auth-user/interfaces/map-to-object.interface';

@Controller()
export class AuthController {

    constructor(private authSvc: AuthService, private mapAdapter: MapAdapterService) { }

    @MessagePattern({ cmd: 'register_user' })
    public async register(@Payload() data: UserReqDTO) {
        return await this.authSvc.register(data)
    }

    @MessagePattern({ cmd: 'login_user' })
    public async login(@Payload() loginDTO: LoginReqDTO): Promise<MapToJson<TokenPairType, TokenPair>> {
        return this.mapAdapter.adaptTokenPairTypeAndTokenPairMap(await this.authSvc.login(loginDTO))
    }

   

}
