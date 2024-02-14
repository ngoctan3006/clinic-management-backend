import { Injectable } from '@nestjs/common';
import { MedicalService } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalServiceDto, UpdateMedicalServiceDto } from './dtos';

@Injectable()
export class MedicalServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async createMedicalService(
    data: CreateMedicalServiceDto,
  ): Promise<MedicalService> {
    return await this.prisma.medicalService.create({ data });
  }

  async updateMedicalService(
    id: number,
    data: UpdateMedicalServiceDto,
  ): Promise<MedicalService> {
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
    return await this.prisma.medicalService.delete({ where: { id } });
  }
}
