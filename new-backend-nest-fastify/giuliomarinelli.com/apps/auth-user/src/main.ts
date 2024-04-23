import { NestFactory } from '@nestjs/core';
import { AuthUserModule } from './auth-user.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthUserModule,
    {
      
    }
  );
  await app.listen(3000);
}
bootstrap();
