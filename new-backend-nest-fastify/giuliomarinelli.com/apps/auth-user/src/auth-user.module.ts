import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configurations } from './config/config';
import { Repository } from 'typeorm';
import { UserSecurityManagementModule } from './user-security-management/user-security-management.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: 'development.env',
    isGlobal: true,
    load: [...configurations]
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configSvc: ConfigService) => configSvc.get('DB'),
    inject: [ConfigService],
  }),
  UserSecurityManagementModule,],
  controllers: [],
  providers: [ Repository],
})
export class AuthUserModule {}
