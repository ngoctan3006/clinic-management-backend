import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
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
    AuthModule,
    DoctorModule,
    MedicalServiceModule,
    PatientModule,
    PrismaModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
