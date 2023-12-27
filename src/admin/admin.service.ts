import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { UserWithoutPassword } from 'src/auth/dtos';
import { IQuery, IResponse } from 'src/common/dtos';
import { hashPassword } from 'src/common/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateDoctorDto, IDoctor } from './dtos';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAllUser(query: IQuery): Promise<IResponse<UserWithoutPassword[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.user.count();
    const data = await this.prisma.user.findMany({
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
      },
    });
    return {
      success: true,
      message: 'Get all user success',
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
}
