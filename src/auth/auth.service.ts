import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ENV_KEY } from 'src/common/constants';
import { comparePassword } from 'src/common/utils';
import { UserService } from 'src/user/user.service';
import {
  JwtPayload,
  ResponseLoginDto,
  SignupDto,
  UserWithoutPassword,
} from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async getMe(userId: number): Promise<UserWithoutPassword> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    delete user.password;

    return user;
  }

  async signup(data: SignupDto): Promise<UserWithoutPassword> {
    const { phone, email, password, confirmPassword } = data;
    const phoneExist = await this.userService.findByPhone(phone);
    if (phoneExist) {
      throw new BadRequestException({
        success: false,
        message: 'Phone already exists',
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

    if (password !== confirmPassword) {
      throw new BadRequestException({
        success: false,
        message: 'Confirm password is not match',
        data: null,
      });
    }

    delete data.confirmPassword;
    const user = await this.userService.create(data);
    delete user.password;

    return user;
  }

  async signin(phone: string, password: string): Promise<ResponseLoginDto> {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'Phone number or password is incorrect',
        data: null,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException({
        success: false,
        message: 'Phone number or password is incorrect',
        data: null,
      });
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    delete user.password;

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      id: user.id,
      phone: user.phone,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(ENV_KEY.JWT_REFRESH_TOKEN_SECRET),
      expiresIn: this.configService.get<number>(
        ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      ),
    });
    return { accessToken, refreshToken };
  }
}
