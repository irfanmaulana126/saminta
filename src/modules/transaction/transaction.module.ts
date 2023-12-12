import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService, PrismaService, AuthHelpers],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
