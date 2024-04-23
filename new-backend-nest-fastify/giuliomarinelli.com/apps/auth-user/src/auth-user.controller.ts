import { Controller, Get } from '@nestjs/common';


@Controller()
export class AuthUserController {


  @Get()
  getHello(): void {
    console.log('hello')
  }
}
//