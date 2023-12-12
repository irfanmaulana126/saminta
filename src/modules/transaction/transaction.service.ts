import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ObjectId, Transaction } from 'mongodb';
import { PrismaService } from 'nestjs-prisma';
import { createPaginator } from 'prisma-pagination';
import { PaginatedInputQuery } from 'src/shared/dto/paginated-input.dto';
import { PaginatedOutputDTO } from 'src/shared/dto/paginated-output.dto';
import { MidtransService } from '@ruraim/nestjs-midtrans';

import {
  TransactionCreateFormDTO,
  TransactionNotifHandlerFormDTO,
} from './transaction.dto';

const paginate = createPaginator({ perPage: 10 });
@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private readonly midtransService: MidtransService,
  ) {}

  async transactionById(id: string): Promise<any | null> {
    const objectId = new ObjectId(id);

    return this.prisma.transaction.findFirst({
      select: {
        id: true,
        idOrder: true,
        email: true,
        name: true,
        idAkunGame: true,
        nickname: true,
        ranked: true,
        sumGame: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: objectId.toHexString(),
      },
    });
  }

  async transactions(
    query: PaginatedInputQuery,
  ): Promise<PaginatedOutputDTO<Transaction>> {
    let where: Prisma.TransactionWhereInput = {};
    const { page, perPage, searchTerm } = query;

    if (searchTerm) {
      where = {
        OR: [
          {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            name: {
              equals: searchTerm,
            },
          },
          {
            phone: {
              equals: searchTerm,
            },
          },
          {
            nickname: {
              equals: searchTerm,
            },
          },
          {
            idAkunGame: {
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

    return paginate<Transaction, Prisma.TransactionFindManyArgs>(
      this.prisma.product,
      {
        select: {
          id: true,
          idOrder: true,
          email: true,
          name: true,
          phone: true,
          idAkunGame: true,
          sumGame: true,
          totalPrice: true,
          idMembership: true,
          product: true,
          nickname: true,
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

  async createTransaction(body: TransactionCreateFormDTO): Promise<any> {
    const number_order = 'T-' + Math.random().toString(36).slice(2);
    const productId = new ObjectId(body.productId);
    try {
      return this.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          select: {
            id: true,
            idOrder: true,
            email: true,
            name: true,
            phone: true,
            idAkunGame: true,
            sumGame: true,
            totalPrice: true,
            idMembership: true,
            product: {
              select: {
                name: true,
              },
            },
            nickname: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
          data: {
            idOrder: number_order,
            email: body.email,
            name: body.name,
            nickname: body.nickname,
            phone: body.phone,
            idAkunGame: body.idAkunGame,
            ranked: body.ranked,
            sumGame: body.sumGame,
            productId: productId.toHexString(),
            totalPrice: body.totalPrice,
          },
        });
        try {
          const result = await this.midtransService.charge({
            payment_type: 'bank_transfer',
            transaction_details: {
              order_id: number_order,
              gross_amount: parseInt(body.totalPrice),
            },
            customer_details: {
              email: body.email,
              first_name: body.name,
              phone: body.phone,
            },
            item_details: [
              {
                id: productId.toHexString(),
                price: parseInt(body.totalPrice),
                quantity: 1,
                name: transaction.product.name,
              },
            ],
            bank_transfer: {
              bank: 'bca',
            },
          });
          const paymentResult = {
            orderId: number_order,
            response: result,
          };
          const savedPaymentResult = await tx.transactionCharge.create({
            data: paymentResult,
          });
          return savedPaymentResult;
        } catch (error) {
          throw new Error('Requst charge failed');
        }
      });
    } catch (error) {
      throw new Error('Transaction filed');
    }
  }
  async createTransactionNotifHandler(
    body: TransactionNotifHandlerFormDTO,
  ): Promise<any> {
    try {
      return this.prisma.$transaction(async (tx) => {
        await tx.transactionNotifHandler.create({
          select: {
            id: true,
            response: true,
          },
          data: {
            response: JSON.stringify(body.response),
          },
        });
      });
    } catch (error) {
      throw new Error('Transaction Notif filed');
    }
  }
}
