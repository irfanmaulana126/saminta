import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductCreateFormDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: ProductType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_membership: boolean;
}

export class ProductUpdateFormDTO extends PartialType(ProductCreateFormDTO) {}
