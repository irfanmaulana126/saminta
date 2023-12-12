import {
  Controller,
  Get,
  Query,
  UseGuards,
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
import { ROLES } from 'src/shared/constants/global.constants';
import {
  PaginatedInputDTO,
  PaginatedInputQuery,
} from 'src/shared/dto/paginated-input.dto';
import { ApiPaginatedResponse } from 'src/decorators/pagination.decorator';
import { PaginatedModelReponseDTO } from 'src/shared/dto/paginated-output.dto';
import { Product } from '@prisma/client';
import { SingleModelResponseDTO } from 'src/shared/dto/single-output.dto';

import { UserRoles } from '../auth/auth.roles.decorator';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';

import { ProductService } from './product.service';
import { ProductCreateFormDTO } from './product.dto';

@ApiTags('product')
@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get all product' })
  @ApiQuery({ type: PaginatedInputDTO })
  @ApiPaginatedResponse(PaginatedModelReponseDTO<Product>)
  async getAll(
    @Query() query: PaginatedInputQuery,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<Product>> {
    const product = await this.productService.products(query);
    return res.status(200).send({
      message: product.data.length > 0 ? 'success' : 'product not found',
      data: product.data,
      meta: product.meta,
    });
  }

  @Get('/:id')
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get by id product' })
  @ApiPaginatedResponse(SingleModelResponseDTO<Product>)
  async getById(
    @Param('id') id: string,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<Product>> {
    const product = await this.productService.productById(id);
    return res.status(200).send({
      message: product ? 'success' : 'product not found',
      data: product,
    });
  }

  @Post()
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBody({ type: ProductCreateFormDTO })
  @ApiOperation({ description: 'Create Product' })
  @ApiResponse({ type: SingleModelResponseDTO<Product> })
  async create(
    @Body() product: ProductCreateFormDTO,
    @Response() res,
  ): Promise<SingleModelResponseDTO<Product>> {
    let createdProduct = null;
    try {
      createdProduct = await this.productService.createProduct(product);
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
      });
    }

    return res.status(201).send({
      message: 'success',
      data: createdProduct,
    });
  }
}
