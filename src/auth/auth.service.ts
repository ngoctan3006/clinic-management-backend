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
import { ResponseLoginDto, SignupDto, UserWithoutPassword } from './dtos';

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
    const { username, phone, email, password, confirmPassword } = data;
    const usernameExist = await this.userService.findByUsername(username);
    if (usernameExist) {
      throw new BadRequestException({
        success: false,
        message: 'Username already exists',
        data: null,
      });
    }

    const emailExist = await this.userService.findByEmail(email);
    if (emailExist) {
      throw new BadRequestException({
        success: false,
        message: 'Email already exists',
        data: null,
      });
    }

    const phoneExist = await this.userService.findByPhone(phone);
    if (phoneExist) {
      throw new BadRequestException({
        success: false,
        message: 'Phone already exists',
        data: null,
      });
    }

    if (password !== confirmPassword) {
      throw new BadRequestException({
        success: false,
        message: 'Confirm password is not match',
        data: null,
      });
    }

    const user = await this.userService.create(data);
    delete user.password;

    return user;
  }

  async signin(username: string, password: string): Promise<ResponseLoginDto> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'Username or password is incorrect',
        data: null,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException({
        success: false,
        message: 'Username or password is incorrect',
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
    const payload = {
      id: user.id,
      username: user.username,
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
