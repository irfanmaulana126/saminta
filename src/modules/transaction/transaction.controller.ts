import {
  Controller,
  Get,
  Query,
  Response,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedInputDTO,
  PaginatedInputQuery,
} from 'src/shared/dto/paginated-input.dto';
import { ApiPaginatedResponse } from 'src/decorators/pagination.decorator';
import { PaginatedModelReponseDTO } from 'src/shared/dto/paginated-output.dto';
import { Transaction } from '@prisma/client';
import { SingleModelResponseDTO } from 'src/shared/dto/single-output.dto';

import { TransactionService } from './transaction.service';
import { TransactionCreateFormDTO } from './transaction.dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ description: 'Get all transection' })
  @ApiQuery({ type: PaginatedInputDTO })
  @ApiPaginatedResponse(PaginatedModelReponseDTO<Transaction>)
  async getAll(
    @Query() query: PaginatedInputQuery,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<Transaction>> {
    const transaction = await this.transactionService.transactions(query);
    return res.status(200).send({
      message:
        transaction.data.length > 0 ? 'success' : 'transaction not found',
      data: transaction.data,
      meta: transaction.meta,
    });
  }

  @Get('/:id')
  @ApiOperation({ description: 'Get by id transection' })
  @ApiPaginatedResponse(SingleModelResponseDTO<Transaction>)
  async getById(
    @Param('id') id: string,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<Transaction>> {
    const transaction = await this.transactionService.transactionById(id);
    return res.status(200).send({
      message: transaction ? 'success' : 'transaction not found',
      data: transaction,
    });
  }

  @Post()
  @ApiBody({ type: TransactionCreateFormDTO })
  @ApiOperation({ description: 'Create transection' })
  @ApiResponse({ type: SingleModelResponseDTO<Transaction> })
  async create(
    @Body() transaction: TransactionCreateFormDTO,
    @Response() res,
  ): Promise<SingleModelResponseDTO<Transaction>> {
    let transactiondata = null;
    try {
      transactiondata =
        await this.transactionService.createTransaction(transaction);
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
      });
    }

    return res.status(201).send({
      message: 'success',
      data: transactiondata,
    });
  }
}
