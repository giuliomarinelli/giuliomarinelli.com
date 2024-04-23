import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserReqDTO } from '../interfaces/user-req-dto.interface';

@Controller()
export class AuthController {

    constructor(private authSvc: AuthService) { }

    @MessagePattern({ cmd: 'register_user' })
    public async register(@Payload() data: UserReqDTO) {
        return await this.authSvc.register(data)
    }

}
