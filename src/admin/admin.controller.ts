import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Doctor, Role } from '@prisma/client';
import { UserWithoutPassword } from 'src/auth/dtos';
import { Roles } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
import { AdminService } from './admin.service';
import { CreateDoctorDto, IDoctor, UpdateDoctorDto } from './dtos';

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

  @Get('patient/:id')
  @ApiParam({ name: 'id', description: 'Patient id' })
  async getPatientById(
    @Param('id') id: number,
  ): Promise<IResponse<UserWithoutPassword>> {
    return {
      success: true,
      message: 'Get patient by id success',
      data: await this.adminService.getPatientById(+id),
    };
  }

  @Get('doctors')
  async getAllDoctor(
    @Query() query: IQuery,
  ): Promise<IResponse<UserWithoutPassword[]>> {
    return this.adminService.getAllDoctor(query);
  }

  @Get('doctor/:id')
  @ApiParam({ name: 'id', description: 'Doctor id' })
  async getDoctorById(
    @Param('id') id: number,
  ): Promise<IResponse<UserWithoutPassword>> {
    return {
      success: true,
      message: 'Get doctor by id success',
      data: await this.adminService.getDoctorById(+id),
    };
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

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiParam({ name: 'id', description: 'Doctor id' })
  @Put('doctor/:id')
  async updateMedicalService(
    @Param('id') id: number,
    @Body() data: UpdateDoctorDto,
  ): Promise<IResponse<Doctor>> {
    return {
      success: true,
      message: 'Update doctor successfully',
      data: await this.adminService.updateDoctor(+id, data),
    };
  }

  @ApiParam({ name: 'id', description: 'Doctor id' })
  @Delete('doctor/:id')
  async deleteDoctor(@Param('id') id: number): Promise<IResponse<null>> {
    await this.adminService.deleteDoctor(+id);
    return {
      success: true,
      message: 'Delete doctor successfully',
      data: null,
    };
  }

  @ApiParam({ name: 'id', description: 'Doctor id' })
  @Put('doctor/restore/:id')
  async restoreDoctor(@Param('id') id: number): Promise<IResponse<IDoctor>> {
    return {
      success: true,
      message: 'Restore doctor successfully',
      data: await this.adminService.restoreDoctor(+id),
    };
  }
}
