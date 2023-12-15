import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashPassword } from 'src/common/utils';
import { PrismaService } from 'src/prisma/prisma.service';
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
    const { password, ...rest } = data;

    return await this.prisma.user.create({
      data: {
        ...rest,
        password: await hashPassword(password),
      },
    });
  }
}
