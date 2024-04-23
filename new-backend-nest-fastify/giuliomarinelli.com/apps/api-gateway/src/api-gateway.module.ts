import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/config';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'MY_TODO_LIST',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'my-todo-list-queue'
      }
    }
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
