import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Appointment, Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { IQuery, IResponse } from 'src/common/dtos';
import { AppointmentService } from './appointment.service';

@ApiTags('appointment')
@Controller('appointment')
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles(Role.ADMIN)
  @Get('all')
  async getAllUser(@Query() query: IQuery): Promise<IResponse<Appointment[]>> {
    return this.appointmentService.getAllAppointment(query);
  }
}
