import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
