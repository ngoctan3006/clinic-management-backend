import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
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
    default: Gender.OTHER,
  })
  @IsOptional()
  @IsString()
  gender: Gender = Gender.OTHER;
}
