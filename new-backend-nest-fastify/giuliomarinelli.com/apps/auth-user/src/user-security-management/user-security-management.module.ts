import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth/auth.service';
import { ClientTCP } from '@nestjs/microservices';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService, ClientTCP]
})
export class UserSecurityManagementModule {}
