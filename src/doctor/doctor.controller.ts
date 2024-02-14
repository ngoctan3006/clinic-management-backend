import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment, Role } from '@prisma/client';
import { CurrentUser, Roles } from 'src/common/decorators';
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
  ): Promise<Appointment[]> {
    return this.doctorService.getAllAppointments(id);
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Put('appointment/:id')
  async changeAppointmentStatus(
    @Param('id') appointmentId: number,
    @Body() { status }: ChangeAppointmentStatusDto,
  ): Promise<Appointment> {
    return this.doctorService.changeAppointmentStatus(appointmentId, status);
  }
}
