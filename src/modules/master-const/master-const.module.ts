import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';

import { MasterConstController } from './master-const.controller';
import { MasterConstService } from './master-const.service';

@Module({
  providers: [MasterConstService, PrismaService, AuthHelpers],
  controllers: [MasterConstController],
  exports: [MasterConstService],
})
export class MasterConstModule {}
