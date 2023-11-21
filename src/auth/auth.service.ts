import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ENV_KEY } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

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
