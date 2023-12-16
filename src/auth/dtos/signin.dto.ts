import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ description: 'Tên đăng nhập' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
