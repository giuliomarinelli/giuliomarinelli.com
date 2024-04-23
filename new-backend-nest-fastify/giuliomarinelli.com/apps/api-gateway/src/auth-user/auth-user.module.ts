import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_USER',
        transport: Transport.TCP,
        options: { port: 3002 }
      }]),
  ],
  controllers: [AuthUserController]
})
export class AuthUserModule {}
