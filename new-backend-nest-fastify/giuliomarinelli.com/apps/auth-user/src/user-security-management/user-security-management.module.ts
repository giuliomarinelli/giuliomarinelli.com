import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { ClientTCP, ClientsModule, Transport } from '@nestjs/microservices';
import { JwtUtilsService } from './services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User]),ClientsModule.register([
        {
          name: 'AUTH_USER',
          transport: Transport.TCP,
          options: { port: 3003, host: 'localhost' }
        }]),
    ],
    providers: [AuthService, ClientTCP, JwtUtilsService, JwtService],
    controllers: [AuthController]
})
export class UserSecurityManagementModule { }
