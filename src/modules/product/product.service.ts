import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { PrismaService } from 'nestjs-prisma';
import { createPaginator } from 'prisma-pagination';
import { PaginatedInputQuery } from 'src/shared/dto/paginated-input.dto';
import { PaginatedOutputDTO } from 'src/shared/dto/paginated-output.dto';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';

import { ProductCreateFormDTO } from './product.dto';

const paginate = createPaginator({ perPage: 10 });
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private authHelpers: AuthHelpers,
  ) {}

  async productById(id: string): Promise<any | null> {
    const objectId = new ObjectId(id);
    const userId = new ObjectId(this.authHelpers.currentUser().id);

    return this.prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        is_active: true,
        is_membership: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: objectId.toHexString(),
        userId: userId.toHexString(),
      },
    });
  }

  async products(
    query: PaginatedInputQuery,
  ): Promise<PaginatedOutputDTO<Product>> {
    let where: Prisma.ProductWhereInput = {};
    const userId = new ObjectId(this.authHelpers.currentUser().id);
    const { page, perPage, searchTerm } = query;

    if (searchTerm) {
      where = {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            price: {
              equals: parseInt(searchTerm),
            },
          },
          {
            description: {
              equals: searchTerm,
            },
          },
        ],
        AND: [
          {
            deletedAt: {
              equals: null,
            },
          },
        ],
      };
    }

    if (await this.authHelpers.isStreamer()) {
      where.AND = [
        {
          userId: {
            equals: userId.toHexString(),
          },
        },
      ];
    }

    return paginate<Product, Prisma.ProductFindManyArgs>(
      this.prisma.product,
      {
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          type: true,
          is_active: true,
          is_membership: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        where: where,
        orderBy: {
          createdAt: 'asc',
        },
      },
      {
        page,
        perPage,
      },
    );
  }

  async createProduct(body: ProductCreateFormDTO): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          is_active: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
        data: {
          name: body.name,
          price: body.price,
          description: body.description,
          type: body.type,
          is_active: body.is_active,
          is_membership: body.is_membership,
          userId: this.authHelpers.currentUser().id,
        },
      });

      return product;
    });
  }
}
