import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthUserModule } from './auth-user/auth-user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      isGlobal: true,
      load: [...configurations]
    }),
    ClientsModule.register([
      {
        name: 'AUTH_USER',
        transport: Transport.TCP,
        options: { port: 3003 }
      },
      {
        name: 'MY_TODO_LIST',
        transport: Transport.TCP,
        options: { port: 3001 }
      }
    ]),
    AuthUserModule
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
