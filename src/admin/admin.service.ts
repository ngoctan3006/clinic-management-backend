import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Doctor, PrismaClient, Role } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { UserWithoutPassword } from 'src/auth/dtos';
import { IQuery, IResponse } from 'src/common/dtos';
import { hashPassword } from 'src/common/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateDoctorDto, IDoctor, UpdateDoctorDto } from './dtos';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getPatientById(id: number): Promise<UserWithoutPassword> {
    const patient = await this.prisma.user.findUnique({
      where: { id, role: Role.PATIENT, deletedAt: null },
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    if (!patient) {
      throw new NotFoundException({
        success: false,
        message: 'Patient not found',
        data: null,
      });
    }
    return patient;
  }

  async getAllPatient(
    query: IQuery,
  ): Promise<IResponse<UserWithoutPassword[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.user.count({
      where: {
        role: Role.PATIENT,
        deletedAt: null,
      },
    });
    const data = await this.prisma.user.findMany({
      where: {
        role: Role.PATIENT,
        deletedAt: null,
      },
      skip,
      take: pageSize,
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return {
      success: true,
      message: 'Get all patient success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async getDoctorById(id: number): Promise<UserWithoutPassword> {
    const patient = await this.prisma.user.findFirst({
      where: {
        role: Role.DOCTOR,
        doctor: {
          id,
          deletedAt: null,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        doctor: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    if (!patient) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    return patient;
  }

  async getAllDoctor(query: IQuery): Promise<IResponse<UserWithoutPassword[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.user.count({
      where: {
        role: Role.DOCTOR,
        doctor: {
          deletedAt: null,
        },
        deletedAt: null,
      },
    });
    const data = await this.prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
        doctor: {
          deletedAt: null,
        },
      },
      skip,
      take: pageSize,
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        doctor: true,
      },
    });
    return {
      success: true,
      message: 'Get all doctor success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async createDoctor(data: CreateDoctorDto): Promise<IDoctor> {
    const { phone, email } = data;
    const phoneExist = await this.userService.findByPhone(phone);
    if (phoneExist) {
      throw new BadRequestException({
        success: false,
        message: 'Phone number already exists',
        data: null,
      });
    }
    if (email) {
      const emailExist = await this.userService.findByEmail(email);
      if (emailExist) {
        throw new BadRequestException({
          success: false,
          message: 'Email already exists',
          data: null,
        });
      }
    }

    try {
      const newDoctor: IDoctor = await this.prisma.$transaction(
        async (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => {
          const { speciality, degree, experience, ...userData } = data;
          const user = await prisma.user.create({
            data: {
              ...userData,
              role: Role.DOCTOR,
              password: await hashPassword('123456'),
            },
          });
          const doctor = await prisma.doctor.create({
            data: {
              userId: user.id,
              speciality,
              degree,
              experience,
            },
          });
          delete user.password;
          return {
            ...user,
            doctor,
          };
        },
      );
      return newDoctor;
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error?.message || 'Create doctor failed',
        data: null,
      });
    }
  }

  async updateDoctor(id: number, data: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id, deletedAt: null },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    return await this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  async deleteDoctor(id: number): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id, deletedAt: null },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    return await this.prisma.doctor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restoreDoctor(id: number): Promise<IDoctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id, deletedAt: { not: null } },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    await this.prisma.doctor.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
    return await this.prisma.user.findUnique({
      where: { id: doctor.userId },
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        doctor: true,
      },
    });
  }
}
