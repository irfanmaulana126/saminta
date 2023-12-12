import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PaginatedInputDTO {
  @IsNumber()
  @ApiPropertyOptional({ default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ default: 10 })
  perPage: number;

  @IsString()
  @ApiPropertyOptional()
  searchTerm: string;
}

export class PaginatedInputFilterDTO {
  @IsNumber()
  @ApiPropertyOptional({ default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ default: 10 })
  perPage: number;

  @IsString()
  @ApiPropertyOptional()
  searchTerm: string;

  @IsString()
  @ApiPropertyOptional()
  parentId: string;
}

export interface PaginatedInputQuery {
  page?: number;
  perPage?: number;
  searchTerm?: string;
}

export interface PaginatedInputQueryFilter {
  page?: number;
  perPage?: number;
  searchTerm?: string;
  parentId?: string;
}
