import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment, MedicalHistory, Role } from '@prisma/client';
import { CurrentUser, Roles } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
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
    @CurrentUser('id') userId: number,
    @Query() query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    return this.doctorService.getAllAppointments(userId, query);
  }

  @Get('medical-histories')
  async getAllMedicalHistories(
    @CurrentUser('id') userId: number,
    @Query() query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    return await this.doctorService.getAllMedicalHistory(userId, query);
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
