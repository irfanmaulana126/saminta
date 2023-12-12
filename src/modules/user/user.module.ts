import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthHelpers } from '../../shared/helpers/auth.helpers';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserListener } from './user.listener';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserListener, AuthHelpers],
  exports: [UserService],
})
export class UserModule {}
