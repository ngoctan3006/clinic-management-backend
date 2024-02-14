import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAppointments(userId: number): Promise<Appointment[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { doctor: true },
    });
    const doctorId = user?.doctor.id;
    if (!doctorId) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    return await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            phone: true,
            fullname: true,
            email: true,
            address: true,
            birthday: true,
            gender: true,
          },
        },
        service: true,
      },
    });
  }

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
