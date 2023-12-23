import { Injectable } from '@nestjs/common';
import { UserWithoutPassword } from 'src/auth/dtos';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

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
}
