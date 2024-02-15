import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorService, MedicalService } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddDoctorServiceDto,
  CreateMedicalServiceDto,
  UpdateMedicalServiceDto,
} from './dtos';

@Injectable()
export class MedicalServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async addDoctorService(data: AddDoctorServiceDto): Promise<DoctorService> {
    const { doctorId, serviceId } = data;
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId, deletedAt: null },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const service = await this.prisma.medicalService.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException({
        success: false,
        message: 'Service not found',
        data: null,
      });
    }
    const doctorService = await this.prisma.doctorService.findUnique({
      where: { doctorId_serviceId: { doctorId, serviceId } },
    });
    if (doctorService) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor service existed',
        data: null,
      });
    }
    return await this.prisma.doctorService.create({ data });
  }

  async deleteDoctorService(data: AddDoctorServiceDto): Promise<DoctorService> {
    const { doctorId, serviceId } = data;
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const service = await this.prisma.medicalService.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException({
        success: false,
        message: 'Service not found',
        data: null,
      });
    }
    const doctorService = await this.prisma.doctorService.findUnique({
      where: { doctorId_serviceId: { doctorId, serviceId } },
    });
    if (!doctorService) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor service not found',
        data: null,
      });
    }
    return await this.prisma.doctorService.delete({
      where: { id: doctorService.id },
    });
  }

  async createMedicalService(
    data: CreateMedicalServiceDto,
  ): Promise<MedicalService> {
    return await this.prisma.medicalService.create({ data });
  }

  async updateMedicalService(
    id: number,
    data: UpdateMedicalServiceDto,
  ): Promise<MedicalService> {
    const service = await this.prisma.medicalService.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException({
        success: false,
        message: 'Service not found',
        data: null,
      });
    }
    return await this.prisma.medicalService.update({
      where: { id },
      data,
    });
  }

  async getAllServices(): Promise<MedicalService[]> {
    return await this.prisma.medicalService.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        doctors: {
          include: {
            doctor: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    fullname: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async deleteMedicalService(id: number): Promise<MedicalService> {
    const service = await this.prisma.medicalService.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException({
        success: false,
        message: 'Service not found',
        data: null,
      });
    }
    return await this.prisma.medicalService.delete({ where: { id } });
  }
}
