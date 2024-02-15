import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicalHistory, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dtos';

@Injectable()
export class MedicalHistoryService {
  constructor(private readonly prisma: PrismaService) {}

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
