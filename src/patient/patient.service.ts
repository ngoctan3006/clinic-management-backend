import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
  MedicalHistory,
  Role,
} from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dtos';

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

  async getAppointmentByPatientId(
    patientId: number,
    query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.appointment.count({ where: { patientId } });
    const data = await this.prisma.appointment.findMany({
      where: {
        patientId,
      },
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
        service: true,
      },
    });
    return {
      success: true,
      message: 'Get all appointment success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async getAllMedicalHistory(
    patientId: number,
    query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId, role: Role.PATIENT },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Patient not found',
        data: null,
      });
    }
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.medicalHistory.count({
      where: { patientId, deletedAt: null },
    });
    const data = await this.prisma.medicalHistory.findMany({
      where: { patientId, deletedAt: null },
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

  async cancelAppointment(id: number, patientId: number): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, patientId },
    });
    if (!appointment) {
      throw new NotFoundException({
        success: false,
        message: 'Appointment not found',
        data: null,
      });
    }
    if (
      appointment.status !== AppointmentStatus.PENDING &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      throw new NotFoundException({
        success: false,
        message: 'Appointment cannot be canceled',
        data: null,
      });
    }
    await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELED_BY_PATIENT,
      },
    });
    return await this.prisma.appointment.findUnique({
      where: { id },
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
        service: true,
      },
    });
  }
}
