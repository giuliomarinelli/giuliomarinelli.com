import { NestFactory } from '@nestjs/core';
import { AuthUserModule } from './auth-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthUserModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379
      }
    }
  )
  await app.listen()
}
bootstrap();
