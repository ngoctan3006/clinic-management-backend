import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { transformToInt } from '../utils';

export class IQuery {
  @ApiProperty({ required: false })
  @Transform(transformToInt)
  @IsOptional()
  @IsInt()
  page: number;

  @ApiProperty({ required: false })
  @Transform(transformToInt)
  @IsOptional()
  @IsInt()
  pageSize: number;
}
