import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'Tên đăng nhập' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Địa chỉ email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Họ và tên', required: false })
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Ngày sinh (ISO Date String)', required: false })
  @IsOptional()
  @IsString()
  birthday: string;

  @ApiProperty({
    description: 'Giới tính',
    required: false,
    enum: Gender,
    default: Gender.OTHER,
  })
  @IsOptional()
  @IsString()
  gender: Gender = Gender.OTHER;
}
