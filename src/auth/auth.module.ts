import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ENV_KEY } from 'src/constants';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_KEY.JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get<number>(
            ENV_KEY.JWT_ACCESS_TOKEN_EXPIRATION_TIME
          ),
        },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
