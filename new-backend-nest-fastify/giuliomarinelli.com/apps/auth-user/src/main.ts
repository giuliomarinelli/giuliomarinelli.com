import { NestFactory } from '@nestjs/core';
import { AuthUserModule } from './auth-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthUserModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3003,
      },
    }
  )
  await app.listen()
}
bootstrap();
