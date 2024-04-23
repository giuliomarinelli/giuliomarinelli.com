import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/config';


@Module({
  imports: [
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
