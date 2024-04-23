import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/config';


@Module({
  imports: [ClientsModule.register([
    {
      name: 'AUTH_USER',
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      }
    },
    {
      name: 'TO_DO_LIST',
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      }
    },
  ]),
  ConfigModule.forRoot({
    envFilePath: 'development.env',
    isGlobal: true,
    load: [...configurations]
  })
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
