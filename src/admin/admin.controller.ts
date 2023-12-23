import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { IQuery } from 'src/common/dtos';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('users')
  async getAllUser(@Query() query: IQuery) {
    return this.adminService.getAllUser(query);
  }
}
