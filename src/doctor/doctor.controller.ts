import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment, Role } from '@prisma/client';
import { CurrentUser, Roles } from 'src/common/decorators';
import { IResponse } from 'src/common/dtos';
import { DoctorService } from './doctor.service';
import { ChangeAppointmentStatusDto } from './dtos';

@ApiTags('doctor')
@Roles(Role.DOCTOR)
@ApiBearerAuth()
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('appointments')
  async getAllAppointments(
    @CurrentUser('id') id: number,
  ): Promise<IResponse<Appointment[]>> {
    return {
      success: true,
      message: 'Get all appointments successfully',
      data: await this.doctorService.getAllAppointments(id),
    };
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Put('appointment/:id')
  async changeAppointmentStatus(
    @Param('id') id: number,
    @Body() { status }: ChangeAppointmentStatusDto,
  ): Promise<IResponse<Appointment>> {
    return {
      success: true,
      message: 'Change appointment status successfully',
      data: await this.doctorService.changeAppointmentStatus(id, status),
    };
  }
}
