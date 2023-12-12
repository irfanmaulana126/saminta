import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { INVALID_EMAIL } from '../../shared/constants/strings';

export class RolesDataDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  name: string;
}

export class AuthDataDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsArray()
  @ApiProperty({ isArray: true, type: RolesDataDTO })
  roles: RolesDataDTO[];

  @IsString()
  @ApiProperty()
  accessToken: string;

  @IsNumber()
  @ApiProperty()
  issuedAt: number;

  @IsNumber()
  @ApiProperty()
  expiresIn: number;
}

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
