import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { INVALID_EMAIL } from 'src/shared/constants/strings';
import { PaginatedInputQuery } from 'src/shared/dto/paginated-input.dto';

export class UserFilterDTO implements PaginatedInputQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsString()
  page?: any;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsString()
  perPage?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsArray({ message: 'Invalid roles' })
  roles?: string[];
}

export class UserCreateFormDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  role: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faskesOrganization: string;
}

export class UserUpdateFormDTO extends PartialType(UserCreateFormDTO) {}
