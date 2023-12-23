import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
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
  @IsOptional()
  @IsString()
  gender: Gender;
}
