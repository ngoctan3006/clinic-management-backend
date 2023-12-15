import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/dtos';
import { AuthService } from './auth.service';
import {
  ResponseLoginDto,
  SigninDto,
  SignupDto,
  UserWithoutPassword,
} from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'Đăng ký tài khoản thành công' })
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('signup')
  async signup(
    @Body() data: SignupDto,
  ): Promise<IResponse<UserWithoutPassword>> {
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: await this.authService.signup(data),
    };
  }

  @ApiOkResponse({ description: 'Đăng nhập thành công' })
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('signin')
  async signin(@Body() data: SigninDto): Promise<IResponse<ResponseLoginDto>> {
    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: await this.authService.signin(data.username, data.password),
    };
  }
}
