import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dtos';
import { Appointment } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(
    patientId: number,
    data: CreateAppointmentDto,
  ): Promise<Appointment> {
    const endTime = new Date(data.startTime.getTime() + 30 * 60 * 1000);
    return await this.prisma.appointment.create({
      data: {
        ...data,
        endTime,
        patientId,
      },
    });
  }
}
