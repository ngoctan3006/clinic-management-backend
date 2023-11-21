import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ENV_KEY } from 'src/common/constants';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async signup(data: SignupDto): Promise<User> {
    const { username, phone, email } = data;
    const usernameExist = await this.userService.findByUsername(username);
    if (usernameExist) {
      throw new BadRequestException('Username already exists');
    }

    const emailExist = await this.userService.findByEmail(email);
    if (emailExist) {
      throw new BadRequestException('Email already exists');
    }

    const phoneExist = await this.userService.findByPhone(phone);
    if (phoneExist) {
      throw new BadRequestException('Phone already exists');
    }

    return await this.userService.create(data);
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
        ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_TIME
      ),
    });
    return { accessToken, refreshToken };
  }
}
