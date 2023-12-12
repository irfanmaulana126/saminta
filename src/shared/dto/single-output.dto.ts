import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SingleModelResponseDTO<T> {
  @IsString()
  @ApiProperty()
  message: string;

  @IsArray()
  @ApiProperty()
  data: T;
}
