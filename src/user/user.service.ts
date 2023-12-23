import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { comparePassword, hashPassword } from 'src/common/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { phone } });
  }

  async create(data: CreateUserDto): Promise<User> {
    const { password, confirmPassword, ...rest } = data;

    return await this.prisma.user.create({
      data: {
        ...rest,
        password: await hashPassword(password),
      },
    });
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword, confirmPassword } = data;
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException({
        success: false,
        message: 'Password and confirm password not match',
        data: null,
      });
    }
    const isPasswordMatch = await comparePassword(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException({
        success: false,
        message: 'Password wrong',
        data: null,
      });
    }
    await this.prisma.user.update({
      where: { id },
      data: { password: await hashPassword(newPassword) },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const oldUser = await this.findById(id);
    if (!oldUser) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    if (data.email) {
      const emailExist = await this.findByEmail(data.email);
      if (emailExist && emailExist.id !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Email already exist',
          data: null,
        });
      }
    }
    const newUser = await this.prisma.user.update({ where: { id }, data });
    delete newUser.password;
    return newUser;
  }
}
