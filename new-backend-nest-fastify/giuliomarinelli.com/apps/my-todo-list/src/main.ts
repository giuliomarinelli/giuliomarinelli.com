import { NestFactory } from '@nestjs/core';
import { MyTodoListModule } from './my-todo-list.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MyTodoListModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    }
  );
  await app.listen();
}
bootstrap();
