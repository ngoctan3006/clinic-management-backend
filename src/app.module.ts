import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ENV_KEY } from './common/constants';
import { DoctorModule } from './doctor/doctor.module';
import { MailModule } from './mail/mail.module';
import { EmailProcessor } from './mail/processors';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { MedicalServiceModule } from './medical-service/medical-service.module';
import { PatientModule } from './patient/patient.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    AppointmentModule,
    AuthModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(ENV_KEY.REDIS_HOST),
          port: configService.get<number>(ENV_KEY.REDIS_PORT),
          username: configService.get<string>(ENV_KEY.REDIS_USERNAME),
          password: configService.get<string>(ENV_KEY.REDIS_PASSWORD),
        },
      }),
      inject: [ConfigService],
    }),
    DoctorModule,
    MailModule,
    MedicalHistoryModule,
    MedicalServiceModule,
    PatientModule,
    PrismaModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [EmailProcessor],
})
export class AppModule {}
