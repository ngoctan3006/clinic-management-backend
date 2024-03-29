import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Appointment, MedicalHistory } from '@prisma/client';
import { UserWithoutPassword } from 'src/auth/dtos';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
import { CancelAppointmentDto, CreateAppointmentDto } from './dtos';
import { PatientService } from './patient.service';

@ApiTags('patient')
@Controller('patient')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('doctors')
  async getAllDoctor(
    @Query() query: IQuery,
  ): Promise<IResponse<UserWithoutPassword[]>> {
    return this.patientService.getAllDoctor(query);
  }

  @Get('appointments')
  async getAllAppointment(
    @CurrentUser('id') patientId: number,
    @Query() query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    return this.patientService.getAppointmentByPatientId(patientId, query);
  }

  @Get('medical-histories')
  async getAllMedicalHistories(
    @CurrentUser('id') patientId: number,
    @Query() query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    return await this.patientService.getAllMedicalHistory(patientId, query);
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

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Put('appointment/cancel/:id')
  async cancelAppointment(
    @CurrentUser('id') patientId: number,
    @Param('id') id: number,
    @Body() data: CancelAppointmentDto,
  ): Promise<IResponse<Appointment>> {
    return {
      success: true,
      message: 'Cancel appointment successfully',
      data: await this.patientService.cancelAppointment(+id, patientId, data),
    };
  }
}
