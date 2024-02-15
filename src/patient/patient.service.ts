import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dtos';
import { Appointment } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';

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
}
