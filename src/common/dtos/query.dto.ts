import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { transformToInt } from '../utils';

export class IQuery {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @Transform(transformToInt)
  @IsOptional()
  @IsInt()
  page: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @Transform(transformToInt)
  @IsOptional()
  @IsInt()
  pageSize: number = 10;
}
