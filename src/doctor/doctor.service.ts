import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async changeAppointmentStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    return await this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
