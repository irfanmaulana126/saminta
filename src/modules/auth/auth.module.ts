import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { UserService } from '../user/user.service';
import { JWT_SECRET } from '../../shared/constants/global.constants';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';

import { JwtStrategy } from './auth.jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    PrismaService,
    AuthHelpers,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
