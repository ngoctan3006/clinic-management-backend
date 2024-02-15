import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
import { CreateAppointmentDto } from './dtos';
import { PatientService } from './patient.service';

@ApiTags('patient')
@Controller('patient')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('appointments')
  async getAllAppointment(
    @CurrentUser('id') id: number,
    @Query() query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    return this.patientService.getAppointmentByPatientId(id, query);
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post('appointment')
  async createAppointment(
    @CurrentUser('id') patientId: number,
    @Body() data: CreateAppointmentDto,
  ): Promise<IResponse<Appointment>> {
    return {
      success: true,
      message: 'Create appointment successfully',
      data: await this.patientService.createAppointment(patientId, data),
    };
  }
}
