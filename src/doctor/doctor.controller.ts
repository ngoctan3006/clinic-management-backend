import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment, Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { DoctorService } from './doctor.service';
import { ChangeAppointmentStatusDto } from './dtos';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
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
