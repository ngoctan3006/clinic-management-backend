import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { transformToDate, transformValue } from 'src/common/utils';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ description: 'ISO Date String Format', required: false })
  @Transform(transformToDate)
  @IsOptional()
  birthday: Date;

  @ApiProperty({
    required: false,
    enum: Gender,
  })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  gender: Gender;
}
