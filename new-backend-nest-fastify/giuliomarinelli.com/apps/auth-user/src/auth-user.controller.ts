import { Controller, Get } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';

@Controller()
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Get()
  getHello(): string {
    return this.authUserService.getHello();
  }
}
