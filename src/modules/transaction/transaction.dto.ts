import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TransactionCreateFormDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  idAkunGame: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ranked: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  totalPrice: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sumGame: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  idMembership: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;
}
export class TransactionNotifHandlerFormDTO {
  @ApiPropertyOptional()
  @IsJSON()
  @IsOptional()
  response: JSON;
}
export class TransactionUpdateFormDTO extends PartialType(
  TransactionCreateFormDTO,
) {}
