import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class PaginatedOutputDTO<T> {
  data: T[];
  meta: PaginatedMetaInfoDTO;
}

export class PaginatedMetaInfoDTO {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export class PaginatedModelReponseDTO<T> {
  @IsString()
  @ApiProperty()
  message: string;

  @IsArray()
  @ApiProperty()
  data: T[];

  @IsObject()
  @ApiPropertyOptional()
  meta: PaginatedMetaInfoDTO;
}
