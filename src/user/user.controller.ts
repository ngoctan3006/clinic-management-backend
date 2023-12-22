import { Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { IResponse } from './../common/dtos/response.dto';
import { ChangePasswordDto } from './dtos';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('change-password')
  async changePassword(
    @CurrentUser('id') userId: number,
    data: ChangePasswordDto,
  ): Promise<IResponse<void>> {
    return {
      success: true,
      message: 'Change password successfully',
      data: await this.userService.changePassword(userId, data),
    };
  }
}
