import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { IResponse } from './../common/dtos/response.dto';
import { ChangePasswordDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('change-password')
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() data: ChangePasswordDto,
  ): Promise<IResponse<void>> {
    return {
      success: true,
      message: 'Change password successfully',
      data: await this.userService.changePassword(userId, data),
    };
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put()
  async update(
    @CurrentUser('id') userId: number,
    @Body() data: UpdateUserDto,
  ): Promise<IResponse<User>> {
    return {
      success: true,
      message: 'Update user info successfully',
      data: await this.userService.update(userId, data),
    };
  }
}
