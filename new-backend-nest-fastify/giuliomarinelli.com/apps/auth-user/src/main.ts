import { NestFactory } from '@nestjs/core';
import { AuthUserModule } from './auth-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthUserModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'auth-user-queue',
        queueOptions: {
          durable: false
        },
      }
    }
  );
  await app.listen()
}
bootstrap();
