import { NestFactory } from '@nestjs/core';
import { MyTodoListModule } from './my-todo-list.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MyTodoListModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'my-todo-list-queue',
        queueOptions: {
          durable: false
        },
      }
    }
  );
  await app.listen();
}
bootstrap();
