import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IResponse } from 'src/common/dtos';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'Signup successfully' })
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('signup')
  async signup(
    @Body() data: SignupDto,
  ): Promise<IResponse<Omit<User, 'password'>>> {
    return {
      success: true,
      message: 'Signup successfully',
      data: await this.authService.signup(data),
    };
  }
}
