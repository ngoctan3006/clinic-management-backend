import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { IResponse } from 'src/common/dtos';
import { AuthService } from './auth.service';
import {
  ResponseLoginDto,
  SigninDto,
  SignupDto,
  UserWithoutPassword,
} from './dtos';
import { JwtGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  async getMe(
    @CurrentUser('id') userId: number,
  ): Promise<IResponse<UserWithoutPassword>> {
    return {
      success: true,
      message: 'Lấy thông tin tài khoản thành công',
      data: await this.authService.getMe(userId),
    };
  }

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
