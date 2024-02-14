import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { CreateAppointmentDto } from './dtos';
import { PatientService } from './patient.service';

@ApiTags('patient')
@Controller('patient')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('appointment')
  async createAppointment(
    @CurrentUser('id') patientId: number,
    @Body() data: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.patientService.createAppointment(patientId, data);
  }
}
