import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { IResponse } from './../common/dtos/response.dto';
import { ChangePasswordDto } from './dtos';
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
}
