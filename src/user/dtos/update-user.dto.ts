import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ description: 'ISO Date String Format', required: false })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  birthday: Date;

  @ApiProperty({
    required: false,
    enum: Gender,
  })
  @Transform(({ value }) => value || undefined)
  @IsOptional()
  @IsString()
  gender: Gender;
}
