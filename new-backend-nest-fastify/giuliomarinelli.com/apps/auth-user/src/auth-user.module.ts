import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configSvc: ConfigService) => configSvc.get('DB'),
    inject: [ConfigService],
  }),],
  controllers: [AuthUserController],
  providers: [AuthUserService],
})
export class AuthUserModule {}
