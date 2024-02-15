import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
  MedicalHistory,
  Role,
} from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAppointments(userId: number): Promise<Appointment[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
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

  async getAllMedicalHistory(
    userId: number,
    query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
      include: { doctor: true },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const doctorId = user.doctor.id;
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.medicalHistory.count();
    const data = await this.prisma.medicalHistory.findMany({
      where: { doctorId },
      skip,
      take: pageSize,
      include: {
        doctor: {
          select: {
            id: true,
            degree: true,
            speciality: true,
            experience: true,
            user: {
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
          },
        },
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
      },
    });
    return {
      success: true,
      message: 'Get all medical history success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
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
