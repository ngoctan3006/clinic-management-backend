import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicalHistory, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dtos';
import { IQuery, IResponse } from 'src/common/dtos';

@Injectable()
export class MedicalHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMedicalHistory(
    query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.medicalHistory.count({
      where: { deletedAt: null },
    });
    const data = await this.prisma.medicalHistory.findMany({
      where: { deletedAt: null },
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

  async createMedicalHistory(
    userId: number,
    data: CreateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    const patient = await this.prisma.user.findUnique({
      where: {
        id: data.patientId,
        role: Role.PATIENT,
      },
    });
    if (!patient) {
      throw new NotFoundException({
        success: false,
        message: 'Patient not found',
        data: null,
      });
    }
    const doctor = await this.prisma.user.findUnique({
      where: {
        id: userId,
        role: Role.DOCTOR,
      },
      include: {
        doctor: true,
      },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    return await this.prisma.medicalHistory.create({
      data: {
        ...data,
        doctorId: doctor.doctor.id,
      },
    });
  }

  async updateMedicalHistory(
    id: number,
    userId: number,
    data: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    const { patientId } = data;
    if (patientId) {
      const patient = await this.prisma.user.findUnique({
        where: {
          id: patientId,
          role: Role.PATIENT,
        },
      });
      if (!patient) {
        throw new NotFoundException({
          success: false,
          message: 'Patient not found',
          data: null,
        });
      }
    }
    const doctor = await this.prisma.user.findUnique({
      where: {
        id: userId,
        role: Role.DOCTOR,
      },
      include: {
        doctor: true,
      },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: {
        id,
        doctorId: doctor.doctor.id,
        deletedAt: null,
      },
    });
    if (!medicalHistory) {
      throw new NotFoundException({
        success: false,
        message: 'Medical history not found',
        data: null,
      });
    }
    return await this.prisma.medicalHistory.update({
      where: {
        id,
      },
      data,
    });
  }
}
