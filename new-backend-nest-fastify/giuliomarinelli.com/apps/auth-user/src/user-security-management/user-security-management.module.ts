import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { ClientTCP } from '@nestjs/microservices';
import { JwtUtilsService } from './services/jwt-utils.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService, ClientTCP, JwtUtilsService, JwtService]
})
export class UserSecurityManagementModule { }
