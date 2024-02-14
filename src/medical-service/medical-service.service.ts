import { Injectable } from '@nestjs/common';
import { MedicalService } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalServiceService {
  constructor(private readonly prisma: PrismaService) {}

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
}
