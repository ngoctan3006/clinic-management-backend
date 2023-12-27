import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { transformToDate, transformValue } from 'src/common/utils';

export class SignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsEmail()
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
    default: Gender.OTHER,
  })
  @IsOptional()
  @IsString()
  gender: Gender = Gender.OTHER;
}
