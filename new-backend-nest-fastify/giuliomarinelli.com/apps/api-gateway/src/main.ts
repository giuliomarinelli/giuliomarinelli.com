import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const logger = new Logger('ApiGateway Bootstrap')
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiGatewayModule,
    new FastifyAdapter()
  )
  const configSvc = app.get<ConfigService>(ConfigService)
  
  await app.register(fastifyCookie, {
    secret: configSvc.get('KEYS.cookieSignSecret')
  })
  app.enableCors(
    {
      origin: configSvc.get<string[]>('APP.corsOrigins'),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  )
  const port = configSvc.get<number>('APP.port')
  await app.listen(port);
  logger.log(`API Gateway listening on port ${port} with Fastify Server`)
}
bootstrap();
