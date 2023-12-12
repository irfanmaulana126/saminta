import { Module } from '@nestjs/common';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';
import { PrismaService } from 'nestjs-prisma';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductService, PrismaService, AuthHelpers],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
