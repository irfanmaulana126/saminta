import { Controller, Get, UseGuards, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.jwt.guard';

import { MasterConstService } from './master-const.service';

@ApiTags('Master Const')
@Controller('master-const')
export class MasterConstController {
  constructor(private readonly masterConstservice: MasterConstService) {}

  @Get('/product-type')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all Blod Type' })
  async getBoldType(@Response() res) {
    const bloodType = this.masterConstservice.productType();
    return res.status(200).send({
      message: 'success',
      data: Object.values(bloodType),
    });
  }
}
