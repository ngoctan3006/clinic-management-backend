import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserWithoutPassword } from 'src/auth/dtos';
import { Roles } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
import { AdminService } from './admin.service';
import { CreateDoctorDto, IDoctor } from './dtos';

@ApiTags('admin')
@Roles(Role.ADMIN)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('patients')
  async getAllUser(
    @Query() query: IQuery,
  ): Promise<IResponse<UserWithoutPassword[]>> {
    return this.adminService.getAllPatient(query);
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('doctor')
  async createDoctor(
    @Body() data: CreateDoctorDto,
  ): Promise<IResponse<IDoctor>> {
    return {
      success: true,
      message: 'Create doctor successfully',
      data: await this.adminService.createDoctor(data),
    };
  }
}
