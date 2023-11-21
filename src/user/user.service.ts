import { BadRequestException, Injectable } from '@nestjs/common';
import { Gender, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { phone } });
  }

  async create(data: CreateUserDto): Promise<User> {
    const { username, password, phone, email, gender, role, ...rest } = data;
    const usernameExist = await this.findByUsername(username);
    if (usernameExist) {
      throw new BadRequestException('Username already exists');
    }

    const emailExist = await this.findByEmail(email);
    if (emailExist) {
      throw new BadRequestException('Email already exists');
    }

    const phoneExist = await this.findByPhone(phone);
    if (phoneExist) {
      throw new BadRequestException('Phone already exists');
    }

    return await this.prisma.user.create({
      data: {
        ...rest,
        username,
        phone,
        email,
        password: await hashPassword(password),
        gender: Gender[gender] || Gender.OTHER,
        role: Role[role] || Role.PATIENT,
      },
    });
  }
}
